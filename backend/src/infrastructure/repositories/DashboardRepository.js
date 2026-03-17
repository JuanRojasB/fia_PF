const IDashboardRepository = require('../../domain/repositories/IDashboardRepository');
const { getInstance } = require('../database/connection');

/**
 * Dashboard Repository - Adaptado a erp_pollo_fiesta
 * Usa vistas y tablas reales con datos completos
 */
class DashboardRepository extends IDashboardRepository {
  
  // ==================== COMERCIAL ====================
  
  async getGestionComercial() {
    const db = getInstance();
    const pool = db.getPool();
    
    // Vista: Análisis de ventas por categoría (2024 vs 2025)
    const [analisisVentas] = await pool.query(`
      SELECT * FROM vista_com_analisis_ventas ORDER BY anio DESC, kilos_vendidos DESC
    `);
    
    // Vista: KPIs de pollo entero (2023-2025)
    const [kpisPollo] = await pool.query(`
      SELECT * FROM vista_com_kpi_pollo_entero ORDER BY anio DESC
    `);
    
    // Vista: Unidades procesadas por centro
    const [unidadesProcesadas] = await pool.query(`
      SELECT * FROM vista_com_unidades_procesadas ORDER BY anio DESC, unidades DESC
    `);
    
    // Vista: Comparativo de huevo multianual
    const [comparativoHuevo] = await pool.query(`
      SELECT * FROM vista_com_huevo_comparativo_multianual
    `);
    
    // Vista: Participación PDV por zona 2024 - NUEVA
    const [pdvParticipacionZona] = await pool.query(`
      SELECT * FROM vista_com_pdv_participacion_zona_2024 ORDER BY zona_asignacion, participacion_pollo_pct DESC
    `);
    
    // Ventas zonales comparativas (2024 vs 2023)
    const [ventasZonales] = await pool.query(`
      SELECT * FROM com_pdv_ventas_zonales ORDER BY anio DESC, zona_geografica
    `);
    
    // Top desempeño PDV
    const [topDesempeno] = await pool.query(`
      SELECT * FROM com_pdv_top_desempeno WHERE anio = 2024 ORDER BY kilos_pollo DESC
    `);
    
    // Ventas detalladas Sede 3 (Refrigerado/Congelado)
    const [ventasSede3] = await pool.query(`
      SELECT 
        anio,
        estado_conservacion,
        codigo_linea,
        nombre_linea,
        kilos_vendidos,
        precio_promedio,
        (kilos_vendidos * precio_promedio) as ingresos_calculados
      FROM com_sede3_ventas_detalle
      ORDER BY anio DESC, kilos_vendidos DESC
    `);
    
    // Ventas Sede 3 agrupadas por temperatura (para dashboard Institucional/Moderno)
    const [ventasSede3Temperatura] = await pool.query(`
      SELECT 
        estado_conservacion as temperatura,
        codigo_linea,
        nombre_linea,
        SUM(CASE WHEN anio = 2025 THEN kilos_vendidos ELSE 0 END) as kilos_2025,
        SUM(CASE WHEN anio = 2024 THEN kilos_vendidos ELSE 0 END) as kilos_2024,
        AVG(CASE WHEN anio = 2025 THEN precio_promedio ELSE NULL END) as precio_2025,
        AVG(CASE WHEN anio = 2024 THEN precio_promedio ELSE NULL END) as precio_2024
      FROM com_sede3_ventas_detalle
      GROUP BY estado_conservacion, codigo_linea, nombre_linea
      ORDER BY estado_conservacion, kilos_2025 DESC
    `);
    
    // Ventas Sede 1 agrupadas por temperatura (para dashboard Asadero)
    const [ventasSede1Temperatura] = await pool.query(`
      SELECT 
        estado_conservacion as temperatura,
        codigo_linea,
        nombre_linea,
        SUM(CASE WHEN anio = 2025 THEN kilos_vendidos ELSE 0 END) as kilos_2025,
        SUM(CASE WHEN anio = 2024 THEN kilos_vendidos ELSE 0 END) as kilos_2024,
        AVG(CASE WHEN anio = 2025 THEN precio_promedio ELSE NULL END) as precio_2025,
        AVG(CASE WHEN anio = 2024 THEN precio_promedio ELSE NULL END) as precio_2024
      FROM com_sede1_ventas_detalle
      GROUP BY estado_conservacion, codigo_linea, nombre_linea
      ORDER BY estado_conservacion, kilos_2025 DESC
    `);
    
    // Resumen de ventas por línea de producto (COMPLETO con Mayorista) - NUEVO
    const [ventasResumenLinea] = await pool.query(`
      SELECT 
        codigo_linea,
        nombre_linea,
        kilos_2025,
        kilos_2024,
        participacion_pct_2025,
        variacion_kilos,
        variacion_kilos_pct,
        precio_promedio_2025,
        precio_promedio_2024,
        variacion_precio_pct
      FROM ventas_resumen_linea
      WHERE codigo_linea != 999
      ORDER BY kilos_2025 DESC
    `);
    
    // Ventas de huevo por raza
    const [ventasHuevo] = await pool.query(`
      SELECT 
        anio,
        raza_produccion,
        unidades_vendidas,
        precio_promedio_unidad,
        ingresos_totales_calculados,
        utilidad_neta_millones,
        margen_neto_pct
      FROM com_ventas_huevo
      ORDER BY anio DESC, unidades_vendidas DESC
    `);
    
    // Todos los puntos de venta
    const [puntosVenta] = await pool.query(`
      SELECT * FROM com_pdv_maestro ORDER BY zona_geografica, nombre_pdv
    `);
    
    // Agrupaciones comerciales
    const [agrupaciones] = await pool.query(`
      SELECT 
        a.nombre_agrupacion,
        a.lider_comercial,
        c.nombre_categoria
      FROM com_agrupaciones a
      LEFT JOIN com_categorias c ON a.id_categoria = c.id_categoria
      ORDER BY c.nombre_categoria, a.nombre_agrupacion
    `);
    
    // Objetivos de pollo entero
    const [objetivos] = await pool.query(`
      SELECT * FROM com_objetivo_pollo_entero ORDER BY anio DESC
    `);
    
    // Metas operativas Sede 3 - CON TODOS LOS CAMPOS
    const [metasSede3] = await pool.query(`
      SELECT 
        anio,
        kilos_recibidos_canal,
        ventas_kilos_generales,
        ingresos_totales,
        precio_promedio_kilo,
        dias_rotacion_cartera,
        fuerza_comercial_asesores,
        fuerza_comercial_servicio_cliente,
        fuerza_comercial_mercaderistas,
        (COALESCE(fuerza_comercial_asesores,0) + COALESCE(fuerza_comercial_servicio_cliente,0) + COALESCE(fuerza_comercial_mercaderistas,0)) as total_fuerza_comercial
      FROM com_sede3_metas_operativas
      ORDER BY anio DESC
    `);
    
    // Ventas por categoría (Pie/Canal) - COMPLETO
    const [ventasPieCanal] = await pool.query(`
      SELECT 
        v.anio,
        c.nombre_categoria,
        v.kilos_vendidos,
        v.ingresos_pesos,
        (v.ingresos_pesos / v.kilos_vendidos) as precio_promedio_kg
      FROM com_ventas_pie_canal v
      LEFT JOIN com_categorias c ON v.id_categoria = c.id_categoria
      ORDER BY v.anio DESC, v.kilos_vendidos DESC
    `);
    
    // Unidades procesadas por centro - NUEVO
    const [unidadesPorCentro] = await pool.query(`
      SELECT 
        anio,
        centro_operacion,
        unidades
      FROM com_unidades_procesadas
      ORDER BY anio DESC, unidades DESC
    `);
    
    // Rendimiento de líneas de producto - NUEVO
    const [rendimientoLineas] = await pool.query(`
      SELECT 
        anio,
        nombre_linea,
        clasificacion,
        variacion_kilos,
        variacion_volumen_pct,
        variacion_precio_pct,
        observaciones
      FROM com_rendimiento_lineas
      ORDER BY anio DESC, variacion_kilos DESC
    `);
    
    // Asignación mayorista (para ComercialResumenDashboard)
    const [asignacionMayorista] = await pool.query(`
      SELECT 
        anio,
        centro_operacion,
        unidades
      FROM com_unidades_procesadas
      ORDER BY anio DESC, centro_operacion
    `);
    
    // Calcular totales SOLO si no existen en vistas - USAR DATOS DE BD
    const total2025 = analisisVentas
      .filter(v => v.anio === 2025)
      .reduce((sum, v) => sum + parseFloat(v.kilos_vendidos || 0), 0);
    
    const total2024 = analisisVentas
      .filter(v => v.anio === 2024)
      .reduce((sum, v) => sum + parseFloat(v.kilos_vendidos || 0), 0);
    
    const ingresos2025 = analisisVentas
      .filter(v => v.anio === 2025)
      .reduce((sum, v) => sum + parseFloat(v.ingresos_pesos || 0), 0);
    
    const ingresos2024 = analisisVentas
      .filter(v => v.anio === 2024)
      .reduce((sum, v) => sum + parseFloat(v.ingresos_pesos || 0), 0);
    
    // Variación ya viene calculada en participacion_kilos_pct de la vista
    const variacionKilos = total2024 > 0 
      ? (((total2025 - total2024) / total2024) * 100).toFixed(2) 
      : 0;
    
    const variacionIngresos = ingresos2024 > 0 
      ? (((ingresos2025 - ingresos2024) / ingresos2024) * 100).toFixed(2) 
      : 0;
    
    return {
      // Vistas principales
      analisisVentas,
      kpisPollo,
      unidadesProcesadas,
      comparativoHuevo,
      pdvParticipacionZona,
      ventasZonales,
      topDesempeno,
      
      // Ventas detalladas
      ventasSede3,
      ventasSede3Temperatura,
      ventasSede1Temperatura,
      ventasResumenLinea,
      ventasHuevo,
      ventasPieCanal,
      unidadesPorCentro,
      rendimientoLineas,
      
      // Asignación mayorista
      asignacionMayorista,
      
      // Estructura organizacional
      puntosVenta,
      agrupaciones,
      
      // Metas y objetivos
      objetivos,
      metasSede3,
      
      // Totales calculados
      totales: {
        kilos2025: total2025,
        kilos2024: total2024,
        variacionKilosPct: parseFloat(variacionKilos),
        ingresos2025: ingresos2025,
        ingresos2024: ingresos2024,
        variacionIngresosPct: parseFloat(variacionIngresos),
        totalPuntosVenta: puntosVenta.length,
        totalAgrupaciones: agrupaciones.length
      }
    };
  }

  // ==================== CARTERA ====================
  
  async getGestionCartera() {
    const db = getInstance();
    const pool = db.getPool();
    
    // Datos mensuales detallados de gestión de cartera 2024
    const datosMensuales2024 = [
      { mes: 'Ene-24', total_cartera: 17368824347, cartera_vencida: 7355885001, indice_morosidad: 42.35, variacion_cartera_vencida: 1627583813, dias_rotacion: 15.33, pct_contado: 43.53, ventas_contado: 14804790413, pct_credito: 57.88, ventas_credito: 20357461041, ventas_netas: 35174184601 },
      { mes: 'Feb-24', total_cartera: 17667659324, cartera_vencida: 7554763544, indice_morosidad: 42.76, variacion_cartera_vencida: -198878543, dias_rotacion: 15.65, pct_contado: 42.33, ventas_contado: 14653779643, pct_credito: 58.11, ventas_credito: 20341586407, ventas_netas: 35006559698 },
      { mes: 'Mar-24', total_cartera: 18554837177, cartera_vencida: 8731368137, indice_morosidad: 47.06, variacion_cartera_vencida: -1176804593, dias_rotacion: 16.58, pct_contado: 43.03, ventas_contado: 15813998981, pct_credito: 54.48, ventas_credito: 18942547900, ventas_netas: 34767205811 },
      { mes: 'Abr-24', total_cartera: 17160989796, cartera_vencida: 6258895055, indice_morosidad: 36.47, variacion_cartera_vencida: 2472673082, dias_rotacion: 14.79, pct_contado: 37.39, ventas_contado: 14507990904, pct_credito: 59.68, ventas_credito: 21485828897, ventas_netas: 36003410790 },
      { mes: 'May-24', total_cartera: 17296613033, cartera_vencida: 6385802980, indice_morosidad: 36.92, variacion_cartera_vencida: -126907925, dias_rotacion: 15.16, pct_contado: 36.77, ventas_contado: 13858670323, pct_credito: 61.42, ventas_credito: 21355314192, ventas_netas: 34767444917 },
      { mes: 'Jun-24', total_cartera: 17369318696, cartera_vencida: 7027952880, indice_morosidad: 40.46, variacion_cartera_vencida: -642149900, dias_rotacion: 15.76, pct_contado: 39.76, ventas_contado: 13592178875, pct_credito: 62.28, ventas_credito: 20596911612, ventas_netas: 33072431000 },
      { mes: 'Jul-24', total_cartera: 16985702845, cartera_vencida: 7631424812, indice_morosidad: 44.93, variacion_cartera_vencida: 603471932, dias_rotacion: 14.16, pct_contado: 40.36, ventas_contado: 14868008366, pct_credito: 61.05, ventas_credito: 21974083207, ventas_netas: 35994048000 },
      { mes: 'Ago-24', total_cartera: 18241184484, cartera_vencida: 7487362499, indice_morosidad: 41.05, variacion_cartera_vencida: -144062313, dias_rotacion: 14.76, pct_contado: 40.99, ventas_contado: 15200467396, pct_credito: 58.92, ventas_credito: 21847344860, ventas_netas: 37080665532 },
      { mes: 'Sep-24', total_cartera: 19078117955, cartera_vencida: 8562206834, indice_morosidad: 44.88, variacion_cartera_vencida: 1074844335, dias_rotacion: 16.68, pct_contado: 38.79, ventas_contado: 13306759121, pct_credito: 61.11, ventas_credito: 20964059466, ventas_netas: 34303533147 },
      { mes: 'Oct-24', total_cartera: 20492871054, cartera_vencida: 9967323267, indice_morosidad: 48.64, variacion_cartera_vencida: 1405116433, dias_rotacion: 16.35, pct_contado: 39.93, ventas_contado: 15015991287, pct_credito: 59.98, ventas_credito: 22556031862, ventas_netas: 37606648926 },
      { mes: 'Nov-24', total_cartera: 18127942076, cartera_vencida: 8108510595, indice_morosidad: 44.73, variacion_cartera_vencida: -1858812672, dias_rotacion: 18.39, pct_contado: 37.56, ventas_contado: 13229692488, pct_credito: 62.44, ventas_credito: 21990982839, ventas_netas: 35220896424 },
      { mes: 'Dic-24', total_cartera: 17161524439, cartera_vencida: 8696468873, indice_morosidad: 50.67, variacion_cartera_vencida: 587958278, dias_rotacion: 20.86, pct_contado: 43.11, ventas_contado: 16664266926, pct_credito: 56.89, ventas_credito: 21991418905, ventas_netas: 38656486182 },
    ];

    // Datos mensuales detallados de gestión de cartera 2025
    const datosMensuales = [
      { mes: 'Ene-25', total_cartera: 14412689391, cartera_vencida: 6176399177, indice_morosidad: 42.85, variacion_cartera_vencida: -2520069696, dias_rotacion: 19.78, pct_contado: 35.86, pct_credito: 64.13, ventas_contado: 11987878785, ventas_credito: 21437479983, ventas_netas: 33428115870 },
      { mes: 'Feb-25', total_cartera: 15097421607, cartera_vencida: 7065964437, indice_morosidad: 46.80, variacion_cartera_vencida: 889565260, dias_rotacion: 16.59, pct_contado: 33.54, pct_credito: 66.46, ventas_contado: 10438364907, ventas_credito: 20679848688, ventas_netas: 31118341350 },
      { mes: 'Mar-25', total_cartera: 14469921094, cartera_vencida: 7277406809, indice_morosidad: 50.29, variacion_cartera_vencida: 211442372, dias_rotacion: 16.47, pct_contado: 35.13, pct_credito: 64.87, ventas_contado: 11609872525, ventas_credito: 21437803674, ventas_netas: 33048101757 },
      { mes: 'Abr-25', total_cartera: 17936508752, cartera_vencida: 8717656442, indice_morosidad: 48.60, variacion_cartera_vencida: 1440249633, dias_rotacion: 14.39, pct_contado: 33.84, pct_credito: 66.16, ventas_contado: 10356355285, ventas_credito: 20251153500, ventas_netas: 30608104632 },
      { mes: 'May-25', total_cartera: 18209254924, cartera_vencida: 7030281613, indice_morosidad: 38.61, variacion_cartera_vencida: -1687374829, dias_rotacion: 15.32, pct_contado: 39.09, pct_credito: 60.91, ventas_contado: 12985883589, ventas_credito: 20238388567, ventas_netas: 33224425996 },
      { mes: 'Jun-25', total_cartera: 18490901842, cartera_vencida: 8583907709, indice_morosidad: 46.42, variacion_cartera_vencida: 1553626096, dias_rotacion: 16.79, pct_contado: 38.01, pct_credito: 61.99, ventas_contado: 11041764270, ventas_credito: 18011416335, ventas_netas: 29053428245 },
      { mes: 'Jul-25', total_cartera: 16734768996, cartera_vencida: 6118360787, indice_morosidad: 36.56, variacion_cartera_vencida: -2465546922, dias_rotacion: 12.69, pct_contado: 38.59, pct_credito: 61.40, ventas_contado: 12805263305, ventas_credito: 20372743972, ventas_netas: 33178713394 },
      { mes: 'Ago-25', total_cartera: 20856456595, cartera_vencida: 10315161061, indice_morosidad: 49.46, variacion_cartera_vencida: 4196800274, dias_rotacion: 17.01, pct_contado: 36.90, pct_credito: 63.10, ventas_contado: 11388755473, ventas_credito: 19478201008, ventas_netas: 30867655227 },
      { mes: 'Sep-25', total_cartera: 17309202563, cartera_vencida: 7218602492, indice_morosidad: 41.70, variacion_cartera_vencida: -3096558569, dias_rotacion: 16.06, pct_contado: 35.76, pct_credito: 64.24, ventas_contado: 11061123842, ventas_credito: 19870276930, ventas_netas: 30931784737 },
      { mes: 'Oct-25', total_cartera: 19652177415, cartera_vencida: 11656799639, indice_morosidad: 59.32, variacion_cartera_vencida: 4438197147, dias_rotacion: 16.05, pct_contado: 40.81, pct_credito: 59.19, ventas_contado: 15827220099, ventas_credito: 22958626315, ventas_netas: 38785846414 },
      { mes: 'Nov-25', total_cartera: 20952520953, cartera_vencida: 10134081938, indice_morosidad: 48.37, variacion_cartera_vencida: -1522717701, dias_rotacion: 16.21, pct_contado: 40.58, pct_credito: 59.42, ventas_contado: 14939957297, ventas_credito: 21873567783, ventas_netas: 36813525080 },
      { mes: 'Dic-25', total_cartera: 16786699697, cartera_vencida: 8487412907, indice_morosidad: 50.56, variacion_cartera_vencida: -1646669031, dias_rotacion: 15.40, pct_contado: 46.85, pct_credito: 53.15, ventas_contado: 20054162655, ventas_credito: 22754467018, ventas_netas: 42808629673 },
    ];

    // Exposición de cartera 2025 vs 2024
    const exposicionCartera = [
      { mes: 'Enero', t2025: 14413, t2024: 17366, variacion: '-17' },
      { mes: 'Febrero', t2025: 15097, t2024: 17668, variacion: '-15' },
      { mes: 'Marzo', t2025: 15568, t2024: 18555, variacion: '-16' },
      { mes: 'Abril', t2025: 17937, t2024: 17161, variacion: '5' },
      { mes: 'Mayo', t2025: 18209, t2024: 16978, variacion: '7' },
      { mes: 'Junio', t2025: 18491, t2024: 17763, variacion: '4' },
      { mes: 'Julio', t2025: 16735, t2024: 17415, variacion: '-4' },
      { mes: 'Agosto', t2025: 20667, t2024: 18241, variacion: '13' },
      { mes: 'Septiembre', t2025: 17110, t2024: 19078, variacion: '-10' },
      { mes: 'Octubre', t2025: 19652, t2024: 20493, variacion: '-4' },
      { mes: 'Noviembre', t2025: 22838, t2024: 18704, variacion: '22' },
      { mes: 'Diciembre', t2025: 16787, t2024: 17162, variacion: '-2' }
    ];

    // Resumen anual
    const resumenAnual = {
      rotacion_dic_2025: '15,40',
      rotacion_dic_2024: '20,86',
      ventas_contado_promedio: '37.91',
      ventas_credito_promedio: '62.09',
      morosidad_promedio: '46.63',
      cartera_dic_2025: 16787,
      variacion_dic: '-2'
    };
    
    return {
      resumenAnual,
      datosMensuales,
      datosMensuales2024,
      exposicionCartera
    };
  }

  // ==================== COMERCIAL PDV ====================
  
  async getComercialPDV() {
    // Datos completamente hardcodeados, no requiere BD
    const resumen = {
      total_pdv: 22,
      total_coordinadores: 7
    };

    const coordinadores = [
      {
        nombre: 'Elmira Gonzalez',
        cantidad_pdv: 7,
        ubicaciones: ['6 puntos en el sur de Bogotá', '1 punto en Fusagasugá']
      },
      {
        nombre: 'Michael Arias',
        cantidad_pdv: 5,
        ubicaciones: ['5 puntos en el Norte de Bogotá']
      },
      {
        nombre: 'Adriana',
        cantidad_pdv: 1,
        ubicaciones: ['Chiquinquirá']
      },
      {
        nombre: 'John Ramirez',
        cantidad_pdv: 2,
        ubicaciones: ['Tunja', 'Sogamoso']
      },
      {
        nombre: 'Julián Mora',
        cantidad_pdv: 5,
        ubicaciones: ['4 locales en Yopal', '1 local en Aguazul']
      },
      {
        nombre: 'Ivan Romero',
        cantidad_pdv: 1,
        ubicaciones: ['Central de carnes del frigorífico de Guadalupe']
      },
      {
        nombre: 'Belisario Eguis',
        cantidad_pdv: 1,
        ubicaciones: ['Visión Colombia']
      }
    ];

    // Crecimiento general PDV 2024 vs 2025 (valores completos)
    const crecimiento = {
      kilos_2024: 2013000,
      kilos_2025: 2451000,
      crecimiento_kilos_pct: 21.76,
      pesos_2024: 18830000000,
      pesos_2025: 23818000000,
      crecimiento_pesos_pct: 26.49,
      destacados: [
        { nombre: 'Toberín', aporte_pesos: 2222000000, kilos: 171000 },
        { nombre: 'Distribuidora Yopal', aporte_pesos: 6922000000, kilos: 755000 }
      ]
    };

    return {
      resumen,
      coordinadores,
      crecimiento
    };
  }

  // ==================== LOGÍSTICA ====================
  
  async getGestionLogistica() {
    const db = getInstance();
    const pool = db.getPool();
    
    console.log('🔍 getGestionLogistica - Iniciando consulta...');
    
    try {
      // Gastos logísticos por sede, año y concepto con JOIN
      const [gastosLogisticos] = await pool.query(`
        SELECT 
          s.nombre_sede as sede,
          g.anio,
          g.concepto_gasto as concepto,
          g.valor_pesos as valor
        FROM log_gastos_operacionales g
        INNER JOIN log_sedes_operacion s ON g.id_sede = s.id_sede
        ORDER BY s.nombre_sede, g.anio DESC, g.concepto_gasto
      `);
      
      console.log('📊 gastosLogisticos obtenidos:', gastosLogisticos.length, 'registros');
      if (gastosLogisticos.length > 0) {
        console.log('📋 Primer registro:', gastosLogisticos[0]);
      }
      
      // Los datos ya vienen en el formato correcto
      const items = gastosLogisticos.map(g => ({
        sede: g.sede.toUpperCase().replace(' ', ''), // "Sede 1" -> "SEDE1"
        anio: parseInt(g.anio),
        concepto: g.concepto,
        valor: parseFloat(g.valor) / 1000 // Convertir de pesos a miles
      }));
      
      console.log('✅ items transformados:', items.length, 'registros');
      if (items.length > 0) {
        console.log('📋 Primeros 3 items:', items.slice(0, 3));
      }
      
      // Control de mermas - con manejo de errores
      let mermas = [];
      try {
        const [result] = await pool.query(`
          SELECT 
            anio,
            sede,
            porcentaje_merma_real,
            porcentaje_meta
          FROM log_control_mermas
          ORDER BY anio DESC, sede
        `);
        mermas = result;
      } catch (error) {
        console.log('⚠️ Tabla log_control_mermas no existe, continuando sin mermas');
      }
      
      // Vista de cumplimiento 2025 - construir desde log_control_mermas si la vista está vacía
      let cumplimiento2025 = [];
      try {
        const [result] = await pool.query(`SELECT * FROM vista_log_cumplimiento_mermas_2025`);
        cumplimiento2025 = result;
      } catch (error) {
        console.log('⚠️ Vista vista_log_cumplimiento_mermas_2025 no existe, continuando sin cumplimiento');
      }

      // Si la vista está vacía, construir desde log_control_mermas
      if (cumplimiento2025.length === 0) {
        const mermas2025 = mermas.filter(m => parseInt(m.anio) === 2025);
        const mermas2024 = mermas.filter(m => parseInt(m.anio) === 2024);
        cumplimiento2025 = mermas2025.map(m => {
          const m2024 = mermas2024.find(x => x.sede === m.sede);
          const mermaReal = parseFloat(m.porcentaje_merma_real);
          const meta = parseFloat(m.porcentaje_meta);
          const merma2024 = m2024 ? parseFloat(m2024.porcentaje_merma_real) : null;
          const brecha = (mermaReal - meta).toFixed(2);
          const mejora = m2024 ? (mermaReal - merma2024).toFixed(2) : null;
          return {
            sede: m.sede,
            merma_2025: mermaReal.toFixed(2),
            meta_establecida: meta.toFixed(2),
            brecha_puntos_porcentuales: brecha,
            merma_2024: merma2024 ? merma2024.toFixed(2) : null,
            mejora_vs_2024: mejora,
            cumple_meta: mermaReal <= meta ? 'Sí' : 'No',
            estado_auditoria: mermaReal <= meta ? 'Cumple meta' : `Brecha ${brecha}pp`
          };
        });
        console.log('✅ cumplimiento2025 construido desde log_control_mermas:', cumplimiento2025.length, 'registros');
      }
      
      // Calcular promedios por sede
      const porSede = mermas.reduce((acc, m) => {
        const sede = m.sede || 'General';
        if (!acc[sede]) {
          acc[sede] = { registros: 0, mermaPromedio: 0, metaPromedio: 0 };
        }
        acc[sede].registros += 1;
        acc[sede].mermaPromedio += parseFloat(m.porcentaje_merma_real) || 0;
        acc[sede].metaPromedio += parseFloat(m.porcentaje_meta) || 0;
        return acc;
      }, {});
      
      Object.keys(porSede).forEach(sede => {
        const data = porSede[sede];
        data.mermaPromedio = (data.mermaPromedio / data.registros).toFixed(2);
        data.metaPromedio = (data.metaPromedio / data.registros).toFixed(2);
        data.cumple = parseFloat(data.mermaPromedio) <= parseFloat(data.metaPromedio);
      });
      
      console.log('📦 Retornando datos:', {
        itemsCount: items.length,
        mermasCount: mermas.length,
        cumplimiento2025Count: cumplimiento2025.length,
        sedesEvaluadas: Object.keys(porSede).length
      });
      
      return {
        items,
        mermas,
        cumplimiento2025,
        porSede,
        totales: {
          totalRegistros: items.length,
          sedesEvaluadas: Object.keys(porSede).length
        }
      };
    } catch (error) {
      console.error('❌ Error en getGestionLogistica:', error);
      // Retornar estructura vacía pero válida
      return {
        items: [],
        mermas: [],
        cumplimiento2025: [],
        porSede: {},
        totales: {
          totalRegistros: 0,
          sedesEvaluadas: 0
        },
        error: error.message
      };
    }
  }

  // ==================== PRODUCCIÓN ====================
  
  async getProduccionGranjas() {
    const db = getInstance();
    const pool = db.getPool();
    
    // Todas las granjas con detalles completos
    const [granjas] = await pool.query(`
      SELECT 
        nombre_granja,
        linea,
        zona_climatica,
        metros_cuadrados,
        capacidad_aves,
        (capacidad_aves / metros_cuadrados) as densidad_aves_m2
      FROM prod_granjas
      ORDER BY linea, capacidad_aves DESC
    `);
    
    // Capacidad y clima por zona
    const [capacidadClima] = await pool.query(`
      SELECT * FROM prod_capacidad_clima ORDER BY anio DESC, pct_participacion_calculado DESC
    `);
    
    // Equipo de producción
    const [equipoProduccion] = await pool.query(`
      SELECT * FROM prod_equipo_produccion ORDER BY anio DESC
    `);
    
    // Calcular totales
    const totalAves = granjas.reduce((sum, g) => sum + (parseInt(g.capacidad_aves) || 0), 0);
    const totalMetros = granjas.reduce((sum, g) => sum + (parseFloat(g.metros_cuadrados) || 0), 0);
    const densidadPromedio = totalMetros > 0 ? (totalAves / totalMetros).toFixed(2) : 0;
    
    // Agrupar por línea
    const porLinea = granjas.reduce((acc, g) => {
      const linea = g.linea || 'Sin línea';
      if (!acc[linea]) {
        acc[linea] = { granjas: 0, aves: 0, metros: 0, densidad: 0 };
      }
      acc[linea].granjas += 1;
      acc[linea].aves += parseInt(g.capacidad_aves) || 0;
      acc[linea].metros += parseFloat(g.metros_cuadrados) || 0;
      return acc;
    }, {});
    
    // Calcular densidad por línea
    Object.keys(porLinea).forEach(linea => {
      const data = porLinea[linea];
      data.densidad = data.metros > 0 ? (data.aves / data.metros).toFixed(2) : 0;
    });
    
    // Agrupar por zona climática
    const porZona = granjas.reduce((acc, g) => {
      const zona = g.zona_climatica || 'Sin zona';
      if (!acc[zona]) {
        acc[zona] = { granjas: 0, aves: 0, metros: 0 };
      }
      acc[zona].granjas += 1;
      acc[zona].aves += parseInt(g.capacidad_aves) || 0;
      acc[zona].metros += parseFloat(g.metros_cuadrados) || 0;
      return acc;
    }, {});
    
    return {
      granjas,
      capacidadClima,
      equipoProduccion,
      porLinea,
      porZona,
      totales: {
        totalGranjas: granjas.length,
        totalAves,
        totalMetros: totalMetros.toFixed(2),
        densidadPromedio: parseFloat(densidadPromedio),
        totalPersonal: equipoProduccion.reduce((sum, e) => sum + (parseInt(e.total_personas) || 0), 0)
      }
    };
  }

  async getProduccionHistorico() {
    const db = getInstance();
    const pool = db.getPool();
    
    // Encasetamiento mensual (2024-2025)
    const [encasetamiento] = await pool.query(`
      SELECT 
        anio,
        mes,
        valor_programado,
        valor_real,
        (valor_real - valor_programado) as diferencia,
        (valor_real / valor_programado * 100) as porcentaje_cumplimiento
      FROM prod_encasetamiento
      ORDER BY anio DESC, mes
    `);
    
    // Encasetamiento anual con comparativas
    const [encasetamientoAnual] = await pool.query(`
      SELECT * FROM prod_encasetamiento_anual ORDER BY anio DESC
    `);
    
    // Pollo entregado anual (histórico 2018-2024)
    const [polloEntregado] = await pool.query(`
      SELECT * FROM prod_pollo_entregado_anual ORDER BY anio DESC
    `);
    
    // Zootecnia pollo (indicadores técnicos)
    const [zootecniaPollo] = await pool.query(`
      SELECT * FROM prod_zootecnia_pollo ORDER BY anio DESC
    `);
    
    // Zootecnia huevo (indicadores técnicos) - ACTUALIZADO
    const [zootecniaHuevo] = await pool.query(`
      SELECT 
        anio,
        saldo_inicial_aves,
        mortalidad_aves,
        mortalidad_aves_tabla_pct,
        mortalidad_aves_real_pct,
        venta_seleccion_aves,
        huevos_producidos,
        huevos_enviados_bodega,
        inventario_final_huevo,
        huevos_producidos_tabla_x_ave_mes,
        huevos_producidos_real_x_ave_mes,
        consumo_alimento_x_ave_kg_tabla,
        consumo_alimento_x_ave_kg_real,
        consumo_alimento_balanceado_kl,
        variacion_absoluta,
        variacion_relativa_pct
      FROM prod_zootecnia_huevo 
      ORDER BY anio DESC
    `);
    
    // Postura - flujo y resumen - ACTUALIZADO
    const [posturaFlujo] = await pool.query(`
      SELECT 
        anio,
        municipio_levante,
        granja_levante,
        semana_salida_productiva,
        granjas_destino_produccion,
        notas
      FROM prod_postura_flujo 
      ORDER BY anio DESC
    `);
    
    const [posturaResumen] = await pool.query(`
      SELECT 
        anio,
        aves_en_produccion_cierre,
        huevos_producidos,
        var_pct_vs_2024_reportado,
        huevos_tabla_x_gallina,
        huevos_real_x_gallina_reportado,
        mejora_vs_estandar_reportado,
        huevos_real_x_gallina_calculado,
        mejora_vs_estandar_calculado,
        notas
      FROM prod_postura_resumen_anual 
      ORDER BY anio DESC
    `);
    
    // Calcular totales y promedios
    const totalProgramado = encasetamiento.reduce((sum, e) => sum + (parseInt(e.valor_programado) || 0), 0);
    const totalReal = encasetamiento.reduce((sum, e) => sum + (parseInt(e.valor_real) || 0), 0);
    const cumplimientoPromedio = totalProgramado > 0 ? ((totalReal / totalProgramado) * 100).toFixed(2) : 0;
    
    // Totales por año
    const totalesPorAnio = encasetamiento.reduce((acc, e) => {
      if (!acc[e.anio]) {
        acc[e.anio] = { programado: 0, real: 0, meses: 0 };
      }
      acc[e.anio].programado += parseInt(e.valor_programado) || 0;
      acc[e.anio].real += parseInt(e.valor_real) || 0;
      acc[e.anio].meses += 1;
      return acc;
    }, {});
    
    return {
      encasetamiento,
      encasetamientoAnual,
      polloEntregado,
      zootecniaPollo,
      zootecniaHuevo,
      posturaFlujo,
      posturaResumen,
      totalesPorAnio,
      totales: {
        totalEncasetamiento: encasetamiento.length,
        totalPolloEntregado: polloEntregado.length,
        totalProgramado,
        totalReal,
        diferencia: totalReal - totalProgramado,
        cumplimientoPromedio: parseFloat(cumplimientoPromedio),
        totalHuevosProducidos: zootecniaHuevo.reduce((sum, h) => sum + (parseInt(h.huevos_producidos) || 0), 0),
        totalAvesPostura: posturaResumen.reduce((sum, p) => sum + (parseInt(p.aves_en_produccion_cierre) || 0), 0)
      }
    };
  }

  // ==================== AUDITORÍA ====================
  
  async getGestionAuditoria() {
    const db = getInstance();
    const pool = db.getPool();
    
    // Auditorías ejecutadas con detalles completos
    const [auditorias] = await pool.query(`
      SELECT 
        id_auditoria,
        fecha_auditoria,
        mes_evaluado,
        anio_evaluado,
        tipo_auditoria,
        area_proceso_auditado,
        id_pdv,
        auditor_responsable,
        estado,
        DATEDIFF(CURDATE(), fecha_auditoria) as dias_desde_auditoria
      FROM aud_auditorias_ejecutadas
      ORDER BY fecha_auditoria DESC
    `);
    
    // Devoluciones mensuales por sede - datos hardcodeados según imagen de referencia
    const devolucionesMensuales = [
      // 2024 — leídos uno a uno de la imagen de referencia
      //                                                  S1    S2    S3
      { anio: 2024, mes_num: 1,  mes_nombre: 'Enero',      sede_1_pct: 3.30, sede_2_pct: 1.30, sede_3_pct: 2.00 },
      { anio: 2024, mes_num: 2,  mes_nombre: 'Febrero',    sede_1_pct: 3.70, sede_2_pct: 1.80, sede_3_pct: 2.00 },
      { anio: 2024, mes_num: 3,  mes_nombre: 'Marzo',      sede_1_pct: 3.80, sede_2_pct: 1.80, sede_3_pct: 2.80 },
      { anio: 2024, mes_num: 4,  mes_nombre: 'Abril',      sede_1_pct: 3.90, sede_2_pct: 3.30, sede_3_pct: 1.50 },
      { anio: 2024, mes_num: 5,  mes_nombre: 'Mayo',       sede_1_pct: 3.40, sede_2_pct: 0.90, sede_3_pct: 1.30 },
      { anio: 2024, mes_num: 6,  mes_nombre: 'Junio',      sede_1_pct: 2.70, sede_2_pct: 0.70, sede_3_pct: 1.30 },
      { anio: 2024, mes_num: 7,  mes_nombre: 'Julio',      sede_1_pct: 2.70, sede_2_pct: 0.80, sede_3_pct: 1.40 },
      { anio: 2024, mes_num: 8,  mes_nombre: 'Agosto',     sede_1_pct: 4.10, sede_2_pct: 1.00, sede_3_pct: 1.40 },
      { anio: 2024, mes_num: 9,  mes_nombre: 'Septiembre', sede_1_pct: 3.00, sede_2_pct: 1.00, sede_3_pct: 1.50 },
      { anio: 2024, mes_num: 10, mes_nombre: 'Octubre',    sede_1_pct: 3.00, sede_2_pct: 0.40, sede_3_pct: 1.50 },
      { anio: 2024, mes_num: 11, mes_nombre: 'Noviembre',  sede_1_pct: 3.20, sede_2_pct: 0.50, sede_3_pct: 1.80 },
      { anio: 2024, mes_num: 12, mes_nombre: 'Diciembre',  sede_1_pct: 2.80, sede_2_pct: 0.40, sede_3_pct: 2.10 },
      // 2025 — leídos uno a uno de la imagen de referencia
      //                                                  S1    S2    S3
      { anio: 2025, mes_num: 1,  mes_nombre: 'Enero',      sede_1_pct: 3.20, sede_2_pct: 0.80, sede_3_pct: 1.50 },
      { anio: 2025, mes_num: 2,  mes_nombre: 'Febrero',    sede_1_pct: 2.70, sede_2_pct: 0.80, sede_3_pct: 1.50 },
      { anio: 2025, mes_num: 3,  mes_nombre: 'Marzo',      sede_1_pct: 4.20, sede_2_pct: 0.80, sede_3_pct: 1.50 },
      { anio: 2025, mes_num: 4,  mes_nombre: 'Abril',      sede_1_pct: 2.80, sede_2_pct: 0.80, sede_3_pct: 1.50 },
      { anio: 2025, mes_num: 5,  mes_nombre: 'Mayo',       sede_1_pct: 2.80, sede_2_pct: 0.80, sede_3_pct: 1.80 },
      { anio: 2025, mes_num: 6,  mes_nombre: 'Junio',      sede_1_pct: 2.80, sede_2_pct: 1.80, sede_3_pct: 2.00 },
      { anio: 2025, mes_num: 7,  mes_nombre: 'Julio',      sede_1_pct: 2.80, sede_2_pct: 0.30, sede_3_pct: 2.00 },
      { anio: 2025, mes_num: 8,  mes_nombre: 'Agosto',     sede_1_pct: 2.80, sede_2_pct: 4.10, sede_3_pct: 1.80 },
      { anio: 2025, mes_num: 9,  mes_nombre: 'Septiembre', sede_1_pct: 2.00, sede_2_pct: 0.40, sede_3_pct: 2.00 },
      { anio: 2025, mes_num: 10, mes_nombre: 'Octubre',    sede_1_pct: 2.40, sede_2_pct: 5.00, sede_3_pct: 4.00 },
      { anio: 2025, mes_num: 11, mes_nombre: 'Noviembre',  sede_1_pct: 2.50, sede_2_pct: 3.00, sede_3_pct: 3.00 },
      { anio: 2025, mes_num: 12, mes_nombre: 'Diciembre',  sede_1_pct: 3.00, sede_2_pct: 1.50, sede_3_pct: 2.80 },
    ];
    
    // Resumen anual hardcodeado
    const devolucionesResumen = [
      { anio: 2025, promedio_compania_pct: 2.26, promedio_sede_1_pct: 2.85, promedio_sede_2_pct: 1.61, promedio_sede_3_pct: 2.31 },
      { anio: 2024, promedio_compania_pct: 2.54, promedio_sede_1_pct: null, promedio_sede_2_pct: null, promedio_sede_3_pct: null },
    ];

    // Variación hardcodeada
    const variacionDevoluciones = {
      pct_2025: 2.26,
      pct_2024: 2.54,
      variacion_puntos_porcentuales: -0.28,
      estado_auditoria: 'Mejora'
    };
    
    let hallazgos = [];
    let planesAccion = [];
    
    // Hallazgos (si existen - opcional)
    try {
      const [result] = await pool.query(`
        SELECT 
          h.id_hallazgo,
          h.id_auditoria,
          h.descripcion_hallazgo,
          h.nivel_riesgo,
          h.requiere_plan_accion,
          a.tipo_auditoria,
          a.area_proceso_auditado,
          a.fecha_auditoria
        FROM aud_hallazgos h
        LEFT JOIN aud_auditorias_ejecutadas a ON h.id_auditoria = a.id_auditoria
        ORDER BY h.nivel_riesgo DESC, a.fecha_auditoria DESC
      `);
      hallazgos = result;
    } catch (error) {
      console.log('⚠️ Tabla aud_hallazgos no existe, continuando sin hallazgos');
    }
    
    // Planes de acción (si existen - opcional)
    try {
      const [result] = await pool.query(`
        SELECT 
          p.id_plan_accion,
          p.id_hallazgo,
          p.accion_correctiva,
          p.fecha_limite,
          p.estado_plan,
          h.descripcion_hallazgo,
          h.nivel_riesgo,
          DATEDIFF(p.fecha_limite, CURDATE()) as dias_para_vencimiento
        FROM aud_planes_accion p
        LEFT JOIN aud_hallazgos h ON p.id_hallazgo = h.id_hallazgo
        ORDER BY p.fecha_limite
      `);
      planesAccion = result;
    } catch (error) {
      console.log('⚠️ Tabla aud_planes_accion no existe, continuando sin planes de acción');
    }
    
    // Agrupar por tipo de auditoría
    const porTipo = auditorias.reduce((acc, a) => {
      const tipo = a.tipo_auditoria || 'Sin tipo';
      if (!acc[tipo]) {
        acc[tipo] = { cantidad: 0, areas: new Set() };
      }
      acc[tipo].cantidad += 1;
      if (a.area_proceso_auditado) {
        acc[tipo].areas.add(a.area_proceso_auditado);
      }
      return acc;
    }, {});
    
    // Convertir Sets a arrays
    Object.keys(porTipo).forEach(tipo => {
      porTipo[tipo].areas = Array.from(porTipo[tipo].areas);
    });
    
    // Procesar devoluciones mensuales por sede
    const devolucionesPorSede = {
      'Sede 1': [],
      'Sede 2': [],
      'Sede 3': []
    };
    
    devolucionesMensuales.forEach(d => {
      devolucionesPorSede['Sede 1'].push({
        anio: d.anio,
        mes: d.mes_nombre,
        mes_num: d.mes_num,
        porcentaje: parseFloat(d.sede_1_pct)
      });
      devolucionesPorSede['Sede 2'].push({
        anio: d.anio,
        mes: d.mes_nombre,
        mes_num: d.mes_num,
        porcentaje: parseFloat(d.sede_2_pct)
      });
      devolucionesPorSede['Sede 3'].push({
        anio: d.anio,
        mes: d.mes_nombre,
        mes_num: d.mes_num,
        porcentaje: parseFloat(d.sede_3_pct)
      });
    });
    
    // Calcular promedio general de devoluciones
    const promedioDevolucionGeneral = devolucionesResumen.length > 0
      ? parseFloat(devolucionesResumen[0].promedio_compania_pct)
      : 0;
    
    return {
      auditorias,
      devolucionesMensuales,
      devolucionesResumen,
      variacionDevoluciones: variacionDevoluciones || null,
      devolucionesPorSede,
      hallazgos,
      planesAccion,
      porTipo,
      totales: {
        totalAuditorias: auditorias.length,
        totalDevolucionesMensuales: devolucionesMensuales.length,
        totalHallazgos: hallazgos.length,
        totalPlanesAccion: planesAccion.length,
        tiposAuditoria: Object.keys(porTipo).length,
        sedesEvaluadas: 3,
        promedioDevolucionGeneral: promedioDevolucionGeneral,
        variacion2025vs2024: variacionDevoluciones[0] ? parseFloat(variacionDevoluciones[0].variacion_puntos_porcentuales) : 0
      }
    };
  }

  // ==================== ASEGURAMIENTO DE CALIDAD ====================
  
  async getGestionCalidad() {
    const db = getInstance();
    const pool = db.getPool();
    
    try {
      // Indicadores de gestión
      let indicadores = [];
      try {
        const [result] = await pool.query(`SELECT * FROM cal_indicadores_gestion ORDER BY anio DESC LIMIT 20`);
        indicadores = result;
      } catch (e) {
        console.log('⚠️ Tabla cal_indicadores_gestion no disponible');
      }
      
      // Métricas de calidad
      let metricas = [];
      try {
        const [result] = await pool.query(`SELECT * FROM cal_metricas_calidad ORDER BY anio DESC, mes DESC LIMIT 50`);
        metricas = result;
      } catch (e) {
        console.log('⚠️ Tabla cal_metricas_calidad no disponible');
      }
      
      // Líneas de acción
      let lineasAccion = [];
      try {
        const [result] = await pool.query(`SELECT * FROM cal_lineas_accion ORDER BY id_linea LIMIT 20`);
        lineasAccion = result;
      } catch (e) {
        console.log('⚠️ Tabla cal_lineas_accion no disponible');
      }
      
      // Acciones por proceso
      let accionesProceso = [];
      try {
        const [result] = await pool.query(`SELECT * FROM cal_acciones_proceso ORDER BY id_proceso LIMIT 50`);
        accionesProceso = result;
      } catch (e) {
        console.log('⚠️ Tabla cal_acciones_proceso no disponible');
      }
      
      // Hitos de sistemas
      let hitosSistemas = [];
      try {
        const [result] = await pool.query(`SELECT * FROM cal_hitos_sistemas ORDER BY fecha_implementacion DESC LIMIT 20`);
        hitosSistemas = result;
      } catch (e) {
        console.log('⚠️ Tabla cal_hitos_sistemas no disponible');
      }
      
      // Calcular totales y promedios
      const totalIndicadores = indicadores.length;
      const totalMetricas = metricas.length;
      const totalLineas = lineasAccion.length;
      const totalAcciones = accionesProceso.length;
      const totalHitos = hitosSistemas.length;
      
      // Agrupar métricas por año
      const metricasPorAnio = metricas.reduce((acc, m) => {
        const anio = m.anio || 2025;
        if (!acc[anio]) {
          acc[anio] = [];
        }
        acc[anio].push(m);
        return acc;
      }, {});
      
      // Agrupar acciones por proceso
      const accionesPorProceso = accionesProceso.reduce((acc, a) => {
        const proceso = a.proceso || 'General';
        if (!acc[proceso]) {
          acc[proceso] = [];
        }
        acc[proceso].push(a);
        return acc;
      }, {});
      
      return {
        indicadores,
        metricas,
        lineasAccion,
        accionesProceso,
        hitosSistemas,
        metricasPorAnio,
        accionesPorProceso,
        totales: {
          totalIndicadores,
          totalMetricas,
          totalLineas,
          totalAcciones,
          totalHitos,
          procesosEvaluados: Object.keys(accionesPorProceso).length,
          aniosRegistrados: Object.keys(metricasPorAnio).length
        }
      };
    } catch (error) {
      console.error('❌ Error en getGestionCalidad:', error);
      // Retornar estructura vacía pero válida
      return {
        indicadores: [],
        metricas: [],
        lineasAccion: [],
        accionesProceso: [],
        hitosSistemas: [],
        metricasPorAnio: {},
        accionesPorProceso: {},
        totales: {
          totalIndicadores: 0,
          totalMetricas: 0,
          totalLineas: 0,
          totalAcciones: 0,
          totalHitos: 0,
          procesosEvaluados: 0,
          aniosRegistrados: 0
        }
      };
    }
  }

  // ==================== GESTIÓN HUMANA ====================
  
  async getGestionHumana() {
    const db = getInstance();
    const pool = db.getPool();
    
    // Planta de Personal
    const [personal] = await pool.query(`
      SELECT 
        anio,
        mes_corte as mes,
        numero_personas
      FROM rh_planta_personal
      ORDER BY anio DESC
    `);
    
    // Costos de Nómina
    const [costos] = await pool.query(`
      SELECT 
        anio,
        costo_nomina_total_pesos,
        horas_extras_cantidad,
        costo_horas_extras_pesos,
        costo_promedio_hora_extra
      FROM rh_costos_nomina
      ORDER BY anio DESC
    `);
    
    // Rotación de Personal
    const [rotacion] = await pool.query(`
      SELECT 
        anio,
        ingresos_personas,
        retiros_personas,
        crecimiento_neto
      FROM rh_rotacion_personal
      ORDER BY anio DESC
    `);
    
    // Motivos de Retiro 2025
    const [motivos] = await pool.query(`
      SELECT 
        motivo,
        cantidad
      FROM gh_motivos_retiro
      WHERE anio = 2025
      ORDER BY cantidad DESC
    `);
    
    // Vistas de análisis
    const [analisisCostos] = await pool.query(`
      SELECT * FROM vista_rh_analisis_costos_25_vs_24
    `);
    
    const [movimientoPlanta] = await pool.query(`
      SELECT * FROM vista_rh_movimiento_planta_25_vs_24 ORDER BY anio DESC
    `);
    
    // Calcular KPIs
    const personal2024 = personal.find(p => p.anio === 2024);
    const personal2025 = personal.find(p => p.anio === 2025);
    const variacionPersonal = personal2024 && personal2025 
      ? (((personal2025.numero_personas - personal2024.numero_personas) / personal2024.numero_personas) * 100).toFixed(2)
      : 0;
    
    const costos2024 = costos.find(c => c.anio === 2024);
    const costos2025 = costos.find(c => c.anio === 2025);
    const variacionNomina = costos2024 && costos2025
      ? (((parseFloat(costos2025.costo_nomina_total_pesos) - parseFloat(costos2024.costo_nomina_total_pesos)) / parseFloat(costos2024.costo_nomina_total_pesos)) * 100).toFixed(2)
      : 0;
    
    const rotacion2024 = rotacion.find(r => r.anio === 2024);
    const rotacion2025 = rotacion.find(r => r.anio === 2025);
    const variacionRetiros = rotacion2024 && rotacion2025
      ? (((rotacion2025.retiros_personas - rotacion2024.retiros_personas) / rotacion2024.retiros_personas) * 100).toFixed(2)
      : 0;
    const variacionIngresos = rotacion2024 && rotacion2025
      ? (((rotacion2025.ingresos_personas - rotacion2024.ingresos_personas) / rotacion2024.ingresos_personas) * 100).toFixed(2)
      : 0;
    
    const variacionHoras = costos2024 && costos2025
      ? (((costos2025.horas_extras_cantidad - costos2024.horas_extras_cantidad) / costos2024.horas_extras_cantidad) * 100).toFixed(2)
      : 0;
    const variacionValorHoras = costos2024 && costos2025
      ? (((parseFloat(costos2025.costo_horas_extras_pesos) - parseFloat(costos2024.costo_horas_extras_pesos)) / parseFloat(costos2024.costo_horas_extras_pesos)) * 100).toFixed(2)
      : 0;
    
    const totalRetiros2025 = motivos.reduce((sum, m) => sum + (parseInt(m.cantidad) || 0), 0);
    
    // Calcular porcentajes de motivos
    const motivosConPorcentaje = motivos.map(m => ({
      ...m,
      porcentaje: totalRetiros2025 > 0 ? parseFloat(((m.cantidad / totalRetiros2025) * 100).toFixed(2)) : 0
    }));
    
    return {
      personal,
      costos,
      rotacion,
      motivos: motivosConPorcentaje,
      analisisCostos,
      movimientoPlanta,
      kpis: {
        personal2024: personal2024?.numero_personas || 0,
        personal2025: personal2025?.numero_personas || 0,
        variacionPersonal: parseFloat(variacionPersonal),
        nomina2024: costos2024?.costo_nomina_total_pesos || 0,
        nomina2025: costos2025?.costo_nomina_total_pesos || 0,
        variacionNomina: parseFloat(variacionNomina),
        retiros2024: rotacion2024?.retiros_personas || 0,
        retiros2025: rotacion2025?.retiros_personas || 0,
        variacionRetiros: parseFloat(variacionRetiros),
        ingresos2024: rotacion2024?.ingresos_personas || 0,
        ingresos2025: rotacion2025?.ingresos_personas || 0,
        variacionIngresos: parseFloat(variacionIngresos),
        horas2024: costos2024?.horas_extras_cantidad || 0,
        horas2025: costos2025?.horas_extras_cantidad || 0,
        variacionHoras: parseFloat(variacionHoras),
        valorHoras2024: costos2024?.costo_horas_extras_pesos || 0,
        valorHoras2025: costos2025?.costo_horas_extras_pesos || 0,
        variacionValorHoras: parseFloat(variacionValorHoras),
        totalRetiros2025: totalRetiros2025
      },
      totales: {
        totalPersonal: personal.length,
        totalCostos: costos.length,
        totalRotacion: rotacion.length,
        totalMotivos: motivos.length
      }
    };
  }

  // ==================== MARKETING ====================
  
  async getGestionMarketing() {
    const db = getInstance();
    const pool = db.getPool();
    
    try {
      // Verificar si existen las tablas y obtener datos
      let indicadores = [];
      let campanas = [];
      let hitos = [];
      let iniciativas = [];
      
      // Intentar obtener indicadores estratégicos
      try {
        const [result] = await pool.query(`SELECT * FROM mkt_indicadores_estrategicos LIMIT 10`);
        indicadores = result;
      } catch (e) {
        console.log('⚠️ Tabla mkt_indicadores_estrategicos no disponible');
      }
      
      // Intentar obtener campañas
      try {
        const [result] = await pool.query(`SELECT * FROM mkt_campanas_publicidad ORDER BY anio DESC LIMIT 50`);
        campanas = result;
      } catch (e) {
        console.log('⚠️ Tabla mkt_campanas_publicidad no disponible');
      }
      
      // Intentar obtener hitos
      try {
        const [result] = await pool.query(`SELECT * FROM mkt_hitos_infraestructura ORDER BY anio DESC LIMIT 20`);
        hitos = result;
      } catch (e) {
        console.log('⚠️ Tabla mkt_hitos_infraestructura no disponible');
      }
      
      // Intentar obtener iniciativas
      try {
        const [result] = await pool.query(`SELECT * FROM mkt_iniciativas_comerciales ORDER BY anio DESC LIMIT 20`);
        iniciativas = result;
      } catch (e) {
        console.log('⚠️ Tabla mkt_iniciativas_comerciales no disponible');
      }
      
      // Calcular totales si hay datos de campañas
      const totalInversion = campanas.reduce((sum, c) => sum + (parseFloat(c.inversion_pesos) || 0), 0);
      const roiPromedio = campanas.length > 0
        ? campanas.reduce((sum, c) => sum + (parseFloat(c.roi_porcentaje) || 0), 0) / campanas.length
        : 0;
      
      // Agrupar campañas por canal si existe la columna
      const porCanal = campanas.reduce((acc, c) => {
        const canal = c.canal || 'General';
        if (!acc[canal]) {
          acc[canal] = { campanas: 0, inversion: 0, roiTotal: 0 };
        }
        acc[canal].campanas += 1;
        acc[canal].inversion += parseFloat(c.inversion_pesos) || 0;
        acc[canal].roiTotal += parseFloat(c.roi_porcentaje) || 0;
        return acc;
      }, {});
      
      // Calcular ROI promedio por canal
      Object.keys(porCanal).forEach(canal => {
        const data = porCanal[canal];
        data.roiPromedio = data.campanas > 0 ? (data.roiTotal / data.campanas).toFixed(2) : 0;
      });
      
      return {
        indicadores,
        campanas,
        hitos,
        iniciativas,
        porCanal,
        totales: {
          totalCampanas: campanas.length,
          totalHitos: hitos.length,
          totalIniciativas: iniciativas.length,
          totalInversion: totalInversion,
          roiPromedio: roiPromedio.toFixed(2),
          canalesActivos: Object.keys(porCanal).length
        }
      };
    } catch (error) {
      console.error('❌ Error en getGestionMarketing:', error);
      // Retornar estructura vacía pero válida
      return {
        indicadores: [],
        campanas: [],
        hitos: [],
        iniciativas: [],
        porCanal: {},
        totales: {
          totalCampanas: 0,
          totalHitos: 0,
          totalIniciativas: 0,
          totalInversion: 0,
          roiPromedio: 0,
          canalesActivos: 0
        },
        error: error.message
      };
    }
  }

  // ==================== SAGRILAFT ====================
  
  async getSistemaSagrilaft() {
    // Datos hardcodeados del informe SAGRILAFT 2022-2025
    // Tabla No. 1: Análisis de datos de Stakeholders no conformes más representativos por SAGRILAFT DEL 2022 al 2025
    
    // Datos de stakeholders no conformes por contraparte (EXACTOS DE LA TABLA)
    const stakeholdersNoConformes = [
      {
        contraparte: 'EMPLEADOS',
        rechazados: 168,
        la_pct: 1,
        ft_pct: 20,
        documentacion_pct: 6,
        antecedentes_pct: 27,
        peps_pct: 3
      },
      {
        contraparte: 'CLIENTES',
        rechazados: 128,
        la_pct: 6,
        ft_pct: 16,
        documentacion_pct: 47,
        antecedentes_pct: 12,
        peps_pct: 3
      },
      {
        contraparte: 'PROVEEDORES',
        rechazados: 6,
        la_pct: 17,
        ft_pct: 50,
        documentacion_pct: 0,
        antecedentes_pct: 0,
        peps_pct: 0
      },
      {
        contraparte: 'TRANSPORTADORES',
        rechazados: 12,
        la_pct: 0,
        ft_pct: 0,
        documentacion_pct: 42,
        antecedentes_pct: 8,
        peps_pct: 0
      }
    ];

    // Total no conformes (última fila de la tabla)
    const totalNoConformes = {
      contraparte: 'TOTAL NO CONFORMES',
      rechazados: 314,
      la_pct: 3,
      ft_pct: 18,
      documentacion_pct: 24,
      antecedentes_pct: 20,
      peps_pct: 3
    };

    // Hallazgos y acciones por área (DEL TEXTO DEL INFORME)
    const hallazgosPorArea = [
      {
        area: 'Gestión Humana',
        hallazgo: '27% candidatos no conformes por antecedentes',
        porcentaje: 27,
        accion: 'Revisión procedimiento PGH-04, nuevos filtros y responsables incluyendo área de granjas',
        fecha_reunion: '14 de enero',
        responsable: 'Oficial de Cumplimiento + Gestión Humana'
      },
      {
        area: 'Logística',
        hallazgo: '47% transportadores no conformes por documentación inadecuada',
        porcentaje: 47,
        accion: 'Actualización completa PGH-06, formatos FCO-05 y FCO-03, modificación lista de chequeo',
        fecha_reunion: '23 de enero',
        responsable: 'Oficial de Cumplimiento + Logística'
      },
      {
        area: 'Logística',
        hallazgo: '8% transportadores no aptos por antecedentes',
        porcentaje: 8,
        accion: 'Inclusión SAGRILAFT en lista de inducción a transportadores nuevos',
        fecha_reunion: '23 de enero',
        responsable: 'Oficial de Cumplimiento + Logística'
      },
      {
        area: 'Compras',
        hallazgo: '50% no conformidad - 3 proveedores con novedades por FT',
        porcentaje: 50,
        cantidad: 3,
        accion: 'Mejora de comunicación y filtros de proveedores',
        fecha_reunion: null,
        responsable: 'Oficial de Cumplimiento + Compras'
      },
      {
        area: 'Comercial',
        hallazgo: '47% incumplimiento en manejo documental',
        porcentaje: 47,
        accion: 'Divulgaciones individuales a vendedores para reducir o eliminar riesgo',
        fecha_reunion: null,
        responsable: 'Oficial de Cumplimiento + Comercial'
      }
    ];

    // Resumen general
    const resumenGeneral = {
      total_validados: 5732,
      total_rechazados: 314,
      porcentaje_rechazo: 5.47,
      periodo: '2022-2025',
      plataforma: 'DATALAFT / Risk Consulting',
      normatividad: [
        'Circular 100-00005 de 2017',
        'Circular 100-000016 de 2020',
        'Circular 100-000015 de 2021'
      ]
    };

    // Meta de mejora
    const metasMejora = [
      {
        indicador: 'Documentación inadecuada',
        valor_actual: 24,
        meta: 10,
        plazo_meses: 6,
        estado: 'En progreso'
      }
    ];

    return {
      stakeholders: stakeholdersNoConformes,
      totalNoConformes: totalNoConformes,
      hallazgos: hallazgosPorArea,
      resumen: resumenGeneral,
      metas: metasMejora,
      totales: {
        total_validados: 5732,
        total_rechazados: 314,
        porcentaje_rechazo: 5.47
      }
    };
  }

  // ==================== BALANCE GENERAL / FUENTES Y USOS ====================
  
  async getFuentesUsos() {
    const db = getInstance();
    const pool = db.getPool();
    
    const [datos] = await pool.query(`
      SELECT * FROM fin_macroeconomia ORDER BY anio DESC
    `);
    
    return {
      items: datos,
      totales: {
        registros: datos.length
      },
      mensaje: datos.length === 0 ? 'Módulo financiero pendiente de configuración' : null
    };
  }

  // ==================== GERENCIA ESTRATÉGICA / PRESUPUESTO 2025 ====================
  
  async getGestionGerencia() {
    // Datos hardcodeados del informe de Presupuesto 2025
    
    // Variables macroeconómicas
    const variablesMacro = {
      inflacion_2024: 5.2,
      inflacion_2025: 5.1,
      crecimiento: 5.4,
      mortalidad_2024: 10.05,
      mortalidad_2025: 9.03,
      reduccion_mortalidad: 1.02
    };

    // Presupuesto de caja
    const presupuestoCaja = {
      efectivo_2024: 48627, // Millones
      efectivo_2025: 77491, // Millones
      incremento_absoluto: 28864, // Millones
      incremento_porcentual: 59
    };

    // Ejecución trimestral - TOTAL PF (en miles) con variaciones por trimestre
    const totalPF = [
      { 
        trimestre: 'I Q', 
        real_2025: 7315860, 
        ppto_2025: 7623210, 
        real_2024: 6734448, 
        real_2023: 6971748, 
        real_2022: 7181036,
        var_25_ppto_vs_real: -4.2,
        var_25_vs_24: 7.9,
        var_24_vs_23: -3.5
      },
      { 
        trimestre: 'II Q', 
        real_2025: 7207680, 
        ppto_2025: 7427250, 
        real_2024: 7026825, 
        real_2023: 7073246, 
        real_2022: 7943886,
        var_25_ppto_vs_real: -3.0,
        var_25_vs_24: 2.5,
        var_24_vs_23: -0.7
      },
      { 
        trimestre: 'III Q', 
        real_2025: 7338200, 
        ppto_2025: 7667942, 
        real_2024: 6881796, 
        real_2023: 7408003, 
        real_2022: 7852724,
        var_25_ppto_vs_real: -4.5,
        var_25_vs_24: 6.2,
        var_24_vs_23: -7.6
      },
      { 
        trimestre: 'IV Q', 
        real_2025: 7940681, 
        ppto_2025: 7940681, 
        real_2024: 7560474, 
        real_2023: 7538868, 
        real_2022: 7640617,
        var_25_ppto_vs_real: 0.0,
        var_25_vs_24: 4.8,
        var_24_vs_23: 0.3
      }
    ];

    // Ejecución trimestral - INTEGRADO MAYORISTA (en miles) con variaciones
    const integradoMayorista = [
      { 
        trimestre: 'I Q', 
        real_2025: 982097, 
        ppto_2025: 1040610, 
        real_2024: 775594, 
        real_2023: 761923, 
        real_2022: 797540,
        var_25_ppto_vs_real: -6.0,
        var_25_vs_24: 21.0,
        var_24_vs_23: 1.8
      },
      { 
        trimestre: 'II Q', 
        real_2025: 917310, 
        ppto_2025: 1093650, 
        real_2024: 842638, 
        real_2023: 685946, 
        real_2022: 839420,
        var_25_ppto_vs_real: -19.2,
        var_25_vs_24: 8.1,
        var_24_vs_23: 18.6
      },
      { 
        trimestre: 'III Q', 
        real_2025: 942600, 
        ppto_2025: 1099214, 
        real_2024: 803255, 
        real_2023: 891413, 
        real_2022: 856721,
        var_25_ppto_vs_real: -16.6,
        var_25_vs_24: 14.8,
        var_24_vs_23: -11.0
      },
      { 
        trimestre: 'IV Q', 
        real_2025: 1103881, 
        ppto_2025: 1103881, 
        real_2024: 932779, 
        real_2023: 842598, 
        real_2022: 777651,
        var_25_ppto_vs_real: 0.0,
        var_25_vs_24: 15.5,
        var_24_vs_23: 9.7
      }
    ];

    // Ejecución trimestral - POLLO CANAL (en miles) con variaciones
    const polloCanal = [
      { 
        trimestre: 'I Q', 
        real_2025: 6333763, 
        ppto_2025: 6582600, 
        real_2024: 5958854, 
        real_2023: 6209825, 
        real_2022: 6383496,
        var_25_ppto_vs_real: -3.9,
        var_25_vs_24: 5.9,
        var_24_vs_23: -4.2
      },
      { 
        trimestre: 'II Q', 
        real_2025: 6290370, 
        ppto_2025: 6333600, 
        real_2024: 6184187, 
        real_2023: 6387300, 
        real_2022: 7104466,
        var_25_ppto_vs_real: -0.7,
        var_25_vs_24: 1.7,
        var_24_vs_23: -3.3
      },
      { 
        trimestre: 'III Q', 
        real_2025: 6395600, 
        ppto_2025: 6568728, 
        real_2024: 6078541, 
        real_2023: 6516590, 
        real_2022: 6996003,
        var_25_ppto_vs_real: -2.7,
        var_25_vs_24: 5.0,
        var_24_vs_23: -7.2
      },
      { 
        trimestre: 'IV Q', 
        real_2025: 6836800, 
        ppto_2025: 6836800, 
        real_2024: 6627695, 
        real_2023: 6696270, 
        real_2022: 6862966,
        var_25_ppto_vs_real: 0.0,
        var_25_vs_24: 3.1,
        var_24_vs_23: -1.0
      }
    ];

    // Calcular totales anuales
    const calcularTotales = (data) => {
      return {
        real_2025: data.reduce((sum, t) => sum + t.real_2025, 0),
        ppto_2025: data.reduce((sum, t) => sum + t.ppto_2025, 0),
        real_2024: data.reduce((sum, t) => sum + t.real_2024, 0),
        real_2023: data.reduce((sum, t) => sum + t.real_2023, 0),
        real_2022: data.reduce((sum, t) => sum + t.real_2022, 0)
      };
    };

    const totalesPF = calcularTotales(totalPF);
    const totalesIntegrado = calcularTotales(integradoMayorista);
    const totalesCanal = calcularTotales(polloCanal);

    // Variaciones
    const variacionPF = {
      var_25_ppto_vs_real: ((totalesPF.real_2025 - totalesPF.ppto_2025) / totalesPF.ppto_2025 * 100).toFixed(1),
      var_25_vs_24: ((totalesPF.real_2025 - totalesPF.real_2024) / totalesPF.real_2024 * 100).toFixed(1),
      var_24_vs_23: ((totalesPF.real_2024 - totalesPF.real_2023) / totalesPF.real_2023 * 100).toFixed(1)
    };

    const variacionIntegrado = {
      var_25_ppto_vs_real: ((totalesIntegrado.real_2025 - totalesIntegrado.ppto_2025) / totalesIntegrado.ppto_2025 * 100).toFixed(1),
      var_25_vs_24: ((totalesIntegrado.real_2025 - totalesIntegrado.real_2024) / totalesIntegrado.real_2024 * 100).toFixed(1),
      var_24_vs_23: ((totalesIntegrado.real_2024 - totalesIntegrado.real_2023) / totalesIntegrado.real_2023 * 100).toFixed(1)
    };

    const variacionCanal = {
      var_25_ppto_vs_real: ((totalesCanal.real_2025 - totalesCanal.ppto_2025) / totalesCanal.ppto_2025 * 100).toFixed(1),
      var_25_vs_24: ((totalesCanal.real_2025 - totalesCanal.real_2024) / totalesCanal.real_2024 * 100).toFixed(1),
      var_24_vs_23: ((totalesCanal.real_2024 - totalesCanal.real_2023) / totalesCanal.real_2023 * 100).toFixed(1)
    };

    // Impuestos y tributación
    const tributacion = {
      tasa_minima: 15,
      incremento_tributacion_2025: 36, // % respecto al impuesto neto de renta del año 2023
      impuestos_saludables: [
        { anio: 2023, tasa: 10 },
        { anio: 2024, tasa: 15 },
        { anio: 2025, tasa: 20 }
      ]
    };

    // Estado de Resultado Integral
    const estadoResultado = {
      empresa: 'POLLO FIESTA S.A.',
      nit: '860.032.450-9',
      titulo: 'Estado de Resultado Integral',
      periodo: 'De 1 de enero al 31 de Diciembre por los años de: 2025',
      unidad: 'Expresados en Pesos',
      filas: [
        {
          actividad: 'Ingresos de actividades ordinarias',
          notas: 24,
          valor_2025: 29802421000,
          pct_2025: 100.0,
          valor_2024: 27801234000,
          pct_2024: 100.0,
          variacion_abs: 2001187000,
          variacion_pct: 7.2
        },
        {
          actividad: 'Otros ingresos de operación',
          notas: 25,
          valor_2025: 312450000,
          pct_2025: 1.0,
          valor_2024: 289100000,
          pct_2024: 1.0,
          variacion_abs: 23350000,
          variacion_pct: 8.1
        },
        {
          actividad: 'Costo de venta',
          notas: 26,
          valor_2025: -24156780000,
          pct_2025: -81.1,
          valor_2024: -22543210000,
          pct_2024: -81.1,
          variacion_abs: -1613570000,
          variacion_pct: 7.2
        },
        {
          actividad: '(Pérdida) Utilidad Bruta',
          notas: null,
          valor_2025: 5958091000,
          pct_2025: 20.0,
          valor_2024: 5547124000,
          pct_2024: 20.0,
          variacion_abs: 410967000,
          variacion_pct: 7.4,
          esSubtotal: true
        },
        {
          actividad: 'Gastos de administración',
          notas: 27,
          valor_2025: -1890340000,
          pct_2025: -6.3,
          valor_2024: -1754210000,
          pct_2024: -6.3,
          variacion_abs: -136130000,
          variacion_pct: 7.8
        },
        {
          actividad: 'Gastos de ventas',
          notas: 28,
          valor_2025: -2134560000,
          pct_2025: -7.2,
          valor_2024: -1987430000,
          pct_2024: -7.1,
          variacion_abs: -147130000,
          variacion_pct: 7.4
        },
        {
          actividad: '(Pérdida) Utilidad Operacional',
          notas: null,
          valor_2025: 1933191000,
          pct_2025: 6.5,
          valor_2024: 1805484000,
          pct_2024: 6.5,
          variacion_abs: 127707000,
          variacion_pct: 7.1,
          esSubtotal: true
        },
        {
          actividad: 'Ingresos financieros',
          notas: 29,
          valor_2025: 145230000,
          pct_2025: 0.5,
          valor_2024: 132100000,
          pct_2024: 0.5,
          variacion_abs: 13130000,
          variacion_pct: 9.9
        },
        {
          actividad: 'Gastos financieros',
          notas: 30,
          valor_2025: -312450000,
          pct_2025: -1.0,
          valor_2024: -289340000,
          pct_2024: -1.0,
          variacion_abs: -23110000,
          variacion_pct: 8.0
        },
        {
          actividad: '(Pérdida) Utilidad antes de impuestos',
          notas: null,
          valor_2025: 1765971000,
          pct_2025: 5.9,
          valor_2024: 1648244000,
          pct_2024: 5.9,
          variacion_abs: 117727000,
          variacion_pct: 7.1,
          esSubtotal: true
        },
        {
          actividad: 'Impuesto de renta y complementarios',
          notas: 31,
          valor_2025: -636949560,
          pct_2025: -2.1,
          valor_2024: -527437000,
          pct_2024: -1.9,
          variacion_abs: -109512560,
          variacion_pct: 20.8
        },
        {
          actividad: '(Pérdida) Utilidad Neta del Ejercicio',
          notas: null,
          valor_2025: 1129021440,
          pct_2025: 3.8,
          valor_2024: 1120807000,
          pct_2024: 4.0,
          variacion_abs: 8214440,
          variacion_pct: 0.7,
          esTotal: true
        }
      ]
    };

    // Marco legal y tecnológico
    const marcoLegal = {
      ley_603_2000: 'Propiedad intelectual y derechos de autor PED',
      ley_1581_2012: 'Protección de Datos Personales (Habeas Data)',
      erp_sistema: 'ERP Enterprise - SIESA DIGITAL S.A.S.',
      proceso_rio_fucha: {
        estado: 'Recurso de excepción de pérdida de ejecutoriedad',
        fecha_auto: '20 de enero de 2023',
        resolucion: 'Resolución #348 del 6 de junio de 2023'
      }
    };

    return {
      variablesMacro,
      presupuestoCaja,
      estadoResultado,
      ejecucionTrimestral: {
        totalPF: {
          data: totalPF,
          totales: totalesPF,
          variaciones: variacionPF
        },
        integradoMayorista: {
          data: integradoMayorista,
          totales: totalesIntegrado,
          variaciones: variacionIntegrado
        },
        polloCanal: {
          data: polloCanal,
          totales: totalesCanal,
          variaciones: variacionCanal
        }
      },
      tributacion,
      marcoLegal
    };
  }

  // ==================== GESTIÓN EN COMPRAS ====================
  
  async getGestionCompras() {
    // Datos del texto proporcionado
    const comprasMensuales = [
      { mes: 'Enero', anio: 2025, compras: 534282848, compras2024: 474432855, compras2023: 560056443, variacion2025vs2024: 12.62, variacion2024vs2023: -21.00 },
      { mes: 'Febrero', anio: 2025, compras: 509837369, compras2024: 621555555, compras2023: 759316575, variacion2025vs2024: -17.97, variacion2024vs2023: -18.14 },
      { mes: 'Marzo', anio: 2025, compras: 619736830, compras2024: 550965800, compras2023: 767903778, variacion2025vs2024: 12.48, variacion2024vs2023: -28.25 },
      { mes: 'Abril', anio: 2025, compras: 648645152, compras2024: 784542984, compras2023: 713190490, variacion2025vs2024: -17.32, variacion2024vs2023: 10.00 },
      { mes: 'Mayo', anio: 2025, compras: 865707842, compras2024: 753451113, compras2023: 765715840, variacion2025vs2024: 14.90, variacion2024vs2023: -1.60 },
      { mes: 'Junio', anio: 2025, compras: 715067678, compras2024: 732476001, compras2023: 539106699, variacion2025vs2024: -2.38, variacion2024vs2023: 35.87 },
      { mes: 'Julio', anio: 2025, compras: 685759378, compras2024: 731561700, compras2023: 554146147, variacion2025vs2024: -6.26, variacion2024vs2023: 32.02 },
      { mes: 'Agosto', anio: 2025, compras: 750725818, compras2024: 553684110, compras2023: 800416404, variacion2025vs2024: 35.59, variacion2024vs2023: -30.83 },
      { mes: 'Septiembre', anio: 2025, compras: 1019920685, compras2024: 773445898, compras2023: 716179612, variacion2025vs2024: 31.87, variacion2024vs2023: 8.00 },
      { mes: 'Octubre', anio: 2025, compras: 963699938, compras2024: 643181922, compras2023: 777703724, variacion2025vs2024: 49.83, variacion2024vs2023: -17.30 },
      { mes: 'Noviembre', anio: 2025, compras: 718262645, compras2024: 685082844, compras2023: 682133592, variacion2025vs2024: 4.84, variacion2024vs2023: 0.43 },
      { mes: 'Diciembre', anio: 2025, compras: 896023288, compras2024: 836824477, compras2023: 714183870, variacion2025vs2024: 7.07, variacion2024vs2023: 17.17 }
    ];

    const totales = {
      total2025: 8927669471,
      total2024: 8141205259,
      total2023: 8390561162,
      variacion2025vs2024: 9.66,
      variacion2024vs2023: -2.97
    };

    // Meses con mayor crecimiento 2025 vs 2024
    const mesesMayorCrecimiento = [
      { mes: 'Octubre', variacion: 49.83 },
      { mes: 'Agosto', variacion: 35.59 },
      { mes: 'Septiembre', variacion: 31.87 }
    ];

    // Meses con caídas importantes 2024 vs 2023
    const mesesCaidas2024 = [
      { mes: 'Agosto', variacion: -30.83 },
      { mes: 'Marzo', variacion: -28.25 },
      { mes: 'Enero', variacion: -21.00 }
    ];

    // Meses con mayor caída 2025 vs 2024
    const mesesCaidas2025 = [
      { mes: 'Julio', variacion: -6.26 },
      { mes: 'Junio', variacion: -2.38 },
      { mes: 'Febrero', variacion: -1.76 }
    ];

    return {
      comprasMensuales,
      totales,
      mesesMayorCrecimiento,
      mesesCaidas2024,
      mesesCaidas2025,
      analisis: {
        recuperacion2025: true,
        crecimientoTotal: 9.66,
        contraccion2024: -2.97,
        mesesDestacados: ['Octubre', 'Agosto', 'Septiembre']
      }
    };
  }

  // ==================== OPERACIONES Y MANTENIMIENTO ====================
  
  async getGestionOperaciones() {
    // Datos del texto proporcionado - hardcodeados porque las tablas no tienen inserts
    
    // KPIs TPM principales
    const kpisTpm = [
      { anio: 2024, disponibilidad_pct: 97, oee_pct: 84.00, mtbf_horas: 13.35, mttr_horas: 0.35 },
      { anio: 2025, disponibilidad_pct: 95.70, oee_pct: 86.40, mtbf_horas: 10.42, mttr_horas: 0.47 }
    ];
    
    // KPIs TPM detalle mensual 2025
    const kpisTpmDetalle = [
      { anio: 2025, mes_num: 1, mes_nombre: 'Enero', disponibilidad_pct: 96.5, oee_pct: 87.2, mttr_horas: 0.28 },
      { anio: 2025, mes_num: 2, mes_nombre: 'Febrero', disponibilidad_pct: 96.8, oee_pct: 86.9, mttr_horas: 0.25 },
      { anio: 2025, mes_num: 3, mes_nombre: 'Marzo', disponibilidad_pct: 95.9, oee_pct: 86.5, mttr_horas: 0.32 },
      { anio: 2025, mes_num: 4, mes_nombre: 'Abril', disponibilidad_pct: 97.2, oee_pct: 88.1, mttr_horas: 0.24 },
      { anio: 2025, mes_num: 5, mes_nombre: 'Mayo', disponibilidad_pct: 95.3, oee_pct: 85.8, mttr_horas: 0.37 },
      { anio: 2025, mes_num: 6, mes_nombre: 'Junio', disponibilidad_pct: 96.1, oee_pct: 86.7, mttr_horas: 0.29 },
      { anio: 2025, mes_num: 7, mes_nombre: 'Julio', disponibilidad_pct: 95.8, oee_pct: 86.3, mttr_horas: 0.31 },
      { anio: 2025, mes_num: 8, mes_nombre: 'Agosto', disponibilidad_pct: 94.77, oee_pct: 84.9, mttr_horas: 0.42 },
      { anio: 2025, mes_num: 9, mes_nombre: 'Septiembre', disponibilidad_pct: 98.75, oee_pct: 89.2, mttr_horas: 0.10 },
      { anio: 2025, mes_num: 10, mes_nombre: 'Octubre', disponibilidad_pct: 95.5, oee_pct: 85.6, mttr_horas: 0.37 },
      { anio: 2025, mes_num: 11, mes_nombre: 'Noviembre', disponibilidad_pct: 94.71, oee_pct: 80.1, mttr_horas: 0.45 },
      { anio: 2025, mes_num: 12, mes_nombre: 'Diciembre', disponibilidad_pct: 98.51, oee_pct: 88.9, mttr_horas: 0.11 }
    ];
    
    // Equipos ofensores
    const equiposOfensores = [
      { equipo: 'Línea de Descargue', horas_paro: 17.32, numero_novedades: 22, impacto: 'Crítico (17% del tiempo total)' },
      { equipo: 'Zona de Máquinas y Calderas', horas_paro: 14.15, numero_novedades: 23, impacto: 'Muy Alto (14% del tiempo total)' },
      { equipo: 'Transferidor', horas_paro: 10.47, numero_novedades: 42, impacto: 'Frecuencia Alarmante (42 eventos)' },
      { equipo: 'Línea de Selección Linco', horas_paro: 9.70, numero_novedades: 17, impacto: 'Alto (9% del tiempo total)' },
      { equipo: 'Desplumadora #1 (ITA)', horas_paro: 6.78, numero_novedades: 20, impacto: 'Moderado-Alto (7% del tiempo total)' }
    ];
    
    // Órdenes de trabajo mensual
    const ordenesTrabajo = [
      { mes_num: 1, mes_nombre: 'Enero', ot_correctivas: 24, ot_preventivas: 343, total: 367, porcentaje_correctivas: 5.80 },
      { mes_num: 2, mes_nombre: 'Febrero', ot_correctivas: 26, ot_preventivas: 75, total: 101, porcentaje_correctivas: 25.70 },
      { mes_num: 3, mes_nombre: 'Marzo', ot_correctivas: 44, ot_preventivas: 142, total: 186, porcentaje_correctivas: 23.70 },
      { mes_num: 4, mes_nombre: 'Abril', ot_correctivas: 21, ot_preventivas: 195, total: 216, porcentaje_correctivas: 9.70 },
      { mes_num: 5, mes_nombre: 'Mayo', ot_correctivas: 37, ot_preventivas: 265, total: 302, porcentaje_correctivas: 12.30 },
      { mes_num: 6, mes_nombre: 'Junio', ot_correctivas: 22, ot_preventivas: 485, total: 507, porcentaje_correctivas: 4.30 },
      { mes_num: 7, mes_nombre: 'Julio', ot_correctivas: 80, ot_preventivas: 405, total: 485, porcentaje_correctivas: 16.50 },
      { mes_num: 8, mes_nombre: 'Agosto', ot_correctivas: 61, ot_preventivas: 174, total: 235, porcentaje_correctivas: 26.00 },
      { mes_num: 9, mes_nombre: 'Septiembre', ot_correctivas: 52, ot_preventivas: 327, total: 379, porcentaje_correctivas: 13.70 },
      { mes_num: 10, mes_nombre: 'Octubre', ot_correctivas: 20, ot_preventivas: 257, total: 277, porcentaje_correctivas: 7.20 },
      { mes_num: 11, mes_nombre: 'Noviembre', ot_correctivas: 9, ot_preventivas: 291, total: 300, porcentaje_correctivas: 3.00 },
      { mes_num: 12, mes_nombre: 'Diciembre', ot_correctivas: 7, ot_preventivas: 339, total: 346, porcentaje_correctivas: 2.00 }
    ];
    
    // Mantenimiento de vehículos
    const mantenimientoVehiculos = [
      { anio: 2024, costo_total: 356022963, variacion_pct: null },
      { anio: 2025, costo_total: 189938418, variacion_pct: -46.65 }
    ];
    
    // Novedades arquitectura
    const novedadesArquitectura = [
      { planta: 'PLANTA DE BENEFICIO', abiertas: 42, cerradas: 175, total: 217, ejecucion_pct: 81 },
      { planta: 'SEDE 1', abiertas: 22, cerradas: 4, total: 26, ejecucion_pct: 15 },
      { planta: 'SEDE 2', abiertas: 46, cerradas: 29, total: 75, ejecucion_pct: 39 },
      { planta: 'SEDE 3', abiertas: 58, cerradas: 36, total: 94, ejecucion_pct: 38 },
      { planta: 'SEDE 4', abiertas: 9, cerradas: 5, total: 14, ejecucion_pct: 36 }
    ];
    
    // Novedades infraestructura (mantenimiento)
    const novedadesInfraestructura = [
      { planta: 'PLANTA DE BENEFICIO', abiertas: 13, cerradas: 145, total: 158, ejecucion_pct: 92 },
      { planta: 'SEDE 1', abiertas: 3, cerradas: 17, total: 20, ejecucion_pct: 85 },
      { planta: 'SEDE 2', abiertas: 37, cerradas: 70, total: 107, ejecucion_pct: 65 },
      { planta: 'SEDE 3', abiertas: 5, cerradas: 70, total: 75, ejecucion_pct: 93 },
      { planta: 'SEDE 4', abiertas: 2, cerradas: 13, total: 15, ejecucion_pct: 87 }
    ];
    
    // Calcular totales
    const totalHorasParo = equiposOfensores.reduce((sum, e) => sum + parseFloat(e.horas_paro || 0), 0);
    const totalNovedades = equiposOfensores.reduce((sum, e) => sum + parseInt(e.numero_novedades || 0), 0);
    
    const totalOtCorrectivas = ordenesTrabajo.reduce((sum, o) => sum + parseInt(o.ot_correctivas || 0), 0);
    const totalOtPreventivas = ordenesTrabajo.reduce((sum, o) => sum + parseInt(o.ot_preventivas || 0), 0);
    const totalOt = totalOtCorrectivas + totalOtPreventivas;
    const porcentajeCorrectivas = totalOt > 0 ? ((totalOtCorrectivas / totalOt) * 100).toFixed(1) : 0;
    
    // Calcular cumplimiento global de novedades
    const totalAbiertas = [...novedadesArquitectura, ...novedadesInfraestructura]
      .reduce((sum, n) => sum + parseInt(n.abiertas || 0), 0);
    const totalCerradas = [...novedadesArquitectura, ...novedadesInfraestructura]
      .reduce((sum, n) => sum + parseInt(n.cerradas || 0), 0);
    const totalNovedadesGlobal = totalAbiertas + totalCerradas;
    const cumplimientoGlobal = totalNovedadesGlobal > 0 
      ? ((totalCerradas / totalNovedadesGlobal) * 100).toFixed(0) 
      : 0;
    
    return {
      kpisTpm,
      kpisTpmDetalle,
      equiposOfensores,
      ordenesTrabajo,
      mantenimientoVehiculos,
      novedadesArquitectura,
      novedadesInfraestructura,
      totales: {
        totalHorasParo: totalHorasParo.toFixed(2),
        totalNovedades,
        totalOtCorrectivas,
        totalOtPreventivas,
        totalOt,
        porcentajeCorrectivas: parseFloat(porcentajeCorrectivas),
        porcentajePreventivas: (100 - parseFloat(porcentajeCorrectivas)).toFixed(1),
        cumplimientoGlobal: parseInt(cumplimientoGlobal),
        totalAbiertas,
        totalCerradas
      }
    };
  }

  // ==================== PLANTA DE BENEFICIO ====================
  
  async getPlantaBeneficio() {
    // Datos del texto proporcionado - hardcodeados
    
    // Aves procesadas mensual
    const avesProcessadasMensual = [
      { mes: 'Enero', mes_num: 1, aves_2025: 1138590, aves_2024: 1381940 },
      { mes: 'Febrero', mes_num: 2, aves_2025: 987813, aves_2024: 1497420 },
      { mes: 'Marzo', mes_num: 3, aves_2025: 1503670, aves_2024: 1514470 },
      { mes: 'Abril', mes_num: 4, aves_2025: 1461700, aves_2024: 1565990 },
      { mes: 'Mayo', mes_num: 5, aves_2025: 1743130, aves_2024: 1460260 },
      { mes: 'Junio', mes_num: 6, aves_2025: 1536490, aves_2024: 1474570 },
      { mes: 'Julio', mes_num: 7, aves_2025: 1455100, aves_2024: 1381820 },
      { mes: 'Agosto', mes_num: 8, aves_2025: 1587210, aves_2024: 1502890 },
      { mes: 'Septiembre', mes_num: 9, aves_2025: 1417860, aves_2024: 1398310 },
      { mes: 'Octubre', mes_num: 10, aves_2025: 1844070, aves_2024: 1736570 },
      { mes: 'Noviembre', mes_num: 11, aves_2025: 1663280, aves_2024: 1526970 },
      { mes: 'Diciembre', mes_num: 12, aves_2025: 1405190, aves_2024: 1441070 }
    ];

    // Promedio de pesos mensual
    const promedioPesos = [
      { mes: 'Enero', mes_num: 1, promedio_2025: 1954, promedio_2024: 1981 },
      { mes: 'Febrero', mes_num: 2, promedio_2025: 2023, promedio_2024: 1973 },
      { mes: 'Marzo', mes_num: 3, promedio_2025: 2006, promedio_2024: 1994 },
      { mes: 'Abril', mes_num: 4, promedio_2025: 1991, promedio_2024: 1883 },
      { mes: 'Mayo', mes_num: 5, promedio_2025: 2013, promedio_2024: 2013 },
      { mes: 'Junio', mes_num: 6, promedio_2025: 1995, promedio_2024: 2018 },
      { mes: 'Julio', mes_num: 7, promedio_2025: 1993, promedio_2024: 2021 },
      { mes: 'Agosto', mes_num: 8, promedio_2025: 1993, promedio_2024: 1981 },
      { mes: 'Septiembre', mes_num: 9, promedio_2025: 1980, promedio_2024: 1967 },
      { mes: 'Octubre', mes_num: 10, promedio_2025: 1971, promedio_2024: 2016 },
      { mes: 'Noviembre', mes_num: 11, promedio_2025: 1966, promedio_2024: 2011 },
      { mes: 'Diciembre', mes_num: 12, promedio_2025: 1959, promedio_2024: 1937 }
    ];

    // Participación por rangos
    const participacionRangos = [
      { anio: 2024, rango_570_1377: 11.84, rango_1378_1816: 50.95, rango_1817_1928: 36.74 },
      { anio: 2025, rango_570_1377: 10.16, rango_1378_1816: 49.42, rango_1817_1928: 37.43 }
    ];

    // Descartes en kilos
    const descartesKilos = [
      { categoria: 'AHOGADAS', kilos_2024: 120229.50, kilos_2025: 78087.84, variacion_pct: -35.1 },
      { categoria: 'AVES DESCARTADAS POR GRANJA', kilos_2024: 116105.33, kilos_2025: 176136.30, variacion_pct: 51.7 },
      { categoria: 'AVES DESCARTADAS POR PLANTA', kilos_2024: 15307.98, kilos_2025: 48399.12, variacion_pct: 216.3 },
      { categoria: 'COMIDA EN BUCHE', kilos_2024: 7458.40, kilos_2025: 6391.90, variacion_pct: -14.3 },
      { categoria: 'HIGADO', kilos_2024: 72579, kilos_2025: 62799, variacion_pct: -13.5 },
      { categoria: 'PATAS', kilos_2024: 230243, kilos_2025: 284379, variacion_pct: 23.5 },
      { categoria: 'PIERNA PERNIL', kilos_2024: 2671.35, kilos_2025: 5866.15, variacion_pct: 119.6 },
      { categoria: 'PIERNAS', kilos_2024: 3025.20, kilos_2025: 2605.95, variacion_pct: -13.9 }
    ];

    // Participación canal y vísceras
    const participacionCanal = [
      { anio: 2021, pct_canal: 80.14, pct_viscera: 12.57, merma_planta: 7.29, en_caliente_seco: 72.00, hidratacion: 8.14, canal_viscera: 92.71 },
      { anio: 2022, pct_canal: 79.32, pct_viscera: 12.53, merma_planta: 8.15, en_caliente_seco: 72.00, hidratacion: 7.32, canal_viscera: 91.85 },
      { anio: 2023, pct_canal: 79.91, pct_viscera: 12.27, merma_planta: 7.82, en_caliente_seco: 72.10, hidratacion: 7.77, canal_viscera: 92.18 },
      { anio: 2024, pct_canal: 81.34, pct_viscera: 12.11, merma_planta: 6.55, en_caliente_seco: 72.50, hidratacion: 8.86, canal_viscera: 93.45 },
      { anio: 2025, pct_canal: 82.19, pct_viscera: 12.49, merma_planta: 5.38, en_caliente_seco: 71.86, hidratacion: 10.27, canal_viscera: 94.68 }
    ];

    // Calcular totales
    const totalAves2025 = avesProcessadasMensual.reduce((sum, m) => sum + m.aves_2025, 0);
    const totalAves2024 = avesProcessadasMensual.reduce((sum, m) => sum + m.aves_2024, 0);
    const variacionAves = ((totalAves2025 - totalAves2024) / totalAves2024 * 100).toFixed(2);
    
    const promedioPeso2025 = promedioPesos.reduce((sum, m) => sum + m.promedio_2025, 0) / promedioPesos.length;
    const promedioPeso2024 = promedioPesos.reduce((sum, m) => sum + m.promedio_2024, 0) / promedioPesos.length;

    const totalDescartes2024 = descartesKilos.reduce((sum, d) => sum + d.kilos_2024, 0);
    const totalDescartes2025 = descartesKilos.reduce((sum, d) => sum + d.kilos_2025, 0);

    return {
      avesProcessadasMensual,
      promedioPesos,
      participacionRangos,
      descartesKilos,
      participacionCanal,
      totales: {
        totalAves2025,
        totalAves2024,
        variacionAves: parseFloat(variacionAves),
        promedioPeso2025: promedioPeso2025.toFixed(0),
        promedioPeso2024: promedioPeso2024.toFixed(0),
        totalDescartes2024: totalDescartes2024.toFixed(2),
        totalDescartes2025: totalDescartes2025.toFixed(2),
        variacionDescartes: ((totalDescartes2025 - totalDescartes2024) / totalDescartes2024 * 100).toFixed(2)
      }
    };
  }

  // ==================== TECNOLOGÍAS DE LA INFORMACIÓN ====================
  
  async getTecnologiasInformacion() {
    // Datos hardcodeados basados en el texto proporcionado
    const proyectos = [
      {
        nombre: 'Digitalización',
        descripcion: 'Digitalización con enfoque a las tablas de retención para la administración de áreas funcionales, la perpetuidad de los archivos laborales (90 años), sobre gestión documental por procesos misionales.',
        estado: 'Activo',
        icono: 'FileText'
      },
      {
        nombre: 'CCTV',
        descripcion: 'Sistemas de Circuito cerrado de televisión – CCTV, sede oficina principal, sedes, plantas de procesos, puntos de venta y granjas avícolas.',
        estado: 'Activo',
        icono: 'Video'
      },
      {
        nombre: 'BOT Certificados',
        descripcion: 'Se cuenta el BOT para certificados de calidad.',
        estado: 'Activo',
        icono: 'Bot'
      },
      {
        nombre: 'Microsoft Teams',
        descripcion: 'Se utiliza la herramienta de Microsoft Teams, Microsoft 365 para toda la organización.',
        estado: 'Activo',
        icono: 'Users'
      },
      {
        nombre: 'Redes Estructuradas',
        descripcion: 'Se realizó el montaje de redes estructuradas con personal propio en la bodega ANGEL BLANCO, antes vanti.',
        estado: 'Completado',
        icono: 'Network'
      },
      {
        nombre: 'ERP ENTERPRISE',
        descripcion: 'El sistema de información con su nube (cloud) navega con el ERP ENTERPRISE, en sus aplicativos de nómina, comercial y finanzas. Se encuentra en proceso de Re-parametrización el área de: Compras, Almacén, inventarios y mantenimiento.',
        estado: 'En Proceso',
        icono: 'Database'
      },
      {
        nombre: 'Power Apps',
        descripcion: 'Powers apps para desarrollo de aplicaciones.',
        estado: 'Activo',
        icono: 'Code'
      },
      {
        nombre: 'Backup OneDrive',
        descripcion: 'Backup en OneDrive (nube) con su copia de respaldo en un servidor propio autónomo para la información de la empresa.',
        estado: 'Activo',
        icono: 'Cloud'
      }
    ];

    const ecosistema = {
      sistemaPrincipal: 'Pollo Fiesta',
      componentes: [
        {
          id: 1,
          nombre: 'Sistemas de videovigilancia empresarial (CCTV)',
          categoria: 'Seguridad',
          funcionalidades: [
            'POS',
            'PROCESO PROCESADOS DESPACHOS',
            'EXTERIORES BODEGA ANGEL BLANCO'
          ],
          color: '#1e40af'
        },
        {
          id: 2,
          nombre: 'SIESA',
          categoria: 'ERP',
          funcionalidades: [
            'Atención a cliente final Interno'
          ],
          color: '#1e40af'
        },
        {
          id: 3,
          nombre: 'Microsoft 365',
          categoria: 'Productividad',
          funcionalidades: [
            'Backups equipos One Driver',
            'Power Apps',
            'Power Automate'
          ],
          color: '#1e40af'
        },
        {
          id: 4,
          nombre: 'BOT',
          categoria: 'Automatización',
          funcionalidades: [
            'Envía correo con tarjeta de cumpleaños a todos los colaboradores'
          ],
          color: '#1e40af'
        },
        {
          id: 5,
          nombre: 'Aplicaciones',
          categoria: 'Desarrollo Interno',
          funcionalidades: [
            'Manejo de agenda salas de capacitación',
            'Seguimiento Producto Congelado Sede 2',
            'Archivo Digital Versión 3.0',
            'Digiturno Cartera',
            'Verificador empleados activos e inactivos'
          ],
          color: '#1e40af'
        }
      ]
    };

    return {
      ecosistema,
      proyectos
    };
  }
}

module.exports = DashboardRepository;
