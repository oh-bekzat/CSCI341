const { DataTypes } = require('sequelize')
const sequelize = require('../database')
const Caregiver = require('./Caregiver')
const Job = require('./Job')

const JobApplication = sequelize.define('JobApplication', {
  caregiver_user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Caregiver,
      key: 'caregiver_user_id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  job_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Job,
      key: 'job_id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  date_applied: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'job_application',
  timestamps: false,
  primaryKey: ['caregiver_user_id', 'job_id'],
})

module.exports = JobApplication