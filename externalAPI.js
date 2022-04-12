const axios = require('axios');
const express = require('express');
const { events } = require('./models/events')

const apikey = "4340a8146e26f2d7d6d12e60ecf0ecc3"

exports.getCoords = async (req, res) => {
    const response = await axios(`http://api.openweathermap.org/geo/1.0/direct?q=${req.body.location}&limit=5&appid=${apikey}`)
    .then ((response => {
        return response
    }))
    return response
}

exports.getForecast = async (req,res) => {
    const response = await axios (`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,alerts&appid=${apikey}`)
    .then((response) => {
        return response
    })    
    return response
}



/* const getForecast = async (req,res) => {
    const response =
} */