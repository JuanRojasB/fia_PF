-- Insertar datos de Pollo Entregado 2025
-- Según tabla proporcionada

INSERT INTO prod_pollo_entregado_anual 
(anio, programado, real_granjas, comprado, total, var_pct, var_unidades_calc, var_unidades_reportada, notas)
VALUES 
(2025, 30872786, 28604260, 274229, 28878489, -2.4, -720612, -733456, 'Del total recibido (REAL) de granjas para el año 2024 sumado al pollo comprado arroja un total de 28.6 millones de pollos el cual presento un decrecimiento frente al año anterior de -2.4%, lo que representa -733.456 pollos menos.');

SELECT 'Datos de 2025 insertados correctamente' as mensaje;

-- Verificar
SELECT * FROM prod_pollo_entregado_anual WHERE anio = 2025;
