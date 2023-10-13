//jshint esversion:6
import mongoose from "mongoose";
import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import ejs from "ejs";
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
var Urioptions = { useUnifiedTopology: true, useNewUrlParser: true };
var dbUri = "mongodb://localhost:27017/userDB";
var userDB = mongoose.createConnection(dbUri, Urioptions);
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

//
app.get("/", (req, res) => {
    res.render("home");
});
app.route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post((req, res) => {
        res.render("login");
    });
app.route("/register")
    .get((req, res) => {
        res.render("register");
    })
    .post(async (req, res) => {
        const { password, email } = req.body;
        console.log("!!email and password --->", email, password);
        var userDB = await mongoose.createConnection(dbUri, Urioptions);
        var User = userDB.model("User", userSchema);

        const newUser = new User({
            email: email,
            password: password,
        });
        await newUser.save();
        userDB.close();
    });

userDB.close();
//
app.listen(port, console.log(`Port started at ${port}`));

//
