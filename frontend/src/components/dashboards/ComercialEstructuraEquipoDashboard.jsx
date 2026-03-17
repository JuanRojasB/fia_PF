import { useState } from 'react';
import { Users, User, ChevronDown, ChevronUp, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const canales = [
  {
    id: 'institucional',
    nombre: 'Institucional',
    sede: 'Sede 3',
    lider: 'Hernán Benito',
    color: '#3b82f6',
    colorLight: '#eff6ff',
    colorBorder: '#bfdbfe',
    categoria: 'Pollo en Canal',
    asesores: [
      { cc: '52173826',  nombre: 'Bernal Vásquez Elizabeth' },
      { cc: '52161793',  nombre: 'Castillo Quiñonez Sandra Arminda' },
      { cc: '79837241',  nombre: 'García Castro Efrén' },
      { cc: '51821727',  nombre: 'Jaimes Silva Sandra Rocío' },
      { cc: '79420963',  nombre: 'Malagón Borda Gustavo Enrique' },
      { cc: '39749700',  nombre: 'Mejía García Patricia de los Ángeles' },
      { cc: '53155047',  nombre: 'Morales Parada Sandra Patricia' },
      { cc: '28683054',  nombre: 'Navarro Celia' },
      { cc: '52464859',  nombre: 'Ramírez Herrera Sandra Milena' },
      { cc: '79844147',  nombre: 'Ramírez Malagón John Alexander' },
    ]
  },
  {
    id: 'toberinSede5',
    nombre: 'Sede 5 — Toberín',
    sede: 'Sede 5',
    lider: 'Yenny Alvarado',
    color: '#10b981',
    colorLight: '#ecfdf5',
    colorBorder: '#a7f3d0',
    categoria: 'Pollo en Canal',
    asesores: [
      { cc: '1093803653', nombre: 'Hernández Ariza Johnny Alirio' },
      { cc: '53000676',   nombre: 'Vargas Pinilla Ana Marcela' },
      { cc: '91472769',   nombre: 'Monroy Cortés Carlos Manuel' },
    ]
  },
  {
    id: 'asadero',
    nombre: 'Canal Asadero',
    sede: 'Sede 1',
    lider: 'German Rodríguez',
    color: '#f97316',
    colorLight: '#fff7ed',
    colorBorder: '#fed7aa',
    categoria: 'Pollo en Canal',
    asesores: [
      { cc: '1016009906', nombre: 'Sánchez Merchán William Edilson' },
      { cc: '1023867208', nombre: 'Gamba Piragua Lenith' },
      { cc: '1075666080', nombre: 'Garnica Rodríguez Nubia Yamile' },
      { cc: '1101756357', nombre: 'Fandiño Fandiño Jeny Aida' },
      { cc: '14279394',   nombre: 'González Contreras Juan Carlos' },
      { cc: '15904268',   nombre: 'Urrea Restrepo Luis Gustavo' },
      { cc: '19482319',   nombre: 'Arenas Urrea Luis Albeiro' },
      { cc: '37943525',   nombre: 'Salas Moreno Maria Fanny' },
      { cc: '39568107',   nombre: 'Segura Cleves Sandra Mónica' },
      { cc: '51631698',   nombre: 'Caldas Palacios Maria Nancy' },
      { cc: '51845295',   nombre: 'Puentes Correa Alicia' },
      { cc: '52159001',   nombre: 'Salamanca Camacho Dorys Adriana' },
      { cc: '52213001',   nombre: 'Cardona Ramírez Janeth' },
      { cc: '52583090',   nombre: 'Villamil Bermúdez Mariela' },
      { cc: '79903450',   nombre: 'Gil Chiquiza Javier Gonzalo' },
      { cc: '80469096',   nombre: 'Ovalle Ochoa Diego Fernando' },
    ]
  },
  {
    id: 'pdv',
    nombre: 'Puntos de Venta (PDV)',
    sede: 'Bogotá / Región',
    lider: 'Elmira González & Michael Arias',
    color: '#8b5cf6',
    colorLight: '#f5f3ff',
    colorBorder: '#ddd6fe',
    categoria: 'Pollo en Canal',
    asesores: []
  },
  {
    id: 'yopal',
    nombre: 'Yopal',
    sede: 'Yopal / Aguazul',
    lider: 'Julián Mora',
    color: '#06b6d4',
    colorLight: '#ecfeff',
    colorBorder: '#a5f3fc',
    categoria: 'Pollo en Canal',
    asesores: []
  },
  {
    id: 'mayorista',
    nombre: 'Mayorista',
    lider: 'José Rodríguez',
    color: '#6366f1',
    colorLight: '#eef2ff',
    colorBorder: '#c7d2fe',
    categoria: 'Pollo en Pie',
    asesores: []
  },
  {
    id: 'huevos',
    nombre: 'Huevos',
    sede: 'Comercial',
    lider: 'Margarita Roa Barrera',
    color: '#eab308',
    colorLight: '#fefce8',
    colorBorder: '#fde68a',
    categoria: 'Huevos',
    asesores: []
  },
];

const categorias = [
  { key: 'Pollo en Canal', emoji: '🐔' },
  { key: 'Pollo en Pie',   emoji: '🐣' },
  { key: 'Huevos',         emoji: '🥚' },
];

const totalAsesores = canales.reduce((s, c) => s + c.asesores.length, 0);

function CanalCard({ canal }) {
  const [open, setOpen] = useState(false);
  const tieneAsesores = canal.asesores.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden shadow-md border"
      style={{ borderColor: canal.colorBorder, backgroundColor: canal.colorLight }}
    >
      {/* Header coloreado */}
      <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: canal.color }}>
        <div>
          <div className="text-white font-bold text-base leading-tight">{canal.nombre}</div>
          <div className="text-white/70 text-xs mt-0.5">{canal.sede}</div>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white">
          {tieneAsesores ? `${canal.asesores.length} asesores` : 'Líder'}
        </span>
      </div>

      {/* Líder */}
      <div className="px-5 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: canal.color + '22' }}>
          <Award className="w-4 h-4" style={{ color: canal.color }} />
        </div>
        <div>
          <div className="text-xs text-gray-400">Líder comercial</div>
          <div className="text-sm font-bold text-gray-900">{canal.lider}</div>
        </div>
      </div>

      {/* Toggle asesores */}
      {tieneAsesores && (
        <>
          <div className="px-5 pb-1">
            <div className="border-t" style={{ borderColor: canal.colorBorder }} />
          </div>
          <button
            onClick={() => setOpen(v => !v)}
            className="w-full px-5 py-2.5 flex items-center justify-between text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: canal.color }}
          >
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {open ? 'Ocultar equipo' : `Ver equipo (${canal.asesores.length} asesores)`}
            </span>
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {canal.asesores.map((a, i) => (
                    <div
                      key={a.cc}
                      className="flex items-center gap-2.5 py-2 px-3 rounded-lg bg-white/70 border"
                      style={{ borderColor: canal.colorBorder }}
                    >
                      <div
                        className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold flex-shrink-0"
                        style={{ backgroundColor: canal.color }}
                      >
                        {i + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-gray-800 truncate">{a.nombre}</div>
                        <div className="text-xs text-gray-400">CC: {a.cc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
}

export default function ComercialEstructuraEquipoDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-white/20 p-3 rounded-xl">
            <Users className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Estructura Comercial</h1>
            <p className="text-blue-100 mt-1">Equipo de ventas por canal y sede — 2025</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/15 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold">3</div>
            <div className="text-sm text-blue-100 mt-1">Categorías</div>
          </div>
          <div className="bg-white/15 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold">{canales.length}</div>
            <div className="text-sm text-blue-100 mt-1">Canales</div>
          </div>
          <div className="bg-white/15 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold">{totalAsesores}</div>
            <div className="text-sm text-blue-100 mt-1">Asesores</div>
          </div>
        </div>
      </div>

      {/* Por categoría */}
      {categorias.map(({ key, emoji }) => {
        const items = canales.filter(c => c.categoria === key);
        return (
          <div key={key}>
            {/* Separador de categoría */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest px-3">
                {emoji} {key}
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
              {items.map(canal => (
                <CanalCard key={canal.id} canal={canal} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
