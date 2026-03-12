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
      SELECT * FROM com_puntos_venta ORDER BY zona, nombre_pdv
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
    
    // Información de sedes (U01, U02, U03) - NUEVO
    const [sedesInfo] = await pool.query(`
      SELECT 
        u.anio,
        u.centro_operacion,
        u.unidades,
        u.participacion_porcentaje,
        m.sede,
        m.merma_2025,
        m.meta_establecida,
        m.brecha_puntos_porcentuales,
        m.estado_evaluacion
      FROM vista_com_unidades_procesadas u
      LEFT JOIN vista_log_cumplimiento_mermas_2025 m 
        ON (
          (u.centro_operacion = 'Sede U01' AND m.sede = 'U01') OR
          (u.centro_operacion = 'Sede U02' AND m.sede = 'U02') OR
          (u.centro_operacion = 'Sede U03' AND m.sede = 'U03')
        )
      WHERE u.centro_operacion LIKE 'Sede U%'
      ORDER BY u.anio DESC, u.unidades DESC
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
      
      // Ventas detalladas
      ventasSede3,
      ventasHuevo,
      ventasPieCanal,
      unidadesPorCentro,
      sedesInfo,
      
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
    
    // Vista: Exposición de cartera 2025 vs 2024 - NUEVA
    const [exposicionCartera] = await pool.query(`
      SELECT * FROM vista_fin_exposicion_cartera_25_vs_24 ORDER BY mes_num
    `);
    
    // Vista: Mix de ventas 2025 (contado/crédito, morosidad, rotación) - NUEVA
    const [mixVentas] = await pool.query(`
      SELECT * FROM vista_fin_mix_ventas_2025 ORDER BY mes_num
    `);
    
    // Todos los clientes con detalles completos
    const [clientes] = await pool.query(`
      SELECT 
        id_cliente,
        nombre_cliente,
        dias_rotacion_real,
        saldo_pendiente,
        asesor_asignado,
        (saldo_pendiente / 1000000) as saldo_millones
      FROM com_cartera_clientes
      ORDER BY saldo_pendiente DESC
    `);
    
    // Calcular métricas generales
    const totalCartera = clientes.reduce((sum, c) => sum + (parseFloat(c.saldo_pendiente) || 0), 0);
    const promedioRotacion = clientes.length > 0
      ? clientes.reduce((sum, c) => sum + (parseFloat(c.dias_rotacion_real) || 0), 0) / clientes.length
      : 0;
    
    // Agrupar por asesor
    const porAsesor = clientes.reduce((acc, c) => {
      const asesor = c.asesor_asignado || 'Sin asignar';
      if (!acc[asesor]) {
        acc[asesor] = { 
          clientes: 0, 
          cartera: 0, 
          rotacionTotal: 0,
          rotacionPromedio: 0,
          clientesLista: []
        };
      }
      acc[asesor].clientes += 1;
      acc[asesor].cartera += parseFloat(c.saldo_pendiente) || 0;
      acc[asesor].rotacionTotal += parseFloat(c.dias_rotacion_real) || 0;
      acc[asesor].clientesLista.push({
        nombre: c.nombre_cliente,
        saldo: c.saldo_pendiente,
        rotacion: c.dias_rotacion_real
      });
      return acc;
    }, {});
    
    // Calcular promedios por asesor
    Object.keys(porAsesor).forEach(asesor => {
      const data = porAsesor[asesor];
      data.rotacionPromedio = (data.rotacionTotal / data.clientes).toFixed(2);
      data.carteraPorcentaje = totalCartera > 0 ? ((data.cartera / totalCartera) * 100).toFixed(2) : 0;
    });
    
    // Clasificar clientes por rango de rotación
    const porRangoRotacion = {
      'Excelente (0-15 días)': clientes.filter(c => c.dias_rotacion_real <= 15).length,
      'Bueno (16-30 días)': clientes.filter(c => c.dias_rotacion_real > 15 && c.dias_rotacion_real <= 30).length,
      'Regular (31-45 días)': clientes.filter(c => c.dias_rotacion_real > 30 && c.dias_rotacion_real <= 45).length,
      'Malo (46-60 días)': clientes.filter(c => c.dias_rotacion_real > 45 && c.dias_rotacion_real <= 60).length,
      'Crítico (>60 días)': clientes.filter(c => c.dias_rotacion_real > 60).length
    };
    
    // Top 10 clientes por saldo
    const top10Clientes = clientes.slice(0, 10);
    
    // Clientes con rotación crítica (>60 días)
    const clientesCriticos = clientes.filter(c => c.dias_rotacion_real > 60);
    
    return {
      // Vistas nuevas
      exposicionCartera,
      mixVentas,
      
      // Datos existentes
      clientes,
      porAsesor,
      porRangoRotacion,
      top10Clientes,
      clientesCriticos,
      totales: {
        totalCartera,
        totalCarteraMillones: (totalCartera / 1000000).toFixed(2),
        promedioRotacion: promedioRotacion.toFixed(2),
        totalClientes: clientes.length,
        totalAsesores: Object.keys(porAsesor).length,
        clientesCriticos: clientesCriticos.length,
        porcentajeCriticos: ((clientesCriticos.length / clientes.length) * 100).toFixed(2)
      }
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
      
      // Vista de cumplimiento 2025 - con manejo de errores
      let cumplimiento2025 = [];
      try {
        const [result] = await pool.query(`
          SELECT * FROM vista_log_cumplimiento_mermas_2025
        `);
        cumplimiento2025 = result;
      } catch (error) {
        console.log('⚠️ Vista vista_log_cumplimiento_mermas_2025 no existe, continuando sin cumplimiento');
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
    
    // Devoluciones mensuales por sede - ACTUALIZADO
    const [devolucionesMensuales] = await pool.query(`
      SELECT 
        anio,
        mes_num,
        mes_nombre,
        sede_1_pct,
        sede_2_pct,
        sede_3_pct
      FROM aud_devoluciones_mensuales
      ORDER BY anio DESC, mes_num
    `);
    
    // Resumen anual de devoluciones - NUEVO
    const [devolucionesResumen] = await pool.query(`
      SELECT 
        anio,
        promedio_compania_pct,
        promedio_sede_1_pct,
        promedio_sede_2_pct,
        promedio_sede_3_pct
      FROM aud_devoluciones_resumen_anual
      ORDER BY anio DESC
    `);
    
    // Vista de variación 2025 vs 2024 - NUEVO
    const [variacionDevoluciones] = await pool.query(`
      SELECT * FROM vista_aud_variacion_devoluciones_25_vs_24
    `);
    
    // Hallazgos (si existen)
    const [hallazgos] = await pool.query(`
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
    
    // Planes de acción (si existen)
    const [planesAccion] = await pool.query(`
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
      variacionDevoluciones: variacionDevoluciones[0] || null,
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

  // ==================== GESTIÓN HUMANA ====================
  
  async getGestionHumana() {
    const db = getInstance();
    const pool = db.getPool();
    
    // Causas de retiro
    const [causasRetiro] = await pool.query(`
      SELECT 
        motivo_retiro,
        cantidad_empleados
      FROM gh_causas_retiro
      ORDER BY cantidad_empleados DESC
    `);
    
    // Rotación de personal
    const [rotacion] = await pool.query(`
      SELECT 
        anio,
        mes,
        total_ingresos,
        total_retiros
      FROM gh_rotacion_personal
      ORDER BY anio DESC, mes
    `);
    
    return {
      causasRetiro,
      rotacion,
      totales: {
        totalCausas: causasRetiro.length,
        totalRegistros: rotacion.length
      },
      mensaje: causasRetiro.length === 0 ? 'Módulo pendiente de datos' : null
    };
  }

  // ==================== SAGRILAFT ====================
  
  async getSistemaSagrilaft() {
    const db = getInstance();
    const pool = db.getPool();
    
    // Evaluaciones de terceros
    const [evaluaciones] = await pool.query(`
      SELECT 
        fecha_evaluacion,
        tipo_contraparte,
        nombre_razon_social,
        estado_aprobacion,
        es_pep
      FROM cumpl_evaluaciones_terceros
      ORDER BY fecha_evaluacion DESC
    `);
    
    // Causales de rechazo
    const [causales] = await pool.query(`
      SELECT 
        c.motivo_rechazo,
        e.nombre_razon_social,
        e.tipo_contraparte
      FROM cumpl_causales_rechazo c
      LEFT JOIN cumpl_evaluaciones_terceros e ON c.id_evaluacion = e.id_evaluacion
      ORDER BY c.id_rechazo DESC
    `);
    
    return {
      evaluaciones,
      causales,
      totales: {
        totalEvaluaciones: evaluaciones.length,
        totalCausales: causales.length
      },
      mensaje: evaluaciones.length === 0 ? 'Módulo pendiente de datos' : null
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

  // ==================== GERENCIA ESTRATÉGICA ====================
  
  async getGestionGerencia() {
    const db = getInstance();
    const pool = db.getPool();
    
    return {
      items: [],
      mensaje: 'Módulo de gerencia estratégica pendiente de configuración'
    };
  }
}

module.exports = DashboardRepository;
