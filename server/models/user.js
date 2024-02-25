'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Room, {
        foreignKey: 'room_id',
        onDelete: 'SET NULL',
      });
    }

    isPasswordValid(password) {
      return bcrypt.compare(password, this.password);
    }
  }
  User.init({
    id: {
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false, // not null
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'ROLE_USER',
    },
    room_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'User',
    freezeTableName: true,
  });
  return User;
};