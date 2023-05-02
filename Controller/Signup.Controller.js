

const SignupRouter = require('express').Router();

const bcrypt = require("bcrypt");
const { response } = require('express');


const generateHashedPassword = async (password) => {
    const noOfRounds = 10;
    const salt = await bcrypt.genSalt(noOfRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

SignupRouter.post("/CreateSignup", function (req, res, next) {
    const {
        email,
        password,
    } = req.body;

    const SignupNew = new SignupNew({
        email: req.body.email,
        password: req.body.password,
    });


    SignupNew.save()

        .then((res) => {
            const response = getUserbyemail(email);
            if (response) {
                res.status(400).json({
                    success: false,
                    message: "User name already exist",
                    error: error,
                });
            } else if (password.length < 8) {
                res.status(400).json({
                    success: false,
                    message: "Password must be atleast 8 characters",
                    error: error,
                });
            } else {
                const pass = generateHashedPassword(password);
                const result = signUp({
                    email: email,
                    password: pass,
                });
                res.status(200).json(result);
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


module.exports = SignupRouter;

