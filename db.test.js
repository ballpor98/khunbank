const db = require('./db')
const axios = require('axios')
const { getRecommendations } = require('./recommendations')

getRecommendations('cst_id012728').then(res => console.log('recommends', res))

;(async () => {
    await db.init()
    db.getSavingAccountBalancesFromUserId('ABwppHGnwMEfnVXHMVIg1mWiUIdKwHwboRSeYF-GwnZUIGCtue4Hd3NV9hBL-uYjbL652sX87ZRyqw')
        .then(console.log)
    
    db.getUserRemainingCredits('ABwppHGnwMEfnVXHMVIg1mWiUIdKwHwboRSeYF-GwnZUIGCtue4Hd3NV9hBL-uYjbL652sX87ZRyqw')
        .then(console.log)
    
    db.getUserCardLimits('ABwppHGnwMEfnVXHMVIg1mWiUIdKwHwboRSeYF-GwnZUIGCtue4Hd3NV9hBL-uYjbL652sX87ZRyqw')
        .then(console.log)
    
    db.getUserCardBillCycles('ABwppHGnwMEfnVXHMVIg1mWiUIdKwHwboRSeYF-GwnZUIGCtue4Hd3NV9hBL-uYjbL652sX87ZRyqw')
        .then(console.log)
})()