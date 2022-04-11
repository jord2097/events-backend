const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');
const uri = "mongodb+srv://jord2097:9Y8ML4kvEPcTqR99@cluster0.q2ktn.mongodb.net/events-app?retryWrites=true&w=majority"
const { Event } = require('./models/events')
const { User } = require ('./models/users')

mongoose.connect(uri)

const app = express();
app.use(helmet())
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('combined'))


// login
app.post('/auth', async (req,res) => {    
    const user = await User.findOne({userName: req.body.userName})    
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

// authorisation using token
app.use(async (req,res,next) => {
    const authHeader = req.headers['authorization']
    const user = await User.findOne({token: authHeader})
    if(user){
        next()
    } else {
        res.sendStatus(403)
    }
})

// crud
app.get('/', async(req,res) => {
    res.send(await Event.find())
}) 

app.post('/', async (req,res) => {
    const newEvent = req.body
    const event = new Event(newEvent)
    await event.save()
    res.send({ message: 'New event posted.'})

})

app.listen(port, () => 
    console.log(`Events API listening on http://localhost:${port}`)
)

var db = mongoose.connection
db.on('error', console.error.bind(console, "Connection error"))
db.once('open', function callback() {
    console.log("Database connected")
})


