

const baseUrl = 'http://35.198.201.70/recommend'
const axios = require('axios')


const createUrl = (customerId) => `${baseUrl}/${customerId}`

const getRecommendations = async (customerId) => {
    console.log('getting recommendations')
    const req = await (axios.get(createUrl(customerId)))
    const res = req.data.category
    const recommendations = Object.keys(res).map(key => res[key])
    return recommendations
}

module.exports = {
    getRecommendations
}