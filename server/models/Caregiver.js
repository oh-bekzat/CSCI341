const { DataTypes } = require('sequelize')
const sequelize = require('../database')
const User = require('./User')

const Caregiver = sequelize.define('Caregiver', {
  caregiver_user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: 'user_id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  photo_data: {
    type: DataTypes.BLOB('long'),
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('male', 'female'),
    allowNull: false,
  },
  caregiving_type: {
    type: DataTypes.ENUM('babysitter', 'caregiver for elderly', 'playmate for children'),
    allowNull: false,
  },
  hourly_rate: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
}, {
  tableName: 'caregiver',
  timestamps: false,
})

module.exports = Caregiver
