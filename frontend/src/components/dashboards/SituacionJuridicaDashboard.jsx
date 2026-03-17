import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, PieChart as PieChartIcon, AlertCircle, Scale, X, Info, Shield, CheckCircle } from 'lucide-react';

export default function SituacionJuridicaDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Situación Jurídica y Tecnológica</h2>
        <p className="text-gray-700">Marco legal, sistema ERP, procesos jurídicos vigentes y marco tributario de Pollo Fiesta S.A. 2025.</p>
      </div>


      {/* Jurídica y Tecnológica */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" />
          Situación Jurídica y Tecnológica Pollo Fiesta 2025
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white/95 rounded-xl p-4 border-2 border-blue-500/30 cursor-pointer hover:border-blue-500 transition-all"
            onClick={() => openModal('Situación Jurídica — Marco Legal',
              <div className="text-gray-700 space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <p className="font-semibold text-blue-700 mb-1">Ley 603 de 2000</p>
                  <p className="text-sm">Propiedad intelectual y derechos de autor — Proceso Electrónico de Datos (PED).</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <p className="font-semibold text-blue-700 mb-2">Ley 1581 de 2012 — Habeas Data</p>
                  <p className="text-sm mb-3">Regula el tratamiento de la información en bases de datos. Establece el Régimen General de Protección de Datos Personales. Pollo Fiesta S.A. se ajusta a la normatividad aplicando los siguientes principios:</p>
                  <ul className="text-sm space-y-2">
                    <li><strong>Legalidad:</strong> El tratamiento de datos está sujeto a las disposiciones legales vigentes. Inscrita con sus bases de datos en el Registro Nacional de Bases de Datos (RNBD).</li>
                    <li><strong>Finalidad:</strong> Los datos personales solo pueden ser tratados para fines legítimos e informados previamente al titular.</li>
                    <li><strong>Libertad:</strong> El tratamiento solo puede realizarse con el consentimiento previo, expreso e informado del titular.</li>
                    <li><strong>Veracidad o Calidad:</strong> Los datos recolectados deben ser veraces, completos y actualizados.</li>
                    <li><strong>Transparencia:</strong> El titular tiene derecho a obtener información sobre el tratamiento de sus datos en cualquier momento.</li>
                  </ul>
                </div>
              </div>
            )}>
            <FileText className="w-8 h-8 text-blue-600 mb-3" />
            <div className="text-blue-600 font-semibold mb-2">Marco Legal</div>
            <div className="text-gray-900 text-sm mb-2">Ley 603/2000 · Ley 1581/2012</div>
            <div className="text-xs text-gray-600">Protección de datos y PED — Habeas Data</div>
          </div>

          <div className="bg-white/95 rounded-xl p-4 border-2 border-purple-500/30 cursor-pointer hover:border-purple-500 transition-all"
            onClick={() => openModal('ERP Enterprise — SIESA DIGITAL S.A.S.',
              <div className="text-gray-700 space-y-4">
                <p>La empresa cuenta con el software aplicativo <strong className="text-purple-600">ERP – Enterprise</strong> de la compañía <strong>SIESA DIGITAL S.A.S.</strong> La minería de datos, en su proceso electrónico de datos, incluye:</p>
                <ul className="text-sm space-y-2 list-disc list-inside">
                  <li>Minería cuantitativa y cualitativa de datos en las áreas comercial, administrativa, financiera, nómina, inventarios, compras, mantenimientos y mobile para captura de pedidos y PQR.</li>
                  <li>Estadísticas y trazabilidad desde una sola fuente de la información.</li>
                  <li>CRM – Gestión de Relación con los Clientes (Customer Relationship Management).</li>
                  <li>PQRS – Servicio al Cliente.</li>
                  <li>Aplicación de dispositivos Mobile Phone M.P. – captura de pedidos.</li>
                  <li>Reportador de Gerencia de Business Intelligence (BI) – Unidad Funcional Financiera.</li>
                  <li>Reporteadores Flex – Mobile – Generic Transfer – UPI – Administración del Sistema y Listas de precios.</li>
                </ul>
                <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                  <p className="text-sm font-semibold text-purple-700 mb-2">El ERP permite controlar:</p>
                  <p className="text-sm">Inventarios en granjas y sedes; inventarios de empaques y canastillas; entrada de pollo pie; básculas, taras y destares; entrada y salida de cada proceso con control de mermas internas y externas; facturación, reliquidaciones por conceptos; listas de precios; captura desde la fuente del pedido (cliente); reportadores; manejo y control de horarios para aliados productivos y empleados; control de relojes con huellas biométricas; grados de seguridad perimetral del sistema con claves y usuarios según su función.</p>
                </div>
              </div>
            )}>
            <PieChartIcon className="w-8 h-8 text-purple-600 mb-3" />
            <div className="text-purple-600 font-semibold mb-2">ERP Enterprise</div>
            <div className="text-gray-900 text-sm mb-2">SIESA DIGITAL S.A.S.</div>
            <div className="text-xs text-gray-600">Minería de datos, BI y trazabilidad</div>
          </div>

          <div className="bg-white/95 rounded-xl p-4 border-2 border-yellow-500/30 cursor-pointer hover:border-yellow-500 transition-all"
            onClick={() => openModal('Proceso Ronda del Río Fucha',
              <div className="text-gray-700 space-y-3">
                <p>Con auto de fecha <strong>20 de enero de 2023</strong>, la Juez 19 Administrativa solicitó informe final de entrega de predios, a lo cual se le dio cumplimiento por los interiores 1 y 3. La sociedad Globerty no fue involucrada.</p>
                <p>Con relación al incidente de desacato contra Pollo Fiesta, <strong>no prosperó</strong> en favor de la Alcaldía de Kennedy, dentro de la restitución de la ronda del Río Fucha.</p>
                <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-300">
                  <p className="text-sm font-semibold mb-2">Por fuera del término legal para responder por parte de la Alcaldía menor de Kennedy:</p>
                  <ul className="text-sm space-y-2 list-disc list-inside">
                    <li>Recurso de excepción de pérdida de ejecutoriedad ante presunta sanción desde 2023.</li>
                    <li>Recurso de reposición subsidiariamente con el de apelación desde el año 2023.</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-600">Como oposición y en defensa técnica a la <strong>Resolución #348 del 6 de junio de 2023</strong>, por presunto incumplimiento a Resolución 455 del año 2007, acción decidida por la Alcaldía de Kennedy por supuesto acto de rebeldía.</p>
              </div>
            )}>
            <AlertCircle className="w-8 h-8 text-yellow-600 mb-3" />
            <div className="text-yellow-600 font-semibold mb-2">Río Fucha</div>
            <div className="text-gray-900 text-sm mb-2">Recurso de excepción</div>
            <div className="text-xs text-gray-600">Pérdida de ejecutoriedad</div>
          </div>

        </div>
      </motion.div>

      {/* Marco Tributario */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Scale className="w-6 h-6 text-orange-600" />
          Marco Tributario 2025
        </h3>

        {/* Tarjetas resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          {/* Cumplimiento */}
          <div className="bg-green-50 rounded-xl p-4 border-2 border-green-300 cursor-pointer hover:border-green-500 transition-all"
            onClick={() => openModal('Cumplimiento Tributario 2025',
              <div className="text-gray-700 space-y-4">
                <p>En materia tributaria por el año gravable 2.025, Pollo Fiesta S.A. elaboró y presentó oportunamente todas las declaraciones de impuestos nacionales y territoriales.</p>
                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Recuperación IVA ante la DIAN:</p>
                  <p className="text-3xl font-black text-green-700 text-center my-3">$13.966.302.000</p>
                  <p className="text-sm text-center text-gray-600">Recuperados por saldos a favor en IVA, sin ningún tipo de glosa.</p>
                </div>
              </div>
            )}>
            <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
            <div className="text-green-700 font-bold mb-1">Cumplimiento Tributario</div>
            <div className="text-gray-900 text-xl font-black">$13.966.302.000</div>
            <div className="text-xs text-gray-600 mt-2">IVA recuperado ante la DIAN — sin glosa</div>
          </div>

          {/* Impuestos Saludables */}
          <div className="bg-red-50 rounded-xl p-4 border-2 border-red-300 cursor-pointer hover:border-red-500 transition-all"
            onClick={() => openModal('Impuestos Saludables',
              <div className="text-gray-700 space-y-4">
                <p>Continúa vigente el impuesto que se paga por importar o producir <strong>bebidas ultra procesadas azucaradas</strong> y <strong>alimentos ultra procesados o azucarados</strong>. Son dos grupos distintos con tarifas distintas.</p>
                <p className="text-sm font-semibold text-gray-800">Tarifas para alimentos ultra procesados o azucarados:</p>
                <div className="space-y-2">
                  {[
                    { anio: '2023', tasa: '10%', active: false },
                    { anio: '2024', tasa: '15%', active: false },
                    { anio: '2025 y siguientes', tasa: '20%', active: true },
                  ].map((item) => (
                    <div key={item.anio} className={`rounded-lg p-3 flex items-center justify-between ${item.active ? 'bg-red-100 border-2 border-red-400' : 'bg-gray-100 border border-gray-200'}`}>
                      <span className="font-semibold text-gray-900">{item.anio}</span>
                      <span className={`text-2xl font-black ${item.active ? 'text-red-600' : 'text-gray-500'}`}>{item.tasa}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}>
            <AlertCircle className="w-8 h-8 text-red-600 mb-3" />
            <div className="text-red-700 font-bold mb-1">Impuestos Saludables</div>
            <div className="text-gray-900 text-2xl font-black">20%</div>
            <div className="text-xs text-gray-600 mt-2">Tasa vigente 2025 y siguientes</div>
          </div>

          {/* Tasa mínima */}
          <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-300 cursor-pointer hover:border-orange-500 transition-all"
            onClick={() => openModal('Tasa Mínima de Tributación — Art. 240 Par. 6',
              <div className="text-gray-700 space-y-4">
                <p className="text-sm leading-relaxed">
                  Continúa vigente el artículo 240, en su parágrafo 6, que establece una <strong className="text-orange-700">tasa mínima de tributación (TTD) no inferior al 15%</strong> para los contribuyentes del impuesto sobre la renta, calculada a partir de la utilidad financiera depurada.
                </p>
                {/* Fórmula TTD */}
                <div className="bg-orange-50 rounded-xl p-5 border-2 border-orange-300 text-center">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Tasa de Tributación Depurada (TTD):</p>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-3xl font-black italic text-gray-900">TTD =</span>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-black italic text-gray-900 border-b-4 border-gray-900 px-6 pb-1">ID</span>
                      <span className="text-2xl font-black italic text-gray-900 pt-1 px-6">UD</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">ID = Impuesto Depurado &nbsp;|&nbsp; UD = Utilidad Depurada</p>
                </div>
                {/* Fórmula IA */}
                <div className="bg-white rounded-xl p-4 border-2 border-orange-200 text-center">
                  <p className="text-sm text-gray-600 mb-2">Para contribuyentes sin consolidación, la diferencia positiva es un mayor impuesto a adicionar:</p>
                  <p className="text-xl font-black text-orange-700">IA = (UD × 15%) − ID</p>
                </div>
                {/* Resultado Pollo Fiesta */}
                <div className="bg-green-50 rounded-xl p-4 border-2 border-green-300">
                  <p className="text-sm font-bold text-gray-900 mb-1">Resultado Pollo Fiesta — Año gravable 2025:</p>
                  <p className="text-sm text-gray-700">Pollo Fiesta incrementó su tasa de tributación en <strong className="text-green-700">41,15%</strong> con relación al impuesto neto de renta del año 2.024.</p>
                </div>
              </div>
            )}>
            <Scale className="w-8 h-8 text-orange-600 mb-3" />
            <div className="text-orange-700 font-bold mb-1">Tasa Mínima (TTD)</div>
            <div className="text-gray-900 text-2xl font-black">≥ 15%</div>
            <div className="text-xs text-gray-600 mt-2">Pollo Fiesta 2025: +41,15% vs 2024</div>
          </div>

        </div>

        {/* Detalle narrativo */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>
            <strong className="text-gray-900">Cumplimiento general:</strong> En materia tributaria por el año gravable 2.025, Pollo Fiesta S.A. elaboró y presentó oportunamente todas las declaraciones de impuestos nacionales y territoriales. Por saldos a favor en IVA se recuperaron ante la DIAN <strong className="text-green-700">$13.966.302.000</strong>, sin ningún tipo de glosa.
          </p>
          <p>
            <strong className="text-gray-900">Impuestos saludables:</strong> Continúa vigente el impuesto que se paga por importar o producir bebidas ultra procesadas azucaradas y alimentos ultra procesados o azucarados — dos grupos distintos con tarifas distintas. Para alimentos ultra procesados: 2023: 10% · 2024: 15% · <strong className="text-red-600">2025 y siguientes: 20%</strong>.
          </p>
          <p>
            <strong className="text-gray-900">Tasa mínima de tributación (Art. 240 Par. 6):</strong> La Tasa de Tributación Depurada (TTD) no podrá ser inferior al 15% y resulta de dividir el Impuesto Depurado (ID) sobre la Utilidad Depurada (UD). Para contribuyentes sin consolidación, la diferencia positiva entre <em>(UD × 15%) − ID</em> se adiciona como mayor impuesto (IA). Pollo Fiesta incrementó su tasa de tributación en <strong className="text-orange-700">41,15%</strong> con relación al impuesto neto de renta del año 2.024.
          </p>
        </div>
      </motion.div>

      {/* Modal */}
      {createPortal(
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-4xl w-full border-4 border-blue-500 shadow-2xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-gray-900 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-700 leading-relaxed overflow-y-auto flex-1 pr-2">{modalContent.content}</div>
              <div className="mt-6 flex justify-end flex-shrink-0">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  Entendido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </div>
  );
}
