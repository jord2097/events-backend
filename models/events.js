const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
    creator: String,
    eventName: String,
    location: String,
    description: String,
    eventDate: String,
    img: String  
})

module.exports.Event = mongoose.model('events', eventSchema, 'events')