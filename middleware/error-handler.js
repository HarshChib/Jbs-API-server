const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let code=err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  let message=err.message || 'INvalid REQUEST'
  if(err&&err.code===11000){
    message=`${err.keyValue.email} already in use`
    code=401
  }
  
  return res.status(code).json({ message })
}

module.exports = errorHandlerMiddleware
