const baseUrl = 'http://35.198.201.70/recommend'

const createUrl = (customerId) => `${baseUrl}/${customerId}`

const getRecommendations = async (customerId) => {
    const res = await fetch(createUrl(customerId))
    const resJson = await res.json()
    const recommendations = Object.keys(resJson).map(key => resJson[key])
    return recommendations
}

module.exports = {
    getRecommendations
}