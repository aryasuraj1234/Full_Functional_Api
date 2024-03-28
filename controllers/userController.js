const userModel=require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const transporter= require('../config/nodeMailer');
const tokenMOdel = require('../models/token');

const Resistration = async(req,res)=>{
  try {
    const {name,email,password,confirm_password}=req.body;
    const profilePicturePath = req.file ? req.file.path : null;
    const user = await userModel.findOne({email:email});
  if (user) {
    res.json({"status":"failed","message":"User Already resistered here"})
  } else {
    if(name && email && password && confirm_password){
    if (password===confirm_password) {

    const salt =await bcrypt.genSalt(10);
    const hashPassword =await bcrypt.hash(password,salt);
    const newUser = new userModel({
        name:name,
        email:email,
        password:hashPassword,
        profilePicturePath:profilePicturePath
    })
    
    await newUser.save();
    const saved_user=await userModel.findOne({email:email});
    
    const token = jwt.sign({USERId:saved_user._id},process.env.SECRET_KEY,{expiresIn:"5d"});
    const newToken= new tokenMOdel({
        token:token,
        email:saved_user.email
    })
    await newToken.save();
    // await Token.create({USERId:saved_user.id,});
    
    res.json({"status":"successful","message":"Resistration Successfully","result":newUser,"token":newToken})
    } else {
      res.json({"status":"failed","message":"Not Match Yours Passwords"})  
    }
    }
    else{
        res.json({"status":"failed","message":"All fields Are Require"})
    }
  }
    
  } catch (error) {
    res.json(error)
  }
}
const login =async(req,res)=>{
try {
  const {email , password}=req.body;
  const user = await userModel.findOne({email:email});
  if(user){
  // const salt =await bcrypt.genSalt(10);
  const ismatch = await bcrypt.compare(password,user.password);
  if(user.email === email && ismatch){
  const token = jwt.sign({USERId:user._id},process.env.SECRET_KEY,{expiresIn:"8d"})

  res.json({"status":"success","message":"Login Successfully","token":token})
  }
   else{
    res.json({"message":"failed", "message":"Eamil and Password not match"});
   }
  }
  else{
    res.json({"status":"failed","message":"Email Not Resistered"})
  }
   
} catch (error) {
  res.json(error);
}
}

const getAllUser =async(req,res)=>{
  try {
   const users= await userModel.find();
   res.json(users);
  } catch (error) {
    res.json(error);
  }
}

const getOneUser=async(req,res)=>{
  const USERId=req.params.USERId;
  try {
    const user = await userModel.findById(USERId);
    res.json(user)
  } catch (error) {
    res.json(error);
  }
}
const deleteUser=async(req,res)=>{
  const USERId=req.params.USERId;
  try {
    await userModel.findOneAndDelete(USERId);
    res.json("Done")
  } catch (error) {
    res.json(error);
  }
}

const UpdateUser =async(req,res)=>{
  const USERId=req.params.USERId;
      try {
        const neUser= await userModel.updateOne({
          "_id":USERId
        },
        req.body

        )
        res.json(neUser);
      } catch (error) {
        res.json(error)
      }
}

const changePassword=async(req,res)=>{
   const {password,confirm_password} = req.body;
   if(password && confirm_password){
   if (password === confirm_password) {
     // hash password and change password...
    const salt =await bcrypt.genSalt(10);
    const newhashPassword= await bcrypt.hash(password,salt);
    // console.log(req.user);
    console.log(req.user);

    await userModel.findByIdAndUpdate(req.user._id,{$set:{
      password:newhashPassword
  }})
    res.json('password change successfully');
   } else {
    res.json({"message":"Not matchs your password"})
   }
   }
   else{
    res.json({"status":"failed", "message":"All Fields Are REquire"})
   }


}

const loggedUser=async(req,res)=>{
  try {
     res.json({"user":req.user})
  } catch (error) {
     res.json(error)
  }
}

const resetPasswordMail=async(req,res)=>{
 try {

  const {email} = req.body;
  // cheak mail resistered or not.................
if (email) {
  const user = await userModel.findOne({email:email});
  if(user){
    // send a link to email 
    const newsecret_key=user._id + process.env.SECRET_KEY;
    // xcode for send mail
    const token = jwt.sign({userId:user._id},newsecret_key,{expiresIn:"10m"});
    const link = `http://localhost:9770/user/${user._id}/${token}`;
    console.log(link);
    const info = await transporter.sendMail({
      from:process.env.EMAIL_FROM,
      to:user.email,
      subject:"Suraj arya ",
      html:`<a href=${link}> click here</a>`
    })
    res.json({"message":"Please Cheak YOur Mail","info":info})

  }
   else{
     res.json({"message":"Please Cheak Your Mail"});
   }
  
} else {
  res.json({"message":"Plese fill the All Fields"})
}
 } catch (error) {
  res.json(error)
 }
}

const resetAndUpdate=async(req,res)=>{
  
    const{password,confirm_password}= req.body
    const {id,token}=req.params
    // in the bases of we need user 
    const user = await userModel.findById(id);
    // create a new secret key
    const new_secretKey = user._id + process.env.SECRET_KEY ;
    // jwt.verify(token,new_secretKey);
    
  try {
    jwt.verify(token,new_secretKey);
    if(password && confirm_password){
   if (password === confirm_password) {
      const salt = await bcrypt.genSalt(10);
      const newhashPassword = await bcrypt.hash(password,salt);
      await userModel.findByIdAndUpdate(user._id,{$set:{
        password:newhashPassword
    }}) 
    res.json({"message":"Password reset successfully"}) 
   } else {
    res.json({"message":"Password and confirm password not same"})
   }
    }else{
      res.json({"message":"Please Give Both Field"})
    }
  } catch (error) {
    res.json(error);
  }
  
 
}
module.exports={Resistration,login,getAllUser,getOneUser,deleteUser,UpdateUser,changePassword,loggedUser,resetPasswordMail,resetAndUpdate};