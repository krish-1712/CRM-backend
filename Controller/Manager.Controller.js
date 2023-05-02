const ManagerRouter =require('express').Router();
const ManagerModels = require('../Modeling/Manager.Models');
const jwt=require("jsonwebtoken");


ManagerModels

//  method = GET

ManagerRouter.get("/getAllManager",function(req,res,next){
    ManagerModels.find()
    .then((response) => {
      if (response.length > 0) {
        const token = req.header("x-auth-token");
        console.log(token);
        jwt.verify(token, process.env.SECRET_KEY);
        next();
        res.status(200).json({
          success: true,
          message: "Manager fetched successfully!!!",
          data: response,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "No Manager found!!!",
          data: response,
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: "Bad request!!!",
        error: error,
      });
    });
});

//  Get by id 
ManagerRouter.get("/getAllManager/:id",function(req,res,next){
    const{id}=req.params;
    console.log(id)
    if (!id) {
        return res.status(401).json({
          success: false,
          message: "Seniorid id is missing",
          error: "Bad request",
        });

      }
      ManagerModels.find({ id: id })
      .then((response)=>{
        if (response && response.length > 0) {
            return res.status(200).json({
              success: true,
              message: "Manager Details fetched successfully!!!",
              data: response,
            });
          }else {
            return res.status(200).json({
              success: true,
              message: "No Manager Details Found!!!",
              data: response,
            });
          }
      })
      .catch((error) => {
        return res.status(200).json({
          success: false,
          message: "No Manager Details Found!!!",
          data: error,
        });
    });

    

});

//  method = POST

ManagerRouter.post("/createManager",  function (req, res, next) {
    const {
        id,
      Firstname,
      Lastname,
      Email,
      Address,
      Contactnumber,
    } = req.body;
    const ManagerNew = new ManagerModels({
        id:id,
      Firstname: Firstname,
      Lastname: Lastname,
      Email: Email,
      Address:Address,
      Contactnumber: Contactnumber,
    });
    ManagerNew.save()
      .then((response) => {
        if (response && response._id) {
          return res.status(200).json({
            success: true,
            message: "Manager creatd successfully!!!",
            data: response,
          });
        }
      })
      .catch((error) => {
        return res.status(401).json({
          success: false,
          message: "Error creating Manager",
          error: error,
        });
      });
  });


  ManagerRouter.put("/updateManager/:id",function(req,res,next){
    

 
      
    const{id}=req.params;
    console.log(id)
    const {Firstname,Lastname,Email,Address,Contactnumber}=req.body

    if (!id) {
        return res.status(201).json({
          success: false,
          message: "Managerid id is missing",
          error: "Bad request",
        });

      }
      SeniorEmpModels.findByIdAndUpdate(
        { id: id },
        {
        $set:{
            Firstname,
            Lastname,
            Email,
            Address,
            Contactnumber,
            updateOn: Date.now(),
        }
    }
        )
      .then((response)=>{
        if (response && response.length > 0) {
            return res.status(200).json({
              success: true,
              message: "Manager Details Updated successfully!!!",
              data: response,
            });
          }else {
            return res.status(200).json({
              success: true,
              message: "No Manager Details Found!!!",
              data: response,
            });
          }
      })
      .catch((error) => {
        return res.status(400).json({
          success: false,
          message: "No Manager Details Found!!!",
          data: error,
        });
    });

    

 });
  
  module.exports = ManagerRouter;