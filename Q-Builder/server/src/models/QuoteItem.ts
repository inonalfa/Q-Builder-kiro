import { DataTypes, Model, Sequelize, Association } from 'sequelize';
import { Quote } from './Quote';
import { CatalogItem } from './CatalogItem';

export interface QuoteItemAttributes {
  id: number;
  quoteId: number;
  catalogItemId?: number;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteItemCreationAttributes extends Omit<QuoteItemAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class QuoteItem extends Model<QuoteItemAttributes, QuoteItemCreationAttributes> implements QuoteItemAttributes {
  public id!: number;
  public quoteId!: number;
  public catalogItemId?: number;
  public description!: string;
  public unit!: string;
  public quantity!: number;
  public unitPrice!: number;
  public lineTotal!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public static associations: {
    quote: Association<QuoteItem, Quote>;
    catalogItem: Association<QuoteItem, CatalogItem>;
  };

  public static initModel(sequelize: Sequelize): typeof QuoteItem {
    QuoteItem.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        quoteId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'quotes',
            key: 'id'
          }
        },
        catalogItemId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'catalog_items',
            key: 'id'
          }
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [2, 500]
          }
        },
        unit: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [1, 20]
          }
        },
        quantity: {
          type: DataTypes.DECIMAL(10, 3),
          allowNull: false,
          validate: {
            min: 0.001
          }
        },
        unitPrice: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            min: 0
          }
        },
        lineTotal: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          validate: {
            min: 0
          }
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'QuoteItem',
        tableName: 'quote_items',
        timestamps: true,
        indexes: [
          {
            fields: ['quoteId']
          },
          {
            fields: ['catalogItemId']
          }
        ],
        hooks: {
          beforeSave: (instance: QuoteItem) => {
            // Automatically calculate line total
            instance.lineTotal = Number(instance.quantity) * Number(instance.unitPrice);
          }
        }
      }
    );

    return QuoteItem;
  }

  public static associate(): void {
    QuoteItem.belongsTo(Quote, {
      foreignKey: 'quoteId',
      as: 'quote'
    });

    QuoteItem.belongsTo(CatalogItem, {
      foreignKey: 'catalogItemId',
      as: 'catalogItem'
    });
  }
}