const express = require("express");
const router = express.Router();
const Post = require("../Models/post");
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

router.post("",multer({storage:storage}).single("image"),(req,res,next) => {
    const url = req.protocol + "://" +req.get('host');
    const post = new Post({
        title:req.body.title,
        content:req.body.content,
        imagePath:url+ "/images/" +req.file.filename
    });
    post.save().then((result) => {
        res.status(201).json({
            message:"successfully post created",
            post : {
                title : result.title, //return all objects except which one added or overwritten
                id:result._id,
                content : result.content,
                imagePath : result.imagePath
            }
        });
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
    });
});

router.put("/:id",multer({storage:storage}).single('image'),(req,res) => {
    if(req.file){
        const url = req.protocol+'://'+ req.get('host');
        imagePath = url + "/images/" + req.file.filename; 
    }
    const post = new Post({
        _id : req.body.id,
        title : req.body.title,
        content : req.body.content,
        imagePath : req.body.imagePath
    });
    console.log(post);
    Post.updateOne({_id : req.params.id},post).then((result) => {
        console.log("result",result,post);
        res.status(200).json({message:'successfully post updated'});
    }).catch((error) => {
        console.log("error",error);
    });
});

router.delete("/:id",(req,res) => {
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

router.get("/:id",(req,res) => {
    Post.findById({_id : req.params.id}).then((post) => {
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message:'post not found'});
        }
    });
});

module.exports = router;