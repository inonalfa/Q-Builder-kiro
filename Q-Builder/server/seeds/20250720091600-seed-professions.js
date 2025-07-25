'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const professions = [
      { name: 'electrical', nameHebrew: 'חשמל' },
      { name: 'plumbing', nameHebrew: 'אינסטלציה' },
      { name: 'painting', nameHebrew: 'צבע' },
      { name: 'drywall', nameHebrew: 'גבס' },
      { name: 'flooring', nameHebrew: 'ריצוף' },
      { name: 'demolition', nameHebrew: 'פירוק ופינוי' },
      { name: 'aluminum', nameHebrew: 'עבודות אלומיניום' },
      { name: 'gardening', nameHebrew: 'גינות' },
      { name: 'kitchens', nameHebrew: 'מטבחים' },
      { name: 'plastering', nameHebrew: 'טיח' },
      { name: 'roofing', nameHebrew: 'גגות' },
      { name: 'waterproofing', nameHebrew: 'איטום' },
      { name: 'framework', nameHebrew: 'שלד' },
      { name: 'frames', nameHebrew: 'מסגרות' },
      { name: 'air-conditioning', nameHebrew: 'מיזוג אוויר' },
      { name: 'solar-heaters', nameHebrew: 'דודי שמש' },
      { name: 'gas', nameHebrew: 'גז' },
      { name: 'carpentry', nameHebrew: 'נגרות ודלתות' },
      { name: 'handyman', nameHebrew: 'הנדימן' }
    ];

    const now = new Date();
    const professionsWithTimestamps = professions.map(profession => ({
      ...profession,
      createdAt: now,
      updatedAt: now
    }));

    await queryInterface.bulkInsert('professions', professionsWithTimestamps);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('professions', null, {});
  }
};