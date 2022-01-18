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
    res.setHeader("Access-Control-Allow-Methods","GET,POST,DELETE,PUT,PATCH,OPTIONS");
    next();
});

app.post("/posts",(req,res,next) => {
    const post = new Post({
        title:req.body.title,
        content:req.body.content
    });
    post.save().then((result) => {
        res.status(201).json({
            message:"successfully post created",
            postId:result.id
        });
    }); //Name of the Model
});

app.get("/posts",(req,res,next) => {
    Post.find().then((document) => {
        //console.log(document);
        res.status(200).json({
            message:"Post successfully fetched",
            posts:document
        });
    });
});
app.put("/posts/:id",(req,res) => {
    console.log(req.params.id);
    const post = new Post({
        _id : req.body.id,
        title : req.body.title,
        content : req.body.content
    });
    console.log(post);
    Post.updateOne({_id : req.params.id},post).then((result) => {
        console.log("result",result,post);
        res.status(200).json({message:'successfully post updated'});
    }).catch((error) => {
        console.log("error",error);
    });
});

app.delete("/posts/:id",(req,res) => {
    console.log(req.params.id);
    Post.deleteOne({_id : req.params.id}).then((result) => {
      console.log("result",result);
    }).catch((error) =>{
        console.log(error);
    });
    res.status(200).json({
        message:"Post deleted successfully"
    });
});

app.get("/posts/:id",(req,res) => {
    Post.findById({_id : req.params.id}).then((post) => {
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message:'post not found'});
        }
    });
});

module.exports = app;