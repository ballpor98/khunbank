const IntentApp = require('./intent-app')
const intentApp = new IntentApp()

intentApp.intent(/.*/, (req, res, next) => {
    console.log(`got intent ${req.body.queryResult.intent.displayName}`)
    next(res)
})

intentApp.intent('Default Welcome Intent', (req, res) => {
    console.log(req.body.originalDetectIntentRequest)
    const name = 'ประยุทธ'
    res.json({
        fulfillmentText: `สวัสดี คุณ${name}`
    })
})

intentApp.intent('testIntent', (req, res) => {
    res.send('got testIntent')
})

intentApp.intent('SA Balance', (req, res) => {
    const amount = 10000
    res.json({
        fulfillmentText: `เงินคงเหลือในบัญชี ${amount} บาท`
    })
})

intentApp.intent('Buying', (req, res) => {
    res.json({
        "fulfillmentText": "ได้เลย ราคา 3900 บาทนะ แต่เงินในบัญชีของคุณไม่เพียงพอ ต้องการใช้บัตรเครดิตไหม",
        "followupEvent": {
            "name": "money_not_enough",
            "data": {
                "destination": "destination",
                "amount": 3900
            }
        }
    })
})

intentApp.use((req, res) => {
    res.json({
        fulfillmentText: 'test fulfillmentText'
    })
})

module.exports = (req, res) => {
    const body = req.body
    console.log(body)
    intentApp.handler(req, res)
    res.status(200).end()
}