//jshint esversion:6
import mongoose from 'mongoose';
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

// Create the User model
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
  .post((req, res) => {
    res.render('login');
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

    // Save the user to the database
    newUser.save();
  });

// Route to handle user registration
app.post('/register', (req, res) => {});
//
app.listen(port, console.log(`Port started at ${port}`));

//
