import { sequelize } from '../config/database';
import { User, Profession, CatalogItem, Client, Quote, Project, Payment } from '../models';

// כלי פשוט לצפייה בנתוני הדאטה בייס
export class DatabaseViewer {
  static async showAllTables() {
    try {
      await sequelize.authenticate();
      console.log('🔗 Connected to database successfully\n');

      // הצג סטטיסטיקות כלליות
      console.log('📊 Database Statistics:');
      console.log('='.repeat(50));
      
      const userCount = await User.count();
      const professionCount = await Profession.count();
      const catalogItemCount = await CatalogItem.count();
      const clientCount = await Client.count();
      const quoteCount = await Quote.count();
      const projectCount = await Project.count();
      const paymentCount = await Payment.count();

      console.log(`👥 Users: ${userCount}`);
      console.log(`🔧 Professions: ${professionCount}`);
      console.log(`📋 Catalog Items: ${catalogItemCount}`);
      console.log(`🏢 Clients: ${clientCount}`);
      console.log(`💰 Quotes: ${quoteCount}`);
      console.log(`🏗️ Projects: ${projectCount}`);
      console.log(`💳 Payments: ${paymentCount}`);
      console.log();

    } catch (error) {
      console.error('❌ Database connection failed:', error);
    }
  }

  static async showUsers() {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'businessName', 'provider', 'createdAt']
      });

      console.log('👥 Users Table:');
      console.log('='.repeat(80));
      console.table(users.map(user => ({
        ID: user.id,
        Name: user.name,
        Email: user.email,
        Business: user.businessName,
        Provider: user.provider,
        Created: user.createdAt.toLocaleDateString('he-IL')
      })));
    } catch (error) {
      console.error('❌ Error fetching users:', error);
    }
  }

  static async showProfessions() {
    try {
      const professions = await Profession.findAll();

      console.log('🔧 Professions Table:');
      console.log('='.repeat(60));
      console.table(professions.map(prof => ({
        ID: prof.id,
        Name: prof.name,
        Hebrew: prof.nameHebrew,
        Created: prof.createdAt.toLocaleDateString('he-IL')
      })));
    } catch (error) {
      console.error('❌ Error fetching professions:', error);
    }
  }

  static async showCatalogItems(professionId?: number) {
    try {
      const where = professionId ? { professionId } : {};
      const catalogItems = await CatalogItem.findAll({
        where,
        include: [{
          model: Profession,
          as: 'profession',
          attributes: ['name', 'nameHebrew']
        }],
        limit: 20
      });

      console.log('📋 Catalog Items Table:');
      console.log('='.repeat(100));
      console.table(catalogItems.map(item => ({
        ID: item.id,
        Name: item.name,
        Unit: item.unit,
        Price: item.defaultPrice ? `₪${item.defaultPrice}` : 'N/A',
        Profession: (item as any).profession?.nameHebrew || 'Unknown'
      })));
    } catch (error) {
      console.error('❌ Error fetching catalog items:', error);
    }
  }

  static async showClients(userId?: number) {
    try {
      const where = userId ? { userId } : {};
      const clients = await Client.findAll({
        where,
        attributes: ['id', 'name', 'email', 'phone', 'createdAt'],
        limit: 20
      });

      console.log('🏢 Clients Table:');
      console.log('='.repeat(80));
      console.table(clients.map(client => ({
        ID: client.id,
        Name: client.name,
        Email: client.email,
        Phone: client.phone,
        Created: client.createdAt.toLocaleDateString('he-IL')
      })));
    } catch (error) {
      console.error('❌ Error fetching clients:', error);
    }
  }

  static async showQuotes(userId?: number) {
    try {
      const where = userId ? { userId } : {};
      const quotes = await Quote.findAll({
        where,
        include: [{
          model: Client,
          as: 'client',
          attributes: ['name']
        }],
        attributes: ['id', 'quoteNumber', 'title', 'status', 'totalAmount', 'issueDate'],
        limit: 20
      });

      console.log('💰 Quotes Table:');
      console.log('='.repeat(100));
      console.table(quotes.map(quote => ({
        ID: quote.id,
        Number: quote.quoteNumber,
        Title: quote.title.substring(0, 30) + '...',
        Client: (quote as any).client?.name || 'Unknown',
        Status: quote.status,
        Amount: `₪${quote.totalAmount}`,
        Date: quote.issueDate.toLocaleDateString('he-IL')
      })));
    } catch (error) {
      console.error('❌ Error fetching quotes:', error);
    }
  }

  static async showProjects(userId?: number) {
    try {
      const where = userId ? { userId } : {};
      const projects = await Project.findAll({
        where,
        include: [{
          model: Client,
          as: 'client',
          attributes: ['name']
        }],
        attributes: ['id', 'name', 'status', 'budget', 'startDate'],
        limit: 20
      });

      console.log('🏗️ Projects Table:');
      console.log('='.repeat(100));
      console.table(projects.map(project => ({
        ID: project.id,
        Name: project.name.substring(0, 30) + '...',
        Client: (project as any).client?.name || 'Unknown',
        Status: project.status,
        Budget: `₪${project.budget}`,
        Started: project.startDate.toLocaleDateString('he-IL')
      })));
    } catch (error) {
      console.error('❌ Error fetching projects:', error);
    }
  }

  static async showPayments(projectId?: number) {
    try {
      const where = projectId ? { projectId } : {};
      const payments = await Payment.findAll({
        where,
        include: [{
          model: Project,
          as: 'project',
          attributes: ['name']
        }],
        attributes: ['id', 'amount', 'method', 'date'],
        limit: 20
      });

      console.log('💳 Payments Table:');
      console.log('='.repeat(80));
      console.table(payments.map(payment => ({
        ID: payment.id,
        Project: (payment as any).project?.name?.substring(0, 20) + '...' || 'Unknown',
        Amount: `₪${payment.amount}`,
        Method: payment.method,
        Date: payment.date.toLocaleDateString('he-IL')
      })));
    } catch (error) {
      console.error('❌ Error fetching payments:', error);
    }
  }

  static async runQuery(sql: string) {
    try {
      const [results] = await sequelize.query(sql);
      console.log('🔍 Query Results:');
      console.log('='.repeat(60));
      console.table(results);
    } catch (error) {
      console.error('❌ Query failed:', error);
    }
  }
}

// פונקציה ראשית להפעלה מהטרמינל
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'stats':
      await DatabaseViewer.showAllTables();
      break;
    case 'users':
      await DatabaseViewer.showUsers();
      break;
    case 'professions':
      await DatabaseViewer.showProfessions();
      break;
    case 'catalog':
      const professionId = args[1] ? parseInt(args[1]) : undefined;
      await DatabaseViewer.showCatalogItems(professionId);
      break;
    case 'clients':
      const userId = args[1] ? parseInt(args[1]) : undefined;
      await DatabaseViewer.showClients(userId);
      break;
    case 'quotes':
      const quoteUserId = args[1] ? parseInt(args[1]) : undefined;
      await DatabaseViewer.showQuotes(quoteUserId);
      break;
    case 'projects':
      const projectUserId = args[1] ? parseInt(args[1]) : undefined;
      await DatabaseViewer.showProjects(projectUserId);
      break;
    case 'payments':
      const projectId = args[1] ? parseInt(args[1]) : undefined;
      await DatabaseViewer.showPayments(projectId);
      break;
    case 'query':
      const sql = args.slice(1).join(' ');
      if (sql) {
        await DatabaseViewer.runQuery(sql);
      } else {
        console.log('❌ Please provide a SQL query');
      }
      break;
    default:
      console.log('📖 Q-Builder Database Viewer');
      console.log('Usage: npx tsx src/utils/db-viewer.ts <command>');
      console.log('');
      console.log('Commands:');
      console.log('  stats                    - Show database statistics');
      console.log('  users                    - Show all users');
      console.log('  professions              - Show all professions');
      console.log('  catalog [professionId]   - Show catalog items');
      console.log('  clients [userId]         - Show clients');
      console.log('  quotes [userId]          - Show quotes');
      console.log('  projects [userId]        - Show projects');
      console.log('  payments [projectId]     - Show payments');
      console.log('  query "SELECT * FROM..." - Run custom SQL query');
      console.log('');
      console.log('Examples:');
      console.log('  npx tsx src/utils/db-viewer.ts stats');
      console.log('  npx tsx src/utils/db-viewer.ts catalog 1');
      console.log('  npx tsx src/utils/db-viewer.ts query "SELECT * FROM users LIMIT 5"');
  }

  await sequelize.close();
  process.exit(0);
}

if (require.main === module) {
  main().catch(console.error);
}