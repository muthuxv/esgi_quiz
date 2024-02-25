'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Quiz.hasMany(models.Question, {
        foreignKey: 'quiz_id',
        as: 'questions'
      });
      Quiz.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      });
    }
  }
  Quiz.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.STRING,
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    isShuffle: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Quiz',
    freezeTableName: true,
  });
  return Quiz;
};