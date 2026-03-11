import { motion } from 'framer-motion';
import { FileText, Building2, Calendar, Users, TrendingUp, Award, Shield, Target } from 'lucide-react';

export default function BienvenidaDashboard() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-8 lg:p-12 border-2 border-blue-500/30"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-500/20 p-4 rounded-xl">
              <Building2 className="w-12 h-12 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                Pollo Fiesta S.A.
              </h1>
              <p className="text-xl text-blue-300">Sistema de Gestión Empresarial</p>
            </div>
          </div>
          
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold text-white">
                Informe de Gestión Año 2025
              </h2>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed">
              A la Honorable Asamblea General de Accionistas
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Consideraciones Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border-2 border-slate-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-green-400" />
          <h2 className="text-2xl font-bold text-white">Consideraciones</h2>
        </div>
        
        <div className="space-y-4 text-gray-300 leading-relaxed">
          <p>
            En cumplimiento con las disposiciones estatutarias de la sociedad <span className="font-semibold text-white">Pollo Fiesta S.A.</span> y de conformidad con lo previsto en los artículos 38, 45, 46 y 47 de la ley 222 de 1995; art. 1 de la ley 603 de 2000, y demás normas concordantes contempladas en la legislación vigente sobre la materia.
          </p>
          
          <p>
            A continuación, se presenta el informe anual por la gestión desarrollada durante el ejercicio económico del año <span className="font-semibold text-white">2025</span>, el cual contiene una exposición fiel sobre la evolución del negocio, la situación jurídica, la situación económica y la situación administrativa de la sociedad en cumplimiento con el ordenamiento legal.
          </p>
        </div>
      </motion.div>

      {/* Key Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl rounded-xl p-6 border-2 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-10 h-10 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Evolución del Negocio</h3>
          <p className="text-sm text-gray-400">
            Análisis del crecimiento y desarrollo empresarial durante el ejercicio 2025
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-xl rounded-xl p-6 border-2 border-green-500/30 hover:border-green-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-10 h-10 text-green-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Situación Jurídica</h3>
          <p className="text-sm text-gray-400">
            Cumplimiento normativo y marco legal de la organización
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl rounded-xl p-6 border-2 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <Award className="w-10 h-10 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Situación Económica</h3>
          <p className="text-sm text-gray-400">
            Estados financieros y resultados del ejercicio fiscal
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-xl rounded-xl p-6 border-2 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="w-10 h-10 text-orange-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Situación Administrativa</h3>
          <p className="text-sm text-gray-400">
            Gestión organizacional y estructura operativa
          </p>
        </motion.div>
      </div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-xl p-8 border-2 border-slate-600"
      >
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-8 h-8 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Ejercicio Económico 2025</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Áreas de Gestión</h3>
            </div>
            <p className="text-3xl font-bold text-blue-400 mb-2">10+</p>
            <p className="text-sm text-gray-400">Dashboards especializados disponibles</p>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Indicadores</h3>
            </div>
            <p className="text-3xl font-bold text-green-400 mb-2">100+</p>
            <p className="text-sm text-gray-400">KPIs y métricas de desempeño</p>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Transparencia</h3>
            </div>
            <p className="text-3xl font-bold text-purple-400 mb-2">100%</p>
            <p className="text-sm text-gray-400">Cumplimiento normativo y legal</p>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-xl p-8 border-2 border-blue-500/30 text-center"
      >
        <h3 className="text-2xl font-bold text-white mb-4">
          Explore los Dashboards
        </h3>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Utilice el menú lateral para navegar entre las diferentes áreas de gestión y acceder a información detallada sobre producción, comercial, logística, recursos humanos y más.
        </p>
        <div className="flex items-center justify-center gap-2 text-blue-400">
          <span className="text-lg">←</span>
          <span className="font-semibold">Seleccione una sección del menú para comenzar</span>
        </div>
      </motion.div>
    </div>
  );
}
