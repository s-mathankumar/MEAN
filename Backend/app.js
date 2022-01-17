const express = require('express');
const bodyParser = require('body-parser');
const { json } = require('body-parser');
const Post = require('./Models/post');
const mongoose = require('mongoose');
const dbCredentials = require('./MongoCredentials.json')

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

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Origin,Content-Type,x-Requested-With,Accept");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,DELETE,UPDATE,OPTIONS");
    next();
});

app.post("/posts",(req,res,next) => {
    const post = new Post({
        title:req.body.title,
        content:req.body.content
    });
    post.save(); //Name of the Model
    res.status(201).json({
        message:"successfully post added"
    });
    next();
});

app.get("/posts",(req,res) => {
    Post.find().then((document) => {
        console.log(document);
        res.status(200).json({
            message:"Post successfully fetched",
            posts:document
        });
    });
});

module.exports = app;