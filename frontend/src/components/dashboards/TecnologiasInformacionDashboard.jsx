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

  // Iniciativas principales con íconos (del texto original)
  const iniciativas = [
    { 
      icono: FileText, 
      titulo: 'Digitalización', 
      descripcion: 'Digitalización con enfoque a las tablas de retención para la administración de áreas funcionales, la perpetuidad de los archivos laborales (90 años), sobre gestión documental por procesos misionales.',
      color: 'blue'
    },
    { 
      icono: Video, 
      titulo: 'CCTV', 
      descripcion: 'Sistemas de Circuito cerrado de televisión – CCTV, sede oficina principal, sedes, plantas de procesos, puntos de venta y granjas avícolas.',
      color: 'purple'
    },
    { 
      icono: Shield, 
      titulo: 'BOT Certificados', 
      descripcion: 'Se cuenta el BOT para certificados de calidad.',
      color: 'green'
    },
    { 
      icono: Monitor, 
      titulo: 'Microsoft 365', 
      descripcion: 'Se utiliza la herramienta de Microsoft Teams, Microsoft 365 para toda la organización.',
      color: 'cyan'
    },
    { 
      icono: Zap, 
      titulo: 'Redes Estructuradas', 
      descripcion: 'Se realizó el montaje de redes estructuradas con personal propio en la bodega ANGEL BLANCO, antes vanti.',
      color: 'pink'
    },
    { 
      icono: Database, 
      titulo: 'ERP ENTERPRISE', 
      descripcion: 'El sistema de información con su nube (cloud) navega con el ERP ENTERPRISE, en sus aplicativos de nómina, comercial y finanzas. Se encuentra en proceso de Re-parametrización el área de: Compras, Almacén, inventarios y mantenimiento.',
      color: 'yellow'
    },
    { 
      icono: Code, 
      titulo: 'Power Apps', 
      descripcion: 'Powers apps para desarrollo de aplicaciones.',
      color: 'orange'
    },
    { 
      icono: Cloud, 
      titulo: 'Backup OneDrive', 
      descripcion: 'Backup en OneDrive (nube) con su copia de respaldo en un servidor propio autónomo para la información de la empresa.',
      color: 'indigo'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'border-blue-500/50 hover:border-blue-500',
      purple: 'border-purple-500/50 hover:border-purple-500',
      green: 'border-green-500/50 hover:border-green-500',
      cyan: 'border-cyan-500/50 hover:border-cyan-500',
      yellow: 'border-yellow-500/50 hover:border-yellow-500',
      orange: 'border-orange-500/50 hover:border-orange-500',
      indigo: 'border-indigo-500/50 hover:border-indigo-500',
      pink: 'border-pink-500/50 hover:border-pink-500'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Descripción */}
      <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-6 border border-blue-300">
        <p className="text-gray-700">Ecosistema tecnológico integral que incluye digitalización de procesos, CCTV en todas las sedes, ERP ENTERPRISE en nube, Microsoft 365, Power Apps y sistemas de backup. Transformación digital continua para mejorar trazabilidad y control.</p>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <Monitor className="w-10 h-10 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ecosistema Tecnológico</h1>
            <p className="text-gray-700 text-sm mt-1">Infraestructura y Aplicaciones</p>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal(
            'Proyectos Activos',
            `Actualmente hay ${proyectos.filter(p => p.estado === 'Activo').length} proyectos tecnológicos operando de forma activa según el texto original: Digitalización con enfoque a las tablas de retención para la administración de áreas funcionales y la perpetuidad de los archivos laborales (90 años), Sistemas de Circuito cerrado de televisión (CCTV) en sede oficina principal, sedes, plantas de procesos, puntos de venta y granjas avícolas, BOT para certificados de calidad, Microsoft Teams y Microsoft 365 para toda la organización, Montaje de redes estructuradas con personal propio en la bodega ANGEL BLANCO, Power Apps para desarrollo de aplicaciones, y Backup en OneDrive (nube) con su copia de respaldo en un servidor propio autónomo para la información de la empresa.`
          )}
          className="bg-white/95 rounded-xl p-5 border-4 border-green-500/30 shadow-lg cursor-pointer hover:border-green-500 transition-all"
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
          onClick={() => openModal(
            'Proyectos En Desarrollo',
            `Actualmente hay ${proyectos.filter(p => p.estado === 'En Proceso').length} proyecto en desarrollo activo. El ERP ENTERPRISE está en proceso de re-parametrización para los módulos de Compras, Almacén, Inventarios y Mantenimiento. Este sistema en nube ya opera exitosamente para Nómina, Comercial y Finanzas. La re-parametrización busca integrar completamente todos los procesos operativos de la empresa en una sola plataforma, mejorando la trazabilidad, control y eficiencia en la gestión de recursos. Se espera completar esta fase durante el año en curso para tener un ERP completamente integrado.`
          )}
          className="bg-white/95 rounded-xl p-5 border-4 border-yellow-500/30 shadow-lg cursor-pointer hover:border-yellow-500 transition-all"
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
          onClick={() => openModal(
            'Iniciativas Tecnológicas',
            `El dashboard muestra ${iniciativas.length} iniciativas tecnológicas principales implementadas en la organización: Digitalización, CCTV, BOT Certificados, Microsoft 365, Redes Estructuradas, ERP ENTERPRISE, Power Apps y Backup OneDrive. Cada una de estas iniciativas contribuye a la transformación digital de la empresa, mejorando la eficiencia operativa, la trazabilidad de procesos y la seguridad de la información. Haga clic en cada iniciativa para ver su descripción completa.`
          )}
          className="bg-white/95 rounded-xl p-5 border-4 border-purple-500/30 shadow-lg cursor-pointer hover:border-purple-500 transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-7 h-7 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">Iniciativas</h3>
          </div>
          <div className="text-3xl font-bold text-purple-600">{iniciativas.length}</div>
          <p className="text-xs text-gray-600 mt-1">Proyectos tecnológicos</p>
        </motion.div>
      </div>

      {/* Iniciativas Tecnológicas */}
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {iniciativas.map((item, idx) => {
            const IconComponent = item.icono;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * idx }}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 ${getColorClasses(item.color)} hover:scale-[1.02] transition-all cursor-pointer`}
                onClick={() => openModal(item.titulo, item.descripcion)}
              >
                <div className="p-2 bg-white/95 rounded-lg flex-shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900">{item.titulo}</h3>
              </motion.div>
            );
          })}
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
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold">
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
