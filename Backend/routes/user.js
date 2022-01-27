const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');
const User = require('../Models/user');

router.post("/signup",(req,res,next) => {
    // Encrypting password
    bcrypt.hash(req.body.password,10)
    .then(hash => {
        const user = new User({
        email:req.body.email,
        password:hash
        })
        user.save().then((result) => {
            res.status(200).json({
                message:"user created successfully",
                result:result
            });
        }).catch(error => {
            res.status(500).json({
                message:"E-mail id already exists"
            });
        });
    });
});

router.post("/login",(req,res,next) => {
    let fetchedUser;
    User.findOne({email : req.body.email})
    .then(user => {
        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }
        fetchedUser = user;
        // comparing encrypted password
        return bcrypt.compare(req.body.password,user.password)
        .then(result => {
            if(!result){
                return res.status(401).json({
                    message : "Auth Failed"
                });
            }
            //Authentication by json web token
            const token = jwt.sign({email:fetchedUser.email,id:fetchedUser._id},"Secret_Text@123",{expiresIn:"1h"}); 
            res.status(200).json({
                token:token,
                expiresIn : 3600,
                userId : fetchedUser._id
            })
        });
    }).catch(error => {
         res.status(401).json({
            message : "Authorization failed"
        });
    });
});

module.exports = router;