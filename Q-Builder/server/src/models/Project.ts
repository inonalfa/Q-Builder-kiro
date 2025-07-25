import { DataTypes, Model, Sequelize, Association } from 'sequelize';
import { User } from './User';
import { Client } from './Client';
import { Quote } from './Quote';
import { Payment } from './Payment';

export interface ProjectAttributes {
  id: number;
  userId: number;
  clientId: number;
  originQuoteId?: number;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  budget: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectCreationAttributes extends Omit<ProjectAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: number;
  public userId!: number;
  public clientId!: number;
  public originQuoteId?: number;
  public name!: string;
  public description?: string;
  public status!: 'active' | 'completed' | 'cancelled';
  public startDate!: Date;
  public endDate?: Date;
  public budget!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public static associations: {
    user: Association<Project, User>;
    client: Association<Project, Client>;
    originQuote: Association<Project, Quote>;
    payments: Association<Project, Payment>;
  };

  public static initModel(sequelize: Sequelize): typeof Project {
    Project.init(
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
        originQuoteId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'quotes',
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
        description: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        status: {
          type: DataTypes.ENUM('active', 'completed', 'cancelled'),
          allowNull: false,
          defaultValue: 'active'
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: true
        },
        budget: {
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
        modelName: 'Project',
        tableName: 'projects',
        timestamps: true,
        indexes: [
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
            fields: ['startDate']
          }
        ]
      }
    );

    return Project;
  }

  public static associate(): void {
    Project.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user'
    });

    Project.belongsTo(Client, {
      foreignKey: 'clientId',
      as: 'client'
    });

    Project.belongsTo(Quote, {
      foreignKey: 'originQuoteId',
      as: 'originQuote'
    });

    Project.hasMany(Payment, {
      foreignKey: 'projectId',
      as: 'payments'
    });
  }
}