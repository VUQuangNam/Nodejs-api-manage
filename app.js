require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const passport = require('passport');
const passportfb = require('passport-facebook').Strategy;
const session = require('express-session')
const bcryptjs = require('bcryptjs');
const router = require('express').Router();

const AccRoutes = require('./manage/routes/account.router');
const UserRoutes = require('./manage/routes/user.router');
const PerRoutes = require('./manage/routes/permission.router');
const ProductRoutes = require('./manage/routes/product.route');

const User = require('./manage/models/user.model')

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

app.get('/', (req, res) => res.send('haha'));
app.get('/login', (req, res) => res.render('login'));
app.get('/auth/fb', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/fb/cb', passport.authenticate('facebook', {
    failureRedirect: '/',
    successRedirect: '/'
}));

passport.use(new passportfb(
    {
        clientID: process.env.CID,
        clientSecret: process.env.CS,
        callbackURL: process.env.CURL,
        profileFields: ['displayName', 'photos', 'email', 'gender'],
        enableProof: true
    },
    (accessToken, refreshToken, profile, done) => {
        User.findOne({ id: profile._json.id }, async (err, user) => {
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
        })
    }
))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findOne({ id }, (err, user) => {
        done(null, user)
    })
})

module.exports = router;