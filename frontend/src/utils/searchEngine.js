// Motor de búsqueda inteligente con NLP avanzado

// Diccionario completo de sinónimos y términos relacionados
const SYNONYMS = {
  // Comparaciones y análisis
  'compara': ['comparar', 'comparación', 'comparativa', 'vs', 'versus', 'diferencia', 'contrasta', 'coteja', 'confronta', 'entre', 'contra'],
  'analiza': ['analizar', 'análisis', 'estudia', 'revisa', 'examina', 'evalúa', 'diagnostica', 'investiga', 'mira', 'chequea', 'verifica'],
  'muestra': ['mostrar', 'ver', 'visualiza', 'enseña', 'presenta', 'exhibe', 'despliega', 'expone', 'dame', 'dime', 'cual', 'cuales', 'que'],
  'calcula': ['calcular', 'suma', 'total', 'cuánto', 'cuanto', 'monto', 'cantidad', 'valor', 'cuanta', 'cuantos'],
  'explica': ['explicar', 'detalla', 'describe', 'aclara', 'interpreta', 'como', 'porque', 'por que'],
  
  // Activos - General
  'activos': ['activo', 'bienes', 'recursos', 'patrimonio activo', 'posesiones', 'haberes', 'tenemos', 'poseemos', 'tengo'],
  'activos corrientes': ['activo corriente', 'activo circulante', 'activos líquidos', 'capital de trabajo', 'activo corto plazo'],
  'activos fijos': ['activo fijo', 'activos no corrientes', 'propiedad planta equipo', 'inmovilizado', 'activo largo plazo', 'ppe'],
  
  // Activos - Específicos
  'disponible': ['efectivo', 'caja', 'bancos', 'dinero disponible', 'liquidez inmediata', 'tesorería', 'cash', 'plata', 'dinero', 'efectivo en caja', 'saldo bancario'],
  'inventarios': ['inventario', 'mercancía', 'stock', 'existencias', 'productos', 'mercaderías', 'bodega', 'almacén', 'mercancia'],
  'cuentas por cobrar': ['cartera', 'deudores', 'clientes', 'por cobrar', 'cxc', 'créditos', 'facturas por cobrar', 'ventas a crédito', 'nos deben'],
  'inversiones': ['inversión', 'portafolio', 'títulos valores', 'acciones', 'bonos', 'cdts', 'certificados'],
  'propiedad': ['propiedades', 'inmuebles', 'edificios', 'terrenos', 'bienes raíces', 'finca raíz', 'locales', 'oficinas'],
  'maquinaria': ['equipos', 'maquinaria y equipo', 'activos fijos', 'herramientas', 'vehículos', 'maquinas', 'equipo de computo', 'computadores'],
  'intangibles': ['intangible', 'marcas', 'patentes', 'goodwill', 'software', 'licencias', 'derechos'],
  
  // Pasivos - General
  'pasivos': ['pasivo', 'deudas', 'obligaciones', 'compromisos', 'adeudos', 'débitos', 'debemos', 'debo', 'prestamos'],
  'pasivos corrientes': ['pasivo corriente', 'pasivo circulante', 'deuda corto plazo', 'obligaciones inmediatas', 'pasivo corto plazo'],
  'pasivos largo plazo': ['pasivo no corriente', 'deuda largo plazo', 'obligaciones futuras', 'pasivo no corriente'],
  
  // Pasivos - Específicos
  'obligaciones financieras': ['préstamos', 'créditos', 'deuda bancaria', 'financiamiento', 'empréstitos', 'crédito bancario', 'prestamo bancario', 'deuda con bancos'],
  'proveedores': ['cuentas por pagar', 'acreedores', 'por pagar', 'cxp', 'suministradores', 'debemos a proveedores', 'facturas por pagar'],
  'impuestos': ['tributos', 'impuestos por pagar', 'obligaciones fiscales', 'gravámenes', 'contribuciones', 'iva', 'renta', 'dian'],
  'nómina': ['salarios', 'sueldos', 'remuneraciones', 'pagos personal', 'costos laborales', 'empleados', 'trabajadores', 'nomina por pagar'],
  'bonos': ['bonos por pagar', 'obligaciones', 'debentures', 'títulos deuda'],
  
  // Patrimonio
  'patrimonio': ['capital', 'equity', 'patrimonio neto', 'fondos propios', 'capital contable', 'recursos propios', 'nuestro', 'propio', 'de nosotros'],
  'capital social': ['capital', 'aportes', 'capital suscrito', 'capital pagado', 'acciones', 'aporte de socios', 'capital inicial'],
  'reservas': ['reserva legal', 'reservas acumuladas', 'reserva estatutaria', 'fondos reserva', 'reserva obligatoria'],
  'utilidades': ['ganancias', 'beneficios', 'resultados', 'utilidad del ejercicio', 'lucro', 'rendimiento', 'ganamos', 'ganancia', 'profit'],
  'utilidades retenidas': ['resultados acumulados', 'ganancias retenidas', 'utilidades no distribuidas', 'utilidades acumuladas'],
  'superávit': ['superavit', 'excedente', 'revalorización', 'plusvalía', 'surplus'],
  
  // Ratios e Indicadores Financieros
  'liquidez': ['solvencia', 'capacidad de pago', 'disponibilidad', 'razón corriente', 'prueba ácida', 'podemos pagar', 'capacidad pago'],
  'endeudamiento': ['apalancamiento', 'nivel de deuda', 'ratio de deuda', 'leverage', 'cobertura', 'que tan endeudados', 'cuanta deuda'],
  'rentabilidad': ['rendimiento', 'retorno', 'ganancia', 'beneficio', 'roa', 'roe', 'margen', 'que tan rentable', 'cuanto ganamos'],
  'eficiencia': ['rotación', 'productividad', 'desempeño', 'gestión', 'operatividad', 'que tan eficientes'],
  'solvencia': ['solidez', 'estabilidad', 'fortaleza financiera', 'capacidad pago largo plazo', 'que tan solventes'],
  'cobertura': ['cobertura intereses', 'capacidad servicio deuda', 'protección', 'podemos cubrir'],
  
  // Métricas de Variación
  'variación': ['cambio', 'diferencia', 'incremento', 'decremento', 'evolución', 'crecimiento', 'reducción', 'aumento', 'disminución'],
  'crecimiento': ['aumento', 'incremento', 'expansión', 'alza', 'subida', 'mejora', 'crecio', 'creció', 'subio', 'subió'],
  'disminución': ['reducción', 'decremento', 'baja', 'caída', 'descenso', 'merma', 'bajo', 'bajó', 'cayo', 'cayó'],
  'porcentaje': ['porcentual', '%', 'tasa', 'proporción', 'ratio', 'por ciento'],
  
  // Períodos Temporales
  '2025': ['año actual', 'este año', 'actual', 'presente', 'vigente', 'ahora', 'hoy', 'actualmente'],
  '2024': ['año anterior', 'año pasado', 'anterior', 'previo', 'precedente', 'antes', 'pasado'],
  'anual': ['año', 'ejercicio', 'periodo', 'fiscal', 'ejercicio fiscal', 'del año'],
  'trimestre': ['trimestral', 'quarter', 'cuatrimestre', '3 meses'],
  'mensual': ['mes', 'monthly', 'del mes'],
  
  // Acciones y Verbos
  'evolución': ['tendencia', 'comportamiento', 'desarrollo', 'progreso', 'trayectoria', 'curso', 'como ha cambiado', 'como cambio'],
  'balance': ['estado financiero', 'situación financiera', 'balance general', 'estado posición financiera', 'balances'],
  'total': ['suma', 'sumatoria', 'agregado', 'consolidado', 'global', 'conjunto', 'todo', 'todos'],
  'detalle': ['desglose', 'desagregado', 'pormenor', 'especificación', 'breakdown', 'detallado'],
  'resumen': ['síntesis', 'sumario', 'compendio', 'extracto', 'overview', 'resumido'],
  'proyección': ['proyectar', 'estimación', 'pronóstico', 'previsión', 'forecast', 'proyectado'],
  
  // Estados Financieros
  'estado resultados': ['p&l', 'pyg', 'pérdidas ganancias', 'income statement', 'estado pérdidas ganancias', 'perdidas y ganancias'],
  'flujo caja': ['cash flow', 'flujo efectivo', 'estado flujos efectivo', 'movimiento efectivo', 'flujo de caja'],
  'estado cambios patrimonio': ['variación patrimonio', 'cambios equity', 'movimiento patrimonio'],
  
  // Términos de Asamblea
  'asamblea': ['junta', 'reunión accionistas', 'junta directiva', 'board meeting', 'reunion'],
  'informe': ['reporte', 'presentación', 'memoria', 'documento', 'exposición', 'informe ejecutivo'],
  'accionistas': ['socios', 'inversionistas', 'shareholders', 'propietarios', 'dueños'],
  'dividendos': ['distribución utilidades', 'reparto beneficios', 'pago accionistas', 'repartir utilidades'],
  
  // Análisis Comparativo
  'mejor': ['superior', 'mayor', 'óptimo', 'favorable', 'positivo', 'mas alto', 'más alto'],
  'peor': ['inferior', 'menor', 'desfavorable', 'negativo', 'adverso', 'mas bajo', 'más bajo'],
  'igual': ['similar', 'equivalente', 'mismo', 'idéntico', 'parejo', 'parecido'],
  
  // Términos Técnicos
  'depreciación': ['amortización', 'desgaste', 'deterioro', 'obsolescencia', 'depreciacion'],
  'provisión': ['reserva', 'previsión', 'estimación', 'allowance', 'provision'],
  'valuación': ['valoración', 'tasación', 'avalúo', 'apreciación', 'valuacion'],
  'consolidación': ['consolidado', 'agregado', 'combinado', 'integrado', 'consolidacion'],
  
  // Preguntas comunes
  'cuanto': ['cuánto', 'cuanta', 'cuánta', 'cuantos', 'cuántos', 'que tanto', 'qué tanto'],
  'como': ['cómo', 'de que manera', 'de qué manera'],
  'donde': ['dónde', 'en donde', 'en dónde'],
  'cuando': ['cuándo', 'en que momento', 'en qué momento'],
  'porque': ['por qué', 'por que', 'cual es la razon', 'cuál es la razón'],
  'cual': ['cuál', 'que', 'qué'],
  
  // Términos coloquiales
  'plata': ['dinero', 'efectivo', 'cash', 'recursos', 'fondos'],
  'deuda': ['debemos', 'debo', 'adeudo', 'prestamo', 'préstamo'],
  'ganancia': ['utilidad', 'beneficio', 'profit', 'ganamos'],
  'perdida': ['pérdida', 'deficit', 'déficit', 'perdimos'],
  'tenemos': ['tengo', 'poseemos', 'contamos con', 'disponemos'],
  'debemos': ['debo', 'adeudamos', 'nos toca pagar']
};

// Palabras clave para detectar intenciones
const INTENT_KEYWORDS = {
  compare: ['compara', 'comparar', 'comparación', 'comparativa', 'vs', 'versus', 'diferencia', 'contrasta', 'entre', 'coteja'],
  analyze: ['analiza', 'analizar', 'análisis', 'estudia', 'revisa', 'examina', 'evalúa', 'diagnostica'],
  show: ['muestra', 'mostrar', 'ver', 'visualiza', 'enseña', 'presenta', 'exhibe', 'despliega'],
  calculate: ['calcula', 'calcular', 'suma', 'total', 'cuánto', 'cuanto', 'monto', 'valor'],
  evolution: ['evolución', 'tendencia', 'comportamiento', 'cambio', 'variación', 'desarrollo', 'progreso'],
  explain: ['explica', 'explicar', 'detalla', 'describe', 'aclara', 'interpreta'],
  report: ['informe', 'reporte', 'presentación', 'asamblea', 'junta', 'exposición'],
  ratio: ['ratio', 'indicador', 'índice', 'razón', 'coeficiente', 'métrica']
};

// Categorías de cuentas
const CATEGORIES = {
  activos: ['ACTIVOS', 'ACTIVO'],
  pasivos: ['PASIVOS', 'PASIVO'],
  patrimonio: ['PATRIMONIO', 'CAPITAL']
};

// Normalizar texto
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .trim();
};

// Expandir query con sinónimos
export const expandQuery = (query) => {
  const normalized = normalizeText(query);
  const words = normalized.split(/\s+/);
  const expandedTerms = new Set([normalized]);
  
  words.forEach(word => {
    Object.entries(SYNONYMS).forEach(([key, synonyms]) => {
      if (synonyms.some(syn => normalizeText(syn).includes(word) || word.includes(normalizeText(syn)))) {
        expandedTerms.add(key);
        synonyms.forEach(syn => expandedTerms.add(normalizeText(syn)));
      }
    });
  });
  
  return Array.from(expandedTerms);
};

// Detectar intención del usuario
export const detectIntent = (query) => {
  const normalized = normalizeText(query);
  
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (keywords.some(keyword => normalized.includes(keyword))) {
      return intent;
    }
  }
  
  return 'search';
};

// Buscar en datos con scoring
export const smartSearch = (query, data) => {
  if (!query || query.length < 2) return [];
  
  const expandedTerms = expandQuery(query);
  const allItems = [
    ...data.activos.map(item => ({ ...item, category: 'ACTIVOS' })),
    ...data.pasivos.map(item => ({ ...item, category: 'PASIVOS' })),
    ...data.patrimonio.map(item => ({ ...item, category: 'PATRIMONIO' }))
  ];
  
  // Calcular score para cada item
  const scoredItems = allItems.map(item => {
    let score = 0;
    const itemText = normalizeText(`${item.accountName} ${item.category} ${item.subcategory || ''}`);
    
    expandedTerms.forEach(term => {
      if (itemText.includes(term)) {
        // Más puntos si coincide con el nombre de cuenta
        if (normalizeText(item.accountName).includes(term)) {
          score += 10;
        }
        // Puntos si coincide con categoría
        if (normalizeText(item.category).includes(term)) {
          score += 5;
        }
        // Puntos si coincide con subcategoría
        if (item.subcategory && normalizeText(item.subcategory).includes(term)) {
          score += 3;
        }
        // Puntos base por cualquier coincidencia
        score += 1;
      }
    });
    
    return { ...item, score };
  });
  
  // Filtrar items con score > 0 y ordenar por score
  return scoredItems
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
};

// Generar sugerencias de autocompletado inteligentes
export const generateAutocompleteSuggestions = (query) => {
  if (!query || query.length < 1) {
    // Sugerencias iniciales sin query
    return [
      'Compara activos vs pasivos',
      'Analiza liquidez corriente',
      'Informe para asamblea',
      'Evolución patrimonio 2024-2025',
      'Nivel de endeudamiento',
      'Rentabilidad del ejercicio'
    ];
  }
  
  const normalized = normalizeText(query);
  const suggestions = [];
  
  // Sugerencias de comparación
  if (normalized.match(/compar|vs|versus|diferenc|contrast/)) {
    suggestions.push(
      'Compara activos vs pasivos totales',
      'Compara disponible con obligaciones financieras',
      'Compara 2024 vs 2025 todos los rubros',
      'Compara patrimonio con pasivos',
      'Compara activos corrientes vs pasivos corrientes',
      'Compara inventarios con cuentas por cobrar'
    );
  }
  
  // Sugerencias de análisis
  if (normalized.match(/anali|estudi|revis|evalu|diagnost/)) {
    suggestions.push(
      'Analiza liquidez corriente y prueba ácida',
      'Analiza nivel de endeudamiento',
      'Analiza rentabilidad sobre activos',
      'Analiza evolución del patrimonio',
      'Analiza estructura de capital',
      'Analiza solvencia financiera'
    );
  }
  
  // Sugerencias de visualización
  if (normalized.match(/muestra|ver|visualiz|enseñ|present|exhib/)) {
    suggestions.push(
      'Muestra todos los activos corrientes',
      'Muestra pasivos de largo plazo',
      'Muestra evolución del capital social',
      'Muestra balance general completo',
      'Muestra desglose de patrimonio',
      'Muestra obligaciones financieras'
    );
  }
  
  // Sugerencias para asamblea/informe
  if (normalized.match(/asamblea|informe|reporte|junta|present|expos/)) {
    suggestions.push(
      'Informe ejecutivo para asamblea',
      'Resumen financiero para accionistas',
      'Indicadores clave de gestión',
      'Análisis comparativo anual',
      'Estado de situación financiera',
      'Evolución patrimonial del ejercicio'
    );
  }
  
  // Sugerencias por categoría ACTIVOS
  if (normalized.match(/activ/)) {
    suggestions.push(
      'Activos corrientes vs no corrientes',
      'Activos totales y su composición',
      'Variación de activos 2024-2025',
      'Activos líquidos disponibles',
      'Activos fijos y depreciación',
      'Rotación de activos'
    );
  }
  
  // Sugerencias por categoría PASIVOS
  if (normalized.match(/pasiv|deud|obligac/)) {
    suggestions.push(
      'Pasivos corrientes y su vencimiento',
      'Pasivos de largo plazo',
      'Total pasivos y estructura',
      'Obligaciones financieras bancarias',
      'Pasivos vs patrimonio (leverage)',
      'Cobertura de pasivos'
    );
  }
  
  // Sugerencias por categoría PATRIMONIO
  if (normalized.match(/patrimoni|capital|equity/)) {
    suggestions.push(
      'Patrimonio total y composición',
      'Capital social y aportes',
      'Reservas legales y estatutarias',
      'Utilidades retenidas acumuladas',
      'Evolución del patrimonio neto',
      'Rentabilidad sobre patrimonio (ROE)'
    );
  }
  
  // Sugerencias de LIQUIDEZ
  if (normalized.match(/liquid|solvenc|pago|disponib/)) {
    suggestions.push(
      'Liquidez corriente (activo/pasivo corriente)',
      'Prueba ácida (sin inventarios)',
      'Disponible vs obligaciones inmediatas',
      'Capacidad de pago corto plazo',
      'Capital de trabajo neto',
      'Ciclo de conversión de efectivo'
    );
  }
  
  // Sugerencias de ENDEUDAMIENTO
  if (normalized.match(/deud|endeud|apalancam|leverage/)) {
    suggestions.push(
      'Nivel de endeudamiento total',
      'Ratio pasivos/patrimonio',
      'Apalancamiento financiero',
      'Cobertura de intereses',
      'Deuda de corto vs largo plazo',
      'Capacidad de endeudamiento'
    );
  }
  
  // Sugerencias de RENTABILIDAD
  if (normalized.match(/rentabil|rendimient|gananci|utilidad|benefici/)) {
    suggestions.push(
      'Rentabilidad sobre activos (ROA)',
      'Rentabilidad sobre patrimonio (ROE)',
      'Margen de utilidad neta',
      'Utilidades del ejercicio',
      'Crecimiento de utilidades',
      'Distribución de dividendos'
    );
  }
  
  // Sugerencias de EVOLUCIÓN/VARIACIÓN
  if (normalized.match(/evolu|tendenc|cambio|variaci|crecimient/)) {
    suggestions.push(
      'Evolución patrimonio 2024-2025',
      'Tendencia de activos totales',
      'Cambios en estructura financiera',
      'Variación anual por rubro',
      'Crecimiento de capital',
      'Análisis de tendencias'
    );
  }
  
  // Sugerencias específicas de cuentas
  if (normalized.match(/disponib|efectiv|caja|banco/)) {
    suggestions.push(
      'Disponible total en bancos',
      'Efectivo y equivalentes',
      'Variación de disponible',
      'Liquidez inmediata'
    );
  }
  
  if (normalized.match(/inventari|mercanci|stock|existenc/)) {
    suggestions.push(
      'Inventarios totales',
      'Rotación de inventarios',
      'Variación de existencias',
      'Inventarios vs ventas'
    );
  }
  
  if (normalized.match(/cobrar|cartera|deudor|client/)) {
    suggestions.push(
      'Cuentas por cobrar totales',
      'Cartera de clientes',
      'Rotación de cartera',
      'Días de cobro promedio'
    );
  }
  
  if (normalized.match(/pagar|proveedor|acreedor/)) {
    suggestions.push(
      'Cuentas por pagar proveedores',
      'Obligaciones con proveedores',
      'Rotación de proveedores',
      'Días de pago promedio'
    );
  }
  
  // Sugerencias de ratios financieros
  if (normalized.match(/ratio|indicador|indice|razon|coeficient|metric/)) {
    suggestions.push(
      'Ratios de liquidez completos',
      'Indicadores de endeudamiento',
      'Ratios de rentabilidad',
      'Indicadores de eficiencia',
      'Métricas de solvencia',
      'KPIs financieros clave'
    );
  }
  
  // Sugerencias de períodos
  if (normalized.match(/2024|2025|anual|año|ejercici/)) {
    suggestions.push(
      'Comparativo 2024 vs 2025',
      'Cierre del ejercicio 2025',
      'Variación anual por categoría',
      'Resultados del año actual',
      'Análisis interanual'
    );
  }
  
  // Sugerencias generales si no hay coincidencias específicas
  if (suggestions.length === 0) {
    suggestions.push(
      'Compara activos vs pasivos totales',
      'Analiza liquidez y solvencia',
      'Informe ejecutivo para asamblea',
      'Evolución patrimonio 2024-2025',
      'Indicadores financieros clave',
      'Balance general consolidado'
    );
  }
  
  return suggestions.slice(0, 8);
};

// Interpretar query y generar acción
export const interpretQuery = (query, data) => {
  const intent = detectIntent(query);
  const normalized = normalizeText(query);
  
  // Detectar comparación específica
  if (intent === 'compare') {
    // Activos vs Pasivos
    if ((normalized.includes('activ') && normalized.includes('pasiv')) ||
        (normalized.includes('activ') && normalized.includes('deud'))) {
      const totalActivos = data.activos.find(i => i.subcategory === 'TOTAL');
      const totalPasivos = data.pasivos.find(i => i.subcategory === 'TOTAL');
      return {
        action: 'compare',
        items: [totalActivos, totalPasivos].filter(Boolean),
        description: 'Comparación Activos vs Pasivos'
      };
    }
    
    // Liquidez
    if (normalized.includes('liquid') || 
        (normalized.includes('disponib') && normalized.includes('obligac'))) {
      const disponible = data.activos.find(i => i.accountName.includes('DISPONIBLE'));
      const obligaciones = data.pasivos.find(i => i.accountName.includes('OBLIGACIONES FINANCIERAS'));
      return {
        action: 'compare',
        items: [disponible, obligaciones].filter(Boolean),
        description: 'Análisis de Liquidez'
      };
    }
    
    // 2024 vs 2025
    if ((normalized.includes('2024') && normalized.includes('2025')) ||
        normalized.includes('anual') || normalized.includes('año')) {
      const totalActivos = data.activos.find(i => i.subcategory === 'TOTAL');
      return {
        action: 'compare',
        items: [totalActivos].filter(Boolean),
        description: 'Comparación 2024 vs 2025'
      };
    }
  }
  
  // Evolución del patrimonio
  if ((intent === 'evolution' || intent === 'analyze') && 
      (normalized.includes('patrimoni') || normalized.includes('capital'))) {
    const patrimonio = data.patrimonio.filter(i => i.subcategory !== 'TOTAL');
    return {
      action: 'compare',
      items: patrimonio,
      description: 'Evolución del Patrimonio'
    };
  }
  
  // Búsqueda general
  const results = smartSearch(query, data);
  return {
    action: 'search',
    items: results,
    description: `Resultados para "${query}"`
  };
};

// Términos populares categorizados para asamblea
export const POPULAR_SEARCHES = {
  asamblea: [
    'Informe ejecutivo para asamblea',
    'Resumen financiero accionistas',
    'Indicadores clave de gestión (KPIs)',
    'Estado de situación financiera',
    'Análisis comparativo anual 2024-2025'
  ],
  liquidez: [
    'Analiza liquidez corriente',
    'Prueba ácida (sin inventarios)',
    'Disponible vs obligaciones',
    'Capital de trabajo neto',
    'Capacidad de pago inmediato'
  ],
  endeudamiento: [
    'Nivel de endeudamiento total',
    'Ratio pasivos/patrimonio',
    'Apalancamiento financiero',
    'Cobertura de intereses',
    'Estructura de deuda'
  ],
  rentabilidad: [
    'Rentabilidad sobre activos (ROA)',
    'Rentabilidad sobre patrimonio (ROE)',
    'Margen de utilidad neta',
    'Crecimiento de utilidades',
    'Retorno de inversión'
  ],
  comparativas: [
    'Compara activos vs pasivos totales',
    'Compara 2024 vs 2025 todos los rubros',
    'Activos corrientes vs pasivos corrientes',
    'Patrimonio vs pasivos',
    'Disponible vs obligaciones financieras'
  ],
  evolucion: [
    'Evolución patrimonio 2024-2025',
    'Tendencia de activos totales',
    'Variación anual por categoría',
    'Crecimiento del capital',
    'Cambios en estructura financiera'
  ],
  cuentas: [
    'Disponible en bancos',
    'Inventarios totales',
    'Cuentas por cobrar',
    'Obligaciones financieras',
    'Capital social',
    'Utilidades retenidas'
  ]
};

// Obtener todas las búsquedas populares
export const getAllPopularSearches = () => {
  return Object.values(POPULAR_SEARCHES).flat();
};

// Calcular métricas financieras para asamblea
export const calculateFinancialMetrics = (data) => {
  const totalActivos2025 = data.activos.find(i => i.subcategory === 'TOTAL')?.value2025 || 0;
  const totalActivos2024 = data.activos.find(i => i.subcategory === 'TOTAL')?.value2024 || 0;
  const totalPasivos2025 = data.pasivos.find(i => i.subcategory === 'TOTAL')?.value2025 || 0;
  const totalPasivos2024 = data.pasivos.find(i => i.subcategory === 'TOTAL')?.value2024 || 0;
  const totalPatrimonio2025 = data.patrimonio.find(i => i.subcategory === 'TOTAL')?.value2025 || 0;
  const totalPatrimonio2024 = data.patrimonio.find(i => i.subcategory === 'TOTAL')?.value2024 || 0;
  
  // Activos corrientes y no corrientes
  const activosCorrientes2025 = data.activos
    .filter(i => i.subcategory === 'CORRIENTE')
    .reduce((sum, i) => sum + i.value2025, 0);
  const activosCorrientes2024 = data.activos
    .filter(i => i.subcategory === 'CORRIENTE')
    .reduce((sum, i) => sum + i.value2024, 0);
    
  // Pasivos corrientes
  const pasivosCorrientes2025 = data.pasivos
    .filter(i => i.subcategory === 'CORRIENTE')
    .reduce((sum, i) => sum + i.value2025, 0);
  const pasivosCorrientes2024 = data.pasivos
    .filter(i => i.subcategory === 'CORRIENTE')
    .reduce((sum, i) => sum + i.value2024, 0);
  
  // Disponible
  const disponible2025 = data.activos.find(i => i.accountName.includes('DISPONIBLE'))?.value2025 || 0;
  const disponible2024 = data.activos.find(i => i.accountName.includes('DISPONIBLE'))?.value2024 || 0;
  
  // Inventarios
  const inventarios2025 = data.activos.find(i => i.accountName.includes('INVENTARIOS'))?.value2025 || 0;
  const inventarios2024 = data.activos.find(i => i.accountName.includes('INVENTARIOS'))?.value2024 || 0;
  
  // Utilidades
  const utilidades2025 = data.patrimonio.find(i => i.accountName.includes('UTILIDAD'))?.value2025 || 0;
  const utilidades2024 = data.patrimonio.find(i => i.accountName.includes('UTILIDAD'))?.value2024 || 0;
  
  return {
    // Ratios de Liquidez
    liquidezCorriente2025: activosCorrientes2025 / pasivosCorrientes2025,
    liquidezCorriente2024: activosCorrientes2024 / pasivosCorrientes2024,
    pruebaAcida2025: (activosCorrientes2025 - inventarios2025) / pasivosCorrientes2025,
    pruebaAcida2024: (activosCorrientes2024 - inventarios2024) / pasivosCorrientes2024,
    capitalTrabajo2025: activosCorrientes2025 - pasivosCorrientes2025,
    capitalTrabajo2024: activosCorrientes2024 - pasivosCorrientes2024,
    
    // Ratios de Endeudamiento
    nivelEndeudamiento2025: (totalPasivos2025 / totalActivos2025) * 100,
    nivelEndeudamiento2024: (totalPasivos2024 / totalActivos2024) * 100,
    apalancamiento2025: totalPasivos2025 / totalPatrimonio2025,
    apalancamiento2024: totalPasivos2024 / totalPatrimonio2024,
    autonomiaFinanciera2025: (totalPatrimonio2025 / totalActivos2025) * 100,
    autonomiaFinanciera2024: (totalPatrimonio2024 / totalActivos2024) * 100,
    
    // Ratios de Rentabilidad
    roa2025: (utilidades2025 / totalActivos2025) * 100,
    roa2024: (utilidades2024 / totalActivos2024) * 100,
    roe2025: (utilidades2025 / totalPatrimonio2025) * 100,
    roe2024: (utilidades2024 / totalPatrimonio2024) * 100,
    
    // Variaciones
    variacionActivos: ((totalActivos2025 - totalActivos2024) / totalActivos2024) * 100,
    variacionPasivos: ((totalPasivos2025 - totalPasivos2024) / totalPasivos2024) * 100,
    variacionPatrimonio: ((totalPatrimonio2025 - totalPatrimonio2024) / totalPatrimonio2024) * 100,
    variacionUtilidades: ((utilidades2025 - utilidades2024) / Math.abs(utilidades2024)) * 100,
    
    // Valores absolutos
    totalActivos2025,
    totalActivos2024,
    totalPasivos2025,
    totalPasivos2024,
    totalPatrimonio2025,
    totalPatrimonio2024,
    utilidades2025,
    utilidades2024,
    disponible2025,
    disponible2024
  };
};

// Generar insights para asamblea
export const generateAssemblyInsights = (metrics) => {
  const insights = [];
  
  // Análisis de Liquidez
  if (metrics.liquidezCorriente2025 > 2) {
    insights.push({
      type: 'positive',
      category: 'Liquidez',
      message: `Excelente liquidez corriente de ${metrics.liquidezCorriente2025.toFixed(2)}. La empresa puede cubrir ${metrics.liquidezCorriente2025.toFixed(2)} veces sus obligaciones de corto plazo.`,
      priority: 'high'
    });
  } else if (metrics.liquidezCorriente2025 >= 1.5) {
    insights.push({
      type: 'neutral',
      category: 'Liquidez',
      message: `Liquidez corriente saludable de ${metrics.liquidezCorriente2025.toFixed(2)}. Capacidad adecuada para cubrir obligaciones inmediatas.`,
      priority: 'medium'
    });
  } else if (metrics.liquidezCorriente2025 < 1) {
    insights.push({
      type: 'warning',
      category: 'Liquidez',
      message: `Liquidez corriente de ${metrics.liquidezCorriente2025.toFixed(2)} está por debajo de 1. Se requiere atención para mejorar la capacidad de pago.`,
      priority: 'high'
    });
  }
  
  // Análisis de Endeudamiento
  if (metrics.nivelEndeudamiento2025 < 50) {
    insights.push({
      type: 'positive',
      category: 'Endeudamiento',
      message: `Nivel de endeudamiento saludable del ${metrics.nivelEndeudamiento2025.toFixed(1)}%. La empresa mantiene una estructura financiera sólida.`,
      priority: 'medium'
    });
  } else if (metrics.nivelEndeudamiento2025 >= 70) {
    insights.push({
      type: 'warning',
      category: 'Endeudamiento',
      message: `Nivel de endeudamiento elevado del ${metrics.nivelEndeudamiento2025.toFixed(1)}%. Se recomienda evaluar estrategias de reducción de deuda.`,
      priority: 'high'
    });
  }
  
  // Análisis de Rentabilidad
  if (metrics.roe2025 > 15) {
    insights.push({
      type: 'positive',
      category: 'Rentabilidad',
      message: `Excelente rentabilidad sobre patrimonio (ROE) del ${metrics.roe2025.toFixed(1)}%. Los accionistas obtienen un retorno superior al promedio.`,
      priority: 'high'
    });
  } else if (metrics.roe2025 > 0) {
    insights.push({
      type: 'neutral',
      category: 'Rentabilidad',
      message: `ROE del ${metrics.roe2025.toFixed(1)}%. La empresa genera retornos positivos para los accionistas.`,
      priority: 'medium'
    });
  } else {
    insights.push({
      type: 'warning',
      category: 'Rentabilidad',
      message: `ROE negativo del ${metrics.roe2025.toFixed(1)}%. Se requiere revisar la estrategia operativa para mejorar resultados.`,
      priority: 'high'
    });
  }
  
  // Análisis de Crecimiento
  if (metrics.variacionPatrimonio > 10) {
    insights.push({
      type: 'positive',
      category: 'Crecimiento',
      message: `Crecimiento patrimonial del ${metrics.variacionPatrimonio.toFixed(1)}%. Excelente fortalecimiento de la posición financiera.`,
      priority: 'high'
    });
  } else if (metrics.variacionPatrimonio < 0) {
    insights.push({
      type: 'warning',
      category: 'Crecimiento',
      message: `Disminución patrimonial del ${Math.abs(metrics.variacionPatrimonio).toFixed(1)}%. Se requiere análisis de las causas y plan de acción.`,
      priority: 'high'
    });
  }
  
  // Análisis de Capital de Trabajo
  if (metrics.capitalTrabajo2025 > 0) {
    insights.push({
      type: 'positive',
      category: 'Capital de Trabajo',
      message: `Capital de trabajo positivo. La empresa cuenta con recursos para operaciones diarias.`,
      priority: 'medium'
    });
  } else {
    insights.push({
      type: 'warning',
      category: 'Capital de Trabajo',
      message: `Capital de trabajo negativo. Se requiere atención inmediata para mejorar la liquidez operativa.`,
      priority: 'high'
    });
  }
  
  return insights.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};
