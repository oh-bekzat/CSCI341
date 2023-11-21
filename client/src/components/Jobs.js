import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('User not logged in');
          return;
        }

        const response = await axios.get(`${API_URL}/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { jobs } = response.data;
        setJobs(jobs);

        const decodedToken = decodeToken(token);
        if (decodedToken && decodedToken.role) {
          setUserRole(decodedToken.role);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  const decodeToken = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const handleEditClick = (job) => {
    setSelectedJob(job);
  };

  const handleDeleteClick = async (jobId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('User not logged in');
        return;
      }

      await axios.delete(`${API_URL}/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedJobs = jobs.filter((job) => job.job_id !== jobId);
      setJobs(updatedJobs);
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  }

  const fetchApplications = async (jobId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('User not logged in');
        return;
      }

      const response = await axios.get(`${API_URL}/jobs/${jobId}/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const applications = response.data.applications;
      console.log('Applications for job', jobId, ':', applications);
    } catch (error) {
      console.error('Error fetching job applications:', error);
    }
  }

  const handleApplyClick = async (job) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('User not logged in');
        return;
      }

      const response = await axios.post(
        `${API_URL}/jobs/${job.job_id}/apply`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const appliedJob = response.data.application.job_id;
      const updatedJobs = jobs.map((j) =>
        j.job_id === appliedJob ? { ...j, applied: true } : j
      );

      setJobs(updatedJobs);
    } catch (error) {
      console.error('Error applying to job:', error);
    }
  }

  const handleCancelEdit = () => {
    setSelectedJob(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedJob({
      ...selectedJob,
      [name]: value,
    });
  };

  const handleUpdateJob = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('User not logged in');
        return;
      }

      const response = await axios.put(
        `${API_URL}/jobs/${selectedJob.job_id}`,
        selectedJob,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the jobs list after successful update
      const updatedJobs = jobs.map((job) =>
        job.job_id === selectedJob.job_id ? response.data.updatedJob : job
      );

      setJobs(updatedJobs);
      setSelectedJob(null);
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  return (
    <div>
      <h2>Jobs List</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.job_id}>
            <div>
              <span>{job.required_caregiving_type}</span>
              {userRole === 'member' && (<>
                <button onClick={() => handleEditClick(job)}>Edit</button>
                <button onClick={() => handleDeleteClick(job.job_id)}>Delete</button>
                <button onClick={() => fetchApplications(job.job_id)}>applications</button></>
              )}
              {userRole !== 'member' && (
                <button onClick={() => handleApplyClick(job)}>Apply</button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {selectedJob && (
        <div>
          <h3>Edit Job</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateJob();
            }}
          >
            <label>
              Required Caregiving Type:
              <select
                name="required_caregiving_type"
                onChange={handleInputChange}
                value={selectedJob.required_caregiving_type}
              >
                <option value="caregiver for elderly">Caregiver for elderly</option>
                <option value="babysitter">Babysitter</option>
                <option value="playmate for children">Playmate for children</option>
              </select>
            </label>
            <label>
              Other Requirements:
              <textarea
                name="other_requirements"
                value={selectedJob.other_requirements}
                onChange={handleInputChange}
              />
            </label>
            <button type="submit">Update</button>
            <button type="button" onClick={handleCancelEdit}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Jobs;
