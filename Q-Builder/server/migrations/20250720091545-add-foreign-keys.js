'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add foreign key constraint from quotes to projects
    await queryInterface.addConstraint('quotes', {
      fields: ['projectId'],
      type: 'foreign key',
      name: 'fk_quotes_project_id',
      references: {
        table: 'projects',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('quotes', 'fk_quotes_project_id');
  }
};