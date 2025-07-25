import { Profession, CatalogItem } from '../models';
import { ProfessionCreationAttributes } from '../models/Profession';

export class ProfessionService {
  /**
   * Get all professions
   */
  async getAllProfessions(): Promise<Profession[]> {
    return await Profession.findAll({
      order: [['nameHebrew', 'ASC']],
      include: [{
        model: CatalogItem,
        as: 'catalogItems',
        attributes: ['id']
      }]
    });
  }

  /**
   * Get profession by ID
   */
  async getProfessionById(id: number): Promise<Profession | null> {
    return await Profession.findByPk(id, {
      include: [{
        model: CatalogItem,
        as: 'catalogItems'
      }]
    });
  }

  /**
   * Create a new profession
   */
  async createProfession(professionData: ProfessionCreationAttributes): Promise<Profession> {
    return await Profession.create(professionData);
  }

  /**
   * Update profession by ID
   */
  async updateProfession(id: number, updates: Partial<ProfessionCreationAttributes>): Promise<Profession | null> {
    const profession = await Profession.findByPk(id);
    if (!profession) {
      return null;
    }

    await profession.update(updates);
    return profession;
  }

  /**
   * Delete profession by ID
   */
  async deleteProfession(id: number): Promise<boolean> {
    // Check if profession has catalog items
    const catalogItemCount = await CatalogItem.count({
      where: { professionId: id }
    });

    if (catalogItemCount > 0) {
      throw new Error('Cannot delete profession with existing catalog items');
    }

    const deletedCount = await Profession.destroy({
      where: { id }
    });

    return deletedCount > 0;
  }

  /**
   * Get professions with catalog item counts
   */
  async getProfessionsWithCounts(): Promise<any[]> {
    const professions = await Profession.findAll({
      order: [['nameHebrew', 'ASC']],
      include: [{
        model: CatalogItem,
        as: 'catalogItems',
        attributes: []
      }],
      attributes: [
        'id',
        'name',
        'nameHebrew',
        'createdAt',
        'updatedAt',
        [
          // Count catalog items for each profession
          Profession.sequelize!.fn('COUNT', Profession.sequelize!.col('catalogItems.id')),
          'catalogItemCount'
        ]
      ],
      group: ['Profession.id']
    });

    return professions;
  }

  /**
   * Seed professions with predefined data
   */
  async seedProfessions(): Promise<void> {
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

    // Use upsert to avoid duplicates
    for (const profession of professions) {
      await Profession.findOrCreate({
        where: { name: profession.name },
        defaults: profession
      });
    }
  }
}

export const professionService = new ProfessionService();