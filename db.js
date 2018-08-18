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
            SELECT cci.card_no_encpt AS card, (cr_lmt_amt - amt_used) AS remaining_cr from cc_information cci join (
                SELECT cct.card_no_encpt, SUM(txn_amt) AS amt_used FROM cc_transaction cct
                JOIN (
                    SELECT * from cc_information cci JOIN ip_cc_mapper ccm ON cci.main_cc_cst_no = ccm.cc_cst_no WHERE ccm.u_id = ?
                ) AS E
                ON cct.card_no_encpt = E.card_no_encpt
                WHERE month(eff_dt) = 12 AND year(eff_dt) = 2017 
                GROUP BY cct.card_no_encpt
            ) AS D on D.card_no_encpt = cci.card_no_encpt
            ORDER BY card ASC
        `, u_id)
    }

    getMonthlyReportFromUid(u_id) {
        return this._execQuery(`
            SELECT cci.card_no_encpt AS card,  amt_used, bill_cyc FROM cc_information cci JOIN (
            SELECT cct.card_no_encpt, SUM(txn_amt) AS amt_used FROM cc_transaction cct
            JOIN (SELECT * FROM cc_information cci JOIN ip_cc_mapper ccm ON cci.main_cc_cst_no = ccm.cc_cst_no WHERE ccm.u_id = 'cst_id012728') AS E
                ON cct.card_no_encpt = E.card_no_encpt
                WHERE MONTH(eff_dt) = 12 AND YEAR(eff_dt) = 2017 
                GROUP BY cct.card_no_encpt
            ) AS d ON d.card_no_encpt = cci.card_no_encpt
            ORDER BY card ASC
        `)
    }

    getUserRemainingCredits(userId) {
        return this.getUidFromUserId(userId).then(result => this.getRemainingCredits(result[0].u_id))
    }

    getCardLimitsFromUid(u_id) {
        return this._execQuery(`
            SELECT card_no_encpt AS card, cr_lmt_amt AS card_limit 
            FROM cc_information cci 
            JOIN ip_cc_mapper ccm ON cci.main_cc_cst_no = ccm.cc_cst_no 
            WHERE ccm.u_id = ?
            ORDER BY card ASC
        `, u_id)
    }

    getUserMonthlyReport(userId) {
        return this.getUidFromUserId(userId).then(result => this.getMonthlyReportFromUid(results[0].u_id))
    }

    getBillCyclesFromUid(u_id) {
        return this._execQuery(`
            SELECT card_no_encpt AS card, bill_cyc AS bill_cycle 
            FROM cc_information cci 
            JOIN ip_cc_mapper ccm ON cci.main_cc_cst_no = ccm.cc_cst_no 
            WHERE ccm.u_id = ?
            ORDER BY card ASC
        `, u_id)
    }

    getUserCardLimits(userId) {
        return this.getUidFromUserId(userId).then(results => this.getCardLimitsFromUid(results[0].u_id))
    }

    getUserCardBillCycles(userId) {
        return this.getUidFromUserId(userId).then(results => this.getBillCyclesFromUid(results[0].u_id))
    }
}

module.exports = new DB(config.db)

