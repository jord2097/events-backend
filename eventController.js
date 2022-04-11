const createError = require('http-errors')
const { ObjectId } = require('mongodb')
const { Event } = require('./models/events')

exports.index = async function (req, res){
    Event.find()
    .then ((books) => res.send(books))
}

