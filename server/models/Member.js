const { DataTypes } = require('sequelize')
const sequelize = require('../database')
const User = require('./User')

const Member = sequelize.define('Member', {
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
  house_rules: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'member',
  timestamps: false,
})

module.exports = Member