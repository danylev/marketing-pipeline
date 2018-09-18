"use strict"
require('dotenv').config()
// Import Schemas
const articlesSchema = require('./warehouse/articles')
// Imports
const mongoose = require('mongoose')
const GatherClappers = require('./scrapper').gatherClappersInfo
// Mongo config
const mongo_uri = process.env.MONGO_URI
const options = {
    useNewUrlParser: true,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWORD,
    bufferCommands: true,
}
const WebSearch = require('./lib-WebSearch')
const Nick = require('nickjs')
const nick = new Nick({
    loadImages: true,
    userAgent:  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:54.0) Gecko/20100101 Firefox/54.0",
    printPageErrors: false,
    printResourceErrors: false,
    printNavigation: false,
    printAborts: false,
    debug: false,
})
//
const loadArticles = async (articles, db) => {
    let Article = await mongoose.model('Articles', articlesSchema)
    let rawArticles = articles
    rawArticles = rawArticles.map(article => {
        return {"url": article, "scraped": false}
    })
    console.log(rawArticles)
    await Article.insertMany(rawArticles, (err, docs) => {
        console.log('%d inserted records.', docs.length)
    })
}
//
const nonScrapedArticles = async (db) => {
    let Article = mongoose.model('Articles', articlesSchema)
    let result = await Article.find({scraped: false})
    return result
}
//
;(async() => {
    mongoose.connect(mongo_uri, options)
    const db = mongoose.connection
    db.once('open', function() {
        console.log('Connected to database!')
    })
    let articles = require('./articles.json').articles
    if (articles) {
        console.log('Loaded articles!')
    } else {
        console.error('Cannot load data for articles!')
    }
    names = await GatherClappers(articles[0], null)
    console.log('Loaded articlel to database!')
})()
.catch(err => {
    console.log(err, "error")
})

// let articles = require('./articles.json').articles
// loadArticles(articles, (err) => {
//     if (err) return console.error(err)
//     nonScrapedArticles()
// })
