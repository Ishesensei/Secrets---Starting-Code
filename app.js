//jshint esversion:6

import mongoose from 'mongoose';
// import encrypt from 'mongoose-encryption';
import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import ejs from 'ejs';
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
// Database configuration
const Urioptions = { useUnifiedTopology: true, useNewUrlParser: true };
const dbUri = 'mongodb://localhost:27017/user1DB';
const user1DB = mongoose.createConnection(dbUri, Urioptions);
//

// Define the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
var secret = process.env.SECRET;
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });
const User = user1DB.model('User', userSchema);

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
    const { email, password } = req.body;
    try {
      const userFound = await User.findOne({ email: email });
      if (userFound && userFound.password === password) {
console.log('!!status --->',` logged in successfully for,email`={});
        
        res.render('secrets');
      }
      if (userFound && userFound.password !== password) {
        res.render('status', { status: 'Login failed Password error.' });
      }
      if (!userFound) {
        res.render('status', { status: 'User doent exist' });
      }
    } catch (error) {
      res.render('status', { status: 'Some error while looking for user' });
    }
  });
app
  .route('/register')
  .get((req, res) => {
    res.render('register');
  })
  .post(async (req, res) => {
    const { email, password } = req.body;

    // Create a new user document
    const newUser = new User({
      email,
      password,
    });
    console.log('!!newUser --->', newUser);

    // Save the user to the database
    try {
      await newUser.save();
      console.log('Success');
      res.render('secrets.ejs');
    } catch (error) {
      console.log('!!error while saving registration detail ---');
    }
  });

// Route to handle user registration
app.post('/register', (req, res) => {});
//
app.listen(port, console.log(`Port started at ${port}`));

//
