import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mapeo de sección → icono emoji y color
const SECTION_META = {
  'bienvenida-principal':       { label: 'Bienvenida',                        icon: '👋', color: '#3b82f6' },
  'contexto-mundial':           { label: 'Contexto Mundial',                   icon: '🌎', color: '#6366f1' },
  'entorno-socioeconomico':     { label: 'Entorno Socioeconómico',             icon: '📊', color: '#8b5cf6' },
  'encasetamiento-colombia':    { label: 'Encasetamiento Colombia',            icon: '🐔', color: '#f59e0b' },
  'negocio-marcha':             { label: 'Negocio en Marcha',                  icon: '🚀', color: '#10b981' },
  'produccion-granjas':         { label: 'Capacidad de Granjas',               icon: '🏭', color: '#14b8a6' },
  'produccion-encasetado':      { label: 'Producción Encasetado',              icon: '📦', color: '#0ea5e9' },
  'produccion-pollo-entregado': { label: 'Pollo Entregado',                   icon: '🚚', color: '#f97316' },
  'produccion-indicadores':     { label: 'Indicadores de Producción',          icon: '📈', color: '#22c55e' },
  'produccion-huevos':          { label: 'Producción de Huevos',               icon: '🥚', color: '#eab308' },
  'comercial-estructura-equipo': { label: 'Estructura Comercial',              icon: '👥', color: '#3b82f6' },
  'comercial-resumen':          { label: 'Asignación Pollo Mayorista',         icon: '🛒', color: '#ef4444' },
  'comercial-ventas-compania':  { label: 'Ventas Compañía',                   icon: '💰', color: '#f43f5e' },
  'comercial-pollo-entero':     { label: 'Pollo Entero',                      icon: '🍗', color: '#fb923c' },
  'comercial-productos':        { label: 'Ventas Pollo en Canal',              icon: '📋', color: '#a855f7' },
  'comercial-asadero':          { label: 'Canal Asadero',                     icon: '🔥', color: '#dc2626' },
  'comercial-institucional':    { label: 'Canal Institucional',               icon: '🏢', color: '#2563eb' },
  'comercial-huevo':            { label: 'Comercial Huevo',                   icon: '🥚', color: '#ca8a04' },
  'logistica-merma':            { label: 'Logística Merma',                   icon: '📉', color: '#64748b' },
  'auditoria':                  { label: 'Auditoría',                         icon: '🔍', color: '#7c3aed' },
  'comercial-pdv':              { label: 'Puntos de Venta',                   icon: '🏪', color: '#059669' },
  'cartera':                    { label: 'Gestión de Cartera',                icon: '💳', color: '#0891b2' },
  'logistica-sede1':            { label: 'Logística Sede 1',                  icon: '📍', color: '#16a34a' },
  'logistica-sede2':            { label: 'Logística Sede 2',                  icon: '📍', color: '#15803d' },
  'logistica-sede3':            { label: 'Logística Sede 3',                  icon: '📍', color: '#166534' },
  'logistica-consolidado':      { label: 'Logística Consolidado',             icon: '📊', color: '#0f766e' },
  'marketing-indicadores':      { label: 'Marketing Indicadores',             icon: '📣', color: '#db2777' },
  'marketing-detalle':          { label: 'Marketing Detalle',                 icon: '🎯', color: '#be185d' },
  'calidad':                    { label: 'Aseguramiento de Calidad',          icon: '✅', color: '#16a34a' },
  'humana-general':             { label: 'Gestión Humana',                    icon: '👥', color: '#0284c7' },
  'humana-causas':              { label: 'Causas de Retiro',                  icon: '📝', color: '#0369a1' },
  'compras':                    { label: 'Gestión en Compras',                icon: '🛍️', color: '#7c3aed' },
  'operaciones':                { label: 'Operaciones y Mantenimiento',       icon: '⚙️', color: '#374151' },
  'operaciones-tpm':            { label: 'Mantenimiento',                     icon: '⚙️', color: '#374151' },
  'operaciones-ot':             { label: 'Órdenes de Trabajo SIESA',          icon: '🔧', color: '#374151' },
  'operaciones-vehiculos':      { label: 'Mantenimiento de Vehículos',        icon: '🚛', color: '#374151' },
  'operaciones-arquitectura':   { label: 'Arquitectura',                      icon: '🏗️', color: '#374151' },
  'planta-beneficio':           { label: 'Planta de Beneficio',               icon: '🏗️', color: '#92400e' },
  'tecnologias-informacion':    { label: 'Tecnologías de la Información',     icon: '💻', color: '#1d4ed8' },
  'sagrilaft':                  { label: 'Sistema SAGRILAFT',                 icon: '🛡️', color: '#4338ca' },
  'presupuesto-2025':           { label: 'Presupuesto 2025',                  icon: '💼', color: '#0f766e' },
  'situacion-juridica':         { label: 'Situación Jurídica',               icon: '⚖️', color: '#6d28d9' },
  'situacion-economica':        { label: 'Situación Económica',              icon: '📊', color: '#065f46' },
};

export default function SectionSplash({ section, trigger }) {
  const [visible, setVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState(section);

  useEffect(() => {
    if (!trigger) return;
    setCurrentSection(section);
    setVisible(true);
    // fallback in case animation doesn't fire
    const t = setTimeout(() => setVisible(false), 1600);
    return () => clearTimeout(t);
  }, [trigger]);

  const meta = SECTION_META[currentSection] || {
    label: currentSection?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || '',
    icon: '📌',
    color: '#3b82f6',
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={trigger}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9998,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            style={{
              position: 'relative',
              background: 'white',
              borderRadius: '24px',
              padding: '40px 56px',
              textAlign: 'center',
              boxShadow: `0 0 0 4px ${meta.color}33, 0 24px 60px rgba(0,0,0,0.25)`,
              minWidth: '320px',
            }}
          >
            {/* Colored top bar */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '5px',
              borderRadius: '24px 24px 0 0',
              background: meta.color,
            }} />

            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.05 }}
              style={{ fontSize: '3.5rem', lineHeight: 1, marginBottom: '16px' }}
            >
              {meta.icon}
            </motion.div>

            {/* Label */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em',
                color: meta.color, textTransform: 'uppercase', marginBottom: '6px',
              }}
            >
              Navegando a
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{
                fontSize: '1.5rem', fontWeight: 800, color: '#111827',
                lineHeight: 1.2, margin: 0,
              }}
            >
              {meta.label}
            </motion.h2>

            {/* Progress bar */}
            <div
              style={{
                marginTop: '24px', height: '4px', borderRadius: '9999px',
                background: '#f1f5f9', overflow: 'hidden',
              }}
            >
              <motion.div
                key={trigger}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.1, ease: 'linear' }}
                onAnimationComplete={() => setVisible(false)}
                style={{ height: '100%', borderRadius: '9999px', background: meta.color }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
