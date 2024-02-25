'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reponse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reponse.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      });
      Reponse.belongsTo(models.Question, {
        foreignKey: 'question_id',
        onDelete: 'CASCADE'
      });
      Reponse.belongsTo(models.Option, {
        foreignKey: 'option_id',
        onDelete: 'CASCADE'
      });
      Reponse.belongsTo(models.Room, {
        foreignKey: 'room_id',
        onDelete: 'CASCADE'
      });
    }
  }
  Reponse.init({
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    option_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    room_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Reponse',
    freezeTableName: true
  });
  return Reponse;
};