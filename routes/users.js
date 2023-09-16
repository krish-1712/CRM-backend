var express = require('express');
var router = express.Router();
const { userModel } = require('../schemas/userSchemas')
const { contactModel } = require('../schemas/contactSchemas')
const mongoose = require('mongoose')
const { dbUrl } = require('../common/dbConfig')
const { hashPassword, hashCompare, createToken, verifyToken } = require('../common/auth')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const { ServiceModel } = require('../schemas/serviceSchemas');
const { urlModel } = require('../schemas/urlSchemas');
require('dotenv').config()
const shortid = require('shortid');
const validUrl = require('valid-url');


mongoose.connect(dbUrl)
  .then(() => console.log('Connected!'));


router.get('/', async function (req, res) {
  try {
    let users = await userModel.find();
    console.log(users);
    return res.status(200).send({
      users,
      message: 'Users Data Fetch Successfully!'
    })

  } catch (error) {
    res.status(500).send({
      message: 'Internal Server Error',
      error
    })
    console.log(error);
  }

});

router.get('/:id', async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req.params.id });
    res.status(200).send({
      user,
      message: 'Users Data Fetch Successfully!'
    })

  } catch (error) {
    res.status(500).send({
      message: 'Internal Server Error',
      error
    })
  }

});


router.post('/signup', async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email })
    console.log(user)

    if (!user) {
      let hashedPassword = await hashPassword(req.body.password)
      req.body.password = hashedPassword
      let user = await userModel.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        mobile: req.body.mobile,
        role: req.body.role,

      })
      console.log(user)
      res.status(200).send({
        message: "Users Created Successfully!",
        user,
      })
    }
    else {
      res.status(400).send({
        message: 'Users Already Exists!'
      })
    }

  } catch (error) {
    res.status(500).send({
      message: 'Internal Server Error',
      error
    })
  }
})


router.post('/login', async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email });
    if (user) {

      if (await hashCompare(req.body.password, user.password)) {

        if (user.role === 'Employee' || user.role === 'Admin' || user.role === 'Manager') {
        
          let token = await createToken({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            userId: user._id,
            role: user.role,
          });

          res.status(200).send({
            message: 'User Login Successfully!',
            token,
            userId: user._id,
            role: user.role,
          });

          return;
        } else {
          res.status(403).send({
            message: 'Access Denied! Only employees, admins, and managers are allowed to login.',
          });
        }
      } else {
        res.status(402).send({
          message: 'Invalid Credentials',
        });
      }
    } else {
      res.status(400).send({
        message: 'User Does Not Exist!',
      });
    }
  } catch (error) {
    res.status(500).send({
      message: 'Internal Server Error',
      error,
    });
  }
});


router.put('/:id', async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req.params.id })
    if (user) {
      user.name = req.body.name
      user.email = req.body.email
      user.password = req.body.password

      await user.save()

      res.status(200).send({
        message: "Users Updated Successfully!"
      })
    }
    else {
      res.status(400).send({
        message: 'Users Does Not Exists!'
      })
    }

  } catch (error) {
    res.status(500).send({
      message: 'Internal Server Error',
      error
    })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req.params.id })
    if (user) {
      let user = await userModel.deleteOne({ _id: req.params.id })
      res.status(200).send({
        message: "User Deleted Successfull!",
        user
      })
    }
    else {
      res.status(400).send({
        message: 'Users Does Not Exists!'
      })
    }

  } catch (error) {
    res.status(500).send({
      message: 'Internal Server Error',
      error
    })
  }
})


router.post('/contact/create', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decodedToken = jwt.decode(token); 
    const role = decodedToken.role; 

    if (role !== 'Admin' && role !== 'Manager') {
      return res.status(403).send({
        message: 'Unauthorized Access. Only Admin and Managers are allowed to create contacts.',
      });
    }

    const userId = req.body.userId; 
    console.log('User ID:', userId);

    let contact = await contactModel.findOne({ name: req.body.name });
    console.log("Contact:", contact);

    if (!contact) {
      let newContact = await contactModel.create({
        userId: userId, 
        name: req.body.name,
        email: req.body.email,
        phonenumber: req.body.phonenumber
      });
      console.log("Created Contact:", newContact);

      res.status(200).send({
        message: "Contact Created Successfully!",
        contact: newContact,
      });
    } else {
      res.status(400).send({
        message: 'Contact Already Exists!'
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: 'Internal Server Error',
      error
    });
  }
});


router.get('/:id/contact', async function (req, res) {
  try {
    let users = await contactModel.find();
    console.log(users);
    return res.status(200).send({
      users,
      message: 'Contact Data Fetch Successfully!'
    })

  } catch (error) {
    res.status(500).send({
      message: 'Internal Server Error',
      error
    })
    console.log(error);
  }

});

router.put('/contact/:id', async (req, res) => {
  try {
    let user = await contactModel.findOne({ _id: req.params.id })
    if (user) {
      user.name = req.body.name,
        user.email = req.body.email,
        user.phonenumber = req.body.phonenumber
      await user.save()

      res.status(200).send({
        message: "Contact Updated Successfully!"
      })
    }
    else {
      res.status(400).send({
        message: 'Contact Does Not Exists!'
      })
    }

  } catch (error) {
    res.status(500).send({
      message: 'Internal Server Error',
      error
    })
  }
})

router.delete('/contact/:id', async (req, res) => {
  try {
    let user = await contactModel.findOne({ _id: req.params.id })
    if (user) {
      let user = await contactModel.deleteOne({ _id: req.params.id })
      res.status(200).send({
        message: "Contact Deleted Successfull!",
        user
      })
    }
    else {
      res.status(400).send({
        message: 'Contact Does Not Exists!'
      })
    }

  } catch (error) {
    res.status(500).send({
      message: 'Internal Server Error',
      error
    })
  }
})



router.post('/service/create', async (req, res) => {
  console.log(req.body);

  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decodedToken = jwt.decode(token); 
    const userId = decodedToken.userId; 
    const role = decodedToken.role; 
    console.log('User ID:', userId);
    console.log('Role:', role);

    if (role !== 'Admin' && role !== 'Manager') {
      return res.status(403).send({
        message: 'Unauthorized Access'
      });
    }


    let serviceUser = await ServiceModel.findOne({ name: req.body.name });
    console.log("Service User:", serviceUser);

    if (!serviceUser) {
      let service = await ServiceModel.create({
        userId: req.body.userId,
        name: req.body.name,
        description: req.body.description,
        status: req.body.status
      });
      console.log("Created Service:", service);

      res.status(200).send({
        message: "Service Request Created Successfully!",
        service,
      });
    } else {
      res.status(400).send({
        message: 'Service Request Already Exists!'
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: 'Internal Server Error',
      error
    });
  }
});


router.get('/:id/service', async function (req, res) {
  try {
    const users = await ServiceModel.find();
    console.log(users);
    return res.status(200).send({
      users,
      message: 'Service Request Data Fetch Successful!'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: 'Internal Server Error',
      error
    });
  }
});


router.put('/service/:id', async (req, res) => {
  try {
    let user = await ServiceModel.findOne({ _id: req.params.id })
    if (user) {
      user.description = req.body.description,
        user.status = req.body.status
      await user.save()

      res.status(200).send({
        message: "Service Request Updated Successfully!"
      })
    }
    else {
      res.status(400).send({
        message: 'Service Request Does Not Exists!'
      })
    }

  } catch (error) {
    res.status(500).send({
      message: 'Internal Server Error',
      error
    })
  }
})

router.delete('/contact/:id', async (req, res) => {
  try {
    let user = await ServiceModel.findOne({ _id: req.params.id })
    if (user) {
      let user = await ServiceModel.deleteOne({ _id: req.params.id })
      res.status(200).send({
        message: "Service Request Deleted Successfull!",
        user
      })
    }
    else {
      res.status(400).send({
        message: 'Service Request Does Not Exists!'
      })
    }

  } catch (error) {
    res.status(500).send({
      message: 'Internal Server Error',
      error
    })
  }
})



router.post("/reset", async (req, res) => {
  console.log(req.body.values.email);

  try {
    let user = await userModel.findOne({ email: req.body.values.email })
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }


    const token = jwt.sign({ userId: user.email }, process.env.secretkey, { expiresIn: '1h' });
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.example.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD

      },
    });



    const queryParams = new URLSearchParams();
    queryParams.set('token', token);
    const queryString = queryParams.toString();

    function generateUniqueIdentifier() {
      return shortid.generate();
    }


    const uniqueId = generateUniqueIdentifier();
    console.log(uniqueId);


    const newShortURL = new urlModel({
      originalURL: `/password?${queryString}`,
      shortenedURL: uniqueId,
    });
    const savedURL = await newShortURL.save();
    console.log('Short URL saved:', savedURL);

    const resetPasswordURL = `${process.env.CLIENT_URL}/url?id=${savedURL.shortenedURL}`;
    let details = {
      from: "greenpalace1712@gmail.com",
      to: user.email,
      subject: "Hello ✔",
      html: `
        <p>Hello,</p>
        <p>Please click on the following link to reset your password:</p>
        <a href="${resetPasswordURL}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };
    await transporter.sendMail(details)
    res.status(200).send({ message: 'Password reset email sent' })
    console.log(details)


  }

  catch (error) {
    console.error('Error saving short URL or sending email:', error);
    res.status(500).send({
      message: 'Error saving short URL or sending email',
      error,
    });
  }


});


router.post('/password', async (req, res) => {


  try {
    const users = await userModel.findOne({ email: req.body.email });
    console.log(users)
    console.log("reset : " + req.body.password);
    const token = req.body.token;
    console.log(token)
    let hashedPassword = await hashPassword(req.body.password)
    console.log(hashedPassword);

    let decodedToken = jwt.verify(token, process.env.secretkey)

    console.log("decoded : " + decodedToken)
    const userId = decodedToken.userId;
    console.log(userId)
    const filter = { email: userId };
    const update = { password: hashedPassword };

    const doc = await userModel.findOneAndUpdate(filter, update);
    console.log("test");
    console.log(doc);


    res.status(200).send({
      message: "Password Reset successfully",
    })

  } catch (error) {
    res.status(400).send({
      message: "Some Error Occured",
    })
  }
})



router.post("/url", async (req, res) => {
  console.log("id : " + req.body.id);
  if (req.body.id) {
    let url = await urlModel.findOne({ shortenedURL: req.body.id })
    if (url) {
      return res.status(200).send({ originalURL: url.originalURL })
    } else {
      return res.status(404).send({ message: 'URL not found' });
    }
  }
  return res.status(404).send({ message: 'URL not found' });
});


router.post('/shorten', async (req, res) => {
  const { originalURL } = req.body;


  if (!validUrl.isUri(originalURL)) {
    return res.status(400).json({ message: 'Invalid original URL' });
  }

  try {

    const existingURL = await urlModel.findOne({ originalURL });
    if (existingURL) {
      return res.json({ shortenedURL: existingURL.shortenedURL });
    }

   
    const shortenedURL = shortid.generate();


    const newURL = new urlModel({
      originalURL,
      shortenedURL,
    });
    await newURL.save();


    res.json({ shortenedURL });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.get('/:id/count', async (req, res) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];


    const decodedToken = jwt.verify(token, process.env.secretkey);
    if (!decodedToken) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const id = req.params.id;


    const serviceRequestCount = await ServiceModel.countDocuments({ userId: id });


    const contactCount = await contactModel.countDocuments({ userId: id });

    res.status(200).send({
      serviceRequestCount,
      contactCount,
    });
  } catch (error) {
    console.error('Error fetching counts:', error);
    res.status(500).send({
      message: 'Internal Server Error',
      error,
    });
  }
});



router.post("/contactpage", async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.values.email });
    console.log(user);

    if (!user) {
      console.log('User not found');
      return res.status(404).send({ message: 'User not found' });
    }

    const token = jwt.sign({ userId: user.email }, process.env.secretkey, { expiresIn: '1h' });

    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.example.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
    });

    const queryParams = new URLSearchParams();
    queryParams.set('token', token);
    const queryString = queryParams.toString();

    let details = {
      from: "greenpalace1712@gmail.com",
      to: user.email,
      subject: "Help Request",
      html: `
        <p>Hello,</p>
        <p>You have received a Contact Mail from ${req.body.values.name} (${req.body.values.email}).</p>
        <p>Message: ${req.body.values.message}</p>
        
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    await transporter.sendMail(details);
    console.log('Help email sent');
    res.status(200).send({ message: 'Help email sent' });
  } catch (error) {
    console.error('Error sending help email:', error);
    res.status(500).send({
      message: "Internal Server Error",
      error,
    });
  }
});


module.exports = router;
