const JuniorEmpRouter =require('express').Router();
const JuniorEmpModels = require('../Modeling/JuniorEmp.Models');
const jwt=require("jsonwebtoken");



JuniorEmpModels

//  method = GET

JuniorEmpRouter.get("/getAllJuniorEmp",function(req,res,next){
    JuniorEmpModels.find()
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
JuniorEmpRouter.get("/getAllJuniorEmp/:id",function(req,res,next){
    const{id}=req.params;
    console.log(id)
    if (!id) {
        return res.status(401).json({
          success: false,
          message: "Juniorid id is missing",
          error: "Bad request",
        });

      }
      JuniorEmpModels.find({ id: id })
      .then((response)=>{
        if (response && response.length > 0) {
            return res.status(200).json({
              success: true,
              message: "JuniorEmp Details fetched successfully!!!",
              data: response,
            });
          }else {
            return res.status(200).json({
              success: true,
              message: "No JuniorEmp Details Found!!!",
              data: response,
            });
          }
      })
      .catch((error) => {
        return res.status(200).json({
          success: false,
          message: "No JuniorEmp Details Found!!!",
          data: error,
        });
    });

    

});


//  method = POST

JuniorEmpRouter.post("/createJuniorEmp",  function (req, res, next) {
    const {
        id,
      Firstname,
      Lastname,
      Email,
      Address,
      Contactnumber,
    } = req.body;
    const JuniorEmpNew = new JuniorEmpModels({
        id:id,
      Firstname: Firstname,
      Lastname: Lastname,
      Email: Email,
      Address:Address,
      Contactnumber: Contactnumber,
    });
    JuniorEmpNew.save()
      .then((response) => {
        if (response && response._id) {
            console.log("fat",response)
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

//   JuniorEmpRouter.put("/updateJuniorEmp/:id",function(req,res,next){
    

 
      
//     const{id}=req.params;
//     console.log(id)
//     const {Firstname,Lastname,Email,Address,Contactnumber}=req.body

//     if (!id) {
//         return res.status(201).json({
//           success: false,
//           message: "juniorid id is missing",
//           error: "Bad request",
//         });

//       }
//       JuniorEmpModels.findByIdAndUpdate(
//         { id: id },
//         {
//         $set:{
//             Firstname,
//             Lastname,
//             Email,
//             Address,
//             Contactnumber,
//             updateOn: Date.now(),
//         }
//     }
//         )
//       .then((response)=>{
//         if (response && response.length > 0) {
//             return res.status(200).json({
//               success: true,
//               message: "JuniorEmp Details Updated successfully!!!",
//               data: response,
//             });
//           }else {
//             return res.status(200).json({
//               success: true,
//               message: "No JuniorEmp Details Found!!!",
//               data: response,
//             });
//           }
//       })
//       .catch((error) => {
//         return res.status(400).json({
//           success: false,
//           message: "No JuniorEmp Details Found!!!",
//           data: error,
//         });
//     });

    

//  });
  
  module.exports = JuniorEmpRouter;