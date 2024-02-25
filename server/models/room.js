'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Room.hasMany(models.User, {
        foreignKey: 'room_id',
        as: 'users'
      });
      Room.belongsTo(models.Quiz, {
        foreignKey: 'quiz_id',
        onDelete: 'SET NULL',
      });
    }
  }
  Room.init({
    id: {
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID
    },
    quiz_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Room',
    freezeTableName: true
  });
  return Room;
};