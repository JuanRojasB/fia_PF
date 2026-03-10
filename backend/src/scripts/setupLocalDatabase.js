/**
 * Script para configurar la base de datos local
 * 1. Crea la base de datos si no existe
 * 2. Ejecuta el script SQL completo
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupLocalDatabase() {
  console.log('🚀 Configurando base de datos local...\n');
  
  const dbConfig = {
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '',
    port: parseInt(process.env.MYSQLPORT || '3306', 10),
    multipleStatements: true
  };

  const dbName = process.env.MYSQLDATABASE || 'fia_pollo_fiesta';

  console.log('📋 Configuración:');
  console.log(`   Host: ${dbConfig.host}`);
  console.log(`   User: ${dbConfig.user}`);
  console.log(`   Port: ${dbConfig.port}`);
  console.log(`   Database: ${dbName}\n`);

  let connection;

  try {
    // Conectar sin especificar base de datos
    console.log('⏳ Conectando a MySQL...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado a MySQL\n');

    // Crear base de datos si no existe
    console.log(`📦 Creando base de datos '${dbName}' si no existe...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log('✅ Base de datos lista\n');

    // Usar la base de datos
    await connection.query(`USE \`${dbName}\``);

    // Leer el archivo SQL
    const sqlFilePath = path.join(__dirname, '../infrastructure/database/create_tables.sql');
    console.log(`📄 Leyendo archivo: ${sqlFilePath}\n`);
    
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Dividir el contenido en statements individuales
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => {
        return stmt.length > 0 && 
               !stmt.startsWith('--') && 
               !stmt.startsWith('/*') &&
               !stmt.includes('CREATE DATABASE') &&
               !stmt.includes('USE gestion_corporativa_pulida');
      });

    console.log(`📊 Total de statements a ejecutar: ${statements.length}\n`);
    console.log('⏳ Ejecutando statements...\n');

    let successCount = 0;
    let errorCount = 0;
    let currentTable = '';
    let insertCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      
      if (!statement) continue;

      try {
        // Detectar qué tabla se está procesando
        if (statement.toUpperCase().includes('DROP TABLE')) {
          const match = statement.match(/DROP TABLE IF EXISTS (\w+)/i);
          if (match) {
            currentTable = match[1];
          }
        } else if (statement.toUpperCase().includes('CREATE TABLE')) {
          const match = statement.match(/CREATE TABLE (\w+)/i);
          if (match) {
            currentTable = match[1];
            console.log(`📦 Creando tabla: ${currentTable}`);
          }
        } else if (statement.toUpperCase().includes('INSERT INTO')) {
          const match = statement.match(/INSERT INTO (\w+)/i);
          if (match && match[1] !== currentTable) {
            if (insertCount > 0) {
              console.log(`   ✅ ${insertCount} registros insertados en ${currentTable}`);
            }
            currentTable = match[1];
            insertCount = 0;
            console.log(`📝 Insertando datos en: ${currentTable}`);
          }
          insertCount++;
        }

        await connection.query(statement + ';');
        successCount++;

        // Mostrar progreso cada 100 statements
        if ((i + 1) % 100 === 0) {
          console.log(`   Progreso: ${i + 1}/${statements.length} (${((i + 1) / statements.length * 100).toFixed(1)}%)`);
        }

      } catch (error) {
        errorCount++;
        
        // Solo mostrar errores críticos
        if (!error.message.includes('Unknown table') && 
            !error.message.includes("doesn't exist")) {
          console.error(`\n❌ Error en statement ${i + 1}:`);
          console.error(`   Statement: ${statement.substring(0, 100)}...`);
          console.error(`   Error: ${error.message}\n`);
        }
      }
    }

    if (insertCount > 0) {
      console.log(`   ✅ ${insertCount} registros insertados en ${currentTable}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN');
    console.log('='.repeat(60));
    console.log(`✅ Statements exitosos: ${successCount}`);
    console.log(`❌ Statements con error: ${errorCount}`);
    console.log(`📈 Tasa de éxito: ${(successCount / statements.length * 100).toFixed(2)}%`);
    console.log('='.repeat(60) + '\n');

    // Verificar tablas creadas
    console.log('🔍 Verificando tablas creadas...\n');
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`✅ Total de tablas: ${tables.length}\n`);
    
    console.log('📋 Tablas creadas:');
    for (let i = 0; i < tables.length; i++) {
      const tableName = Object.values(tables[i])[0];
      
      // Contar registros
      try {
        const [countResult] = await connection.query(`SELECT COUNT(*) as total FROM \`${tableName}\``);
        const count = countResult[0].total || 0;
        console.log(`   ${(i + 1).toString().padStart(2)}. ${tableName.padEnd(40)} (${count} registros)`);
      } catch (error) {
        console.log(`   ${(i + 1).toString().padStart(2)}. ${tableName.padEnd(40)} (error al contar)`);
      }
    }

    console.log('\n✅ ¡Base de datos local configurada exitosamente!\n');
    console.log('🚀 Ahora puedes ejecutar:');
    console.log('   npm start      - Para iniciar el servidor');
    console.log('   npm run dev    - Para modo desarrollo\n');

  } catch (error) {
    console.error('\n❌ Error fatal:');
    console.error(error);
    console.error('\n💡 Verifica que:');
    console.error('   1. MySQL esté instalado y corriendo');
    console.error('   2. Las credenciales en .env sean correctas');
    console.error('   3. El usuario tenga permisos para crear bases de datos\n');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Ejecutar
setupLocalDatabase();
