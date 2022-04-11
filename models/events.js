const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
    eventName: String,
    location: String,
    description: String,
    eventDate: String,
    eventTime: Number
})

module.exports.Event = mongoose.model('events', eventSchema, 'events')