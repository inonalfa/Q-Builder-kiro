'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('quote_items', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      quoteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'quotes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      catalogItemId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'catalog_items',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: false
      },
      quantity: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: false
      },
      unitPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      lineTotal: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
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
    await queryInterface.addIndex('quote_items', ['quoteId']);
    await queryInterface.addIndex('quote_items', ['catalogItemId']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('quote_items');
  }
};