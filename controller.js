const db = require('./db')
const IntentApp = require('./intent-app')
const intentApp = new IntentApp()

intentApp.intent(/.*/, (req, res, next) => {
    console.log(`got intent ${req.body.queryResult.intent.displayName}`)
    next(res)
})

intentApp.intent('Default Welcome Intent', (req, res) => {
    const userId = req.body.originalDetectIntentRequest.payload.user.userId
    console.log(userId)
    db.getNameFromUserId(userId).then(results => {
        const name = results[0].name
        console.log(`got name ${name}`)
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
    const userId = req.body.originalDetectIntentRequest.payload.user.userId
    console.log(userId)
    db.getSavingAccountBalanceFromUserId(userId).then(results => {
        res.json({
            fulfillmentText: req.body.queryResult.fulfillmentText,
        })
    })
})

intentApp.intent('SA Balance', (req, res) => {
    const amount = 1
    res.json({
        fulfillmentText: `เงินคงเหลือในบัญชี ${amount} บาท`
    })
})

intentApp.intent('Buying', (req, res) => {
    const affordable = true
    const destination = req.body.queryResult.outputContexts[0].parameters.thing_to_buy
    const amount = 3900
    if (affordable) {
        res.json({
            "fulfillmentText": `ได้เลย ราคา ${amount} บาทนะ แต่เงินในบัญชีของคุณไม่เพียงพอ ต้องการใช้บัตรเครดิตไหม`,
            "followupEventInput": {
                "name": "money_not_enough",
                "languageCode": "th-TH",
                "parameters": {
                    "destination": destination,
                    "amount": 3900
                }
            },
        })
    } else {
        res.json({
            "followupEventInput": {
                "name": "ask_for_otp",
                "languageCode": "th-TH",
                "parameters": {
                    "destination": destination,
                    "amount": 3900
                }
            },
        })
    }
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
}