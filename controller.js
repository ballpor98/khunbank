const IntentApp = require('./intent-app')
const intentApp = new IntentApp()

intentApp.intent(/.*/, (req, res, next) => {
    console.log(`got intent ${req.body.intent}`)
    next(res)
}, (req) => req.body.intent)

intentApp.intent('testIntent', (req, res) => {
    res.send('got testIntent')
}, (req) => req.body.intent)

module.exports = (req, res) => {
    const body = req.body
    console.log(body)
    intentApp.handler(req, res)
    res.status(200).end()
}