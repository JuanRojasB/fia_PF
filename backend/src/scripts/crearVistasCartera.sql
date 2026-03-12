-- ============================================
-- VISTAS PARA DASHBOARD DE GESTIÓN CARTERA
-- ============================================

-- Vista: Exposición de Cartera 2025 vs 2024 (Comparativa Mensual)
CREATE OR REPLACE VIEW vista_fin_exposicion_cartera_25_vs_24 AS
SELECT 
  CASE 
    WHEN c24.id_cliente LIKE '%_01' THEN 1
    WHEN c24.id_cliente LIKE '%_02' THEN 2
    WHEN c24.id_cliente LIKE '%_03' THEN 3
    WHEN c24.id_cliente LIKE '%_04' THEN 4
    WHEN c24.id_cliente LIKE '%_05' THEN 5
    WHEN c24.id_cliente LIKE '%_06' THEN 6
    WHEN c24.id_cliente LIKE '%_07' THEN 7
    WHEN c24.id_cliente LIKE '%_08' THEN 8
    WHEN c24.id_cliente LIKE '%_09' THEN 9
    WHEN c24.id_cliente LIKE '%_10' THEN 10
    WHEN c24.id_cliente LIKE '%_11' THEN 11
    WHEN c24.id_cliente LIKE '%_12' THEN 12
  END as mes_num,
  CASE 
    WHEN c24.id_cliente LIKE '%_01' THEN 'Enero'
    WHEN c24.id_cliente LIKE '%_02' THEN 'Febrero'
    WHEN c24.id_cliente LIKE '%_03' THEN 'Marzo'
    WHEN c24.id_cliente LIKE '%_04' THEN 'Abril'
    WHEN c24.id_cliente LIKE '%_05' THEN 'Mayo'
    WHEN c24.id_cliente LIKE '%_06' THEN 'Junio'
    WHEN c24.id_cliente LIKE '%_07' THEN 'Julio'
    WHEN c24.id_cliente LIKE '%_08' THEN 'Agosto'
    WHEN c24.id_cliente LIKE '%_09' THEN 'Septiembre'
    WHEN c24.id_cliente LIKE '%_10' THEN 'Octubre'
    WHEN c24.id_cliente LIKE '%_11' THEN 'Noviembre'
    WHEN c24.id_cliente LIKE '%_12' THEN 'Diciembre'
  END as mes_nombre,
  ROUND(c24.saldo_pendiente / 1000000, 2) as t2024,
  ROUND(c25.saldo_pendiente / 1000000, 2) as t2025,
  ROUND(((c25.saldo_pendiente - c24.saldo_pendiente) / c24.saldo_pendiente) * 100, 2) as variacion_pct,
  ROUND(c25.saldo_pendiente - c24.saldo_pendiente, 2) as variacion_absoluta
FROM com_cartera_clientes c24
LEFT JOIN com_cartera_clientes c25 
  ON REPLACE(c24.id_cliente, '2024', '2025') = c25.id_cliente
WHERE c24.id_cliente LIKE 'CARTERA_2024_%'
  AND c24.id_cliente NOT LIKE '%RESUMEN%'
ORDER BY mes_num;

-- Vista: Mix de Ventas 2025 (Contado/Crédito, Morosidad, Rotación)
-- Nota: Esta vista usa datos simulados basados en la cartera
-- En producción, estos datos deberían venir de tablas reales de ventas
CREATE OR REPLACE VIEW vista_fin_mix_ventas_2025 AS
SELECT 
  CASE 
    WHEN id_cliente LIKE '%_01' THEN 1
    WHEN id_cliente LIKE '%_02' THEN 2
    WHEN id_cliente LIKE '%_03' THEN 3
    WHEN id_cliente LIKE '%_04' THEN 4
    WHEN id_cliente LIKE '%_05' THEN 5
    WHEN id_cliente LIKE '%_06' THEN 6
    WHEN id_cliente LIKE '%_07' THEN 7
    WHEN id_cliente LIKE '%_08' THEN 8
    WHEN id_cliente LIKE '%_09' THEN 9
    WHEN id_cliente LIKE '%_10' THEN 10
    WHEN id_cliente LIKE '%_11' THEN 11
    WHEN id_cliente LIKE '%_12' THEN 12
  END as mes_num,
  CASE 
    WHEN id_cliente LIKE '%_01' THEN 'Enero'
    WHEN id_cliente LIKE '%_02' THEN 'Febrero'
    WHEN id_cliente LIKE '%_03' THEN 'Marzo'
    WHEN id_cliente LIKE '%_04' THEN 'Abril'
    WHEN id_cliente LIKE '%_05' THEN 'Mayo'
    WHEN id_cliente LIKE '%_06' THEN 'Junio'
    WHEN id_cliente LIKE '%_07' THEN 'Julio'
    WHEN id_cliente LIKE '%_08' THEN 'Agosto'
    WHEN id_cliente LIKE '%_09' THEN 'Septiembre'
    WHEN id_cliente LIKE '%_10' THEN 'Octubre'
    WHEN id_cliente LIKE '%_11' THEN 'Noviembre'
    WHEN id_cliente LIKE '%_12' THEN 'Diciembre'
  END as mes_nombre,
  -- Simulación: 65% contado, 35% crédito (ajustar según datos reales)
  65.0 as pct_contado,
  35.0 as pct_credito,
  -- Morosidad basada en días de rotación (si >30 días, hay morosidad)
  CASE 
    WHEN dias_rotacion_real > 30 THEN ROUND((dias_rotacion_real - 30) / dias_rotacion_real * 100, 2)
    ELSE 0
  END as morosidad_vencida_pct,
  dias_rotacion_real as dias_rotacion
FROM com_cartera_clientes
WHERE id_cliente LIKE 'CARTERA_2025_%'
  AND id_cliente NOT LIKE '%RESUMEN%'
ORDER BY mes_num;

SELECT 'Vistas de Cartera creadas exitosamente' as resultado;
