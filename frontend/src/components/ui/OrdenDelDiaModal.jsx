import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Circle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export function OrdenDelDiaModal({ isOpen, onClose }) {
  const [checkedItems, setCheckedItems] = useState(() => {
    const saved = localStorage.getItem('ordenDelDiaChecks');
    return saved ? JSON.parse(saved) : {};
  });

  const itemRefs = useRef({});
  const modalContentRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('ordenDelDiaChecks', JSON.stringify(checkedItems));
  }, [checkedItems]);

  useEffect(() => {
    if (isOpen && modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  const toggleCheck = (index) => {
    setCheckedItems(prev => ({ ...prev, [index]: !prev[index] }));
    setTimeout(() => {
      const nextNum = index + 1;
      if (itemRefs.current[nextNum]) {
        itemRefs.current[nextNum].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const agendaItems = [
    { num: 1,  text: 'Verificación del Quorum' },
    { num: 2,  text: 'Nombramiento del presidente y secretario de la Asamblea' },
    { num: 3,  text: 'Nombramiento de la comisión verificadora del acta' },
    { num: 4,  text: 'Lectura del Acta anterior' },
    { num: 5,  text: 'Informe de Gerencia de Mercadeo' },
    { num: 6,  text: 'Informe de Gestión de los Administradores' },
    { num: 7,  text: 'Informe del Revisor Fiscal' },
    { num: 8,  text: 'Estudio y aprobación de Estados Financieros a 31 de diciembre de 2025' },
    { num: 9,  text: 'Proyecto de distribución de utilidades' },
    { num: 10,  text: 'Elección junta directiva' },
    { num: 11, text: 'Elección del revisor Fiscal y asignación de honorarios' },
    { num: 12, text: 'Proposiciones y varios' },
    { num: 13, text: 'Aprobación y firma del acta de sesión' }
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
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header azul */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl relative flex-shrink-0">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4 pr-8">
                Orden del Día
              </h2>
              <div className="flex items-center justify-between text-white/90 text-xs sm:text-sm mb-2">
                <span>Progreso</span>
                <span>{completedCount} de {totalCount} completados</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </div>

            {/* Lista */}
            <div ref={modalContentRef} className="p-6 overflow-y-auto flex-1">
              <div className="space-y-2">
                {agendaItems.map((item) => {
                  const isChecked = checkedItems[item.num] || false;
                  return (
                    <div
                      key={item.num}
                      ref={(el) => { itemRefs.current[item.num] = el; }}
                      onClick={() => toggleCheck(item.num)}
                      className={`flex gap-3 items-start p-3 sm:p-4 rounded-lg transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-green-50 border-2 border-green-300'
                          : 'hover:bg-gray-50 border-2 border-transparent hover:border-gray-200'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {isChecked
                          ? <CheckCircle className="w-6 h-6 text-green-600" />
                          : <Circle className="w-6 h-6 text-gray-400" />
                        }
                      </div>
                      <span className={`font-bold flex-shrink-0 min-w-[2rem] ${isChecked ? 'text-green-600' : 'text-blue-600'}`}>
                        {item.num}.
                      </span>
                      <p className={`text-sm sm:text-base leading-relaxed ${isChecked ? 'text-green-700' : 'text-gray-700'}`}>
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold text-base transition-all shadow-lg"
                >
                  Continuar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
