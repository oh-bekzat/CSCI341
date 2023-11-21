const { DataTypes } = require('sequelize')
const sequelize = require('../database')
const User = require('./User')

const Address = sequelize.define('Address', {
  member_user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: 'user_id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  house_number: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  street: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  town: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'address',
  timestamps: false,
})

module.exports = Address
