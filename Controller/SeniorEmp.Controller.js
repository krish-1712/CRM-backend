const SeniorEmpRouter =require('express').Router();
const SeniorEmpModels = require('../Modeling/SeniorEmp.Models');
const jwt=require("jsonwebtoken");


SeniorEmpModels

//  method = GET

SeniorEmpRouter.get("/getAllSeniorEmp",function(req,res,next){
    SeniorEmpModels.find()
    .then((response) => {
      if (response.length > 0) {
        const token = req.header("x-auth-token");
        console.log(token);
        jwt.verify(token, process.env.SECRET_KEY);
        next();
        res.status(200).json({
          success: true,
          message: "Emp fetched successfully!!!",
          data: response,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "No emp found!!!",
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
SeniorEmpRouter.get("/getAllSeniorEmp/:id",function(req,res,next){
    const{id}=req.params;
    console.log(id)
    if (!id) {
        return res.status(401).json({
          success: false,
          message: "Seniorid id is missing",
          error: "Bad request",
        });

      }
      SeniorEmpModels.find({ id: id })
      .then((response)=>{
        if (response && response.length > 0) {
            return res.status(200).json({
              success: true,
              message: "SeniorEmp Details fetched successfully!!!",
              data: response,
            });
          }else {
            return res.status(200).json({
              success: true,
              message: "No SeniorEmp Details Found!!!",
              data: response,
            });
          }
      })
      .catch((error) => {
        return res.status(200).json({
          success: false,
          message: "No SeniorEmp Details Found!!!",
          data: error,
        });
    });

    

});


//  method = POST

SeniorEmpRouter.post("/createSeniorEmp",  function (req, res, next) {
    const {
        id,
      Firstname,
      Lastname,
      Email,
      Address,
      Contactnumber,
    } = req.body;
    const SeniorEmpNew = new SeniorEmpModels({
        id:id,
      Firstname: Firstname,
      Lastname: Lastname,
      Email: Email,
      Address:Address,
      Contactnumber: Contactnumber,
    });
    SeniorEmpNew.save()
      .then((response) => {
        if (response && response._id) {
          return res.status(200).json({
            success: true,
            message: "emp creatd successfully!!!",
            data: response,
          });
        }
      })
      .catch((error) => {
        return res.status(401).json({
          success: false,
          message: "Error creating emp",
          error: error,
        });
      });
  });

// method= Put

SeniorEmpRouter.put("/updateSeniorEmp/:id",function(req,res,next){
  
      
    const{id}=req.params.id;
    console.log(id)
    const {Firstname,Lastname,Email,Address,Contactnumber}=req.body

    if (!id) {
        return res.status(201).json({
          success: false,
          message: "Seniorid id is missing",
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
              message: "SeniorEmp Details Updated successfully!!!",
              data: response,
            });
          }else {
            return res.status(200).json({
              success: true,
              message: "No SeniorEmp Details Found!!!",
              data: response,
            });
          }
      })
      .catch((error) => {
        return res.status(400).json({
          success: false,
          message: "No SeniorEmp Details Found!!!",
          data: error,
        });
    });

    

 });



  
  module.exports = SeniorEmpRouter;