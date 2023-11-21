const { DataTypes } = require('sequelize')
const sequelize = require('../database')
const Member = require('./Member')

const Job = sequelize.define('Job', {
  job_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  member_user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Member,
      key: 'member_user_id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  required_caregiving_type: {
    type: DataTypes.ENUM('babysitter', 'caregiver for elderly', 'playmate for children'),
    allowNull: false,
  },
  other_requirements: {
    type: DataTypes.TEXT,
  },
  date_posted: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'job',
  timestamps: false,
})

module.exports = Job