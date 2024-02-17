'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Question.belongsTo(models.Quiz, {
        foreignKey: 'quiz_id',
        onDelete: 'CASCADE'
      });
    }
  }
  Question.init({
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('unique', 'multiple'),
      allowNull: false
    },
    quiz_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Question',
    freezeTableName: true
  });
  return Question;
};