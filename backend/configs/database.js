const { Sequelize } = require('sequelize'); // ORM library
require('dotenv').config();

// Connect DB with Connection URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

// Test the connection
async function testDBConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Unable to connect to database:', error.message);
  }
}

testDBConnection();

module.exports = sequelize;
