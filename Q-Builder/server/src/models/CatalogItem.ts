import { DataTypes, Model, Sequelize, Association } from 'sequelize';
import { Profession } from './Profession';
import { QuoteItem } from './QuoteItem';

export interface CatalogItemAttributes {
  id: number;
  professionId: number;
  name: string;
  unit: string;
  defaultPrice?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CatalogItemCreationAttributes extends Omit<CatalogItemAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class CatalogItem extends Model<CatalogItemAttributes, CatalogItemCreationAttributes> implements CatalogItemAttributes {
  public id!: number;
  public professionId!: number;
  public name!: string;
  public unit!: string;
  public defaultPrice?: number;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public static associations: {
    profession: Association<CatalogItem, Profession>;
    quoteItems: Association<CatalogItem, QuoteItem>;
  };

  public static initModel(sequelize: Sequelize): typeof CatalogItem {
    CatalogItem.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        professionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'professions',
            key: 'id'
          }
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [2, 200]
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
        defaultPrice: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
          validate: {
            min: 0
          }
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true
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
        modelName: 'CatalogItem',
        tableName: 'catalog_items',
        timestamps: true,
        indexes: [
          {
            fields: ['professionId']
          },
          {
            fields: ['name']
          }
        ]
      }
    );

    return CatalogItem;
  }

  public static associate(): void {
    CatalogItem.belongsTo(Profession, {
      foreignKey: 'professionId',
      as: 'profession'
    });

    CatalogItem.hasMany(QuoteItem, {
      foreignKey: 'catalogItemId',
      as: 'quoteItems'
    });
  }
}