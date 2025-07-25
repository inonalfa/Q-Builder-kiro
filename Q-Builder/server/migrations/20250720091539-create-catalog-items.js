'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('catalog_items', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      professionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'professions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: false
      },
      defaultPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      description: {
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
    await queryInterface.addIndex('catalog_items', ['professionId']);
    await queryInterface.addIndex('catalog_items', ['name']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('catalog_items');
  }
};