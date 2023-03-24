const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../utils/database');
const session = require('express-session');
const { render } = require('nunjucks');
const validator = require('validator');
const promisePool = pool.promise();

router.get('/', async function (req, res, next) {
    const [rows] = await promisePool.query("SELECT nt19posts.*, nt19logins.username AS author FROM nt19posts JOIN nt19logins on nt19posts.authorId = nt19logins.id ORDER BY id DESC");
    res.render('index.njk', { 
        title: 'Homepage',
        rows: rows,
        loggedIn: req.session.userId||0
    });
});

router.get('/login', function (req, res, next) {
    res.render('login.njk', {
        title: 'Login',
        loggedIn: req.session.userId||0
    });
});

router.get('/register', function (req, res, next){
    res.render('register.njk', {
        title: 'Register',
        loggedIn: req.session.userId||0
    });
});

router.get('/new', async function (req, res, next){
    res.render('new.njk', {
        title: 'New post',
        loggedIn: req.session.userId||0
    });
});

router.get('/profile', function (req, res, next){
    if(req.session.loggedin){
        res.render('profile.njk', { 
            username: req.session.username,
            loggedIn: req.session.userId||0
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
        postId: postId,
        comments: comments[0],
        loggedIn: req.session.userId||0
    }); 
});

router.get('/bcrypt/:pwd', function (req, res ,next){
    bcrypt.hash(req.params.pwd, 10, function (err, hash) {
        return res.json(hash);
    });
});

router.post('/login', async function (req, res, next) {
    const { username, password } = req.body;

    if (username.length === 0){
        res.json('Username is Required')
    }
    else if (password.length === 0){
        res.json('Password is Required')
    }
    else{
        const [rowsname, query] = await promisePool.query('SELECT username FROM nt19logins WHERE username = ?', [username]);
        if(rowsname.length > 0 ){
            const [rows, query] = await promisePool.query('SELECT password FROM nt19logins WHERE username = ?', [username]);
            const bcryptPassword = rows[0].password
            const userId = await promisePool.query("SELECT nt19logins.id FROM nt19logins WHERE username = ?", [username]);
            bcrypt.compare(password, bcryptPassword , function(err, result) {
                console.assert(result,'Invalid username or password')
                if(result){
                    req.session.loggedin = true;
                    req.session.username = username;
                    req.session.userId = userId[0][0].id;
                    res.redirect('/profile');
                }
                else{ 
                    res.json('Invalid username or password')
                }
            });
        }
        else{
            res.json('Invalid username or password');
        }
    }
});

router.post('/register', async function(req, res, next){
    const { username, password, passwordConfirmation, } = req.body;
    if(username.length < 6) {
        res.json('Username must be at least 6 characters');
    }
    else if(password.length < 8){
        res.json('Password must be at least 8 characters');
    }
    else if(passwordConfirmation !== password){
        res.json('Passwords do not match');
    } 
    else if(password === username){
        res.json('Username and password can not be identical');
    }
    else {
        const [user, query] = await promisePool.query('SELECT username FROM nt19logins WHERE username = ?', [username]);
        if(user.length > 0 ){
            res.json('Username is already taken')
        }
        else{
            bcrypt.hash (password, 10, async function(err, hash){
                await promisePool.query('INSERT INTO nt19logins (username, password) VALUES (?, ?)', [username,hash]);
                res.redirect('/login');
            });                
        }
    }
});

router.post('/new', async function (req, res, next) {
    const { title, content } = req.body;
    const authorId = req.session.userId;
    if(title.length < 3){
        res.json('Title must be at least 3 characters');
    }
    else if(content.length < 10){
        res.json('Content must be at least 10 characters');
    }
    else{
        if(req.session.loggedin){
            const sanitize = (str) => {
                let temp = str.trim();
                temp = validator.stripLow(temp);
                temp = validator.escape(temp);
                return temp;
            };
            const sanitizedTitle = sanitize(title);
            const sanitizedContent = sanitize(content);
            const [rows] = await promisePool.query('INSERT INTO nt19posts (authorId, title, content) VALUES (?, ?, ?)', [authorId, sanitizedTitle, sanitizedContent]);
            res.redirect('/');
        }
        else{
            res.redirect('/login');
        }
    }
});

router.post('/logout', async function(req, res, next){
    if(req.session.loggedin){
        req.session.destroy();
        res.redirect('/')
    }
    else{
        res.status(401).json('Access denied')
    }
});

router.post('/deleteUser', async function(req, res, next){
    if(req.session.loggedin){
        await promisePool.query('DELETE FROM nt19commentary WHERE authorId = ?', [req.session.userId]);
        await promisePool.query('DELETE FROM nt19posts WHERE authorId = ?', [req.session.userId]);
        await promisePool.query('DELETE FROM nt19logins WHERE username = ?', [req.session.username]);
        req.session.destroy();
        res.redirect('/')
    }
    else{
        res.status(401).json('Access denied')
    }
});

router.post('/comment', async function (req, res, next) {
    const { postId, content } = req.body;
    const authorId = req.session.userId;
    if(req.session.loggedin){
        const sanitize = (str) => {
            let temp = str.trim();
            temp = validator.stripLow(temp);
            temp = validator.escape(temp);
            return temp;
        };
        const sanitizedContent = sanitize(content);
        const [rows] = await promisePool.query('INSERT INTO nt19commentary (authorId, postId, content) VALUES (?, ?, ?)', [authorId, postId, sanitizedContent]);
        res.redirect('/');
    }
    else{
        res.redirect('/login');
    }
});

module.exports = router;
