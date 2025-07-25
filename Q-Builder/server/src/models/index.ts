import { sequelize } from '../config/database';

// Import models
import { User } from './User';
import { Profession } from './Profession';
import { CatalogItem } from './CatalogItem';
import { Client } from './Client';
import { Quote } from './Quote';
import { QuoteItem } from './QuoteItem';
import { Project } from './Project';
import { Payment } from './Payment';

// Initialize models
User.initModel(sequelize);
Profession.initModel(sequelize);
CatalogItem.initModel(sequelize);
Client.initModel(sequelize);
Quote.initModel(sequelize);
QuoteItem.initModel(sequelize);
Project.initModel(sequelize);
Payment.initModel(sequelize);

// Define associations
User.associate();
Profession.associate();
CatalogItem.associate();
Client.associate();
Quote.associate();
QuoteItem.associate();
Project.associate();
Payment.associate();

export {
  User,
  Profession,
  CatalogItem,
  Client,
  Quote,
  QuoteItem,
  Project,
  Payment
};