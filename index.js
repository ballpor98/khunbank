const express = require('express')
const bodyParser = require('body-parser')
const controller = require('./controller')
const db = require('./db')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/', controller)
app.get('/gsab', (req, res) => {
    console.log(req.query.id)
    db.getSavingAccountBalance(req.query.id).then(results => {
        console.log(results[0].balance)
        res.json({
            fulfillmentText: `${results[0].balance}`
        })
    })
})

const PORT = process.env.PORT || 3000
db.init().then(() => {
    app.listen(process.env.PORT || 3000, () => console.log(`listening at port ${PORT}`))
})