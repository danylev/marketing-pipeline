const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = articlesSchema = new Schema({
    url: String,
    date: {type: Date, default: Date.now},
    scraped: Boolean
})
