//jshint esversion:6

import mongoose from 'mongoose';
import express from 'express';
const app = express();
import 'dotenv/config';
import ejs from 'ejs';
import session from 'express-session';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
//
const port = process.env.PORT || 3000;
// customise middleware
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
//

// Database configuration
const Urioptions = { useUnifiedTopology: true, useNewUrlParser: true };
const dbUri = 'mongodb://localhost:27017/user1DB';
const user1DB = mongoose.createConnection(dbUri, Urioptions);
//

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
//
//Define the Schema plugin
userSchema.plugin(passportLocalMongoose);
//
// Define the user model
const User = user1DB.model('User', userSchema);
//
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//
app.get('/', (req, res) => {
  res.render('home');
});
app
  .route('/login')
  .get((req, res) => {
    res.render('login');
  })
  .post(async (req, res) => {
    let { email, password } = req.body;
    try {
      const userFound = await User.findOne({ username: email });
      if (!userFound) {
        return res.render('status', { status: "User doesn't exist" }); // Corrected the status message
      }

      // Check if the password provided matches the user's password
      const passwordMatch = userFound.password === password;

      if (passwordMatch) {
        console.log(`Authentication matched!`);
        res.render('secrets');
      } else {
        res.render('status', { status: 'Login failed. Password error.' });
      }
    } catch (error) {
      res.render('status', { status: 'Some error while looking for the user' });
    }
  });

app
  .route('/register')
  .get((req, res) => {
    res.render('register');
  })
  .post(async (req, res) => {
    let { email, password } = req.body;
    User.register({ username: email }, password, function (err, user) {
      if (err) {
        console.log('!!err --->', err);
        res.redirect('/register');
      } else {
        passport.authenticate('local')(req, res, () => {
          res.redirect('/secrets');
        });
      }
    });
  });

app.get('/secrets', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('secrets');
  } else {
    res.redirect('/login');
  }
});

//
app.listen(port, console.log(`Port started at ${port}`));
