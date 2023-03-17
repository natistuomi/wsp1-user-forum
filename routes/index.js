const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../utils/database');
const session = require('express-session');
const { render } = require('nunjucks');

const promisePool = pool.promise();



router.get('/', async function (req, res, next) {
    const [rows] = await promisePool.query("SELECT nt19posts.*, nt19logins.username AS author FROM nt19posts JOIN nt19logins on nt19posts.authorId = nt19logins.id ORDER BY id DESC");
    res.render('index.njk', { 
        title: 'Homepage',
        rows: rows
    });
});

router.get('login', function (req, res, next) {
    res.render('login.njk', {
        title: 'Login'
    });
});

router.get('/register', function (req, res, next){
    res.render('register.njk', {
        title: 'Register'
    });
});

router.get('/new', async function (req, res, next){
    res.render('new.njk', {
        title: 'New post'
    });
});

router.get('/profile', function (req, res, next){
    if(req.session.loggedin){
        res.render('profile.njk', { 
            username: req.session.username
        });
    }
    else{
        res.status(401).json('Access denied');
    }
});

router.get('/post/:id', async function (req, res, next){
    const postId = req.params.id;
    const post = await promisePool.query('SELECT nt19posts.*, nt19logins.username AS author FROM nt19posts JOIN nt19logins ON nt19posts.authorID = nt19logins.id WHERE nt19posts.id =' + postId);
    const comments = await promisePool.query('SELECT nt19commentary.*, nt19logins.username AS author FROM nt19commentary JOIN nt19logins on nt19commentary.authorId = nt19logins.id WHERE nt19commentary.postId =' + postId); 
    res.render('post.njk', { 
        post: post[0][0], 
        title: 'Post',
        comments: comments[0]
    }); 
});



module.exports = router;
