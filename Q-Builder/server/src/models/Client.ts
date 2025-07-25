import { DataTypes, Model, Sequelize, Association } from 'sequelize';
import { User } from './User';
import { Quote } from './Quote';
import { Project } from './Project';

export interface ClientAttributes {
  id: number;
  userId: number;
  name: string;
  contactPerson?: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientCreationAttributes extends Omit<ClientAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public id!: number;
  public userId!: number;
  public name!: string;
  public contactPerson?: string;
  public phone!: string;
  public email!: string;
  public address!: string;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public static associations: {
    user: Association<Client, User>;
    quotes: Association<Client, Quote>;
    projects: Association<Client, Project>;
  };

  public static initModel(sequelize: Sequelize): typeof Client {
    Client.init(
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
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [2, 100]
          }
        },
        contactPerson: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            len: [2, 100]
          }
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true
          }
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isEmail: true
          }
        },
        address: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notEmpty: true
          }
        },
        notes: {
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
        modelName: 'Client',
        tableName: 'clients',
        timestamps: true,
        indexes: [
          {
            fields: ['userId']
          },
          {
            fields: ['name']
          },
          {
            fields: ['email']
          }
        ]
      }
    );

    return Client;
  }

  public static associate(): void {
    Client.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user'
    });

    Client.hasMany(Quote, {
      foreignKey: 'clientId',
      as: 'quotes'
    });

    Client.hasMany(Project, {
      foreignKey: 'clientId',
      as: 'projects'
    });
  }
}