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

  // Iniciativas principales con íconos (actualizado 2025)
  const iniciativas = [
    { 
      icono: FileText, 
      titulo: 'Transformación Digital', 
      descripcion: 'Digitalización con enfoque en tablas de retención documental, garantizando administración eficiente de áreas funcionales, cumplimiento normativo para la perpetuidad de archivos laborales (90 años) e implementación de criterios de gestión documental por procesos misionales, fortaleciendo la trazabilidad y control de información estratégica.',
      color: 'blue'
    },
    { 
      icono: Video, 
      titulo: 'Seguridad y CCTV', 
      descripcion: 'Consolidación de infraestructura de videovigilancia mediante implementación y mantenimiento del Sistema de Circuito Cerrado de Televisión (CCTV) en oficina principal, sedes administrativas, plantas de proceso, puntos de venta y granjas avícolas. Incremento de niveles de seguridad, control operativo y monitoreo preventivo en toda la cadena empresarial.',
      color: 'purple'
    },
    { 
      icono: Zap, 
      titulo: 'Automatización', 
      descripcion: 'Puesta en marcha del BOT para la emisión de certificados de calidad, reduciendo tiempos de respuesta y aumentando la eficiencia documental. Desarrollo continuo con Microsoft Power Apps para aplicaciones internas personalizadas según las necesidades de áreas operativas y administrativas.',
      color: 'green'
    },
    { 
      icono: Monitor, 
      titulo: 'Microsoft 365', 
      descripcion: 'Consolidación del uso institucional de Microsoft Teams como plataforma de reuniones, comunicación y trabajo colaborativo, y Microsoft 365 como suite principal de productividad, garantizando acceso seguro, licenciamiento formal y operación remota estable.',
      color: 'cyan'
    },
    { 
      icono: Cloud, 
      titulo: 'Backup y Continuidad', 
      descripcion: 'Todos los usuarios cuentan con Backup en OneDrive (nube) con copia de respaldo automática, fortaleciendo la continuidad del negocio y la seguridad de la información.',
      color: 'indigo'
    },
    { 
      icono: Database, 
      titulo: 'ERP ENTERPRISE', 
      descripcion: 'Mantenimiento de la operación del sistema empresarial basado en ERP ENTERPRISE, alojado en infraestructura cloud, con integración plena en Nómina, Comercial y Finanzas.',
      color: 'yellow'
    },
    { 
      icono: Code, 
      titulo: 'Marketplace Corporativo', 
      descripcion: 'Construcción del Marketplace corporativo, una plataforma orientada a fortalecer la visibilidad comercial, la interacción con clientes y la integración de canales digitales para ventas. Proyecto clave para la modernización digital y la expansión comercial.',
      color: 'orange'
    },
    { 
      icono: Shield, 
      titulo: 'Seguridad Informática', 
      descripcion: 'Fortalecimiento de la seguridad informática y física, consolidación de plataformas en cloud y continuidad operativa basada en buenas prácticas digitales.',
      color: 'pink'
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
        <p className="text-gray-700">Durante el año 2025, el Departamento de Tecnologías de la Información desarrolló y fortaleció múltiples iniciativas orientadas a la transformación digital, la modernización operativa y la seguridad tecnológica. Se destacan: modernización tecnológica, automatización de procesos, seguridad informática y física fortalecida, consolidación de plataformas en cloud y continuidad operativa basada en buenas prácticas digitales.</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Tecnologías de la Información 2025</h1>
            <p className="text-gray-700 text-sm mt-1">Transformación Digital y Modernización Operativa</p>
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
            'Proyectos Activos 2025',
            `Durante el año 2025 se consolidaron ${proyectos.filter(p => p.estado === 'Activo').length} proyectos tecnológicos activos: Transformación Digital y Gestión Documental (digitalización con tablas de retención, cumplimiento normativo 90 años), Fortalecimiento de Seguridad y Supervisión Tecnológica (CCTV en toda la cadena empresarial), Automatización y Eficiencia Operativa (BOT certificados de calidad, Power Apps), Uso Corporativo de Plataformas Microsoft (Teams, 365, OneDrive con backup automático), Gestión de Sistemas ERP ENTERPRISE (nómina, comercial, finanzas en cloud), y Desarrollo del Marketplace Corporativo (plataforma para visibilidad comercial y ventas digitales).`
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
            'Marketplace Corporativo - En Desarrollo',
            `Durante el año 2025 se avanzó en la construcción del Marketplace corporativo, una plataforma orientada a fortalecer la visibilidad comercial, la interacción con clientes y la integración de canales digitales para ventas. Este proyecto es clave para la modernización digital y la expansión comercial de la organización. El Marketplace permitirá a los clientes acceder a productos, realizar pedidos en línea y gestionar sus compras de forma digital, integrándose con el ERP ENTERPRISE para una operación fluida. Se espera completar el desarrollo e implementación durante 2026.`
          )}
          className="bg-white/95 rounded-xl p-5 border-4 border-yellow-500/30 shadow-lg cursor-pointer hover:border-yellow-500 transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-7 h-7 text-yellow-600" />
            <h3 className="text-lg font-bold text-gray-900">En Desarrollo</h3>
          </div>
          <div className="text-3xl font-bold text-yellow-600">{proyectos.filter(p => p.estado === 'En Proceso').length}</div>
          <p className="text-xs text-gray-600 mt-1">Marketplace Corporativo</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal(
            'Iniciativas Tecnológicas 2025',
            `El año 2025 representó un periodo de importantes avances con ${iniciativas.length} iniciativas tecnológicas principales: Transformación Digital (gestión documental), Seguridad y CCTV (videovigilancia integral), Automatización (BOT y Power Apps), Microsoft 365 (Teams y suite de productividad), Backup y Continuidad (OneDrive automático), ERP ENTERPRISE (nómina, comercial, finanzas), Marketplace Corporativo (plataforma de ventas digitales) y Seguridad Informática (fortalecimiento integral). Los logros alcanzados contribuyen directamente a la eficiencia operativa, la mejora de procesos empresariales y la preparación de la organización para los retos tecnológicos del 2026.`
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
