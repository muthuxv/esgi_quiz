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
      // define association here
    }
  }
  Reponse.init({
    isCorrect: DataTypes.BOOLEAN,
    user_id: DataTypes.INTEGER,
    question_id: DataTypes.INTEGER,
    option_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reponse',
    freezeTableName: true
  });
  return Reponse;
};