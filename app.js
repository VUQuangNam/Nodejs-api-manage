require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const session = require('express-session')
const bcryptjs = require('bcryptjs');
const router = require('express').Router();

/** Auth 2 GG + FB */
const passport = require('passport');
const passportfb = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

/** Import send email */
var nodemailer = require('nodemailer');

const AccRoutes = require('./src/routes/account.router');
const UserRoutes = require('./src/routes/user.router');
const PerRoutes = require('./src/routes/permission.router');
const ProductRoutes = require('./src/routes/product.route');

const User = require('./src/models/user.model');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'adaqzxcas'
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

mongoose.connect(process.env.DB_LOCALHOST, { useNewUrlParser: true });

const port = process.env.PORT;
app.set('views', './views');
app.set('view engine', 'ejs');

app.listen(port, function () {
    console.log("Chạy RestHub trên cổng " + port);
});

app.use('/api',
    AccRoutes,
    UserRoutes,
    PerRoutes,
    ProductRoutes
);

app.get('/', (req, res) => res.send('Đăng nhập thành công'));
app.get('/login', (req, res) => res.render('login'));
app.get('/auth/fb', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/fb/cb', passport.authenticate('facebook', {
    failureRedirect: '/',
    successRedirect: '/'
}));

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findOne({ id }, (err, user) => {
        done(null, user)
    })
})

passport.use(new passportfb(
    {
        clientID: process.env.CID,
        clientSecret: process.env.CS,
        callbackURL: process.env.CURL,
        profileFields: ['displayName', 'photos', 'email', 'gender'],
        enableProof: true
    },
    (accessToken, refreshToken, profile, done) => {
        User.findOne({ _id: profile._json.id }, async (err, user) => {
            if (err) return done(err)
            if (user) return done(null, user)
            const newUser = new User({
                _id: profile._json.id,
                username: profile._json.email,
                name: profile._json.name,
                password: await bcryptjs.hash(profile._json.id, 8),
                email: profile._json.email
            })
            newUser.save((err) => {
                return done(null, newUser)
            })
            console.log(accessToken);
        })
    }
))


app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: '/'
}));

passport.use(new GoogleStrategy({
    clientID: process.env.CIDGG,
    clientSecret: process.env.CSGG,
    callbackURL: '/auth/google/callback',
},
    (token, refreshToken, profile, done) => {
        User.findOne({ _id: profile.id }, async (err, user) => {
            if (err) return done(err)
            if (user) {
                console.log(user);
                return done(null, user)
            }
            const newUser = new User({
                _id: profile.id,
                username: profile._json.email,
                name: profile.displayName,
                password: await bcryptjs.hash(profile.id, 8),
                email: profile._json.email
            })
            newUser.save((err) => {
                return done(null, newUser)
            })
            console.log(token);
        })
    }));

module.exports = router;