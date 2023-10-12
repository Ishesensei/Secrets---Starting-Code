//jshint esversion:6
import mongoose from "mongoose";
import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import ejs from "ejs";
const port = process.env.PORT || 3002;
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
//

//
app.listen(port, console.log(`Port started at ${port}`));

//
