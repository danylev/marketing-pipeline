// Populate env variables
require('dotenv').config()
// Import Schemas
const articlesSchema = require('./warehouse/articles').articlesSchema

const mongoose = require('mongoose');
const mongo_uri = process.env.MONGO_URI
const options = {
    useNewUrlParser: true,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWORD,
    bufferCommands: true,
}

mongoose.connect(mongo_uri, options)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected!')
});
var Article = mongoose.model('Articles', articlesSchema)
var article = new Article({url: 'https://hackernoon.com/how-to-promote-your-github-project-1b39a7eee841', scrapped: false})
article.save()
    .then(() => {
        db.close()
    })
