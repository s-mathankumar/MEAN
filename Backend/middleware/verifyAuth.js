const jwt = require('jsonwebtoken');

const verify_auth = (req,res,next) => {
    try{
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token,"Secret_Text@123");
    req.userData = {email:decodedToken.email,id:decodedToken.id};
    next();
    }catch(error) {
        res.status(401).json({
            message:"You're not authenticated"
        })
    }
}

module.exports = verify_auth;