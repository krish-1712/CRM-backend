const AdminRouter =require('express').Router();
const jwt=require("jsonwebtoken");


AdminRouter.get("/", function (req, res,next) {
    const token = req.header("x-auth-token");
    console.log(token);
    jwt.verify(token, process.env.SECRET_KEY);
    next();
    
    res.status(200).json("Hello all welcome to the administrator page");
  });

  module.exports=AdminRouter;