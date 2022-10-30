const jwt = require('jsonwebtoken');
const LSuser = require('../models/LSuser');

const requireAuth = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token){
        const secret = "bunny";
         jwt.verify(token,secret,(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }
        else{
            console.log(decodedToken);
            console.log("hello");
            next();
        }
         });
    }
    else{
        res.redirect('/login');
    }
}

const checkUser = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token){
        const secret = "bunny";
         jwt.verify(token,secret,async (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.locals.user = null;
                next();
            }
        else{
            console.log(decodedToken);
            let user = await LSuser.findById(decodedToken.id);
            res.locals.user = user;
            next();
        }
         });
    }
    else{
        res.locals.user = null;
        next();
    }
}

module.exports = {requireAuth,checkUser};