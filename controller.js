const db = require('./db')
const IntentApp = require('./intent-app')
const intentApp = new IntentApp()

intentApp.intent(/.*/, (req, res, next) => {
    console.log(`got intent ${req.body.queryResult.intent.displayName}`)
    next(res)
})

intentApp.intent('Default Welcome Intent', (req, res) => {
    console.log(req.body.originalDetectIntentRequest.payload.user)
    // const name = 'ประยุทธ'
    db.getNameFromUserId(req.body.originalDetectIntentRequest.payload.user.userId).then(results => {
        const name = results[0].name
        res.json({
            fulfillmentText: `สวัสดี คุณ${name}`
        })
    }).catch(err => {
        console.log(err)
        res.json({
            fulfillmentText: `สวัสดี คุณประยุทธ`
        })
    })
})

intentApp.intent('Money Transfer', (req, res) => {
    res.json({
        fulfillmentText: req.body.queryResult.fulfillmentText,
    })
})

intentApp.intent('SA Balance', (req, res) => {
    const amount = 10000
    res.json({
        fulfillmentText: `เงินคงเหลือในบัญชี ${amount} บาท`
    })
})

intentApp.intent('Buying', (req, res) => {
    res.json({
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
        fulfillmentText: 'เย้ สนุกจังเลย'
    })
})

module.exports = (req, res) => {
    const body = req.body
    console.log(body)
    intentApp.handler(req, res)
    res.status(200).end()
}