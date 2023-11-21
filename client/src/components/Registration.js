import React, { useState } from 'react';
import axios from 'axios'

const API_URL = 'http://localhost:3001'

const Registration = () => {
    const [userData, setUserData] = useState({
        email: '',
        given_name: '',
        surname: '',
        city: '',
        phone_number: '',
        profile_description: '',
        password: '',
        user_type: '',
    
        gender: '',
        caregiving_type: '',
        hourly_rate: '',
        photo_data: '',
    
        house_rules: '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleRegistration = async () => {
        try {
          let registrationData = {
            email: userData.email,
            given_name: userData.given_name,
            surname: userData.surname,
            city: userData.city,
            phone_number: userData.phone_number,
            profile_description: userData.profile_description,
            password: userData.password,
          }
    
          if (userData.user_type === 'caregiver') {
            registrationData = {
              ...registrationData,
              gender: userData.gender,
              caregiving_type: userData.caregiving_type,
              hourly_rate: userData.hourly_rate,
              photo_data: userData.photo_data,
            };
          } else if (userData.user_type === 'member') {
            registrationData = {
              ...registrationData,
              house_rules: userData.house_rules,
            };
          }
    
          const registrationEndpoint = userData.user_type === 'caregiver' ? 'caregiver' : 'member';
          console.log(userData)
          await axios.post(`${API_URL}/users/${registrationEndpoint}`, registrationData);
          console.log('User registered successfully!');
        } catch (error) {
          console.error('Error registering user:', error);
        }
      }

      return (
        <div>
          <h2>Registration</h2>
          <form>
          <input
              type="email"
              name="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="given_name"
              placeholder="First Name"
              value={userData.given_name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="surname"
              placeholder="Last Name"
              value={userData.surname}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={userData.city}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              value={userData.phone_number}
              onChange={handleInputChange}
            />
            <textarea
                name="profile_description"
                placeholder="Profile Description"
                value={userData.profile_description}
                onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={userData.password}
              onChange={handleInputChange}
            />
            <label>
              Choose user type:
              <select name="user_type" onChange={handleInputChange}>
                <option value="">Select user type</option>
                <option value="caregiver">Caregiver</option>
                <option value="member">Member</option>
              </select>
            </label>
    
            {userData.user_type === 'caregiver' && (
              <>
                <label>
                  Gender:
                  <select name="gender" value={userData.gender} onChange={handleInputChange}>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </label>
                <label>
                  Caregiving Type:
                  <select
                    name="caregiving_type"
                    value={userData.caregiving_type}
                    onChange={handleInputChange}
                  >
                    <option value="">Select caregiving type</option>
                    <option value="caregiver for elderly">Caregiver for elderly</option>
                    <option value="babysitter">Babysitter</option>
                    <option value="playmate for children">Playmate for children</option>
                  </select>
                </label>
                <input
                  type="text"
                  name="hourly_rate"
                  placeholder="Hourly Rate"
                  value={userData.hourly_rate}
                  onChange={handleInputChange}
                />
                <label>
                  Photo:
                  <input
                    type="file"
                    name="photo_data"
                    accept="image/*"
                    onChange={(e) => handleInputChange({ target: { name: 'photo_data', value: e.target.files[0] } })}
                  />
                </label>
              </>
            )}
    
            {userData.user_type === 'member' && (
              <label>
                House Rules:
                <input
                  type="text"
                  name="house_rules"
                  placeholder="House Rules"
                  value={userData.house_rules}
                  onChange={handleInputChange}
                />
              </label>
            )}
            <button type="button" onClick={handleRegistration}>
              Register
            </button>
          </form>
         </div>
  );
};

export default Registration