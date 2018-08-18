const db = require('./db')
const IntentApp = require('./intent-app')
const intentApp = new IntentApp()

intentApp.intent(/.*/, (req, res, next) => {
    console.log(`got intent ${req.body.queryResult.intent.displayName}`)
    next(res)
})

intentApp.intent('Credit Card Utilization', (req, res) => {
    const userId = req.body.originalDetectIntentRequest.payload.user.userId
    db.getUserRemainingCredits(userId).then(results => {
        const fulfillmentText = results.map((card, index) => {
            return `บัตรใบที่ ${index} วงเงินเหลือ ${card.remaining_cr} บาท`
        }).slice(0, 2).join('\n')
        res.json({
            fulfillmentText
        })
    })
})

intentApp.intent('Default Welcome Intent', (req, res) => {
    const userId = req.body.originalDetectIntentRequest.payload.user.userId
    console.log(userId)
    db.getNameFromUserId(userId).then(results => {
        const name = results[0].name
        console.log(`got name ${name}`)
        res.json({
            fulfillmentText: `สวัสดี คุณ${name}`,
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
    // db.getSavingAccountBalanceFromUserId(userId).then(results => {
        res.json({
            fulfillmentText: req.body.queryResult.fulfillmentText,
        })
    // })`
})

intentApp.intent('SA Balance', (req, res) => {
    const amount = 1
    const userId = req.body.originalDetectIntentRequest.payload.user.userId
    db.getSavingAccountBalancesFromUserId(userId).then(results => {
        // const amount = results[0].balance
        // res.json({
        //     fulfillmentText: `เงินคงเหลือในบัญชี ${amount} บาท`
        // })
        res.json({
            fulfillmentText: results.slice(0, 2).map(result => `บัญชี ${result.sa_id.substr(5)} ยอดเงินคงเหลือ ${result.balance} บาท`).join('\n')
        })
    }).catch(err => {
        console.log(err)
        res.json({
            fulfillmentText: `รวยจังอะ`
        })
    })
})

intentApp.intent('Buying', (req, res) => {
    const affordable = false
    const destination = req.body.queryResult.parameters.thing_to_buy
    const amount = 3900
    if (!affordable) {
        res.json({
            "followupEventInput": {
                "name": "money_not_enough",
                "languageCode": "th-TH",
                "parameters": {
                    "destination": destination,
                    "amount": amount
                }
            },
        })
    } else {
        res.json({
            fulfillmentText: `จ่ายเงิน ${amount} บาทให้${destination} กรุณากรอก OTP`
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