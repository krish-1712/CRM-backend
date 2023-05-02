const express = require('express');
const ENV =require("dotenv");
const APP_SERVER = require('./app');
const NODE_SERVER= express();
   


const PORT = 4000;






//  Environment Variable into Server
ENV.config();

// Registering App Server 

NODE_SERVER.use("/", APP_SERVER);


// Start NODE_SERVER WITH PORT = 4000

NODE_SERVER.listen(PORT, 'localhost',()=>{
    console.log("APP STARTED");
})