const express = require('express')
const route = express.Router();
const authUser = require('../middlewares/authUser');
const { validateSignUp } = require('../middlewares/joiMiddleware');
const {Resistration ,login,getAllUser,getOneUser,deleteUser,UpdateUser,changePassword,loggedUser,resetPasswordMail,resetAndUpdate}=require('../controllers/userController');
// const upload= require('../middlewares/multer');
const uploadPicture= require('../middlewares/signupMulter');

route.post('/resistration',uploadPicture,validateSignUp,Resistration);
route.post('/login',login);
route.post('/changepwd',authUser,changePassword);
route.post('loggedUser',loggedUser);
route.post('/resetForEmail',resetPasswordMail);
route.post('/reset/:id/:token',resetAndUpdate);
// route.post('/upload',upload,uploadFile);
route.get('/',getAllUser);
route.get('/:USERId',getOneUser);
route.delete('/:USERId',deleteUser);
route.put('/:USERId',UpdateUser);

module.exports = route;