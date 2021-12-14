
require('dotenv').config()
const UnauthenticatedError=require('../errors/unauthenticated')
const jwt=require('jsonwebtoken')
const authenticate=async(req,res,next)=>{
    const authHeader=await req.headers.authorization
   
    if(!authHeader ||!authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError('Invalid token')
    }
   
    const token=authHeader.split(' ')[1]
    try {
        const verification=await jwt.verify(token,process.env.JWT_SECRET)
       req.user=verification
        next()
    } catch (error) {
        throw new UnauthenticatedError('Invalid token')
    }
}
module.exports=authenticate