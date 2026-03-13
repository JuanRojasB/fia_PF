import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, CheckCircle2, Clock, Database, Info, X, Zap, Shield, Cloud, Video, FileText, Code } from 'lucide-react';

export default function TecnologiasInformacionDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  if (!data || !data.ecosistema) {
    return <div className="text-gray-600">No hay datos disponibles</div>;
  }

  const { proyectos } = data;

  // Iniciativas principales con íconos
  const iniciativas = [
    { 
      icono: FileText, 
      titulo: 'Digitalización', 
      descripcion: 'Tablas de retención para administración de áreas funcionales y perpetuidad de archivos laborales (90 años)',
      color: 'blue'
    },
    { 
      icono: Video, 
      titulo: 'CCTV', 
      descripcion: 'Circuito cerrado en oficina principal, sedes, plantas, puntos de venta y granjas avícolas',
      color: 'purple'
    },
    { 
      icono: Shield, 
      titulo: 'BOT Certificados', 
      descripcion: 'Automatización para certificados de calidad',
      color: 'green'
    },
    { 
      icono: Monitor, 
      titulo: 'Microsoft 365', 
      descripcion: 'Teams y herramientas de productividad para toda la organización',
      color: 'cyan'
    },
    { 
      icono: Database, 
      titulo: 'ERP ENTERPRISE', 
      descripcion: 'Sistema en nube para nómina, comercial y finanzas. En re-parametrización: Compras, Almacén, inventarios y mantenimiento',
      color: 'yellow'
    },
    { 
      icono: Code, 
      titulo: 'Power Apps', 
      descripcion: 'Desarrollo de aplicaciones internas personalizadas',
      color: 'orange'
    },
    { 
      icono: Cloud, 
      titulo: 'Backup OneDrive', 
      descripcion: 'Respaldo en nube con copia en servidor autónomo',
      color: 'indigo'
    }
  ];

  // Aplicaciones internas
  const aplicaciones = [
    'Manejo de agenda salas de capacitación',
    'Seguimiento Producto Congelado Sede 2',
    'Archivo Digital Versión 3.0',
    'Digiturno Cartera',
    'Verificador empleados activos e inactivos'
  ];

  // Sistemas principales
  const sistemas = [
    { nombre: 'CCTV', areas: ['POS', 'Proceso Procesados Despachos', 'Exteriores Bodega Angel Blanco'] },
    { nombre: 'SIESA', areas: ['Atención a cliente final interno'] },
    { nombre: 'Microsoft 365', areas: ['Backups One Drive', 'Power Apps', 'Power Automate'] },
    { nombre: 'BOT', areas: ['Envío automático de tarjetas de cumpleaños'] }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
      purple: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
      green: 'bg-green-500/20 border-green-500/50 text-green-400',
      cyan: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400',
      yellow: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
      orange: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
      indigo: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <Monitor className="w-10 h-10 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tecnologías de la Información</h1>
            <p className="text-gray-700 text-sm mt-1">Ecosistema Tecnológico Pollo Fiesta</p>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/95 rounded-xl p-5 border-4 border-green-500/30 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-7 h-7 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">Activos</h3>
          </div>
          <div className="text-3xl font-bold text-green-600">{proyectos.filter(p => p.estado === 'Activo').length}</div>
          <p className="text-xs text-gray-600 mt-1">Proyectos operando</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 rounded-xl p-5 border-4 border-yellow-500/30 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-7 h-7 text-yellow-600" />
            <h3 className="text-lg font-bold text-gray-900">En Desarrollo</h3>
          </div>
          <div className="text-3xl font-bold text-yellow-600">{proyectos.filter(p => p.estado === 'En Proceso').length}</div>
          <p className="text-xs text-gray-600 mt-1">Re-parametrización ERP</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/95 rounded-xl p-5 border-4 border-purple-500/30 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-7 h-7 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">Aplicaciones</h3>
          </div>
          <div className="text-3xl font-bold text-purple-600">{aplicaciones.length}</div>
          <p className="text-xs text-gray-600 mt-1">Desarrollos internos</p>
        </motion.div>
      </div>

      {/* Iniciativas Principales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 shadow-xl"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-600" />
          Iniciativas Tecnológicas
        </h2>
        
        <div className="space-y-3">
          {iniciativas.map((item, idx) => {
            const IconComponent = item.icono;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * idx }}
                className={`flex items-start gap-4 p-4 rounded-lg border ${getColorClasses(item.color)} hover:scale-[1.02] transition-all cursor-pointer`}
                onClick={() => openModal(item.titulo, item.descripcion)}
              >
                <div className="p-2 bg-white/95 rounded-lg flex-shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 mb-1">{item.titulo}</h3>
                  <p className="text-sm text-gray-700">{item.descripcion}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Sistemas del Ecosistema */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 shadow-xl"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Database className="w-6 h-6 text-purple-600" />
          Sistemas del Ecosistema
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sistemas.map((sistema, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
              className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg p-4 border border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
              onClick={() => openModal(
                sistema.nombre,
                `Sistema ${sistema.nombre} con las siguientes funcionalidades: ${sistema.areas.join(', ')}.`
              )}
            >
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-blue-400" />
                {sistema.nombre}
              </h3>
              <ul className="space-y-2">
                {sistema.areas.map((area, areaIdx) => (
                  <li key={areaIdx} className="text-sm text-gray-700 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Aplicaciones Internas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 shadow-xl"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Code className="w-6 h-6 text-orange-600" />
          Aplicaciones Internas Desarrolladas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {aplicaciones.map((app, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * idx }}
              className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg border border-slate-600 hover:border-orange-500 transition-all cursor-pointer"
              onClick={() => openModal(
                app,
                `Aplicación interna desarrollada para ${app.toLowerCase()}. Esta herramienta facilita las operaciones diarias y mejora la eficiencia del proceso.`
              )}
            >
              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span className="text-sm text-gray-700">{app}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-blue-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-gray-900 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-700 leading-relaxed">
                {modalContent.description}
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-gray-900 rounded-lg transition-colors font-semibold">
                  Entendido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
