const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config();
require('./config/dbConnection');
const userRoute= require('./routes/userRoute');
const body_parser= require('body-parser');
const cors = require('cors');
app.use(cors());
app.use(body_parser.json());
app.use(express.json())
app.use('/user',userRoute);
app.listen(process.env.PORT,()=>{
    console.log(`server is run here`); 
})