import { DataTypes, Model, Sequelize, Association } from 'sequelize';
import { CatalogItem } from './CatalogItem';

export interface ProfessionAttributes {
  id: number;
  name: string;
  nameHebrew: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfessionCreationAttributes extends Omit<ProfessionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Profession extends Model<ProfessionAttributes, ProfessionCreationAttributes> implements ProfessionAttributes {
  public id!: number;
  public name!: string;
  public nameHebrew!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public static associations: {
    catalogItems: Association<Profession, CatalogItem>;
  };

  public static initModel(sequelize: Sequelize): typeof Profession {
    Profession.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: true,
            len: [2, 50]
          }
        },
        nameHebrew: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [2, 50]
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
        modelName: 'Profession',
        tableName: 'professions',
        timestamps: true,
        indexes: [
          {
            unique: true,
            fields: ['name']
          }
        ]
      }
    );

    return Profession;
  }

  public static associate(): void {
    Profession.hasMany(CatalogItem, {
      foreignKey: 'professionId',
      as: 'catalogItems'
    });
  }
}