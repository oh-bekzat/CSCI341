const express = require('express')
const jobsRouter = express.Router()
const authenticateToken = require('../middleware/authenticate')
const Job = require('../models/Job')
const Member = require('../models/Member')
const JobApplication = require('../models/JobApplication')

jobsRouter.get('/', authenticateToken, async (req, res) => {
    try {
      const member = await Member.findOne({
        where: { member_user_id: req.user.userId },
      })
  
      let jobsData;

      if (member) {
        jobsData = await Job.findAll({
          where: { member_user_id: req.user.userId},
        });
      } else {
        jobsData = await Job.findAll();
      }

      res.json({ jobs: jobsData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
})

jobsRouter.post('/', authenticateToken, async (req, res) => {
    try {
    console.log('Received Request Body:', req.body)
      const {
        required_caregiving_type,
        other_requirements,
        date_posted,
      } = req.body;
  
      if (!other_requirements || !required_caregiving_type || !date_posted) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const newJob = await Job.create({
        member_user_id: req.user.userId,
        required_caregiving_type,
        other_requirements,
        date_posted,
      });
  
      res.status(201).json({ message: 'Job created successfully', job: newJob });
    } catch (error) {
      console.error('Error creating job:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

jobsRouter.put('/:jobId', authenticateToken, async (req, res) => {
    try {
      const { jobId } = req.params;
      const {
        required_caregiving_type,
        other_requirements,
      } = req.body;
  
      if (!jobId) {
        return res.status(400).json({ error: 'Job ID is required' });
      }
  
      const jobToUpdate = await Job.findByPk(jobId);
  
      if (!jobToUpdate) {
        return res.status(404).json({ error: 'Job not found' });
      }
  
      if (required_caregiving_type) {
        jobToUpdate.required_caregiving_type = required_caregiving_type;
      }
  
      if (other_requirements) {
        jobToUpdate.other_requirements = other_requirements;
      }
  
      await jobToUpdate.save();
  
      res.json({ message: 'Job updated successfully', updatedJob: jobToUpdate });
    } catch (error) {
      console.error('Error updating job:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
})

jobsRouter.post('/:jobId/apply', authenticateToken, async (req, res) => {
    try {
      const { jobId } = req.params;
  
      if (!jobId) {
        return res.status(400).json({ error: 'Job ID is required' });
      }
  
      const job = await Job.findByPk(jobId);
  
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
  
      const existingApplication = await JobApplication.findOne({
        where: {
          caregiver_user_id: req.user.userId,
          job_id: jobId,
        },
      });
  
      if (existingApplication) {
        return res.status(400).json({ error: 'You have already applied to this job' });
      }
  
      const newApplication = await JobApplication.create({
        caregiver_user_id: req.user.userId,
        job_id: jobId,
        date_applied: new Date(),
      });
  
      res.status(201).json({ message: 'Job application created successfully', application: newApplication });
    } catch (error) {
      console.error('Error creating job application:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
})

jobsRouter.delete('/:jobId', authenticateToken, async (req, res) => {
    try {
      const { jobId } = req.params;
  
      if (!jobId) {
        return res.status(400).json({ error: 'Job ID is required' });
      }
  
      const jobToDelete = await Job.findByPk(jobId);
  
      if (!jobToDelete) {
        return res.status(404).json({ error: 'Job not found' });
      }
  
      if (jobToDelete.member_user_id !== req.user.userId) {
        return res.status(403).json({ error: 'You do not have permission to delete this job' });
      }
  
      await jobToDelete.destroy();
  
      res.json({ message: 'Job deleted successfully' });
    } catch (error) {
      console.error('Error deleting job:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
})

jobsRouter.get('/:jobId/applications', authenticateToken, async (req, res) => {
    try {
      const { jobId } = req.params;
  
      if (!jobId) {
        return res.status(400).json({ error: 'Job ID is required' });
      }
  
      const job = await Job.findByPk(jobId);
  
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
  
      const applications = await JobApplication.findAll({
        where: {
          job_id: jobId,
        },
      });
  
      res.json({ applications });
    } catch (error) {
      console.error('Error fetching job applications:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })
  
module.exports = jobsRouter