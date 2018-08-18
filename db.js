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
        order by eff_dt desc limit 1;
        `, userId)
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
}

module.exports = new DB(config.db)

