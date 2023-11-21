const { DataTypes } = require('sequelize')
const sequelize = require('../database')
const Caregiver = require('./Caregiver')
const Member = require('./Member')

const Appointment = sequelize.define('Appointment', {
  appointment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  caregiver_user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Caregiver,
      key: 'caregiver_user_id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
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
  appointment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  appointment_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  work_hours: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('confirmed', 'declined', 'pending'),
    allowNull: false,
  },
}, {
  tableName: 'appointment',
  timestamps: false,
})

module.exports = Appointment
