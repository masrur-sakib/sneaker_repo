const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const Drop = sequelize.define(
  'Drop',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    availableStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    startsAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endsAt: {
      type: DataTypes.DATE,
      allowNull: true, // optional
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true, // optional
    },
  },
  {
    tableName: 'drops',
    timestamps: true,
  },
);

module.exports = Drop;
