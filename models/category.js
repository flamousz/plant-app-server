'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.Item,{
        foreignKey: 'categoryid'
      })
    }
  }
  Category.init({
    name: DataTypes.STRING,
    code: {
      type: DataTypes.STRING,
      unique: {
        msg: "Code has been exists",
      },
    },
    description: DataTypes.STRING,
    status: DataTypes.STRING,
    arcStatus: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};