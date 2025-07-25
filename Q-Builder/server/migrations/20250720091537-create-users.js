'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      passwordHash: {
        type: Sequelize.STRING,
        allowNull: true
      },
      provider: {
        type: Sequelize.ENUM('local', 'google', 'apple'),
        allowNull: false,
        defaultValue: 'local'
      },
      providerId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      businessName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      logoUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      professionIds: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false,
        defaultValue: []
      },
      vatRate: {
        type: Sequelize.DECIMAL(5, 4),
        allowNull: false,
        defaultValue: 0.18
      },
      notificationSettings: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {
          emailEnabled: true,
          quoteExpiry: true,
          paymentReminders: true,
          quoteSent: true
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add indexes
    await queryInterface.addIndex('users', ['email'], { unique: true });
    await queryInterface.addIndex('users', ['provider', 'providerId']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
