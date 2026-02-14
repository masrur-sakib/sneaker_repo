const sequelize = require('../configs/database');
const User = require('./user');
const Drop = require('./drop');
const Reservation = require('./reservation');
const Purchase = require('./purchase');

// ============ RELATIONSHIPS ============

// One User can have Many Reservations
User.hasMany(Reservation, {
  foreignKey: 'userId',
  onDelete: 'CASCADE', // if user is deleted, delete their reservations too
});
Reservation.belongsTo(User, {
  foreignKey: 'userId',
});

// One Drop can have Many Reservations
Drop.hasMany(Reservation, {
  foreignKey: 'dropId',
  onDelete: 'CASCADE',
});
Reservation.belongsTo(Drop, {
  foreignKey: 'dropId',
});

// One User can have Many Purchases
User.hasMany(Purchase, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
Purchase.belongsTo(User, {
  foreignKey: 'userId',
});

// One Drop can have Many Purchases
Drop.hasMany(Purchase, {
  foreignKey: 'dropId',
  onDelete: 'CASCADE',
});
Purchase.belongsTo(Drop, {
  foreignKey: 'dropId',
});

// One Reservation leads to One Purchase (optional)
Reservation.hasOne(Purchase, {
  foreignKey: 'reservationId',
});
Purchase.belongsTo(Reservation, {
  foreignKey: 'reservationId',
});

// ============ SYNC DATABASE ============

// This function creates all tables based on models
async function syncDatabase() {
  try {
    // 'alter: true' modifies existing tables to match models
    // Use 'force: true' only in development to drop and recreate tables
    await sequelize.sync({ alter: true });
    console.log('All tables synchronized!');
  } catch (error) {
    console.error('Error synchronizing tables:', error);
  }
}

module.exports = {
  sequelize,
  User,
  Drop,
  Reservation,
  Purchase,
  syncDatabase,
};
