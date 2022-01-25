const jwt = require('jsonwebtoken');

const verify_auth = (req,res,next) => {
    try{
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token,"Secret_Text@123");
    next();
    }catch(error) {
        res.status(401).json({
            message:"Auth Failed"
        })
    }
}

module.exports = verify_auth;