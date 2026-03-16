import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Circle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export function OrdenDelDiaModal({ isOpen, onClose }) {
  const [checkedItems, setCheckedItems] = useState(() => {
    const saved = localStorage.getItem('ordenDelDiaChecks');
    return saved ? JSON.parse(saved) : {};
  });

  const [showQuorumModal, setShowQuorumModal] = useState(false);
  const [selectedAccionistas, setSelectedAccionistas] = useState([]);

  const itemRefs = useRef({});
  const modalContentRef = useRef(null);

  // Datos de accionistas
  const accionistas = [
    { nombre: 'INVERSIONES LILLY SAS', participacion: 14.29 },
    { nombre: 'INVERSIONES PROJEKTE SAS', participacion: 14.29 },
    { nombre: 'FENISY SAS', participacion: 14.29 },
    { nombre: 'DAVID ERNESTO CAMACHO', participacion: 2.46 },
    { nombre: 'LORENA CAMACHO ROA', participacion: 2.46 },
    { nombre: 'INVERSIONES AMLODA SAS', participacion: 9.36 },
    { nombre: 'MARIA CLEMENCIA ROA BARRERA', participacion: 4.92 },
    { nombre: 'DANIEL ROJAS ROA', participacion: 4.68 },
    { nombre: 'LAURA JIMENA ROJAS ROA', participacion: 4.68 },
    { nombre: 'LUZ MARINA ROA BARRERA', participacion: 0.99 },
    { nombre: 'UNION RB S.A.S.', participacion: 13.3 },
    { nombre: 'CARLOS ERNESTO ROA BARRERA', participacion: 1.97 },
    { nombre: 'MAFERCAR SAS', participacion: 12.32 }
  ];

  const totalParticipacion = selectedAccionistas.reduce((sum, idx) => sum + accionistas[idx].participacion, 0);
  const quorumAlcanzado = totalParticipacion >= 51;

  // Abrir automáticamente el modal de quórum si no está verificado
  useEffect(() => {
    if (isOpen && !checkedItems[1]) {
      setShowQuorumModal(true);
    }
  }, [isOpen, checkedItems]);

  useEffect(() => {
    localStorage.setItem('ordenDelDiaChecks', JSON.stringify(checkedItems));
  }, [checkedItems]);

  useEffect(() => {
    if (isOpen && modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  // Bloquear tecla ESC si el quórum no está verificado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !checkedItems[1]) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown, true);
      document.addEventListener('keydown', handleKeyDown, true);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen, checkedItems]);

  // Prevenir cierre del navegador/pestaña si el quórum no está verificado
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isOpen && !checkedItems[1]) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    if (isOpen && !checkedItems[1]) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isOpen, checkedItems]);

  const toggleCheck = (index) => {
    if (index === 1) {
      // Si es "Verificación del Quorum", abrir el modal de quórum
      setShowQuorumModal(true);
    } else {
      // Solo permitir marcar otros items si el quórum ya fue verificado
      if (!checkedItems[1]) {
        // Si el quórum no ha sido verificado, no permitir avanzar
        return;
      }
      setCheckedItems(prev => ({ ...prev, [index]: !prev[index] }));
      setTimeout(() => {
        const nextNum = index + 1;
        if (itemRefs.current[nextNum]) {
          itemRefs.current[nextNum].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const toggleAccionista = (idx) => {
    setSelectedAccionistas(prev => {
      if (prev.includes(idx)) {
        return prev.filter(i => i !== idx);
      } else {
        return [...prev, idx];
      }
    });
  };

  const confirmarQuorum = () => {
    // Verificación estricta: solo confirmar si se alcanza el 51%
    if (!quorumAlcanzado || totalParticipacion < 51) {
      return;
    }
    setCheckedItems(prev => ({ ...prev, 1: true }));
    setShowQuorumModal(false);
    setTimeout(() => {
      if (itemRefs.current[2]) {
        itemRefs.current[2].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleCloseAttempt = () => {
    // Solo permitir cerrar si el quórum está verificado
    if (checkedItems[1]) {
      onClose();
    }
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

  const isQuorumVerified = checkedItems[1] || false;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm"
          onClick={handleCloseAttempt}
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
              {isQuorumVerified ? (
                <button
                  onClick={handleCloseAttempt}
                  className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              ) : (
                <div className="absolute top-4 right-4 text-white/30 p-1 cursor-not-allowed" title="Debe verificar el quórum primero">
                  <X className="w-5 h-5" />
                </div>
              )}
              <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4 pr-8">
                Orden del Día
              </h2>
              {!isQuorumVerified && (
                <p className="text-yellow-200 text-xs text-center mb-3 font-semibold">
                  ⚠️ Debe verificar el quórum (ítem 1) antes de continuar
                </p>
              )}
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
                  const isQuorumVerified = checkedItems[1] || false;
                  const isDisabled = item.num > 1 && !isQuorumVerified;
                  
                  return (
                    <div
                      key={item.num}
                      ref={(el) => { itemRefs.current[item.num] = el; }}
                      onClick={() => !isDisabled && toggleCheck(item.num)}
                      className={`flex gap-3 items-start p-3 sm:p-4 rounded-lg transition-all ${
                        isDisabled
                          ? 'opacity-50 cursor-not-allowed bg-gray-100'
                          : isChecked
                          ? 'bg-green-50 border-2 border-green-300 cursor-pointer'
                          : 'hover:bg-gray-50 border-2 border-transparent hover:border-gray-200 cursor-pointer'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {isChecked
                          ? <CheckCircle className="w-6 h-6 text-green-600" />
                          : <Circle className={`w-6 h-6 ${isDisabled ? 'text-gray-300' : 'text-gray-400'}`} />
                        }
                      </div>
                      <span className={`font-bold flex-shrink-0 min-w-[2rem] ${
                        isDisabled ? 'text-gray-400' : isChecked ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {item.num}.
                      </span>
                      <div className="flex-1">
                        <p className={`text-sm sm:text-base leading-relaxed ${
                          isDisabled ? 'text-gray-400' : isChecked ? 'text-green-700' : 'text-gray-700'
                        }`}>
                          {item.text}
                        </p>
                        {isDisabled && item.num === 2 && (
                          <p className="text-xs text-red-500 mt-1">
                            ⚠️ Debe verificar el quórum primero (mínimo 51%)
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleCloseAttempt}
                  disabled={!isQuorumVerified}
                  className={`px-8 py-3 rounded-xl font-semibold text-base transition-all shadow-lg ${
                    isQuorumVerified
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  title={!isQuorumVerified ? 'Debe verificar el quórum primero' : ''}
                >
                  Continuar
                </button>
              </div>
            </div>
          </motion.div>

          {/* Modal de Verificación de Quórum */}
          <AnimatePresence>
            {showQuorumModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-black/50"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 relative">
                    {quorumAlcanzado && (
                      <button
                        onClick={() => setShowQuorumModal(false)}
                        className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    <h3 className="text-xl font-bold text-white text-center">Verificación del Quórum</h3>
                    <p className="text-white/90 text-sm text-center mt-2">
                      Seleccione los accionistas presentes (mínimo 51%)
                    </p>
                    {!quorumAlcanzado && (
                      <p className="text-yellow-200 text-xs text-center mt-2 font-semibold">
                        ⚠️ No puede cerrar este modal hasta alcanzar el 51%
                      </p>
                    )}
                    <div className="mt-3 bg-white/20 rounded-lg p-3">
                      <div className="flex justify-between text-white text-sm mb-1">
                        <span>Participación Total:</span>
                        <span className="font-bold">{totalParticipacion.toFixed(2)}%</span>
                      </div>
                      <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
                        <motion.div
                          animate={{ width: `${Math.min(totalParticipacion, 100)}%` }}
                          className={`h-full rounded-full transition-colors ${
                            quorumAlcanzado ? 'bg-green-300' : 'bg-yellow-300'
                          }`}
                        />
                      </div>
                      <p className="text-white/90 text-xs text-center mt-1">
                        {quorumAlcanzado ? '✓ Quórum alcanzado' : `Faltan ${(51 - totalParticipacion).toFixed(2)}% para el quórum`}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 overflow-y-auto max-h-[50vh]">
                    <div className="space-y-2">
                      {accionistas.map((accionista, idx) => {
                        const isSelected = selectedAccionistas.includes(idx);
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleAccionista(idx)}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-green-50 border-2 border-green-300'
                                : 'hover:bg-gray-50 border-2 border-transparent hover:border-gray-200'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                            />
                            <div className="flex-1">
                              <p className={`text-sm font-semibold ${isSelected ? 'text-green-700' : 'text-gray-900'}`}>
                                {accionista.nombre}
                              </p>
                            </div>
                            <span className={`text-sm font-bold ${isSelected ? 'text-green-600' : 'text-gray-600'}`}>
                              {accionista.participacion}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-200 flex gap-3">
                    <button
                      onClick={quorumAlcanzado ? confirmarQuorum : undefined}
                      disabled={!quorumAlcanzado}
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                        quorumAlcanzado
                          ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      title={!quorumAlcanzado ? `Debe alcanzar el 51% (actual: ${totalParticipacion.toFixed(2)}%)` : ''}
                    >
                      Confirmar
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
