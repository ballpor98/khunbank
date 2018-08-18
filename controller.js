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
            fulfillmentText: `สวัสดี คุณ${name}`,
            fulfillmentMessages: [
            {
                "tableCard": {
                  "title": "AoG Table Card title",
                  "subtitle": "AoG Table Card subtitle",
                  "image": {
                    "url": "",
                    "accessibilityText": "Image description for screen readers"
                  },
                  "columnProperties": [
                    {
                      "header": "Header 1"
                    },
                    {
                      "header": "Header 2",
                      "horizontalAlignment": "CENTER"
                    },
                    {
                      "header": "Header 3",
                      "horizontalAlignment": "CENTER"
                    }
                  ],
                  "rows": [
                    {
                      "cells": [
                        {
                          "text": "Cell A1"
                        },
                        {
                          "text": "Cell A2"
                        },
                        {
                          "text": "Cell A3"
                        }
                      ]
                    },
                    {
                      "cells": [
                        {
                          "text": "Cell B1"
                        },
                        {
                          "text": "Cell B2"
                        },
                        {
                          "text": "Cell B3"
                        }
                      ]
                    },
                    {
                      "cells": [
                        {
                          "text": "Cell C1"
                        },
                        {
                          "text": "Cell C2"
                        },
                        {
                          "text": "Cell C3"
                        }
                      ]
                    }
                  ],
                  "buttons": [
                    {
                      "title": "Button title",
                      "openUrlAction": {
                        "url": ""
                      }
                    }
                  ]
                }
              }
        ]
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
    db.getSavingAccountBalanceFromUserId(userId).then(results => {
        const amount = results[0].balance
        res.json({
            fulfillmentText: `เงินคงเหลือในบัญชี ${amount} บาท`
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