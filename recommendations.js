

const baseUrl = 'http://35.198.201.70/recommend'
const axios = require('axios')


const createUrl = (customerId) => `${baseUrl}/${customerId}`

const getRecommendations = async (customerId) => {
    const req = await (axios.get(createUrl(customerId)))
    const res = req.data
    const recommendations = Object.keys(res).map(key => res[key])
    return recommendations
}

module.exports = {
    getRecommendations
}