const express = require("express");
const router = express.Router();
const Post = require("../Models/post");
const verifyAuth = require('../middleware/verifyAuth'); //verying Authorization by json web token
const multer = require('multer');

const MIME_TYPE_MAP = {
    "image/png" :"png",
    "image/jpeg" : "jpg",
    "image/jpg" : "jpg"
}

const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("INVALID MIME TYPE");
        if(isValid){
            error = null;
        }
        cb(error,"backend/images");
    },
    filename:(req,file,cb) => {
        const imageFile = file.originalname.toLowerCase().split(' ').join('-');
        const mime = MIME_TYPE_MAP[file.mimetype];
        console.log(mime);
        cb(null,imageFile+'-'+Date.now()+'.'+mime);
    }
});

router.post("",verifyAuth,multer({storage:storage}).single("image"),(req,res,next) => {
    const url = req.protocol + "://" +req.get('host');
    const post = new Post({
        title:req.body.title,
        content:req.body.content,
        imagePath:url+ "/images/" +req.file.filename,
        creator:req.userData.id
    });
    post.save().then((result) => {
        res.status(201).json({
            message:"successfully post created",
            post : {
                title : result.title, //return all objects except which one added or overwritten
                id:result._id,
                content : result.content,
                imagePath : result.imagePath,
                creator : result.creator
            }
        });
    }).catch((error) => {
        res.status(500).json({
            message : "Creating a post failed"
        })
    }); //Name of the Model
});

router.get("",(req,res,next) => {
    const pageSize = +req.query.pageSize; //'+' sign added to convert string type to number
    const currentPage = +req.query.currentPage;
    const postFindQuery = Post.find();
    let fetchedData;
    if(pageSize && currentPage){
        postFindQuery.skip(pageSize * (currentPage - 1)).
        limit(pageSize);
    }
    postFindQuery.then((document) => {
        fetchedData = document;
        return Post.count();
    }).then((count) => {
        //console.log(document);
        res.status(200).json({
            message:"Post successfully fetched",
            posts:fetchedData,
            postsCount:count
        });
    }).catch(error => {
        res.status(500).json({
            message:"fetching posts failed..!"
        })
    });
});

router.put("/:id",verifyAuth,multer({storage:storage}).single('image'),(req,res) => {
    if(req.file){
        const url = req.protocol+'://'+ req.get('host');
        imagePath = url + "/images/" + req.file.filename; 
    }
    const post = new Post({
        _id : req.body.id,
        title : req.body.title,
        content : req.body.content,
        imagePath : req.body.imagePath,
    });
    console.log(post);
    Post.updateOne({_id : req.params.id,creator:req.userData.id},post).then((result) => {
        if(result.modifiedCount > 0){
            res.status(200).json({message:'successfully post updated'});
        }else{
            res.status(401).json({message:"UnAuthorized"});
        }
    }).catch((error) => {
        res.status(500).json({
            message:"Something went wrong on update...!"
        })
    });
});

router.delete("/:id",verifyAuth,(req,res) => {
    Post.deleteOne({_id : req.params.id,creator:req.userData.id}).then((result) => {
        console.log(result);
        if(result.deletedCount > 0){
            res.status(200).json({
                message:"Post deleted successfully"
            });
        }else{
            res.status(401).json({
                message:"unAuthorized"
            });
        }
    }).catch((error) =>{
        res.status(500).json({
            message:"post can't deleted...!"
        })
    });
});

router.get("/:id",(req,res) => {
    Post.findById({_id : req.params.id})
    .then((post) => {
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message:'post not found'});
        }
    }).catch(error => {
        res.status(500).json({
            message:"Fetching post failed...!"
        })
    });
});

module.exports = router;