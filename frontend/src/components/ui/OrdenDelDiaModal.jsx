import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Circle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import acta1 from '../../assets/ACTA N° 42 ASAMBLEA GNRAL ORD ACC miercoles 19 mar2025 esfa 2024-2023_page-0001.jpg';
import acta2 from '../../assets/ACTA N° 42 ASAMBLEA GNRAL ORD ACC miercoles 19 mar2025 esfa 2024-2023_page-0002.jpg';
import acta3 from '../../assets/ACTA N° 42 ASAMBLEA GNRAL ORD ACC miercoles 19 mar2025 esfa 2024-2023_page-0003.jpg';
import acta4 from '../../assets/ACTA N° 42 ASAMBLEA GNRAL ORD ACC miercoles 19 mar2025 esfa 2024-2023_page-0004.jpg';
import acta5 from '../../assets/ACTA N° 42 ASAMBLEA GNRAL ORD ACC miercoles 19 mar2025 esfa 2024-2023_page-0005.jpg';
import acta6 from '../../assets/ACTA N° 42 ASAMBLEA GNRAL ORD ACC miercoles 19 mar2025 esfa 2024-2023_page-0006.jpg';

const actaPages = [acta1, acta2, acta3, acta4, acta5, acta6];

const accionistas = [
  { nombre: 'INVERSIONES LILLY SAS',        participacion: 14.29 },
  { nombre: 'INVERSIONES PROJEKTE SAS',      participacion: 14.29 },
  { nombre: 'FENISY SAS',                    participacion: 14.29 },
  { nombre: 'DAVID ERNESTO CAMACHO',         participacion: 2.46  },
  { nombre: 'LORENA CAMACHO ROA',            participacion: 2.46  },
  { nombre: 'INVERSIONES AMLODA SAS',        participacion: 9.36  },
  { nombre: 'MARIA CLEMENCIA ROA BARRERA',   participacion: 4.92  },
  { nombre: 'DANIEL ROJAS ROA',              participacion: 4.68  },
  { nombre: 'LAURA JIMENA ROJAS ROA',        participacion: 4.68  },
  { nombre: 'LUZ MARINA ROA BARRERA',        participacion: 0.99  },
  { nombre: 'UNION RB S.A.S.',               participacion: 13.3  },
  { nombre: 'CARLOS ERNESTO ROA BARRERA',    participacion: 1.97  },
  { nombre: 'MAFERCAR SAS',                  participacion: 12.32 },
];

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
  { num: 10, text: 'Elección junta directiva' },
  { num: 11, text: 'Elección del revisor Fiscal y asignación de honorarios' },
  { num: 12, text: 'Proposiciones y varios' },
  { num: 13, text: 'Aprobación y firma del acta de sesión' },
];

export function OrdenDelDiaModal({ isOpen, onClose }) {
  // checkedItems persiste en sessionStorage — se limpia al cerrar el navegador/nueva sesión
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const saved = sessionStorage.getItem('ordenDelDiaChecks');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const [showQuorumModal, setShowQuorumModal]   = useState(false);
  const [selectedAccionistas, setSelectedAccionistas] = useState([]);
  const [showActaModal, setShowActaModal]       = useState(false);
  const [actaPage, setActaPage]                 = useState(0);

  const itemRefs        = useRef({});
  const modalContentRef = useRef(null);
  const actaScrollRef   = useRef(null);
  const wasOpenRef      = useRef(false);

  const totalParticipacion = selectedAccionistas.reduce(
    (sum, idx) => sum + accionistas[idx].participacion, 0
  );
  const quorumAlcanzado = totalParticipacion >= 51;
  const isQuorumVerified = !!checkedItems[1];

  // Persistir en sessionStorage cada vez que cambia
  useEffect(() => {
    try { sessionStorage.setItem('ordenDelDiaChecks', JSON.stringify(checkedItems)); } catch {}
  }, [checkedItems]);

  // Al abrir: si el quórum no está verificado en esta sesión, abrir modal quórum
  // NO resetear checkedItems — se mantiene lo marcado en la sesión
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      setSelectedAccionistas([]);
      setShowActaModal(false);
      setActaPage(0);
      if (modalContentRef.current) modalContentRef.current.scrollTop = 0;
      // Solo abrir quórum si no está verificado aún en esta sesión
      if (!checkedItems[1]) {
        setShowQuorumModal(true);
      }
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Bloquear ESC si quórum no verificado
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape' && !checkedItems[1]) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [isOpen, checkedItems]);

  // ── Handlers ──────────────────────────────────────────────

  const handleItemClick = (num) => {
    if (num === 1) {
      // Clic en el círculo/fila del ítem 1 → abrir modal quórum
      setShowQuorumModal(true);
      return;
    }
    if (!isQuorumVerified) return;
    if (num === 4) {
      setActaPage(0);
      setShowActaModal(true);
      return;
    }
    setCheckedItems(prev => {
      const next = { ...prev, [num]: !prev[num] };
      return next;
    });
    setTimeout(() => {
      const nextRef = itemRefs.current[num + 1];
      if (nextRef) nextRef.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const toggleAccionista = (idx) => {
    setSelectedAccionistas(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const confirmarQuorum = () => {
    if (!quorumAlcanzado) return;
    setCheckedItems(prev => ({ ...prev, 1: true }));
    setShowQuorumModal(false);
    setTimeout(() => {
      if (itemRefs.current[2]) itemRefs.current[2].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 150);
  };

  const goToActaPage = (page) => {
    setActaPage(page);
    setTimeout(() => { if (actaScrollRef.current) actaScrollRef.current.scrollTop = 0; }, 100);
  };

  const handleCloseAttempt = () => { if (isQuorumVerified) onClose(); };

  // ── Render ─────────────────────────────────────────────────

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progress = (completedCount / agendaItems.length) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm"
          onClick={handleCloseAttempt}
        >
          {/* ── Panel principal ── */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl relative flex-shrink-0">
              {isQuorumVerified
                ? <button onClick={handleCloseAttempt} className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"><X className="w-5 h-5" /></button>
                : <div className="absolute top-4 right-4 text-white/30 p-1 cursor-not-allowed" title="Verifique el quórum primero"><X className="w-5 h-5" /></div>
              }
              <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4 pr-8">Orden del Día</h2>
              {!isQuorumVerified && (
                <p className="text-yellow-200 text-xs text-center mb-3 font-semibold">
                  ⚠️ Haga clic en el ítem 1 para verificar el quórum
                </p>
              )}
              <div className="flex items-center justify-between text-white/90 text-xs sm:text-sm mb-2">
                <span>Progreso</span>
                <span>{completedCount} de {agendaItems.length} completados</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} className="h-full bg-white rounded-full" />
              </div>
            </div>

            {/* Lista */}
            <div ref={modalContentRef} className="p-6 overflow-y-auto flex-1">
              <div className="space-y-2">
                {agendaItems.map((item) => {
                  const isChecked    = !!checkedItems[item.num];
                  const isDisabled   = item.num > 1 && !isQuorumVerified;

                  return (
                    <div
                      key={item.num}
                      ref={el => { itemRefs.current[item.num] = el; }}
                      onClick={() => !isDisabled && handleItemClick(item.num)}
                      className={`flex gap-3 items-center p-3 sm:p-4 rounded-lg border-2 transition-all select-none ${
                        isDisabled
                          ? 'opacity-40 cursor-not-allowed bg-gray-50 border-transparent'
                          : isChecked
                          ? 'bg-green-50 border-green-300 cursor-pointer'
                          : 'hover:bg-gray-50 border-transparent hover:border-gray-200 cursor-pointer'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isChecked
                          ? <CheckCircle className="w-6 h-6 text-green-500" />
                          : <Circle className={`w-6 h-6 ${isDisabled ? 'text-gray-300' : 'text-gray-400 hover:text-blue-500'}`} />
                        }
                      </div>
                      <span className={`font-bold flex-shrink-0 w-7 ${isDisabled ? 'text-gray-400' : isChecked ? 'text-green-600' : 'text-blue-600'}`}>
                        {item.num}.
                      </span>
                      <p className={`flex-1 text-sm sm:text-base ${isDisabled ? 'text-gray-400' : isChecked ? 'text-green-700' : 'text-gray-700'}`}>
                        {item.text}
                      </p>
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
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continuar
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── Modal Quórum ── */}
          <AnimatePresence>
            {showQuorumModal && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
                onClick={e => e.stopPropagation()}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-xl w-full max-w-md max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
                  onClick={e => e.stopPropagation()}
                >
                  {/* Header quórum */}
                  <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 flex-shrink-0">
                    <h3 className="text-xl font-bold text-white text-center">Verificación del Quórum</h3>
                    <p className="text-white/90 text-sm text-center mt-1">Seleccione los accionistas presentes (mínimo 51%)</p>
                    <div className="mt-3 bg-white/20 rounded-lg p-3">
                      <div className="flex justify-between text-white text-sm mb-1">
                        <span>Participación:</span>
                        <span className="font-bold">{totalParticipacion.toFixed(2)}%</span>
                      </div>
                      <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
                        <motion.div
                          animate={{ width: `${Math.min(totalParticipacion, 100)}%` }}
                          transition={{ duration: 0.3 }}
                          className={`h-full rounded-full ${quorumAlcanzado ? 'bg-green-300' : 'bg-yellow-300'}`}
                        />
                      </div>
                      <p className="text-white/90 text-xs text-center mt-1">
                        {quorumAlcanzado
                          ? '✓ Quórum alcanzado — puede confirmar'
                          : `Faltan ${(51 - totalParticipacion).toFixed(2)}% para el quórum`}
                      </p>
                    </div>
                  </div>

                  {/* Lista accionistas */}
                  <div className="p-4 overflow-y-auto flex-1">
                    <div className="space-y-2">
                      {accionistas.map((acc, idx) => {
                        const isSelected = selectedAccionistas.includes(idx);
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleAccionista(idx)}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border-2 transition-all ${
                              isSelected ? 'bg-green-50 border-green-300' : 'hover:bg-gray-50 border-transparent hover:border-gray-200'
                            }`}
                          >
                            <input type="checkbox" checked={isSelected} onChange={() => {}} className="w-5 h-5 accent-green-600 rounded" />
                            <p className={`flex-1 text-sm font-semibold ${isSelected ? 'text-green-700' : 'text-gray-900'}`}>{acc.nombre}</p>
                            <span className={`text-sm font-bold ${isSelected ? 'text-green-600' : 'text-gray-500'}`}>{acc.participacion}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer quórum */}
                  <div className="p-4 border-t border-gray-200 flex-shrink-0">
                    <button
                      onClick={confirmarQuorum}
                      disabled={!quorumAlcanzado}
                      className={`w-full py-3 rounded-lg font-bold text-base transition-all ${
                        quorumAlcanzado
                          ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer shadow-lg'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {quorumAlcanzado ? '✓ Confirmar Quórum' : `Seleccione accionistas (${totalParticipacion.toFixed(1)}% / 51%)`}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Modal Acta ── */}
          <AnimatePresence>
            {showActaModal && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80"
                onClick={() => setShowActaModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between flex-shrink-0">
                    <h3 className="text-white font-bold text-lg">Acta N° 42 — Página {actaPage + 1} de {actaPages.length}</h3>
                    <button onClick={() => setShowActaModal(false)} className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"><X className="w-5 h-5" /></button>
                  </div>
                  <div ref={actaScrollRef} className="flex-1 overflow-y-auto bg-gray-100 p-3">
                    <img src={actaPages[actaPage]} alt={`Acta página ${actaPage + 1}`} className="w-full object-contain rounded shadow block" />
                  </div>
                  <div className="p-4 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
                    <button onClick={() => goToActaPage(Math.max(0, actaPage - 1))} disabled={actaPage === 0}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${actaPage === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                      <ChevronLeft className="w-5 h-5" /> Anterior
                    </button>
                    <div className="flex gap-1">
                      {actaPages.map((_, i) => (
                        <button key={i} onClick={() => goToActaPage(i)}
                          className={`w-8 h-8 rounded-full text-sm font-bold transition-all ${i === actaPage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    {actaPage < actaPages.length - 1
                      ? <button onClick={() => goToActaPage(actaPage + 1)} className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all">
                          Siguiente <ChevronRight className="w-5 h-5" />
                        </button>
                      : <button onClick={() => { setShowActaModal(false); setCheckedItems(prev => ({ ...prev, 4: true })); }}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition-all">
                          <CheckCircle className="w-5 h-5" /> Leída
                        </button>
                    }
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
