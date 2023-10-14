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
    let { email, password } = req.body;
    try {
      const userFound = await User.findOne({ email: email });
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
      console.log('!!error while saving registration detail ---', error);
    }
  });

// Route to handle user registration
app.post('/register', (req, res) => {});
//
app.listen(port, console.log(`Port started at ${port}`));

//
