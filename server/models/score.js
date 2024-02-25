'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Score extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Score.init({
    score: DataTypes.INTEGER,
    total_time: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    quiz_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Score',
    freezeTableName: true
  });
  return Score;
};