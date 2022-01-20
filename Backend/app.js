const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { json } = require('body-parser');
const mongoose = require('mongoose');
const dbCredentials = require('./MongoCredentials.json');
const postsRoutes = require('./routes/posts');

const app = express();

mongoose.connect("mongodb+srv://"+dbCredentials.username+":"+dbCredentials.password+"@cluster0.wqquo.mongodb.net/node-angular?retryWrites=true&w=majority")
.then(() => {
    console.log("MongoDb successfully connected.");
})
.catch((reason) => {
    console.log(reason);
    console.log("Connection Failed");
});

// app.use((req,res,next) => {
//     console.log("first middleware");
//     next();
// });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use("/images",express.static(path.join("backend/images")));

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Origin,Content-Type,x-Requested-With,Accept");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,DELETE,PUT,PATCH,OPTIONS");
    next();
});

app.use("/posts",postsRoutes);

module.exports = app;