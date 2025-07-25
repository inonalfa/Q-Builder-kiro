import { Sequelize } from 'sequelize';
import { config } from './index';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  username: config.database.username,
  password: config.database.password,
  logging: config.env === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    console.log('Server will continue running without database connection.');
    console.log('Please ensure PostgreSQL is running and the database exists.');
    console.log('Database configuration:');
    console.log(`  Host: ${config.database.host}`);
    console.log(`  Port: ${config.database.port}`);
    console.log(`  Database: ${config.database.name}`);
    console.log(`  Username: ${config.database.username}`);
  }
};