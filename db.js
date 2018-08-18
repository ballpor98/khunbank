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

    getSavingAccountBalance(savingAccountId) {
        return this._execQuery(`
            SELECT crn_bal as balance FROM sa_transaction
            WHERE sa_id = ?
            ORDER BY txn_dt DESC
            LIMIT 1;
        `, savingAccountId)
    }
}

module.exports = new DB(config.db)

