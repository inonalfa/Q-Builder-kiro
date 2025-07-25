import { DataTypes, Model, Sequelize, Association } from 'sequelize';
import { User } from './User';
import { Client } from './Client';
import { Project } from './Project';
import { QuoteItem } from './QuoteItem';

export interface QuoteAttributes {
  id: number;
  userId: number;
  clientId: number;
  projectId?: number;
  quoteNumber: string;
  title: string;
  issueDate: Date;
  expiryDate: Date;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  totalAmount: number;
  currency: string;
  terms?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteCreationAttributes extends Omit<QuoteAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Quote extends Model<QuoteAttributes, QuoteCreationAttributes> implements QuoteAttributes {
  public id!: number;
  public userId!: number;
  public clientId!: number;
  public projectId?: number;
  public quoteNumber!: string;
  public title!: string;
  public issueDate!: Date;
  public expiryDate!: Date;
  public status!: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  public totalAmount!: number;
  public currency!: string;
  public terms?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public static associations: {
    user: Association<Quote, User>;
    client: Association<Quote, Client>;
    project: Association<Quote, Project>;
    items: Association<Quote, QuoteItem>;
  };

  public static initModel(sequelize: Sequelize): typeof Quote {
    Quote.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        clientId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'clients',
            key: 'id'
          }
        },
        projectId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'projects',
            key: 'id'
          }
        },
        quoteNumber: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: true
          }
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [2, 200]
          }
        },
        issueDate: {
          type: DataTypes.DATE,
          allowNull: false
        },
        expiryDate: {
          type: DataTypes.DATE,
          allowNull: false
        },
        status: {
          type: DataTypes.ENUM('draft', 'sent', 'accepted', 'rejected', 'expired'),
          allowNull: false,
          defaultValue: 'draft'
        },
        totalAmount: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          defaultValue: 0,
          validate: {
            min: 0
          }
        },
        currency: {
          type: DataTypes.STRING(3),
          allowNull: false,
          defaultValue: 'ILS'
        },
        terms: {
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
        modelName: 'Quote',
        tableName: 'quotes',
        timestamps: true,
        indexes: [
          {
            unique: true,
            fields: ['quoteNumber']
          },
          {
            fields: ['userId']
          },
          {
            fields: ['clientId']
          },
          {
            fields: ['status']
          },
          {
            fields: ['issueDate']
          },
          {
            fields: ['expiryDate']
          }
        ]
      }
    );

    return Quote;
  }

  public static associate(): void {
    Quote.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user'
    });

    Quote.belongsTo(Client, {
      foreignKey: 'clientId',
      as: 'client'
    });

    Quote.belongsTo(Project, {
      foreignKey: 'projectId',
      as: 'project'
    });

    Quote.hasMany(QuoteItem, {
      foreignKey: 'quoteId',
      as: 'items'
    });
  }
}