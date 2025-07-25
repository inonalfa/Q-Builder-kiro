import { DataTypes, Model, Sequelize, Association } from 'sequelize';
import { Client } from './Client';
import { Quote } from './Quote';
import { Project } from './Project';

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  passwordHash?: string;
  provider: 'local' | 'google' | 'apple' | 'microsoft';
  providerId?: string;
  emailVerified: boolean;
  businessName: string;
  phone: string;
  address: string;
  logoUrl?: string;
  professionIds: number[];
  vatRate: number;
  notificationSettings: {
    emailEnabled: boolean;
    quoteExpiry: boolean;
    paymentReminders: boolean;
    quoteSent: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public passwordHash?: string;
  public provider!: 'local' | 'google' | 'apple' | 'microsoft';
  public providerId?: string;
  public emailVerified!: boolean;
  public businessName!: string;
  public phone!: string;
  public address!: string;
  public logoUrl?: string;
  public professionIds!: number[];
  public vatRate!: number;
  public notificationSettings!: {
    emailEnabled: boolean;
    quoteExpiry: boolean;
    paymentReminders: boolean;
    quoteSent: boolean;
  };
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public static associations: {
    clients: Association<User, Client>;
    quotes: Association<User, Quote>;
    projects: Association<User, Project>;
  };

  public static initModel(sequelize: Sequelize): typeof User {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [2, 100]
          }
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true
          }
        },
        passwordHash: {
          type: DataTypes.STRING,
          allowNull: true
        },
        provider: {
          type: DataTypes.ENUM('local', 'google', 'apple', 'microsoft'),
          allowNull: false,
          defaultValue: 'local'
        },
        providerId: {
          type: DataTypes.STRING,
          allowNull: true
        },
        emailVerified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        businessName: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
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
        address: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notEmpty: true
          }
        },
        logoUrl: {
          type: DataTypes.STRING,
          allowNull: true
        },
        professionIds: {
          type: DataTypes.ARRAY(DataTypes.INTEGER),
          allowNull: false,
          defaultValue: []
        },
        vatRate: {
          type: DataTypes.DECIMAL(5, 4),
          allowNull: false,
          defaultValue: 0.18,
          validate: {
            min: 0,
            max: 1
          }
        },
        notificationSettings: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {
            emailEnabled: true,
            quoteExpiry: true,
            paymentReminders: true,
            quoteSent: true
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
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        indexes: [
          {
            unique: true,
            fields: ['email']
          },
          {
            fields: ['provider', 'providerId']
          }
        ]
      }
    );

    return User;
  }

  public static associate(): void {
    User.hasMany(Client, {
      foreignKey: 'userId',
      as: 'clients'
    });

    User.hasMany(Quote, {
      foreignKey: 'userId',
      as: 'quotes'
    });

    User.hasMany(Project, {
      foreignKey: 'userId',
      as: 'projects'
    });
  }
}