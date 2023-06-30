const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const saltRound = 10;



const hashPassword = async (password) => {
  let salt = await bcrypt.genSalt(saltRound)

  let hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword

}

const hashCompare = async (password, hashedPassword) => {

  const result = await bcrypt.compare(password, hashedPassword)
  console.log("comparing password", result)
  return result
}

const createToken = async (payload) => {
  try {
    let token = jwt.sign(payload, process.env.secretkey, { expiresIn: '1h' })
    return token
  } catch (err) {
    console.log(err)
  }
}

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'].split(" ")[1];
  console.log(token)

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.secretkey);
    console.log(decoded)
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};




module.exports = { hashPassword, hashCompare, createToken, verifyToken }