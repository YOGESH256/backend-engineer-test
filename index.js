const express = require('express');
const app = express();

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoute = require("./routes/users");



app.use(express.json());



app.use(express.static('public'))

app.use("/api/" , userRoute);




module.exports = app
