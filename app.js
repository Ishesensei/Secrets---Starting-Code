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
const Urioptions = { useNewUrlParser: true };
const dbUri = "mongodb://127.0.0.1:27017/userDB";
const userDB = mongoose.createConnection(dbUri, Urioptions);
const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
});
const User = userDB.model("User", userSchema);
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
    .post((req, res) => {
        res.render("register");
    });
app.get("/submit", (req, res) => {
    res.render("submit");
});

userDB.close();
//
app.listen(port, console.log(`Port started at ${port}`));

//
