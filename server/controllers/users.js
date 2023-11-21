const express = require('express')
const usersRouter = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authenticateToken = require('../middleware/authenticate')

const User = require('../models/User')
const Caregiver = require('../models/Caregiver')
const Member = require('../models/Member')

usersRouter.post('/caregiver', async (req, res) => {
    try {
        const {
            email,
            given_name,
            surname,
            city,
            phone_number,
            profile_description,
            password,
            photo_data,
            gender,
            caregiving_type,
            hourly_rate,
        } = req.body

        if (!email || !given_name || !surname || !city || !phone_number || !profile_description || !password || !photo_data || !gender || !caregiving_type || !hourly_rate) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            email,
            given_name,
            surname,
            city,
            phone_number,
            profile_description,
            password: hashedPassword,
        })

        const newCaregiver = await Caregiver.create({
            caregiver_user_id: newUser.user_id,
            photo_data,
            gender,
            caregiving_type,
            hourly_rate,
        })

        res.status(201).json({ message: 'User and Caregiver created successfully', user: newUser, caregiver: newCaregiver })
    } catch (error) {
        console.error('Error creating user and caregiver:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

usersRouter.post('/member', async (req, res) => {
    try {
        const {
            email,
            given_name,
            surname,
            city,
            phone_number,
            profile_description,
            password,
            house_rules, 
        } = req.body
  
        if (!email || !given_name || !surname || !city || !phone_number || !profile_description || !password || !house_rules) {
            return res.status(400).json({ error: 'Missing required fields' })
        }
  
        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' })
        }
  
        const hashedPassword = await bcrypt.hash(password, 10)
  
        const newUser = await User.create({
            email,
            given_name,
            surname,
            city,
            phone_number,
            profile_description,
            password: hashedPassword,
        })
  
        const newMember = await Member.create({
            member_user_id: newUser.user_id,
            house_rules,
        })
  
        res.status(201).json({ message: 'User and Member created successfully', user: newUser, member: newMember })
    } catch (error) {
        console.error('Error creating user and member:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

usersRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
  
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }
  
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }
  
        const token = jwt.sign({ userId: user.user_id }, 'meiram_is_the_coolest', { expiresIn: '1h' })
  
        res.json({ token })
    } catch (error) {
        console.error('Error during login:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

usersRouter.get('/profile', authenticateToken, (req, res) => {
    try {
        const userData = req.user
        res.status(200).json({ user: userData })
    } catch (error) {
        console.error('Error fetching user profile:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

module.exports = usersRouter