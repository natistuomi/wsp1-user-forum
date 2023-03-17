const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../utils/database');
const session = require('express-session');

const promisePool = pool.promise();



router.get('/', function (req, res, next) {
    res.render('index.njk', { title: 'Hello World' });
});




module.exports = router;
