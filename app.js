//jshint esversion:6

import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import express from 'express';
const app = express();
import 'dotenv/config';
import ejs from 'ejs';
import flash from 'connect-flash';
import session from 'express-session';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
import morgan from './customMorgan.js';
import { colorTags, chalk } from './customcolorTags.js';
import cookieParser from 'cookie-parser';
import GoogleStrategy from 'passport-google-oauth20';
GoogleStrategy.Strategy;
import findOrCreate from 'mongoose-findorcreate';

//
const port = process.env.PORT || 3000;
// customise middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(flash());
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
function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  if (!req.isAuthenticated()) {
    colorTags.log('user not authenticated!');
    return res.redirect('/login');
  }
}
//
// Database configuration
const Urioptions = { useUnifiedTopology: true, useNewUrlParser: true };
const dbUri = 'mongodb://localhost:27017/user1DB';
const user1DB = mongoose.createConnection(dbUri, Urioptions);
//

// Define the user schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: String
});
//
//Define the Schema plugin
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
//
// Define the user model
const User = user1DB.model('User', userSchema);
//
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/oauth2/redirect/google',
      userProfileURL: 'http://www.googleapis.com/oauth2/v3/userinfo',
      scope: ['email', 'profile'],
      passReqToCallback   : true
    },
    function (request, accessToken, refreshToken, profile, done) {
      console.log(request, accessToken, refreshToken, profile);
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  )
);

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
        failureFlash: 'failed to authenticate so redirecting to login!',
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

app.get(
  '/oauth2/google',
  passport.authenticate('google', { scope: ['profile'] })
);

app.get(
  '/oauth2/redirect/google',
  passport.authenticate('google', {
    failureRedirect: '/login',
    failureMessage: true,
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log('user logged in !');
    res.redirect('/secrets');
  }
);

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
        req.logIn(user, function (err) {
          if (err) {
            throw err;
          }
          // session saved
          return res.redirect('/secrets');
        });
      }
    });
  });

app.get('/secrets', isAuth, (req, res) => {
  colorTags.httpReq();

  if (req.isAuthenticated()) {
    res.render('secrets');
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', isAuth, function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});
//
app.listen(port, console.log(`Port started at ${port}`));
