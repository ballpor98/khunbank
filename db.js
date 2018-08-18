const mysql = require('mysql')
const config = require('./config')

class DB {
    constructor(config) {
        this._connection = mysql.createConnection(config)
        this._connected = false
    }

    _execQuery(query, values = []) {
        if(!this._connected) {
            throw new Error('not connected to DB yet')
        }

        return new Promise((resolve, reject) => {
            this._connection.query(query, values, (err, results, fields) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(results, fields)
                }
            })
        })
    }

    init() {
        return new Promise((resolve, reject) => {
            this._connection.connect(err => {
                if (err) {
                    reject(err)
                } else {
                    this._connected = true
                    resolve()
                }
            })
        })
    }

    getCustomerIdFromUserId(userId) {
        return this._execQuery(`
            SELECT u_id as user_id FROM user_mapper
            WHERE user_id = ?;
        `, userId)
    }

    getSavingAccountBalanceFromUserId(userId) {
        return this._execQuery(`
            SELECT crn_bal as balance
            FROM sa_transaction
            JOIN (
                SELECT sa_id FROM user_mapper
                JOIN ip_sa_mapper ON user_mapper.u_id = ip_sa_mapper.u_id
                WHERE user_id = ?
                LIMIT 1
            ) as E on E.sa_id = sa_transaction.sa_id
            ORDER BY txn_dt desc LIMIT 1;
        `, userId)
    }

    getSavingAccountBalancesFromUserId(userId) {
        return this.getUserSavingAccounts(userId).then(results => {
            return Promise.all(
                Array.from(results).map(row => {
                    console.log('row', row.sa_id)
                    return this.getSavingAccountBalance(row.sa_id).then(results => Promise.resolve({
                            sa_id: row.sa_id,
                            balance: results[0].balance
                        }))
                })
            )
        })
    }

    getUserSavingAccounts(userId) {
        return this._execQuery(`
            SELECT sa_id FROM user_mapper
            JOIN ip_sa_mapper ON user_mapper.u_id = ip_sa_mapper.u_id
            WHERE user_id = ?;
        `, userId)
    }

    getSavingAccountBalance(savingAccountId) {
        return this._execQuery(`
            SELECT crn_bal as balance FROM sa_transaction
            WHERE sa_id = ?
            ORDER BY txn_dt DESC
            LIMIT 1;
        `, savingAccountId)
    }

    getNameFromUserId(userId) {
        return this._execQuery(`
            SELECT debug_name AS name FROM user_mapper
            WHERE user_id = ?;
        `, userId)
    }

    getUidFromUserId(userId) {
        return this._execQuery(`
        select u_id from user_mapper
        where user_id = ?;
        `, userId)
    }

    getRemainingCredits(u_id) {
        return this._execQuery(`
            select cci.card_no_encpt as card, (cr_lmt_amt - amt_used) as remaining_cr from cc_information cci join (
            select cct.card_no_encpt, sum(txn_amt) as amt_used from cc_transaction cct
            join (select * from cc_information cci join ip_cc_mapper ccm on cci.main_cc_cst_no = ccm.cc_cst_no where ccm.u_id = ?) as E
            on cct.card_no_encpt = E.card_no_encpt
            where month(eff_dt) = 12 and year(eff_dt) = 2017 
            group by cct.card_no_encpt
            ) as d on d.card_no_encpt = cci.card_no_encpt
        `, u_id)
    }

    getUserRemainingCredits(userId) {
        return this.getUidFromUserId(userId).then(result => this.getRemainingCredits(result[0].u_id))
    }
}

module.exports = new DB(config.db)

