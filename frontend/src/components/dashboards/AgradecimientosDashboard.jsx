import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import orbLogo from '../../assets/orb-logo.png';

export default function AgradecimientosDashboard({ onBack }) {
  useEffect(() => {
    // Hacer scroll al inicio cuando se monta el componente
    setTimeout(() => {
      // Intentar múltiples selectores
      const scrollContainer = document.querySelector('.dashboard-content')?.parentElement;
      const mainContent = document.querySelector('main');
      const overflowAuto = document.querySelector('[class*="overflow-auto"]');
      
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'instant' });
      }
      if (mainContent) {
        mainContent.scrollTo({ top: 0, behavior: 'instant' });
      }
      if (overflowAuto) {
        overflowAuto.scrollTo({ top: 0, behavior: 'instant' });
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 px-4">

      {/* Fondo decorativo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl"
      >
        {/* Carta */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-10 border-4 border-amber-400/40 shadow-2xl relative overflow-hidden">

          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/20 rounded-full -translate-y-32 translate-x-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-200/20 rounded-full translate-y-24 -translate-x-24 pointer-events-none" />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <img src={orbLogo} alt="Logo" className="h-20 object-contain" />
          </motion.div>

          {/* Título */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-gray-900 text-center mb-8 tracking-wide"
          >
            AGRADECIMIENTOS
          </motion.h2>

          {/* Cuerpo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6 text-gray-700 text-base leading-relaxed text-center max-w-2xl mx-auto"
          >
            <p>
              La Gerencia General expresa su más profundo agradecimiento a nuestros estimados accionistas
              por la confianza depositada en la empresa durante este año de retos y logros compartidos.
            </p>
            <p>
              Su respaldo constante ha sido fundamental para seguir consolidando nuestro liderazgo en el
              sector avícola, impulsar proyectos estratégicos y fortalecer nuestro compromiso con la calidad,
              la innovación y la sostenibilidad.
            </p>
            <p>
              Gracias familia Roa por su visión y apoyo, continuamos avanzando con firmeza hacia un
              crecimiento responsable y sostenible, enfocado en generar valor para todos nuestros grupos
              de interés y para el futuro de nuestra organización.
            </p>
          </motion.div>

          {/* Firma */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-12 pt-8 border-t-2 border-amber-300/50 text-center"
          >
            <p className="text-gray-500 text-sm mb-6">Atentamente,</p>
            <div className="inline-block">
              <p className="text-xl font-bold text-gray-900 tracking-wide">JOHN HENRY RESTREPO MELO</p>
              <p className="text-amber-600 font-semibold mt-1">Gerente General</p>
              <p className="text-gray-500 text-sm mt-1">Pollo Fiesta S.A. — 2025</p>
            </div>
          </motion.div>
        </div>

        {/* Botón volver */}
        {onBack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center mt-6"
          >
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold shadow-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver a Situación Económica
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
