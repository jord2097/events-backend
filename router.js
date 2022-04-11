const express = require('express');
const router = express.Router()
const events = require('./eventController')

router.get('/', events.index)

module.exports = router;