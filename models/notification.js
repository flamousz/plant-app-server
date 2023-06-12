'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notification.belongsTo(models.User, {
        foreignKey: 'UserId'
      })
      Notification.belongsTo(models.PlantSchedule, {
        foreignKey: 'PlantScheduleId'
      })
      Notification.hasMany(models.Approval, {
        foreignKey: 'NotificationId'
      })
    }
  }
  Notification.init({
    description: DataTypes.STRING,
    isRead: DataTypes.BOOLEAN,
    UserId: DataTypes.INTEGER,
    PlantScheduleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};