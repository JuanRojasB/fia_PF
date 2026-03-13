import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Clock, CheckCircle, Circle } from 'lucide-react';
import { useState, useEffect } from 'react';

export function OrdenDelDiaModal({ isOpen, onClose }) {
  const [checkedItems, setCheckedItems] = useState(() => {
    // Cargar estado desde localStorage
    const saved = localStorage.getItem('ordenDelDiaChecks');
    return saved ? JSON.parse(saved) : {};
  });

  // Guardar en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('ordenDelDiaChecks', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const toggleCheck = (index) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const resetChecks = () => {
    setCheckedItems({});
    localStorage.removeItem('ordenDelDiaChecks');
  };

  const agendaItems = [
    { num: 1, text: 'Verificación del Quorum' },
    { num: 2, text: 'Nombramiento del presidente y secretario de la Asamblea' },
    { num: 3, text: 'Nombramiento de la comisión verificadora del acta' },
    { num: 4, text: 'Lectura del Acta anterior' },
    { num: 5, text: 'Informe de Gestión de los Administradores' },
    { num: 6, text: 'Informe del Revisor Fiscal' },
    { num: 7, text: 'Estudio y aprobación de Estados Financieros a 31 de diciembre de 2025' },
    { num: 8, text: 'Proyecto de distribución de utilidades' },
    { num: 9, text: 'Elección junta directiva' },
    { num: 10, text: 'Elección del revisor Fiscal y asignación de honorarios' },
    { num: 11, text: 'Proposiciones y varios' },
    { num: 12, text: 'Aprobación y firma del acta de sesión' }
  ];

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = agendaItems.length;
  const progress = (completedCount / totalCount) * 100;
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-gray-900/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-xl sm:rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header con gradiente azul */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6 lg:p-8 rounded-t-xl sm:rounded-t-2xl relative">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center pr-8 mb-3">
                Orden del Día
              </h2>
              
              {/* Barra de progreso */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-white/90 text-xs sm:text-sm mb-2">
                  <span>Progreso</span>
                  <span>{completedCount} de {totalCount} completados</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 sm:h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Información de la convocatoria */}
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2">
                  BOGOTÁ, D.C. REPÚBLICA DE COLOMBIA.
                </h3>
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 mb-1">
                  POLLO FIESTA S.A.
                </p>
              </div>

              {/* Información de la Asamblea */}
              <div className="bg-blue-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border-2 border-blue-200">
                <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 text-center">
                  Convocatoria Asamblea General de Accionistas
                </h4>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-gray-900">Fecha:</p>
                      <p className="text-sm sm:text-base text-gray-700">18 de marzo de 2026</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-gray-900">Hora:</p>
                      <p className="text-sm sm:text-base text-gray-700">8:00 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-gray-900">Lugar:</p>
                      <p className="text-sm sm:text-base text-gray-700">
                        Club los Lagartos<br />
                        Calle 116 No. 72A-80<br />
                        Sede Principal - Salón de Juegos
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-blue-300">
                    <p className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Periodo:</p>
                    <p className="text-sm sm:text-base text-gray-700">Contable 2025</p>
                  </div>
                </div>
              </div>

              {/* Título Orden del día */}
              <div className="mb-4 sm:mb-6">
                <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 text-center">
                  Orden del día
                </h4>
              </div>

              {/* Lista de puntos con checkboxes */}
              <div className="space-y-2 sm:space-y-3">
                {agendaItems.map((item) => {
                  const isChecked = checkedItems[item.num] || false;
                  
                  return (
                    <motion.div
                      key={item.num}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: item.num * 0.05 }}
                      onClick={() => toggleCheck(item.num)}
                      className={`flex gap-3 sm:gap-4 items-start p-3 sm:p-4 rounded-lg transition-all cursor-pointer ${
                        isChecked 
                          ? 'bg-green-50 border-2 border-green-300' 
                          : 'hover:bg-gray-50 border-2 border-transparent hover:border-gray-200'
                      }`}
                    >
                      {/* Checkbox */}
                      <div className="flex-shrink-0 mt-1">
                        {isChecked ? (
                          <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                        ) : (
                          <Circle className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                        )}
                      </div>
                      
                      {/* Número */}
                      <span className={`text-base sm:text-lg lg:text-xl font-bold flex-shrink-0 min-w-[2rem] sm:min-w-[2.5rem] ${
                        isChecked ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {item.num}.
                      </span>
                      
                      {/* Texto */}
                      <p className={`text-sm sm:text-base lg:text-lg leading-relaxed ${
                        isChecked ? 'text-green-700 line-through' : 'text-gray-700'
                      }`}>
                        {item.text}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Botones de acción */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                
                
                <button
                  onClick={onClose}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold text-base sm:text-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
