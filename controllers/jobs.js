const Job = require("../models/Job")
const{StatusCodes}=require("http-status-codes")
const {BadRequestError,NotFoundError}=require("../errors/index")

const getAllJobs = async(req,res)=>{
  const jobs = await Job.find({createdBy:req.user.userId}).sort('createdAt')
  res.status(StatusCodes.OK).json({jobs,count:jobs.length})
}

const getJob = async(req,res)=>{
  const {user:{userId},params:{id:jobId}}=req  //destructuring and aliasing
  const job = await Job.findOne({_id:jobId,createdBy:userId})
  if(!job){
    throw new NotFoundError(`No job found with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({job})
}

const createJob = async(req,res)=>{
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({job})
}

const updateJob = async(req,res)=>{
  // console.log(req)
  const {body:{company,position},
  user:{userId},
  params:{id:jobId}}=req  //destructuring and aliasing
  if(company===''||position==''){
    throw new BadRequestError("Company or Position fields cannot be empty")
  }
  const job = await Job.findOneAndUpdate({_id:jobId,createdBy:userId},
    req.body,{new:true,runValidators:true}) //runs the validators b4 updating then returns the new updated document
    //
    if(!job){
      throw new NotFoundError(`No job found with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
  

  // const job = await Job.findOne({_id:jobId,createdBy:userId})
  // job.company = company
  // job.position = position
  // await job.save()
}

const deleteJob = async(req,res)=>{
  const {user:{userId},params:{id:jobId}}=req  //destructuring and aliasing
  const job = await Job.findOneAndDelete({_id:jobId,createdBy:userId})
  if(!job){
    throw new NotFoundError(`No job found with id ${jobId}`)
  }
  res.status(StatusCodes.OK).send()
}

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
}