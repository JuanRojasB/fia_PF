const IDashboardRepository = require('../../domain/repositories/IDashboardRepository');
const { getInstance } = require('../database/connection');

class DashboardRepository extends IDashboardRepository {
  
  // FUENTES Y USOS (Balance General) - Comparativa 2024 vs 2025 CON CÁLCULOS
  async getFuentesUsos() {
    const db = getInstance();
    const pool = db.getPool();
    const [rows] = await pool.query(`
      SELECT 
        category as tipo,
        subcategory as subcategoria,
        account_name as categoria,
        value_2025 as valor_2025,
        value_2024 as valor_2024,
        variation as variacion,
        fuentes,
        usos
      FROM financial_data
      ORDER BY category, subcategory, account_name
    `);
    
    // Calcular totales y variaciones
    const activos = rows.filter(d => d.tipo === 'ACTIVOS');
    const pasivos = rows.filter(d => d.tipo === 'PASIVOS');
    const patrimonio = rows.filter(d => d.tipo === 'PATRIMONIO');
    
    const totalActivos2025 = activos.reduce((sum, d) => sum + (parseFloat(d.valor_2025) || 0), 0);
    const totalActivos2024 = activos.reduce((sum, d) => sum + (parseFloat(d.valor_2024) || 0), 0);
    
    const totalPasivos2025 = pasivos.reduce((sum, d) => sum + (parseFloat(d.valor_2025) || 0), 0);
    const totalPasivos2024 = pasivos.reduce((sum, d) => sum + (parseFloat(d.valor_2024) || 0), 0);
    
    const totalPatrimonio2025 = patrimonio.reduce((sum, d) => sum + (parseFloat(d.valor_2025) || 0), 0);
    const totalPatrimonio2024 = patrimonio.reduce((sum, d) => sum + (parseFloat(d.valor_2024) || 0), 0);
    
    const varActivos = totalActivos2024 > 0 ? (((totalActivos2025 - totalActivos2024) / totalActivos2024) * 100).toFixed(1) : 0;
    const varPasivos = totalPasivos2024 > 0 ? (((totalPasivos2025 - totalPasivos2024) / totalPasivos2024) * 100).toFixed(1) : 0;
    const varPatrimonio = totalPatrimonio2024 > 0 ? (((totalPatrimonio2025 - totalPatrimonio2024) / totalPatrimonio2024) * 100).toFixed(1) : 0;
    
    return {
      items: rows,
      totales: {
        activos: {
          valor2025: totalActivos2025,
          valor2024: totalActivos2024,
          variacion: parseFloat(varActivos)
        },
        pasivos: {
          valor2025: totalPasivos2025,
          valor2024: totalPasivos2024,
          variacion: parseFloat(varPasivos)
        },
        patrimonio: {
          valor2025: totalPatrimonio2025,
          valor2024: totalPatrimonio2024,
          variacion: parseFloat(varPatrimonio)
        }
      }
    };
  }

  // GESTIÓN DE CARTERA - Comparativa mensual con datos 2024 y 2025 CON CÁLCULOS
  async getGestionCartera() {
    const db = getInstance();
    const pool = db.getPool();
    const [rows] = await pool.query(`
      SELECT 
        mes,
        anio,
        total_cartera,
        total_vencida as cartera_vencida,
        indice_morosi as indice_mora,
        dias_rotacion as rotacion_dias,
        ventas_contado,
        ventas_credito,
        t2025_millones as exp_millones_2025,
        t2024_millones as exp_millones_2024,
        var_t_percent as variacion_pct,
        comentario
      FROM gestion_cartera
      WHERE anio = 2025
      ORDER BY FIELD(mes, 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 
                     'jul', 'ago', 'sep', 'oct', 'nov', 'dic')
    `);
    
    // Calcular promedios
    const promedioCartera = rows.reduce((sum, d) => sum + (parseFloat(d.total_cartera) || 0), 0) / rows.length;
    const promedioMora = rows.reduce((sum, d) => sum + (parseFloat(d.indice_mora) || 0), 0) / rows.length;
    const promedioRotacion = rows.reduce((sum, d) => sum + (parseFloat(d.rotacion_dias) || 0), 0) / rows.length;
    
    return {
      items: rows,
      promedios: {
        cartera: promedioCartera,
        mora: promedioMora,
        rotacion: promedioRotacion
      }
    };
  }

  // GESTIÓN COMERCIAL - Ventas Asadero y Sede 3 (2024 vs 2025) CON CÁLCULOS
  async getGestionComercial() {
    const db = getInstance();
    const pool = db.getPool();
    
    // Obtener datos de productos (REFRIGERADO/CONGELADO)
    const [productos] = await pool.query(`
      SELECT 
        sede,
        canal as linea,
        concepto,
        anio,
        valor_numerico as kg,
        porcentaje as participacion_pct
      FROM gestion_comercial
      WHERE tipo_dato = 'VENTAS_PRODUCTO'
      ORDER BY anio DESC, valor_numerico DESC
    `);
    
    // Obtener datos de asadero
    const [asadero] = await pool.query(`
      SELECT 
        'ASADERO' as sede,
        categoria,
        descripcion as linea,
        anio,
        total_kl as kg,
        total_part as participacion_pct,
        total_var as variacion_pct,
        precio_promedio,
        ingresos_totales,
        comentario
      FROM gestion_comercial_asadero
      WHERE categoria = 'VENTA_PRODUCTO'
      ORDER BY anio DESC, total_kl DESC
    `);
    
    // Obtener datos de sede 3
    const [sede3] = await pool.query(`
      SELECT 
        'SEDE3' as sede,
        categoria,
        descripcion as linea,
        anio,
        total_kl as kg,
        total_part as participacion_pct,
        variacion_kl,
        porcentaje_var as variacion_pct,
        precio,
        comentario
      FROM gestion_comercial_sede3
      WHERE categoria = 'VENTA_PRODUCTO'
      ORDER BY anio DESC, total_kl DESC
    `);
    
    const allData = [...productos, ...asadero, ...sede3];
    
    // Calcular totales por categoría y año
    const getData = (linea, anio) => {
      const item = allData.find(d => 
        d.linea && d.linea.includes(linea) && parseInt(d.anio) === anio
      );
      return item ? parseFloat(item.kg) || 0 : 0;
    };
    
    const refrigerado2025 = getData('REFRIGERADO', 2025);
    const refrigerado2024 = getData('REFRIGERADO', 2024);
    const congelado2025 = getData('CONGELADO', 2025);
    const congelado2024 = getData('CONGELADO', 2024);
    
    const totalKg2025 = refrigerado2025 + congelado2025;
    const totalKg2024 = refrigerado2024 + congelado2024;
    const variacionTotal = totalKg2024 > 0 ? (((totalKg2025 - totalKg2024) / totalKg2024) * 100).toFixed(2) : 0;
    
    return {
      items: allData,
      totales: {
        refrigerado2025,
        refrigerado2024,
        congelado2025,
        congelado2024,
        totalKg2025,
        totalKg2024,
        variacionTotal: parseFloat(variacionTotal)
      }
    };
  }

  // GESTIÓN HUMANA - Comparativa 2024 vs 2025 CON CÁLCULOS
  async getGestionHumana() {
    const db = getInstance();
    const pool = db.getPool();
    const [rows] = await pool.query(`
      SELECT 
        categor_a as categoria,
        descripci_n as concepto,
        a_o as anio,
        valor,
        __variaci_n as variacion_pct,
        variaci_n_absoluta as variacion_absoluta,
        narrativa
      FROM gestion_humana_2025
      ORDER BY categor_a, a_o
    `);
    
    // Agrupar por categoría
    const categorias = {
      'Planta de Personal': [],
      'Costo de Nómina': [],
      'Horas Extras': [],
      'Rotación de Personal': [],
      'Causas de Desvinculación 2025': []
    };
    
    const uniqueData = new Map();
    rows.forEach(d => {
      const cat = d.categoria || d.categor_a;
      const key = `${cat}-${d.concepto}-${d.anio}`;
      if (!uniqueData.has(key)) {
        uniqueData.set(key, d);
      }
    });
    
    Array.from(uniqueData.values()).forEach(d => {
      const cat = d.categoria || d.categor_a;
      if (cat && cat.includes('Causas de Desvinculaci')) {
        categorias['Causas de Desvinculación 2025'].push(d);
      } else if (categorias[cat]) {
        categorias[cat].push(d);
      }
    });
    
    // Calcular KPIs
    const personal2024 = categorias['Planta de Personal'].find(d => (d.anio === '2024' || d.anio === 2024) && d.concepto === 'Total Colaboradores');
    const personal2025 = categorias['Planta de Personal'].find(d => (d.anio === '2025' || d.anio === 2025) && d.concepto === 'Total Colaboradores');
    
    const costoTotal2024 = categorias['Costo de Nómina'].find(d => (d.anio === '2024' || d.anio === 2024) && d.concepto === 'Costo Total');
    const costoTotal2025 = categorias['Costo de Nómina'].find(d => (d.anio === '2025' || d.anio === 2025) && d.concepto === 'Costo Total');
    
    const retiros2024 = categorias['Rotación de Personal'].find(d => (d.anio === '2024' || d.anio === 2024) && d.concepto === 'Retiros');
    const retiros2025 = categorias['Rotación de Personal'].find(d => (d.anio === '2025' || d.anio === 2025) && d.concepto === 'Retiros');
    
    const ingresos2024 = categorias['Rotación de Personal'].find(d => (d.anio === '2024' || d.anio === 2024) && d.concepto === 'Ingresos');
    const ingresos2025 = categorias['Rotación de Personal'].find(d => (d.anio === '2025' || d.anio === 2025) && d.concepto === 'Ingresos');
    
    // Procesar causas de desvinculación
    const causasMap = new Map();
    categorias['Causas de Desvinculación 2025'].forEach(row => {
      const key = row.concepto;
      if (!causasMap.has(key) || causasMap.get(key).valor < row.valor) {
        causasMap.set(key, row);
      }
    });
    
    const causasData = Array.from(causasMap.values())
      .sort((a, b) => b.valor - a.valor)
      .map(row => ({
        name: row.concepto,
        value: row.valor,
        percentage: row.variacion_pct
      }));
    
    return {
      items: rows,
      categorias,
      kpis: {
        personal2024,
        personal2025,
        costoTotal2024,
        costoTotal2025,
        retiros2024,
        retiros2025,
        ingresos2024,
        ingresos2025
      },
      causasDesvinculacion: causasData
    };
  }

  // GESTIÓN LOGÍSTICA - Comparativa 2024 vs 2025 CON CÁLCULOS
  async getGestionLogistica() {
    const db = getInstance();
    const pool = db.getPool();
    const [rows] = await pool.query(`
      SELECT 
        categoria,
        sede,
        concepto,
        anio,
        valor,
        variacion as variacion_pct,
        comentario
      FROM gestion_logistica
      ORDER BY sede, anio DESC, concepto
    `);
    
    // Filtrar y procesar datos - aceptar SEDE1, SEDE2, SEDE3
    const conceptosMap = {};
    rows.forEach(d => {
      const sedeNormalizada = (d.sede || '').toString().trim().toUpperCase();
      
      // Solo aceptar SEDE1, SEDE2, SEDE3 (no CONSOLIDADO ni NULL)
      if (!sedeNormalizada || sedeNormalizada === 'NULL' || sedeNormalizada === 'CONSOLIDADO') return;
      
      const conceptoNormalizado = (d.concepto || '').toString().trim();
      if (!conceptoNormalizado) return;
      
      const conceptoUpper = conceptoNormalizado.toUpperCase();
      // Filtrar totales
      if (conceptoUpper.includes('TOTAL') || conceptoUpper.includes('GASTOS LOGISTICOS')) return;
      
      const anio = parseInt(d.anio);
      if (anio !== 2024 && anio !== 2025) return;
      
      const key = `${sedeNormalizada}-${conceptoNormalizado}-${anio}`;
      const valor = parseFloat(d.valor) || 0;
      
      conceptosMap[key] = {
        sede: sedeNormalizada,
        concepto: conceptoNormalizado,
        anio: anio,
        valor: valor
      };
    });
    
    // Reorganizar por concepto y sede
    const conceptosPorSede = {};
    Object.values(conceptosMap).forEach(d => {
      const key = `${d.sede}-${d.concepto}`;
      if (!conceptosPorSede[key]) {
        conceptosPorSede[key] = { sede: d.sede, concepto: d.concepto, valor2024: 0, valor2025: 0 };
      }
      if (d.anio === 2024) conceptosPorSede[key].valor2024 = d.valor;
      else if (d.anio === 2025) conceptosPorSede[key].valor2025 = d.valor;
    });
    
    const conceptosData = Object.values(conceptosPorSede);
    
    // Calcular totales
    const total2025 = conceptosData.reduce((sum, d) => sum + d.valor2025, 0);
    const total2024 = conceptosData.reduce((sum, d) => sum + d.valor2024, 0);
    const variacionTotal = total2024 > 0 ? (((total2025 - total2024) / total2024) * 100).toFixed(1) : 0;
    
    // Totales por sede
    const sedesMap = {};
    conceptosData.forEach(d => {
      const sedeNormalizada = d.sede;
      
      if (!sedesMap[sedeNormalizada]) sedesMap[sedeNormalizada] = { sede: sedeNormalizada, total2024: 0, total2025: 0 };
      sedesMap[sedeNormalizada].total2024 += d.valor2024;
      sedesMap[sedeNormalizada].total2025 += d.valor2025;
    });
    
    const sedesData = Object.values(sedesMap);
    
    return {
      items: conceptosData,
      totales: {
        total2025,
        total2024,
        variacionTotal: parseFloat(variacionTotal)
      },
      sedes: sedesData
    };
  }

  // PRODUCCIÓN - Capacidad de Granjas CON CÁLCULOS
  async getProduccionGranjas() {
    const db = getInstance();
    const pool = db.getPool();
    const [rows] = await pool.query(`
      SELECT 
        tipo,
        granja,
        mts as metros,
        aves
      FROM capacidad_granjas
      ORDER BY tipo, granja
    `);
    
    // Filtrar totales
    const granjasData = rows.filter(d => {
      const granja = (d.granja || '').toUpperCase();
      const tipo = (d.tipo || '').toUpperCase();
      return granja !== 'TOTAL' && tipo !== 'TOTAL GENERAL';
    });
    
    // Calcular totales
    const totalMetros = granjasData.reduce((sum, d) => sum + (parseFloat(d.metros) || 0), 0);
    const totalAves = granjasData.reduce((sum, d) => sum + (parseFloat(d.aves) || 0), 0);
    const totalGranjas = granjasData.length;
    
    // Cálculos de capacidad
    const ciclosAnuales = 6.5;
    const tasaMortalidad = 0.07;
    const capacidadAnual = totalAves * ciclosAnuales;
    const polloSalido = capacidadAnual * (1 - tasaMortalidad);
    
    // Agrupar por tipo
    const porTipo = granjasData.reduce((acc, d) => {
      const tipo = d.tipo || 'Sin tipo';
      if (!acc[tipo]) {
        acc[tipo] = { metros: 0, aves: 0, count: 0 };
      }
      acc[tipo].metros += parseFloat(d.metros) || 0;
      acc[tipo].aves += parseFloat(d.aves) || 0;
      acc[tipo].count += 1;
      return acc;
    }, {});
    
    const tipoData = Object.entries(porTipo).map(([tipo, values]) => ({
      tipo,
      metros: values.metros,
      aves: values.aves,
      granjas: values.count
    }));
    
    return {
      items: granjasData,
      totales: {
        totalMetros,
        totalAves,
        totalGranjas,
        ciclosAnuales,
        tasaMortalidad,
        capacidadAnual,
        polloSalido
      },
      porTipo: tipoData
    };
  }

  // PRODUCCIÓN - Histórico de Sacrificio y Encasetado CON CÁLCULOS
  async getProduccionHistorico() {
    const db = getInstance();
    const pool = db.getPool();
    
    // Obtener datos de pollo sacrificado
    const [sacrificio] = await pool.query(`
      SELECT 
        'SACRIFICIO' as tipo,
        ano as anio,
        mes,
        prog as programado,
        valor_real as \`real\`,
        comprado,
        total,
        maximalim,
        progr_fiesta,
        entre_real_pf
      FROM pollo_sacrificado
      ORDER BY ano, FIELD(mes, 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
                     'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE')
    `);
    
    // Obtener datos de encasetado
    const [encasetado] = await pool.query(`
      SELECT 
        'ENCASETADO' as tipo,
        ano as anio,
        mes,
        prog as programado,
        valor_real as \`real\`
      FROM encasetado
      ORDER BY ano, FIELD(mes, 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
                     'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE')
    `);
    
    // Procesar datos de sacrificio por mes
    const ordenMeses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 
                        'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
    
    const sacrificioMap = {};
    ordenMeses.forEach(mes => {
      sacrificioMap[mes] = { 
        mes,
        prog2024: 0, real2024: 0, comprado2024: 0, total2024: 0,
        maximalim2024: 0, progr_fiesta2024: 0, entre_real_pf2024: 0,
        prog2025: 0, real2025: 0, comprado2025: 0, total2025: 0,
        maximalim2025: 0, progr_fiesta2025: 0, entre_real_pf2025: 0
      };
    });
    
    sacrificio.forEach(d => {
      const mes = d.mes || 'N/A';
      if (sacrificioMap[mes]) {
        const prog = parseFloat(d.programado) || 0;
        const real = parseFloat(d.real) || 0;
        const comprado = parseFloat(d.comprado) || 0;
        const total = parseFloat(d.total) || 0;
        const maximalim = parseFloat(d.maximalim) || 0;
        const progrFiesta = parseFloat(d.progr_fiesta) || 0;
        const entreRealPf = parseFloat(d.entre_real_pf) || 0;
        
        if (d.anio === 2024) {
          sacrificioMap[mes].prog2024 += prog;
          sacrificioMap[mes].real2024 += real;
          sacrificioMap[mes].comprado2024 += comprado;
          sacrificioMap[mes].total2024 += total;
          sacrificioMap[mes].maximalim2024 += maximalim;
          sacrificioMap[mes].progr_fiesta2024 += progrFiesta;
          sacrificioMap[mes].entre_real_pf2024 += entreRealPf;
        } else if (d.anio === 2025) {
          sacrificioMap[mes].prog2025 += prog;
          sacrificioMap[mes].real2025 += real;
          sacrificioMap[mes].comprado2025 += comprado;
          sacrificioMap[mes].total2025 += total;
          sacrificioMap[mes].maximalim2025 += maximalim;
          sacrificioMap[mes].progr_fiesta2025 += progrFiesta;
          sacrificioMap[mes].entre_real_pf2025 += entreRealPf;
        }
      }
    });
    
    const sacrificioMeses = ordenMeses.map(mes => sacrificioMap[mes]);
    
    // Procesar datos de encasetado por mes
    const encasetadoMap = {};
    ordenMeses.forEach(mes => {
      encasetadoMap[mes] = { 
        mes,
        prog2024: 0, real2024: 0,
        prog2025: 0, real2025: 0
      };
    });
    
    encasetado.forEach(d => {
      const mes = d.mes || 'N/A';
      if (encasetadoMap[mes]) {
        const prog = parseFloat(d.programado) || 0;
        const real = parseFloat(d.real) || 0;
        
        if (d.ano === 2024) {
          encasetadoMap[mes].prog2024 += prog;
          encasetadoMap[mes].real2024 += real;
        } else if (d.ano === 2025) {
          encasetadoMap[mes].prog2025 += prog;
          encasetadoMap[mes].real2025 += real;
        }
      }
    });
    
    const encasetadoMeses = ordenMeses.map(mes => encasetadoMap[mes]);
    
    // Calcular totales
    const totalSacrificio2024 = sacrificioMeses.reduce((sum, d) => sum + (d.real2024 || 0), 0);
    const totalSacrificio2025 = sacrificioMeses.reduce((sum, d) => sum + (d.real2025 || 0), 0);
    const totalEncasetado2024 = encasetadoMeses.reduce((sum, d) => sum + (d.real2024 || 0), 0);
    const totalEncasetado2025 = encasetadoMeses.reduce((sum, d) => sum + (d.real2025 || 0), 0);
    
    return {
      sacrificio: sacrificioMeses,
      encasetado: encasetadoMeses,
      totales: {
        sacrificio2024: totalSacrificio2024,
        sacrificio2025: totalSacrificio2025,
        encasetado2024: totalEncasetado2024,
        encasetado2025: totalEncasetado2025
      }
    };
  }

  // SISTEMA SAGRILAFT
  async getSistemaSagrilaft() {
    const db = getInstance();
    const pool = db.getPool();
    
    // Obtener datos de stakeholders
    const [stakeholders] = await pool.query(`
      SELECT 
        contraparte,
        rechazados,
        la_pct,
        ft_pct,
        documentacion_pct,
        antecedentes_pct,
        peps_pct
      FROM sagrilaft_stakeholders
      ORDER BY rechazados DESC
    `);
    
    // Obtener totales
    const [totales] = await pool.query(`
      SELECT total_validados FROM sagrilaft_totales LIMIT 1
    `);
    
    // Obtener análisis detallado
    const [analisis] = await pool.query(`
      SELECT 
        categor_a as categoria,
        elemento,
        dato_principal,
        detalle_1,
        detalle_2,
        narrativa
      FROM analisis_sagrilaft_2025_2026
      ORDER BY categor_a, elemento
    `);
    
    return {
      stakeholders,
      totales: totales[0] || { total_validados: 0 },
      analisis
    };
  }

  // GESTIÓN GERENCIA ESTRATÉGICA
  async getGestionGerencia() {
    const db = getInstance();
    const pool = db.getPool();
    const [rows] = await pool.query(`
      SELECT 
        secci_n as seccion,
        proceso,
        tema,
        descripci_n as descripcion,
        narrativa
      FROM gestion_gerencia_estrategica_2025
      ORDER BY secci_n, proceso, tema
    `);
    return rows;
  }

  // GESTIÓN AUDITORÍA - Merma y Devoluciones (2023-2025) CON CÁLCULOS
  async getGestionAuditoria() {
    const db = getInstance();
    const pool = db.getPool();
    
    // Obtener datos de merma anual
    const [mermaAnual] = await pool.query(`
      SELECT 
        ano as anio,
        mes,
        valor as porcentaje_merma
      FROM merma_anual
      WHERE ano IN (2023, 2024, 2025, 2026)
      ORDER BY ano, mes
    `);
    
    // Obtener datos de devoluciones
    const [devoluciones] = await pool.query(`
      SELECT 
        ano as anio,
        mes,
        sede,
        devolucion_pct
      FROM auditoria_devoluciones
      WHERE ano IN (2024, 2025)
      ORDER BY ano, mes, sede
    `);
    
    // Obtener narrativas y comentarios
    const [narrativas] = await pool.query(`
      SELECT 
        categoria,
        anio,
        mes,
        sede,
        valor,
        comentario
      FROM gestion_auditoria
      WHERE categoria IN ('NARRATIVA', 'MERMA_PROMEDIO', 'DEVOLUCIONES_PROMEDIO')
      ORDER BY categoria, anio
    `);
    
    // Calcular promedios de merma
    const merma2023 = mermaAnual.filter(d => d.anio === 2023);
    const merma2024 = mermaAnual.filter(d => d.anio === 2024);
    const merma2025 = mermaAnual.filter(d => d.anio === 2025);
    
    const promedio2023 = merma2023.length > 0 
      ? merma2023.reduce((sum, d) => sum + (parseFloat(d.porcentaje_merma) || 0), 0) / merma2023.length 
      : 0;
    const promedio2024 = merma2024.length > 0 
      ? merma2024.reduce((sum, d) => sum + (parseFloat(d.porcentaje_merma) || 0), 0) / merma2024.length 
      : 0;
    const promedio2025 = merma2025.length > 0 
      ? merma2025.reduce((sum, d) => sum + (parseFloat(d.porcentaje_merma) || 0), 0) / merma2025.length 
      : 0;
    
    return {
      mermaAnual,
      devoluciones,
      narrativas,
      promedios: {
        merma2023: promedio2023,
        merma2024: promedio2024,
        merma2025: promedio2025
      }
    };
  }
}

module.exports = DashboardRepository;
