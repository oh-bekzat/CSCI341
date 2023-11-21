const { DataTypes } = require('sequelize')
const sequelize = require('../database')

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  given_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^\+?[0-9]{11}$/i,
    },
  },
  profile_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'user',
  timestamps: false,
})

module.exports = User
