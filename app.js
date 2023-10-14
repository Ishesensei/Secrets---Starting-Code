//jshint esversion:6

import mongoose from 'mongoose';
import encrypt from 'mongoose-encryption';
import express from 'express';
const app = express();
import 'dotenv/config';
import ejs from 'ejs';
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
import bcrypt from 'bcrypt';
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
    let myPlaintextPassword = password;
    try {
      const userFound = await User.findOne({ email: email });
      if (!userFound) { 
        res.render('status', { status: 'User doent exist' });
      }
      if (userFound) {
        const testauth = await bcrypt.compareSync(
          myPlaintextPassword,
          userFound.password
        );

        if (testauth === true) {
          console.log(`auth matched!`);
          res.render('secrets');
        }
        if (testauth === false) {
          res.render('status', { status: 'Login failed Password error.' });
        }
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
    let { email, password } = req.body;

    const saltRounds = 10;
    const myPlaintextPassword = password;
    const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
    console.log(`hashhhhhhhhhhhhhhhhhhhhhhhh`,hash)
    password = hash;
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
      console.log('!!error while saving registration detail ---',error);
    }
  });

// Route to handle user registration
app.post('/register', (req, res) => {});
//
app.listen(port, console.log(`Port started at ${port}`));

//
