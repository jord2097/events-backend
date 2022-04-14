const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');
const uri = "mongodb+srv://jord2097:9Y8ML4kvEPcTqR99@cluster0.q2ktn.mongodb.net/eventsApp?retryWrites=true&w=majority"
const { Event } = require('./models/events')
const { User } = require ('./models/users')
const extAPIcontroller = require('./externalAPI')
const createError = require('http-errors')

mongoose.connect(uri)

const app = express();
app.use(helmet())
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('combined'))

// these functions are prior to auth for read-only guest privileges
app.get('/', async(req,res) => {
    res.send(await Event.find())
})

app.get('/location/:location', async (req, res) => {
    const locationMatches = await Event.find({location: req.params.location})
    if(locationMatches.length === 0){
        return res.sendStatus(404)
    }
    res.send(locationMatches)
}) // find all with "location"

app.get('/date/:date', async (req, res) => {
    const dateMatches = await Event.find({eventDate: req.params.date})
    if(dateMatches.length === 0) {
        return res.sendStatus(404)
    }
    res.send(dateMatches)
}) // find by date
// use library e.g. luxon for date/time handling - make it more user friendly

// register
app.post('/register', async (req, res, next) => {
    const checkuser = await User.findOne({userName: req.body.userName})
    if(checkuser) {
        (next(createError(409,"user already exists")))
    }
    const newUser = req.body
    const user = new User(newUser)
    await user.save()
    res.send({message: "New account registered!"})
})

// login
app.post('/auth', async (req,res) => {    
    const user = await User.findOne({userName: req.body.userName})
    console.log(user) 
    if(!user){
        return res.sendStatus(401)
    }
    if(req.body.password !== user.password){
        return res.sendStatus(403)
    }
    user.token = uuidv4()
    await user.save()
    res.send({token: user.token})
})

// authorisation using token to save login state
app.use(async (req,res,next) => {
    const authHeader = req.headers['authorization']
    const user = await User.findOne({token: authHeader})
    if(user){
        next()
    } else {
        res.sendStatus(403)
    }
})

app.post('/', async (req,res) => {
    const newEvent = req.body
    /* const reverseGeo = await extAPIcontroller.getCoords(req,res)    
    if(!reverseGeo.data[0].lat) {
        return (next(createError("Could not obtain geodata from that place name.")));    
    }
    lat = reverseGeo.data[0].lat
    lon = reverseGeo.data[0].lon    
    const forecast = await extAPIcontroller.getForecast(req,res)
    console.log(forecast.data.daily[1])
    const timestamp = (new Date(req.body.eventDate).getTime() / 1000)
    console.log(timestamp) */
    const event = new Event(newEvent)
    await event.save()
    res.send({ message: 'New event posted.'})

}) 

app.delete('/:id', async (req,res) => {
    await Event.deleteOne({_id: ObjectId(req.params.id)})
    res.send({message: 'Event deleted.'})
})

app.delete('/deleteall/:confirm', async (req,res) => {
    if (req.params.confirm !== "yes") {
        return res.send({message: `Are you sure you want to delete? Replace ${req.params.confirm} with yes`})
    }
    await Event.deleteMany()
    res.send({message: 'All Events Deleted.'})
    
})

app.put('/:id', async (req,res) => {
    await Event.findOneAndUpdate({_id: ObjectId(req.params.id)}, req.body)
    res.send({ message: 'Event updated.'})
})

app.listen(port, () => 
    console.log(`Events API listening on http://localhost:${port}`)
)

var db = mongoose.connection
db.on('error', console.error.bind(console, "Connection error"))
db.once('open', function callback() {
    console.log("Database connected")
})


