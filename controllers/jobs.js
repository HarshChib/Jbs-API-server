const model=require('../models/Job')
const {StatusCodes}=require('http-status-codes')
const NotFoundError=require('../errors/not-found')
const BadRequestError=require('../errors/bad-request')
const getAllJobs=async(req,res)=>{
   
    const jobs=await model.find({createdBy:req.user.id}).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs,count:jobs.length})
}
const getJobs=async(req,res)=>{
    const jobId=req.params.id;
    const name=req.user.username
    const userId=req.user.id;
    try{
        const job=await model.findOne({
        _id:jobId,createdBy:userId
    })
    res.status(StatusCodes.ACCEPTED).json(job)
    }
    catch(error){
        res.json({message:'No jobs'})
    }
   
}
const createJobs=async(req,res)=>{
    req.body.createdBy=req.user.id
    const job=await model.create(req.body)
    res.status(StatusCodes.ACCEPTED).json({job})
}
const updateJobs=async(req,res)=>{
    const {
        body: { company, position },
        user: { userId },
        params: { id: jobId },
      } = req
    
      if (company === '' || position === '') {
        throw new BadRequestError('Company or Position fields cannot be empty')
      }
      const job = await model.findByIdAndUpdate(
        { _id: jobId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
      )
      if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
      }
      res.status(StatusCodes.OK).json({ job })
    
}
const deleteJobs=async(req,res)=>{
    const {
        user: { userId },
        params: { id: jobId },
      } = req
    
      const job = await model.findByIdAndRemove({
        _id: jobId,
        createdBy: userId,
      })
      if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
      }
      res.status(StatusCodes.OK).send()
}
module.exports={getAllJobs,
getJobs,
createJobs,
updateJobs,
deleteJobs}