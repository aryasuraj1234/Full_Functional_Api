const  userModel=require('../models/userModel');
const jwt = require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();
const authUser = async(req,res,next)=>{
  let token;
  const { authorization }=req.headers
  if(authorization && authorization.startsWith('Bearer')){
   try {
       token = authorization.split(' ')[1];
       console.log(token);
       // verify token 
       const {USERId}=jwt.verify(token,process.env.SECRET_KEY);
      //  console.log(USERId);
       // get user from token
      req.user = await userModel.findById(USERId).select("-password");
    next();
   } catch (error) {
       res.json(error);
   }
  }
  else{
 res.json({"status":"autharization failed"})
  }
 if(!token){
   res.json({"status":"unorthorized token"});
 }
}


module.exports=authUser;