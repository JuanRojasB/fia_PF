/**
 * Exporta la base de datos local data_dashboard a un archivo SQL
 * Para importar después en Railway u otro servidor
 * 
 * Uso: node src/scripts/exportDatabase.js
 * Requiere: DB local en localhost, user root, sin contraseña, base data_dashboard
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'data_dashboard',
  port: parseInt(process.env.DB_PORT || '3306', 10)
};

async function exportDatabase() {
  let connection;
  try {
    console.log('🔌 Conectando a', config.host, '...');
    connection = await mysql.createConnection(config);
    console.log('✅ Conectado a', config.database, '\n');

    const [tables] = await connection.query('SHOW TABLES');
    const tableKey = `Tables_in_${config.database}`;
    const tableNames = tables.map(t => t[tableKey]);

    if (tableNames.length === 0) {
      console.log('⚠️  No hay tablas en la base de datos.');
      return;
    }

    console.log('📋 Tablas encontradas:', tableNames.join(', '), '\n');

    let sql = `-- Exportado desde ${config.database} - ${new Date().toISOString()}\n`;
    sql += 'SET NAMES utf8mb4;\nSET FOREIGN_KEY_CHECKS = 0;\n\n';

    for (const table of tableNames) {
      console.log('  Exportando:', table);

      const [createRows] = await connection.query(`SHOW CREATE TABLE \`${table}\``);
      const createSql = createRows[0]['Create Table'];
      sql += `-- Tabla: ${table}\n`;
      sql += `DROP TABLE IF EXISTS \`${table}\`;\n`;
      sql += createSql + ';\n\n';

      const [rows] = await connection.query(`SELECT * FROM \`${table}\``);
      if (rows.length > 0) {
        const columns = Object.keys(rows[0]);
        const colList = columns.map(c => `\`${c}\``).join(', ');

        for (const row of rows) {
          const values = columns.map(col => {
            const val = row[col];
            if (val === null) return 'NULL';
            if (typeof val === 'number') return val;
            return connection.escape(val);
          });
          sql += `INSERT INTO \`${table}\` (${colList}) VALUES (${values.join(', ')});\n`;
        }
        sql += '\n';
      }
    }

    sql += 'SET FOREIGN_KEY_CHECKS = 1;\n';

    const outputPath = path.join(__dirname, '../../database_export.sql');
    fs.writeFileSync(outputPath, sql, 'utf8');
    console.log('\n✅ Exportado a:', outputPath);
    console.log('   Puedes importar este archivo en Railway con MySQL Workbench o:');
    console.log('   mysql -h HOST -P PORT -u root -p railway < backend/database_export.sql');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

exportDatabase();
