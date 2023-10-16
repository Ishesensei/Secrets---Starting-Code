//jshint esversion:6

import mongoose from 'mongoose';
import express from 'express';
const app = express();
import 'dotenv/config';
import ejs from 'ejs';
import session from 'express-session';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
import morgan from './customMorgan.js';
import { colorTags, chalk } from './customcolorTags.js';
import cookieParser from 'cookie-parser';
//
const port = process.env.PORT || 3000;
// customise middleware
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(
  morgan(
    `${chalk.overline.underline.magenta(
      '( :method )'
    )} ${chalk.overline.underline.green(
      '( :url )'
    )} :status :res[content-length]\n:req-query :req-params :req-body\n :req-headers-cookie\n :line`
  )
);
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser());
//
app.use(passport.initialize());
app.use(passport.session());
//
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});
//
// Database configuration
const Urioptions = { useUnifiedTopology: true, useNewUrlParser: true };
const dbUri = 'mongodb://localhost:27017/user1DB';
const user1DB = mongoose.createConnection(dbUri, Urioptions);
//

// Define the user schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
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
  colorTags.httpReq();
  res.render('home');
});
app
  .route('/login')
  .get((req, res) => {
    colorTags.httpReq();

    res.render('login');
  })
  .post(async (req, res) => {
    colorTags.httpReq();
    let { email, password } = req.body;
    try {
      passport.authenticate('local', {
        successRedirect: '/secrets',
        failureRedirect: '/login',
      })(req, res, (err) => {
        if (err) {
          // Handle the error here
          console.error(err);
          // You can also redirect to an error page or send a custom response
          res.status(500).send('Internal Server Error');
        }
      });
    } catch (error) {
      res.render('status', { status: 'Some error ' });
    }
  });
app
  .route('/register')
  .get((req, res) => {
    colorTags.httpReq();
    res.render('register');
  })
  .post(async (req, res) => {
    colorTags.httpReq();
    let { email, password } = req.body;
    const username = email;
    await User.register({ username: username }, password, function (err, user) {
      if (err) {
        console.log(err.message);
        return res.send(err.message);
        //res.redirect('/register');
      }
      if (user) {
        colorTags.log('User Registered');
        async function authenticateUser(req, res) {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', {
      successRedirect: '/secrets',
      failureRedirect: '/login',
    })(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
      }
    });
  });

app.get('/secrets', (req, res) => {
  colorTags.httpReq();

  if (req.isAuthenticated()) {
    res.render('secrets');
  } else {
    res.redirect('/login');
  }
});

//
app.listen(port, console.log(`Port started at ${port}`));
