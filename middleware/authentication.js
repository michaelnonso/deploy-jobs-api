const UnauthenticatedError=require("../errors/unauthenticated")
const jwt = require("jsonwebtoken")
const User = require("../models/User")


const auth = async(req,res,next)=>{
  const authHeader = req.headers.authorization
  if(!authHeader || !authHeader.startsWith('Bearer ')){
    throw new UnauthenticatedError('Authentication invalid')
  }
  const token = authHeader.split(' ')[1]
  try {
    const payload =  jwt.decode(token,process.env.JWT_SECRET)
    //attach the user to the request body
    req.user = {userId:payload.userId,name:payload.name}
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')

  }
}

module.exports = auth