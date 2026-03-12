-- Actualizar datos de encasetamiento según tabla proporcionada
-- POLLO ENCASETADO 2024 vs 2025

-- Actualizar 2024
UPDATE prod_encasetamiento SET valor_programado = 2701500, valor_real = 3591329 WHERE anio = 2024 AND mes = 1;
UPDATE prod_encasetamiento SET valor_programado = 2529000, valor_real = 2487270 WHERE anio = 2024 AND mes = 2;
UPDATE prod_encasetamiento SET valor_programado = 2687200, valor_real = 2568054 WHERE anio = 2024 AND mes = 3;
UPDATE prod_encasetamiento SET valor_programado = 2534000, valor_real = 2520730 WHERE anio = 2024 AND mes = 4;
UPDATE prod_encasetamiento SET valor_programado = 2901300, valor_real = 2913489 WHERE anio = 2024 AND mes = 5;
UPDATE prod_encasetamiento SET valor_programado = 2644000, valor_real = 2718402 WHERE anio = 2024 AND mes = 6;
UPDATE prod_encasetamiento SET valor_programado = 2648400, valor_real = 2565600 WHERE anio = 2024 AND mes = 7;
UPDATE prod_encasetamiento SET valor_programado = 2918800, valor_real = 2938518 WHERE anio = 2024 AND mes = 8;
UPDATE prod_encasetamiento SET valor_programado = 2539500, valor_real = 2631600 WHERE anio = 2024 AND mes = 9;
UPDATE prod_encasetamiento SET valor_programado = 3016100, valor_real = 2932009 WHERE anio = 2024 AND mes = 10;
UPDATE prod_encasetamiento SET valor_programado = 2820600, valor_real = 2164644 WHERE anio = 2024 AND mes = 11;
UPDATE prod_encasetamiento SET valor_programado = 2790000, valor_real = 360162 WHERE anio = 2024 AND mes = 12;

-- Totales 2024: PROG = 32,730,400 | REAL = 30,391,873

-- Actualizar 2025
UPDATE prod_encasetamiento SET valor_programado = 2709400, valor_real = 6034568 WHERE anio = 2025 AND mes = 1;
UPDATE prod_encasetamiento SET valor_programado = 2351600, valor_real = 2379966 WHERE anio = 2025 AND mes = 2;
UPDATE prod_encasetamiento SET valor_programado = 2640400, valor_real = 2682901 WHERE anio = 2025 AND mes = 3;
UPDATE prod_encasetamiento SET valor_programado = 2649600, valor_real = 2632722 WHERE anio = 2025 AND mes = 4;
UPDATE prod_encasetamiento SET valor_programado = 2766400, valor_real = 2727348 WHERE anio = 2025 AND mes = 5;
UPDATE prod_encasetamiento SET valor_programado = 2561200, valor_real = 2592636 WHERE anio = 2025 AND mes = 6;
UPDATE prod_encasetamiento SET valor_programado = 2788000, valor_real = 2723340 WHERE anio = 2025 AND mes = 7;
UPDATE prod_encasetamiento SET valor_programado = 2704800, valor_real = 2589881 WHERE anio = 2025 AND mes = 8;
UPDATE prod_encasetamiento SET valor_programado = 2664000, valor_real = 2681804 WHERE anio = 2025 AND mes = 9;
UPDATE prod_encasetamiento SET valor_programado = 2976800, valor_real = 3052385 WHERE anio = 2025 AND mes = 10;
UPDATE prod_encasetamiento SET valor_programado = 2760600, valor_real = 2330496 WHERE anio = 2025 AND mes = 11;
UPDATE prod_encasetamiento SET valor_programado = 2676300, valor_real = 0 WHERE anio = 2025 AND mes = 12;

-- Totales 2025: PROG = 32,249,100 | REAL = 32,428,047

SELECT 'Datos actualizados correctamente' as mensaje;
