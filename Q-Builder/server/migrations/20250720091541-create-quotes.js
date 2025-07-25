'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('quotes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      clientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'clients',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      projectId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      quoteNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      issueDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      expiryDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('draft', 'sent', 'accepted', 'rejected', 'expired'),
        allowNull: false,
        defaultValue: 'draft'
      },
      totalAmount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'ILS'
      },
      terms: {
        type: Sequelize.TEXT,
        allowNull: true
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
    await queryInterface.addIndex('quotes', ['quoteNumber'], { unique: true });
    await queryInterface.addIndex('quotes', ['userId']);
    await queryInterface.addIndex('quotes', ['clientId']);
    await queryInterface.addIndex('quotes', ['status']);
    await queryInterface.addIndex('quotes', ['issueDate']);
    await queryInterface.addIndex('quotes', ['expiryDate']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('quotes');
  }
};