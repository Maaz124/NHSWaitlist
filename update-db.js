const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection configuration
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'nhs_waitlist',
  user: 'nhs_user',
  password: 'nhs_password',
});

async function updateDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting database update using create-all-tables.sql...');
    
    // Read the create-all-tables.sql file
    const sqlFilePath = path.join(__dirname, 'create-all-tables.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('📝 Executing create-all-tables.sql...');
    
    // Split the SQL file into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`📝 Executing statement ${i + 1}/${statements.length}...`);
          await client.query(statement + ';');
          console.log(`✅ Statement ${i + 1} executed successfully`);
        } catch (error) {
          // If it's a "already exists" error, that's okay
          if (error.message.includes('already exists') || error.message.includes('does not exist')) {
            console.log(`⚠️  Statement ${i + 1} skipped (${error.message})`);
          } else {
            console.error(`❌ Error in statement ${i + 1}:`, error.message);
            throw error;
          }
        }
      }
    }
    
    // Verify tables were created
    console.log('📝 Verifying tables...');
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('📋 Available tables:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    console.log('🎉 Database update completed successfully!');
    
  } catch (error) {
    console.error('❌ Error updating database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the update
updateDatabase()
  .then(() => {
    console.log('✅ Database update script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database update script failed:', error);
    process.exit(1);
  });

