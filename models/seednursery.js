'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SeedNursery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SeedNursery.belongsTo(models.PlantSchedule)
      SeedNursery.belongsTo(models.Item, {
        foreignKey: 'SeedId'
      })
    }
  }
  SeedNursery.init({
    PlantScheduleId: DataTypes.INTEGER,
    SeedId: DataTypes.INTEGER,
    statusNursery: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SeedNursery',
  });
  return SeedNursery;
};