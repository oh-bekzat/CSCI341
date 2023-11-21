import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

const JobForm = ({ onNewJob }) => {
  const [formData, setFormData] = useState({
    required_caregiving_type: '',
    other_requirements: '',
    date_posted: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('User not logged in');
        return;
      }

      const response = await axios.post(
        `${API_URL}/jobs`,
        {
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { job } = response.data;
      onNewJob(job);
      setFormData({
        required_caregiving_type: '',
        other_requirements: '',
        date_posted: '',
      });
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  return (
    <div>
      <h3>Create New Job</h3>
      <form onSubmit={handleSubmit}>
        <label>
            Caregiving type:
            <select name="required_caregiving_type" onChange={handleInputChange}>
              <option value="">Select caregiving type</option>
              <option value="caregiver for elderly">Caregiver for elderly</option>
              <option value="babysitter">Babysitter</option>
              <option value="playmate for children">Playmate for children</option>
            <option value="member">Member</option>
          </select>
        </label>
        <br />
        <label>
          Other Requirements:
          <textarea
            name="other_requirements"
            value={formData.other_requirements}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Date Posted:
          <input
            type="datetime-local"
            name="date_posted"
            value={formData.date_posted}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button type="submit">Create Job</button>
      </form>
    </div>
  );
};

export default JobForm
