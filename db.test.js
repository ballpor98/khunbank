const db = require('./db')

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