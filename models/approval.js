'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Approval extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Approval.belongsTo(models.Notification, {
        foreignKey: 'NotificationId'
      })
    }
  }
  Approval.init({
    NotificationId: DataTypes.INTEGER,
    approvalSequence: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Approval',
  });
  Approval.beforeCreate(el => {
    el.approvalSequence = 1
  })
  
  return Approval;
};