/**
 * Punto de Entrada de la Aplicación
 * Main Entry Point
 */

require('dotenv').config();
const serverConfig = require('./config/server.config');
const { getInstance: getDbConnection } = require('./infrastructure/database/connection');

// Repositories
const UserRepository = require('./infrastructure/repositories/UserRepository');
const DashboardRepository = require('./infrastructure/repositories/DashboardRepository');

// Use Cases
const LoginUseCase = require('./application/use-cases/auth/LoginUseCase');
const GetDashboardDataUseCase = require('./application/use-cases/dashboard/GetDashboardDataUseCase');

// Controllers
const AuthController = require('./presentation/controllers/AuthController');
const DashboardController = require('./presentation/controllers/DashboardController');

// Routes
const routes = require('./presentation/routes');

// App
const App = require('./app');

/**
 * Inicializar aplicación
 */
async function startServer() {
  try {
    console.log('🚀 Iniciando servidor...\n');

    // Conectar a la base de datos
    const dbConnection = getDbConnection();
    await dbConnection.connect();

    // Inicializar repositorios
    const userRepository = new UserRepository(dbConnection);
    const dashboardRepository = new DashboardRepository();

    // Inicializar casos de uso
    const loginUseCase = new LoginUseCase(userRepository);
    const getDashboardDataUseCase = new GetDashboardDataUseCase(dashboardRepository);

    // Inicializar controladores
    const authController = new AuthController(loginUseCase);
    const dashboardController = new DashboardController(getDashboardDataUseCase);

    // Configurar rutas
    const appRoutes = routes(authController, dashboardController);

    // Crear aplicación
    const app = new App(appRoutes);
    const expressApp = app.getApp();

    // Iniciar servidor
    expressApp.listen(serverConfig.port, () => {
      console.log('✅ Servidor iniciado correctamente');
      console.log(`📡 Puerto: ${serverConfig.port}`);
      console.log(`🌍 URL: http://localhost:${serverConfig.port}`);
      console.log(`🗄️  Base de datos: ${process.env.DB_NAME || 'erp_pollo_fiesta'}`);
      console.log(`\n📚 Endpoints disponibles:`);
      console.log(`   POST   /api/auth/login`);
      console.log(`   POST   /api/auth/logout`);
      console.log(`   GET    /api/auth/verify`);
      console.log(`   GET    /api/dashboard/summary`);
      console.log(`   GET    /api/dashboard/:type`);
    });

    // Manejo de cierre graceful
    process.on('SIGINT', async () => {
      console.log('\n🛑 Cerrando servidor...');
      await dbConnection.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Iniciar
startServer();
