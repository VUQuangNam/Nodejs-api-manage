require('dotenv').config();

let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let app = express();
const passport = require('passport');
const passportfb = require('passport-facebook').Strategy;
const session = require('express-session')
var bcrypt = require('bcryptjs');

let apiRoutes = require('./manage/routes/routes');
const User = require('../Nodejs-api-tranning/manage/model/user.model')

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


var port = process.env.PORT;
app.set('views', './views');
app.set('view engine', 'ejs');

app.use('/api', apiRoutes);
app.get('/', (req, res) => res.send('haha'));
app.get('/login', (req, res) => res.render('login'));
app.get('/auth/fb', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/fb/cb', passport.authenticate('facebook', {
    failureRedirect: '/',
    successRedirect: '/'
}));

passport.use(new passportfb(
    {
        clientID: "799394043897220",
        clientSecret: "279ed8df3915bb7cd822ff237999a0d2",
        callbackURL: "http://localhost:8080/auth/fb/cb",
        profileFields: ['email', 'gender', 'displayName'],
        enableProof: true
    },
    (accessToken, refreshToken, profile, done) => {
        User.findOne({ id: profile._json.id }, async (err, user) => {
            if (err) return done(err)
            if (user) return done(null, user)
            const newUser = new User({
                _id: profile._json.id,
                username: profile._json.id,
                name: profile._json.name,
                password: await bcrypt.hash(profile._json.id, 8),
                address: "user",
                email: "user@gmail.com",
                gender: "male",
                phone: "0987654221",
                create_by: {
                    id: "5e5e275ca088bc3bcc4552e1",
                    name: "user13"
                },
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

app.listen(port, function () {
    console.log("Chạy RestHub trên cổng " + port);
});

let router = require('express').Router();

module.exports = router;