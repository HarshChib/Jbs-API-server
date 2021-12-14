const express = require('express');
const router=express.Router();

const {getAllJobs,
getJobs,
createJobs,
updateJobs,
deleteJobs}=require('../controllers/jobs');

router.route('/').get(getAllJobs).post(createJobs);
router.route('/:id').patch(updateJobs).get(getJobs).delete(deleteJobs);

module.exports=router