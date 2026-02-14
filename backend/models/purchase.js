const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const Purchase = sequelize.define(
  'Purchase',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    pricePaid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: 'purchases',
    timestamps: true,
  },
);

module.exports = Purchase;
