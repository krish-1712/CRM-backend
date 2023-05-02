const LoginupRouter = require('express').Router();


const jwt=require("jsonwebtoken");

LoginupRouter.post("/CreateLoginup", function (req, res, next) {
  const {
    email,
    password
  } = req.body;

  const LoginupNew = new LoginupNew({
    email: req.body.email,
    password: req.body.password,
  });
  LoginupNew.save()
    .then((res) => {
      const response = getUserByemail(email);
      if (!response) {
        res.status(400).json({
          success: false,
          message: "Invalid Credentials",
          error: error,
        });
      } else {
        const storedDbPassword = response.password;
        res.status(200).json({
          success: true,
          message: "Password Created Successfully!!",
        })
        const isPasswordCheck = bcrypt.compare(password, storedDbPassword);
        if (isPasswordCheck) {
          const token = jwt.sign({ id: response._id }, process.env.SECRET_KEY);
          res.status(200).json({
            success: true,
            message: " Successfull Login up",
            token: token,
          })

        } else {
          res.status(400).json({
            success: false,
            message: "Invalid Credentials",
            error: error,

          });
        }

      }
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: "Bad request!!!",
        error: error,
      });
    });
})

module.exports =LoginupRouter;

