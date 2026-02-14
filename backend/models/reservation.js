const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const Reservation = sequelize.define(
  'Reservation',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'expired'),
      defaultValue: 'active',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'reservations',
    timestamps: true,
  },
);

module.exports = Reservation;
