import { CatalogItem, Profession } from '../models';
import { CatalogItemCreationAttributes } from '../models/CatalogItem';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

export interface CatalogItemCSVRow {
  name: string;
  unit: string;
  defaultPrice?: string;
  description?: string;
}

export class CatalogService {
  /**
   * Get all catalog items
   */
  async getAllCatalogItems(): Promise<CatalogItem[]> {
    return await CatalogItem.findAll({
      include: [{
        model: Profession,
        as: 'profession'
      }],
      order: [['name', 'ASC']]
    });
  }

  /**
   * Get catalog items by profession ID
   */
  async getCatalogItemsByProfession(professionId: number): Promise<CatalogItem[]> {
    return await CatalogItem.findAll({
      where: { professionId },
      include: [{
        model: Profession,
        as: 'profession'
      }],
      order: [['name', 'ASC']]
    });
  }

  /**
   * Get catalog item by ID
   */
  async getCatalogItemById(id: number): Promise<CatalogItem | null> {
    return await CatalogItem.findByPk(id, {
      include: [{
        model: Profession,
        as: 'profession'
      }]
    });
  }

  /**
   * Create a new catalog item
   */
  async createCatalogItem(catalogItemData: CatalogItemCreationAttributes): Promise<CatalogItem> {
    return await CatalogItem.create(catalogItemData);
  }

  /**
   * Update catalog item by ID
   */
  async updateCatalogItem(id: number, updates: Partial<CatalogItemCreationAttributes>): Promise<CatalogItem | null> {
    const catalogItem = await CatalogItem.findByPk(id);
    if (!catalogItem) {
      return null;
    }

    await catalogItem.update(updates);
    return catalogItem;
  }

  /**
   * Delete catalog item by ID
   */
  async deleteCatalogItem(id: number): Promise<boolean> {
    const deletedCount = await CatalogItem.destroy({
      where: { id }
    });

    return deletedCount > 0;
  }

  /**
   * Parse CSV content and return catalog items data
   */
  parseCatalogCSV(csvContent: string): CatalogItemCSVRow[] {
    try {
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true // Handle UTF-8 BOM
      });

      return records.map((record: any) => ({
        name: record.name || record.Name || record['שם'] || '',
        unit: record.unit || record.Unit || record['יחידה'] || '',
        defaultPrice: record.defaultPrice || record.DefaultPrice || record['מחיר'] || record.price || record.Price || undefined,
        description: record.description || record.Description || record['תיאור'] || undefined
      }));
    } catch (error) {
      throw new Error(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Import catalog items from CSV data
   */
  async importCatalogItemsFromCSV(professionId: number, csvData: CatalogItemCSVRow[]): Promise<CatalogItem[]> {
    // Verify profession exists
    const profession = await Profession.findByPk(professionId);
    if (!profession) {
      throw new Error('Profession not found');
    }

    const createdItems: CatalogItem[] = [];

    for (const row of csvData) {
      // Validate required fields
      if (!row.name || !row.unit) {
        console.warn(`Skipping row with missing name or unit:`, row);
        continue;
      }

      try {
        // Check if item already exists for this profession
        const existingItem = await CatalogItem.findOne({
          where: {
            professionId,
            name: row.name
          }
        });

        if (existingItem) {
          console.warn(`Catalog item "${row.name}" already exists for profession ${professionId}, skipping`);
          continue;
        }

        // Create catalog item
        const catalogItemData: CatalogItemCreationAttributes = {
          professionId,
          name: row.name,
          unit: row.unit,
          ...(row.defaultPrice && { defaultPrice: parseFloat(row.defaultPrice) }),
          ...(row.description && { description: row.description })
        };

        const catalogItem = await this.createCatalogItem(catalogItemData);
        createdItems.push(catalogItem);
      } catch (error) {
        console.error(`Error creating catalog item for row:`, row, error);
        // Continue with next item instead of failing the entire import
      }
    }

    return createdItems;
  }

  /**
   * Import catalog items from CSV file
   */
  async importCatalogItemsFromFile(professionId: number, filePath: string): Promise<CatalogItem[]> {
    try {
      const csvContent = fs.readFileSync(filePath, 'utf-8');
      const csvData = this.parseCatalogCSV(csvContent);
      return await this.importCatalogItemsFromCSV(professionId, csvData);
    } catch (error) {
      throw new Error(`Failed to import from file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Seed catalog items for all professions from CSV files
   */
  async seedCatalogFromCSVFiles(): Promise<{ [professionName: string]: number }> {
    const results: { [professionName: string]: number } = {};
    const seedsDir = path.join(__dirname, '../../seeds/catalog');

    // Get all professions
    const professions = await Profession.findAll();

    for (const profession of professions) {
      const csvFilePath = path.join(seedsDir, `${profession.name}.csv`);

      if (fs.existsSync(csvFilePath)) {
        try {
          const importedItems = await this.importCatalogItemsFromFile(profession.id, csvFilePath);
          results[profession.name] = importedItems.length;
          console.log(`Imported ${importedItems.length} catalog items for ${profession.name}`);
        } catch (error) {
          console.error(`Failed to import catalog for ${profession.name}:`, error);
          results[profession.name] = 0;
        }
      } else {
        console.warn(`CSV file not found for profession: ${profession.name} at ${csvFilePath}`);
        results[profession.name] = 0;
      }
    }

    return results;
  }

  /**
   * Get catalog statistics
   */
  async getCatalogStatistics(): Promise<{
    totalItems: number;
    itemsByProfession: { [professionName: string]: number };
  }> {
    const totalItems = await CatalogItem.count();

    const professions = await Profession.findAll({
      include: [{
        model: CatalogItem,
        as: 'catalogItems',
        attributes: []
      }],
      attributes: [
        'name',
        'nameHebrew',
        [
          CatalogItem.sequelize!.fn('COUNT', CatalogItem.sequelize!.col('catalogItems.id')),
          'itemCount'
        ]
      ],
      group: ['Profession.id'],
      raw: true
    });

    const itemsByProfession: { [professionName: string]: number } = {};
    professions.forEach((profession: any) => {
      itemsByProfession[profession.name] = parseInt(profession.itemCount) || 0;
    });

    return {
      totalItems,
      itemsByProfession
    };
  }

  /**
   * Clear all catalog items for a profession
   */
  async clearCatalogForProfession(professionId: number): Promise<number> {
    const deletedCount = await CatalogItem.destroy({
      where: { professionId }
    });

    return deletedCount;
  }

  /**
   * Clear all catalog items
   */
  async clearAllCatalog(): Promise<number> {
    const deletedCount = await CatalogItem.destroy({
      where: {},
      truncate: true
    });

    return deletedCount;
  }
}

export const catalogService = new CatalogService();