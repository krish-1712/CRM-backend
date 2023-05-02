const express = require('express');
const parser = require("body-parser");
const JuniorEmpRouter = require('./Controller/JuniorEmp.Controller');
const bodyParser = require('body-parser');
const SeniorEmpRouter = require('./Controller/SeniorEmp.Controller');
const ManagerRouter = require('./Controller/Manager.Controller');
const LoginupRouter = require('./Controller/Loginup.Controller');
const SignupRouter = require('./Controller/Signup.Controller');
const AdminRouter = require('./Controller/Admin.Controller');
const APP_SERVER= express();

//  Database session

require("./dbConfig");

//  Registering Middlewares
APP_SERVER.use(bodyParser.urlencoded({extended:true }));
APP_SERVER.use(bodyParser.json());




// Registering the Controller

APP_SERVER.use("/api/JuniorEmp",JuniorEmpRouter)
APP_SERVER.use("/api/SeniorEmp",SeniorEmpRouter)
APP_SERVER.use("/api/Manager",ManagerRouter)
APP_SERVER.use("/api/Loginup",LoginupRouter)
APP_SERVER.use("/api/Signup",SignupRouter)
APP_SERVER.use("/api/Admin",AdminRouter)

module.exports=APP_SERVER;

