const User=require('../models/User')
const {BadRequestError,UnauthenticatedError}=require('../errors')
const {StatusCodes}=require('http-status-codes')

const register=async(req,res)=>{
    const user=await User.create({...req.body})
    const  token=user.createJWT();
    res.status(StatusCodes.CREATED).json({username:user.name,token})
}

const login=async(req,res)=>{
    const {email,password}=req.body;
    if(!email||!password){
        throw new BadRequestError('Please Provide Email and Password')
    }

    const user=await User.findOne({email})
    if(!user){
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const pass=await user.comparePass(password)
    if(!pass){
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const token=user.createJWT();
    res.json({user:{name:user.name},token})
} 

module.exports={register,login}