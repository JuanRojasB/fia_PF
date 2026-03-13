-- Insertar/Actualizar datos de Pollo Entregado 2025
-- Según tabla actualizada con datos correctos

-- Primero eliminar el registro de 2025 si existe
DELETE FROM prod_pollo_entregado_anual WHERE anio = 2025;

-- Insertar datos actualizados de 2025
INSERT INTO prod_pollo_entregado_anual 
(anio, programado, real_granjas, comprado, total, var_pct, var_unidades_calc, var_unidades_reportada, notas)
VALUES 
(2025, 30872786, 29435711, 238502, 29674213, 2.7, 795724, 795724, 'Del total recibido (REAL) de granjas para el año 2025 sumado al pollo comprado arroja un total de 29.6 millones de pollos el cual presentó un crecimiento frente al año anterior de 2.7%, lo que representa +795.724 pollos más.');

SELECT 'Datos de 2025 actualizados correctamente' as mensaje;

-- Verificar datos 2024 y 2025
SELECT 
  anio,
  FORMAT(programado, 0) as programado,
  FORMAT(real_granjas, 0) as real_granjas,
  FORMAT(comprado, 0) as comprado,
  FORMAT(total, 0) as total,
  CONCAT(var_pct, '%') as var_pct
FROM prod_pollo_entregado_anual 
WHERE anio IN (2024, 2025)
ORDER BY anio DESC;
