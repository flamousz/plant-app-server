'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Notification, {
        foreignKey:'UserId'
      })
      User.hasOne(models.ApprovalMaster, {
        foreignKey: 'UserId'
      })
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Name cannot be empty'
        },
        notEmpty: {
          msg: 'Name cannot be empty'
        }
      }
    },
    email: {
      unique: {
        msg: "Email has been exists"
      },
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Please type in email format'
        },
        notNull: {
          msg: 'Email cannot be empty'
        },
        notEmpty: {
          msg: 'Email cannot be empty'
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Role cannot be empty'
        },
        notEmpty: {
          msg: 'Role cannot be empty'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password cannot be empty'
        },
        notEmpty: {
          msg: 'Password cannot be empty'
        },
        len: {
          args: [5],
          msg: 'minimal password character is 5'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate(el => {
    el.password = hashPassword(el.password)
  })

  return User;
};