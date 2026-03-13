import { FileText, Building2, Calendar, Users, TrendingUp, Award, Shield, Target } from 'lucide-react';

export default function BienvenidaDashboard() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white/95 backdrop-blur-xl rounded-2xl p-6 sm:p-8 lg:p-12 border-2 border-blue-500/30">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-blue-500/20 p-3 sm:p-4 rounded-xl">
              <Building2 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2">
                Pollo Fiesta S.A.
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-blue-600">Sistema de Gestión Empresarial</p>
            </div>
          </div>
          
          <div className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-gray-300">
            <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                Informe de Gestión Año 2025
              </h2>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
              A la Honorable Asamblea General de Accionistas
            </p>
          </div>
        </div>
      </div>

      {/* Puntos Importantes de las Subsecciones */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-6 lg:p-8 border-2 border-indigo-500/30">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Target className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Puntos Destacados 2024-2025</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Contexto Mundial */}
          <div className="p-4 sm:p-5 rounded-xl bg-white/95 backdrop-blur-xl border border-blue-500/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              <h3 className="text-base sm:text-lg font-bold text-blue-600">Contexto Mundial</h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Crecimiento global proyectado: <span className="font-semibold text-gray-900">2.6%</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Sector avícola mundial: <span className="font-semibold text-gray-900">+2.5%</span> en producción</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Estabilización de costos de alimentación (soya y maíz)</span>
              </li>
            </ul>
          </div>

          {/* Entorno Socioeconómico */}
          <div className="p-4 sm:p-5 rounded-xl bg-white/95 backdrop-blur-xl border border-cyan-500/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-cyan-600"></div>
              <h3 className="text-base sm:text-lg font-bold text-cyan-600">Entorno Socioeconómico Nacional</h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 mt-1">•</span>
                <span>PIB Colombia 2025: Crecimiento del <span className="font-semibold text-gray-900">2.3%</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 mt-1">•</span>
                <span>IPC: Estabilización en <span className="font-semibold text-gray-900">5.1%</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 mt-1">•</span>
                <span>TRM: Desaceleración del dólar <span className="font-semibold text-gray-900">-9.21%</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 mt-1">•</span>
                <span>Desempleo: Reducción a <span className="font-semibold text-gray-900">10.9%</span></span>
              </li>
            </ul>
          </div>

          {/* Encasetamiento en Colombia */}
          <div className="p-4 sm:p-5 rounded-xl bg-white/95 backdrop-blur-xl border border-violet-500/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-violet-600"></div>
              <h3 className="text-base sm:text-lg font-bold text-violet-600">Encasetamiento en Colombia</h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-violet-600 mt-1">•</span>
                <span>Total 2025: <span className="font-semibold text-gray-900">963.3 millones</span> de aves</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-600 mt-1">•</span>
                <span>Crecimiento: <span className="font-semibold text-green-600">+5.6%</span> vs 2024</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-600 mt-1">•</span>
                <span>Incremento: <span className="font-semibold text-gray-900">+51 millones</span> de aves</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-600 mt-1">•</span>
                <span>Pollo Fiesta: <span className="font-semibold text-gray-900">3.3%</span> participación nacional</span>
              </li>
            </ul>
          </div>

          {/* Negocio en Marcha */}
          <div className="p-4 sm:p-5 rounded-xl bg-white/95 backdrop-blur-xl border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
              <h3 className="text-base sm:text-lg font-bold text-emerald-600">Negocio en Marcha</h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Rentabilidad neta: <span className="font-semibold text-green-600">2.84%</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Calificación INVIMA: <span className="font-semibold text-gray-900">97.55%</span> (+0.86%)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Mejoras en planta de beneficio y red de frío</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Campañas publicitarias 360° exitosas</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Resumen General */}
        <div className="mt-4 sm:mt-6 p-4 sm:p-5 rounded-xl bg-white/95 backdrop-blur-xl border border-green-500/30">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            <h3 className="text-base sm:text-lg font-bold text-green-600">Resumen Ejecutivo</h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            El año 2024-2025 se caracterizó por un <span className="font-semibold text-green-600">crecimiento sostenido</span> del sector avícola colombiano, 
            con mejoras significativas en rentabilidad, calidad y participación de mercado. Pollo Fiesta S.A. logró mantener 
            márgenes positivos a pesar de la reducción del 4% en producción, gracias a la <span className="font-semibold text-gray-900">optimización de procesos</span> y 
            el <span className="font-semibold text-gray-900">fortalecimiento de la red comercial</span>. El contexto macroeconómico favorable, con estabilización 
            de materias primas y mejora en indicadores nacionales, contribuyó al desempeño positivo de la compañía.
          </p>
        </div>
      </div>

      {/* Consideraciones Section */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-6 lg:p-8 border-2 border-gray-300/50">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Consideraciones</h2>
        </div>
        
        <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base">
          <p>
            En cumplimiento con las disposiciones estatutarias de la sociedad <span className="font-semibold text-gray-900">Pollo Fiesta S.A.</span> y de conformidad con lo previsto en los artículos 38, 45, 46 y 47 de la ley 222 de 1995; art. 1 de la ley 603 de 2000, y demás normas concordantes contempladas en la legislación vigente sobre la materia.
          </p>
          
          <p>
            A continuación, se presenta el informe anual por la gestión desarrollada durante el ejercicio económico del año <span className="font-semibold text-gray-900">2025</span>, el cual contiene una exposición fiel sobre la evolución del negocio, la situación jurídica, la situación económica y la situación administrativa de la sociedad en cumplimiento con el ordenamiento legal.
          </p>
        </div>
      </div>

      {/* Key Areas Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-6 border-2 border-blue-500/30">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Evolución del Negocio</h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Análisis del crecimiento y desarrollo empresarial durante el ejercicio 2025
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-6 border-2 border-green-500/30">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Situación Jurídica</h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Cumplimiento normativo y marco legal de la organización
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-6 border-2 border-purple-500/30">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Award className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Situación Económica</h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Estados financieros y resultados del ejercicio fiscal
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-6 border-2 border-orange-500/30">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Users className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Situación Administrativa</h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Gestión organizacional y estructura operativa
          </p>
        </div>
      </div>
    </div>
  );
}
