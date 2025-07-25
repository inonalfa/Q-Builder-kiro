import { DataTypes, Model, Sequelize, Association } from 'sequelize';
import { Project } from './Project';

export interface PaymentAttributes {
  id: number;
  projectId: number;
  date: Date;
  amount: number;
  method: string;
  note?: string;
  receiptNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentCreationAttributes extends Omit<PaymentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number;
  public projectId!: number;
  public date!: Date;
  public amount!: number;
  public method!: string;
  public note?: string;
  public receiptNumber?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public static associations: {
    project: Association<Payment, Project>;
  };

  public static initModel(sequelize: Sequelize): typeof Payment {
    Payment.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        projectId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'projects',
            key: 'id'
          }
        },
        date: {
          type: DataTypes.DATE,
          allowNull: false
        },
        amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            min: 0.01
          }
        },
        method: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [2, 50]
          }
        },
        note: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        receiptNumber: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            len: [1, 50]
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
        modelName: 'Payment',
        tableName: 'payments',
        timestamps: true,
        indexes: [
          {
            fields: ['projectId']
          },
          {
            fields: ['date']
          },
          {
            fields: ['method']
          }
        ]
      }
    );

    return Payment;
  }

  public static associate(): void {
    Payment.belongsTo(Project, {
      foreignKey: 'projectId',
      as: 'project'
    });
  }
}