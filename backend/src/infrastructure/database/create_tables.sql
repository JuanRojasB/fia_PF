-- Script de creación de base de datos FIA - Pollo Fiesta
-- Versión corregida para MySQL/MariaDB

-- Usar la base de datos existente (Railway ya la creó)
-- Si ejecutas localmente, descomenta la siguiente línea:
CREATE DATABASE IF NOT EXISTS gestion_corporativa_pulida CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gestion_corporativa_pulida;

-- Drop tables if exists
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS analisis_sagrilaft_2025_2026;
DROP TABLE IF EXISTS auditoria_devoluciones;
DROP TABLE IF EXISTS capacidad_granjas;
DROP TABLE IF EXISTS cartera_detalle_2025;
DROP TABLE IF EXISTS cartera_resumen;
DROP TABLE IF EXISTS cartera_resumen_exp;
DROP TABLE IF EXISTS encasetado;
DROP TABLE IF EXISTS gestion_auditoria;
DROP TABLE IF EXISTS gestion_cartera;
DROP TABLE IF EXISTS gestion_comercial_asadero;
DROP TABLE IF EXISTS gestion_comercial_sede3;
DROP TABLE IF EXISTS gestion_logistica;
DROP TABLE IF EXISTS gestion_produccion;
DROP TABLE IF EXISTS merma_anual;
DROP TABLE IF EXISTS merma_series;
DROP TABLE IF EXISTS narrativa_analisis_sagrilaft_2025_2026;
DROP TABLE IF EXISTS narrativa_gestion_gerencia_estrategica_2025;
DROP TABLE IF EXISTS narrativa_gestion_umana_2025;
DROP TABLE IF EXISTS pollo_sacrificado;
DROP TABLE IF EXISTS sagrilaft_stakeholders;
DROP TABLE IF EXISTS sagrilaft_totales;

-- Crear tablas

-- Tabla de usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL COMMENT 'Contraseña (texto plano por ahora, implementar bcrypt)',
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'analyst', 'viewer') NOT NULL DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE analisis_sagrilaft_2025_2026 (
    categor_a VARCHAR(255),
    elemento VARCHAR(255),
    dato_principal VARCHAR(255),
    detalle_1 VARCHAR(255),
    detalle_2 VARCHAR(255),
    narrativa TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE auditoria_devoluciones (ano INT, mes INT, sede INT, devolucion_pct DECIMAL(10,2)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE merma_anual (ano INT, mes INT, valor DECIMAL(10,2)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE merma_series (periodo VARCHAR(50), serie1 DECIMAL(10,2), serie2 DECIMAL(10,2), serie3 DECIMAL(10,2)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE cartera_resumen (mes INT, t2025 DECIMAL(15,2), t2024 DECIMAL(15,2), var_pct DECIMAL(10,2)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE cartera_resumen_exp (mes INT, t2025 DECIMAL(15,2), t2024 DECIMAL(15,2), var_pct DECIMAL(10,2)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE cartera_detalle_2025 (mes VARCHAR(50), total_cartera DECIMAL(20,2), total_cartera_vencida DECIMAL(20,2), indice_morosi DECIMAL(10,2), variacion_cartera_vencida DECIMAL(20,2), dias_de_rotacion DECIMAL(10,2), pct_ventas_contado DECIMAL(10,2), ventas_contado DECIMAL(20,2), pct_ventas_credito DECIMAL(10,2), ventas_credito DECIMAL(20,2), valor_ventas_netas DECIMAL(20,2)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE gestion_auditoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(255),
    anio INT,
    mes INT,
    sede VARCHAR(100),
    valor DECIMAL(15,2),
    comentario TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE gestion_cartera (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mes VARCHAR(50),
    anio INT,
    total_cartera DECIMAL(20,2),
    total_vencida DECIMAL(20,2),
    indice_morosi DECIMAL(10,2),
    variacion_cartera_vencida DECIMAL(20,2),
    dias_rotacion DECIMAL(10,2),
    porc_ventas_contado DECIMAL(10,2),
    ventas_contado DECIMAL(20,2),
    porc_ventas_credito DECIMAL(10,2),
    ventas_credito DECIMAL(20,2),
    valor_ventas_netas DECIMAL(20,2),
    t2025_millones DECIMAL(15,3),
    t2024_millones DECIMAL(15,3),
    var_t_percent DECIMAL(10,2),
    comentario TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE gestion_comercial_asadero (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(255),
    descripcion VARCHAR(255),
    anio INT,
    total_kl DECIMAL(15,2),
    total_part DECIMAL(10,2),
    total_var DECIMAL(10,2),
    porcentaje_cumplimiento DECIMAL(10,2),
    precio_promedio DECIMAL(15,2),
    ingresos_totales DECIMAL(20,2),
    comentario TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE gestion_comercial_sede3 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(255),
    descripcion VARCHAR(255),
    anio INT,
    total_kl DECIMAL(15,2),
    total_part DECIMAL(10,2),
    variacion_kl DECIMAL(15,2),
    porcentaje_var DECIMAL(10,2),
    precio DECIMAL(15,2),
    var_precio DECIMAL(10,2),
    comentario TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE gestion_gerencia_estrategica_2025 (
    secci_n VARCHAR(255),
    proceso VARCHAR(255),
    tema VARCHAR(255),
    descripci_n TEXT,
    narrativa TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE gestion_humana_2025 (
    categor_a VARCHAR(255),
    descripci_n VARCHAR(255),
    a_o INT,
    valor BIGINT,
    __variaci_n VARCHAR(50),
    variaci_n_absoluta VARCHAR(50),
    narrativa TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE gestion_logistica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(255),
    sede VARCHAR(100),
    concepto VARCHAR(255),
    anio INT,
    valor DECIMAL(20,2),
    variacion DECIMAL(10,2),
    comentario TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE encasetado (ano INT, mes VARCHAR(50), prog INT, valor_real INT) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE pollo_sacrificado (ano INT, mes VARCHAR(50), prog INT, valor_real INT, comprado INT, total INT, maximalim INT, progr_fiesta INT, entre_real_pf INT) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE capacidad_granjas (tipo VARCHAR(100), granja VARCHAR(255), mts INT, aves INT) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE gestion_produccion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(255),
    subcategoria VARCHAR(255),
    granja VARCHAR(255),
    mes VARCHAR(50),
    anio INT,
    valor_prog INT,
    valor_real INT,
    valor_comprado INT,
    valor_total INT,
    valor_maxlim INT,
    valor_fiesta INT,
    valor_entre_real_pf INT,
    mts INT,
    aves INT,
    comentario TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE narrativa_analisis_sagrilaft_2025_2026 (narrativa TEXT) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE narrativa_gestion_gerencia_estrategica_2025 (narrativa TEXT) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE narrativa_gestion_humana_2025 (narrativa TEXT) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE sagrilaft_stakeholders (contraparte VARCHAR(255), rechazados INT, la_pct DECIMAL(10,2), ft_pct DECIMAL(10,2), documentacion_pct DECIMAL(10,2), antecedentes_pct DECIMAL(10,2), peps_pct DECIMAL(10,2)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE sagrilaft_totales (total_validados INT) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuarios por defecto
INSERT INTO users (username, password, full_name, role) VALUES ('admin', 'admin123', 'Administrador', 'admin');
INSERT INTO users (username, password, full_name, role) VALUES ('analista', 'analista123', 'Analista Financiero', 'analyst');
INSERT INTO users (username, password, full_name, role) VALUES ('viewer', 'viewer123', 'Visualizador', 'viewer');

-- Insertar datos de las tablas
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2, narrativa) VALUES ('Información General', 'Empresa', 'Pollo Fiesta S.A.', NULL, NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2, narrativa) VALUES ('Información General', 'Periodo Evaluado', '2022-2025', NULL, NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2, narrativa) VALUES ('Información General', 'Stakeholders Validados', '5732', NULL, NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2, narrativa) VALUES ('Información General', 'Stakeholders Rechazados', '314', '5.47%', NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2, narrativa) VALUES ('Hallazgos Generales', 'Documentación Inadecuada', '24%', 'Meta: 10%', 'Plazo: 6 meses', NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2, narrativa) VALUES ('Hallazgos Generales', 'Candidatos No Conformes por Antecedentes', '27%', NULL, NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2, narrativa) VALUES ('Hallazgos Generales', 'Transportadores No Conformes por Documentación', '47%', NULL, NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2, narrativa) VALUES ('Hallazgos Generales', 'Transportadores No Aptos por Antecedentes', '8%', NULL, NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2, narrativa) VALUES ('Hallazgos Generales', 'Proveedores con Novedad FT', '50%', '3 casos', NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2, narrativa) VALUES ('Hallazgos Generales', 'Incumplimiento Documental Comercial', '47%', NULL, NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2, narrativa) VALUES ('Acciones por Área', 'Gestión Humana', 'Actualización procedimiento PGH-04', 'Reunión 14 Enero', 'Nuevos filtros y responsables', NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2, narrativa) VALUES ('Acciones por Área', 'Logística', 'Actualización procedimiento PGH-06', 'Reunión 23 Enero', 'Actualización FCO-05 y FCO-03', NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2, narrativa) VALUES ('Acciones por Área', 'Compras', 'Mejora filtros proveedores', NULL, 'Fortalecimiento comunicación', NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2, narrativa) VALUES ('Acciones por Área', 'Comercial', 'Divulgaciones individuales', NULL, 'Reducción riesgo documental', NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2, narrativa) VALUES ('Sistema y Cumplimiento', 'Plataforma Debida Diligencia', 'DATALAFT / Risk Consulting', NULL, NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2, narrativa) VALUES ('Sistema y Cumplimiento', 'Normatividad Aplicable', 'Circular 100-00005 de 2017 y 100-000016 de 2020', NULL, NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2, narrativa) VALUES ('Sistema y Cumplimiento', 'Enfoque', 'Basado en Riesgos y Debida Diligencia Intensificada', NULL, NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2, narrativa) VALUES ('Conclusión', 'Resultado Estratégico', 'Sistema sólido y alineado a normatividad', NULL, NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2, narrativa) VALUES ('Conclusión', 'Compromiso', 'Actualización constante y fortalecimiento monitoreo', NULL, NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2, narrativa) VALUES ('Conclusión', 'Ventaja Estratégica', 'Protección reputacional y sostenibilidad', NULL, NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (narrativa) VALUES ('ANALISIS Y EVALUACION DEL SISTEMA SAGRILAFT: El sistema de Autocontrol y gestión del riesgo integral de lavado de activos y financiación del terrorismo (SAGRILAFT) garantiza la transparencia y la prevención de delitos financieros en Pollo Fiesta S.A., con datos de stakeholders 2022-2025: 5.732 validados, 314 rechazados (5,47%). Se detectó la necesidad de reducir documentación inadecuada del 24% al 10% en 6 meses, actualizar documentación, mejorar filtros y procedimientos, y fortalecer reuniones entre áreas (Gestión Humana, Logistica, Compras, Comercial) para reducir no conformidades. Conclusión: SAGRILAFT es pilar estratégico, requiere actualización constante, capacitación y fortalecimiento de mecanismos de monitoreo. Cumplimiento como ventaja estratégica.');
-- Devoluciones 2024 (Sede 1: azul, Sede 2: naranja, Sede 3: verde)
INSERT INTO auditoria_devoluciones VALUES (2024, 1, 1, 3.5);
INSERT INTO auditoria_devoluciones VALUES (2024, 1, 2, 1.5);
INSERT INTO auditoria_devoluciones VALUES (2024, 1, 3, 2.0);
INSERT INTO auditoria_devoluciones VALUES (2024, 2, 1, 3.8);
INSERT INTO auditoria_devoluciones VALUES (2024, 2, 2, 1.8);
INSERT INTO auditoria_devoluciones VALUES (2024, 2, 3, 2.5);
INSERT INTO auditoria_devoluciones VALUES (2024, 3, 1, 4.0);
INSERT INTO auditoria_devoluciones VALUES (2024, 3, 2, 0.5);
INSERT INTO auditoria_devoluciones VALUES (2024, 3, 3, 3.0);
INSERT INTO auditoria_devoluciones VALUES (2024, 4, 1, 4.0);
INSERT INTO auditoria_devoluciones VALUES (2024, 4, 2, 3.5);
INSERT INTO auditoria_devoluciones VALUES (2024, 4, 3, 1.5);
INSERT INTO auditoria_devoluciones VALUES (2024, 5, 1, 3.5);
INSERT INTO auditoria_devoluciones VALUES (2024, 5, 2, 1.2);
INSERT INTO auditoria_devoluciones VALUES (2024, 5, 3, 1.5);
INSERT INTO auditoria_devoluciones VALUES (2024, 6, 1, 2.8);
INSERT INTO auditoria_devoluciones VALUES (2024, 6, 2, 0.5);
INSERT INTO auditoria_devoluciones VALUES (2024, 6, 3, 1.5);
INSERT INTO auditoria_devoluciones VALUES (2024, 7, 1, 3.0);
INSERT INTO auditoria_devoluciones VALUES (2024, 7, 2, 0.5);
INSERT INTO auditoria_devoluciones VALUES (2024, 7, 3, 1.5);
INSERT INTO auditoria_devoluciones VALUES (2024, 8, 1, 4.2);
INSERT INTO auditoria_devoluciones VALUES (2024, 8, 2, 0.5);
INSERT INTO auditoria_devoluciones VALUES (2024, 8, 3, 1.5);
INSERT INTO auditoria_devoluciones VALUES (2024, 9, 1, 3.2);
INSERT INTO auditoria_devoluciones VALUES (2024, 9, 2, 1.2);
INSERT INTO auditoria_devoluciones VALUES (2024, 9, 3, 1.5);
INSERT INTO auditoria_devoluciones VALUES (2024, 10, 1, 3.0);
INSERT INTO auditoria_devoluciones VALUES (2024, 10, 2, 0.5);
INSERT INTO auditoria_devoluciones VALUES (2024, 10, 3, 2.0);
INSERT INTO auditoria_devoluciones VALUES (2024, 11, 1, 3.0);
INSERT INTO auditoria_devoluciones VALUES (2024, 11, 2, 0.5);
INSERT INTO auditoria_devoluciones VALUES (2024, 11, 3, 2.5);
INSERT INTO auditoria_devoluciones VALUES (2024, 12, 1, 3.0);
INSERT INTO auditoria_devoluciones VALUES (2024, 12, 2, 0.5);
INSERT INTO auditoria_devoluciones VALUES (2024, 12, 3, 2.5);
-- Devoluciones 2025
INSERT INTO auditoria_devoluciones VALUES (2025, 1, 1, 3.0);
INSERT INTO auditoria_devoluciones VALUES (2025, 1, 2, 0.5);
INSERT INTO auditoria_devoluciones VALUES (2025, 1, 3, 2.0);
INSERT INTO auditoria_devoluciones VALUES (2025, 2, 1, 3.0);
INSERT INTO auditoria_devoluciones VALUES (2025, 2, 2, 0.5);
INSERT INTO auditoria_devoluciones VALUES (2025, 2, 3, 2.0);
INSERT INTO auditoria_devoluciones VALUES (2025, 3, 1, 2.8);
INSERT INTO auditoria_devoluciones VALUES (2025, 3, 2, 0.5);
INSERT INTO auditoria_devoluciones VALUES (2025, 3, 3, 2.0);
INSERT INTO auditoria_devoluciones VALUES (2025, 4, 1, 2.8);
INSERT INTO auditoria_devoluciones VALUES (2025, 4, 2, 1.5);
INSERT INTO auditoria_devoluciones VALUES (2025, 4, 3, 1.5);
INSERT INTO auditoria_devoluciones VALUES (2025, 5, 1, 3.0);
INSERT INTO auditoria_devoluciones VALUES (2025, 5, 2, 0.2);
INSERT INTO auditoria_devoluciones VALUES (2025, 5, 3, 1.5);
INSERT INTO auditoria_devoluciones VALUES (2025, 6, 1, 2.8);
INSERT INTO auditoria_devoluciones VALUES (2025, 6, 2, 4.0);
INSERT INTO auditoria_devoluciones VALUES (2025, 6, 3, 2.0);
INSERT INTO auditoria_devoluciones VALUES (2025, 7, 1, 2.5);
INSERT INTO auditoria_devoluciones VALUES (2025, 7, 2, 1.5);
INSERT INTO auditoria_devoluciones VALUES (2025, 7, 3, 2.5);
INSERT INTO auditoria_devoluciones VALUES (2025, 8, 1, 2.5);
INSERT INTO auditoria_devoluciones VALUES (2025, 8, 2, 0.0);
INSERT INTO auditoria_devoluciones VALUES (2025, 8, 3, 2.5);
INSERT INTO auditoria_devoluciones VALUES (2025, 9, 1, 2.8);
INSERT INTO auditoria_devoluciones VALUES (2025, 9, 2, 4.0);
INSERT INTO auditoria_devoluciones VALUES (2025, 9, 3, 2.5);
INSERT INTO auditoria_devoluciones VALUES (2025, 10, 1, 2.8);
INSERT INTO auditoria_devoluciones VALUES (2025, 10, 2, 5.0);
INSERT INTO auditoria_devoluciones VALUES (2025, 10, 3, 3.0);
INSERT INTO auditoria_devoluciones VALUES (2025, 11, 1, 3.0);
INSERT INTO auditoria_devoluciones VALUES (2025, 11, 2, 4.0);
INSERT INTO auditoria_devoluciones VALUES (2025, 11, 3, 4.0);
INSERT INTO auditoria_devoluciones VALUES (2025, 12, 1, 3.0);
INSERT INTO auditoria_devoluciones VALUES (2025, 12, 2, 1.5);
INSERT INTO auditoria_devoluciones VALUES (2025, 12, 3, 3.0);
INSERT INTO merma_anual VALUES (2026, 1, 12.35);
INSERT INTO merma_anual VALUES (2026, 2, 12.35);
INSERT INTO merma_anual VALUES (2026, 3, NULL);
INSERT INTO merma_anual VALUES (2026, 4, NULL);
INSERT INTO merma_anual VALUES (2026, 5, NULL);
INSERT INTO merma_anual VALUES (2026, 6, NULL);
INSERT INTO merma_anual VALUES (2026, 7, NULL);
INSERT INTO merma_anual VALUES (2026, 8, NULL);
INSERT INTO merma_anual VALUES (2026, 9, NULL);
INSERT INTO merma_anual VALUES (2026, 10, NULL);
INSERT INTO merma_anual VALUES (2026, 11, NULL);
INSERT INTO merma_anual VALUES (2026, 12, NULL);
INSERT INTO merma_anual VALUES (2025, 1, 11.62);
INSERT INTO merma_anual VALUES (2025, 2, 10.95);
INSERT INTO merma_anual VALUES (2025, 3, 12.81);
INSERT INTO merma_anual VALUES (2025, 4, 12.06);
INSERT INTO merma_anual VALUES (2025, 5, 11.74);
INSERT INTO merma_anual VALUES (2025, 6, 11.81);
INSERT INTO merma_anual VALUES (2025, 7, 11.39);
INSERT INTO merma_anual VALUES (2025, 8, 10.93);
INSERT INTO merma_anual VALUES (2025, 9, 11.97);
INSERT INTO merma_anual VALUES (2025, 10, 11.42);
INSERT INTO merma_anual VALUES (2025, 11, 11.68);
INSERT INTO merma_anual VALUES (2025, 12, 12.0);
INSERT INTO merma_anual VALUES (2024, 1, 12.46);
INSERT INTO merma_anual VALUES (2024, 2, 11.15);
INSERT INTO merma_anual VALUES (2024, 3, 11.38);
INSERT INTO merma_anual VALUES (2024, 4, 11.75);
INSERT INTO merma_anual VALUES (2024, 5, 10.93);
INSERT INTO merma_anual VALUES (2024, 6, 11.52);
INSERT INTO merma_anual VALUES (2024, 7, 10.73);
INSERT INTO merma_anual VALUES (2024, 8, 11.43);
INSERT INTO merma_anual VALUES (2024, 9, 10.21);
INSERT INTO merma_anual VALUES (2024, 10, 10.64);
INSERT INTO merma_anual VALUES (2024, 11, 12.29);
INSERT INTO merma_anual VALUES (2024, 12, 13.33);
INSERT INTO merma_anual VALUES (2023, 1, 12.96);
INSERT INTO merma_anual VALUES (2023, 2, 12.52);
INSERT INTO merma_anual VALUES (2023, 3, 13.13);
INSERT INTO merma_anual VALUES (2023, 4, 13.23);
INSERT INTO merma_anual VALUES (2023, 5, 12.52);
INSERT INTO merma_anual VALUES (2023, 6, 14.68);
INSERT INTO merma_anual VALUES (2023, 7, 12.69);
INSERT INTO merma_anual VALUES (2023, 8, 11.6);
INSERT INTO merma_anual VALUES (2023, 9, 10.38);
INSERT INTO merma_anual VALUES (2023, 10, 11.36);
INSERT INTO merma_anual VALUES (2023, 11, 11.95);
INSERT INTO merma_anual VALUES (2023, 12, 12.23);
INSERT INTO merma_series VALUES ('2024 enero', 3.5, 1.5, 2.0);
INSERT INTO merma_series VALUES ('2024 febrero', 3.8, 1.8, 3.0);
INSERT INTO merma_series VALUES ('2024 marzo', 4.0, 1.0, 2.8);
INSERT INTO merma_series VALUES ('2024 abril', 4.0, 3.5, 1.5);
INSERT INTO merma_series VALUES ('2024 mayo', 3.5, 1.0, 1.0);
INSERT INTO merma_series VALUES ('2024 junio', 3.0, 0.5, 1.5);
INSERT INTO merma_series VALUES ('2024 julio', 3.0, 0.8, 1.5);
INSERT INTO merma_series VALUES ('2024 agosto', 4.2, 0.5, 1.0);
INSERT INTO merma_series VALUES ('2024 septiembre', 3.5, 1.0, 1.0);
INSERT INTO merma_series VALUES ('2024 octubre', 3.0, 0.5, 1.5);
INSERT INTO merma_series VALUES ('2024 noviembre', 3.0, 0.5, 2.0);
INSERT INTO merma_series VALUES ('2024 diciembre', 3.0, 0.5, 2.5);
INSERT INTO merma_series VALUES ('2025 enero', 3.0, 0.5, 2.5);
INSERT INTO merma_series VALUES ('2025 febrero', 3.0, 0.5, 2.5);
INSERT INTO merma_series VALUES ('2025 marzo', 4.2, 0.5, 1.5);
INSERT INTO merma_series VALUES ('2025 abril', 3.0, 0.5, 1.5);
INSERT INTO merma_series VALUES ('2025 mayo', 3.0, 1.5, 1.5);
INSERT INTO merma_series VALUES ('2025 junio', 3.0, 0.0, 1.5);
INSERT INTO merma_series VALUES ('2025 julio', 3.0, 4.0, 2.0);
INSERT INTO merma_series VALUES ('2025 agosto', 2.5, 2.5, 2.5);
INSERT INTO merma_series VALUES ('2025 septiembre', 2.5, 0.0, 2.5);
INSERT INTO merma_series VALUES ('2025 octubre', 3.0, 5.0, 3.0);
INSERT INTO merma_series VALUES ('2025 noviembre', 4.0, 2.5, 4.0);
INSERT INTO merma_series VALUES ('2025 diciembre', 3.0, 1.5, 3.0);
INSERT INTO cartera_resumen VALUES (1, 14413.0, 17366.0, -17.0);
INSERT INTO cartera_resumen VALUES (2, 15997.0, 17668.0, -15.0);
INSERT INTO cartera_resumen VALUES (3, 14470.0, 18555.0, -16.0);
INSERT INTO cartera_resumen VALUES (4, 17937.0, 17161.0, 5.0);
INSERT INTO cartera_resumen VALUES (5, 18209.0, 16978.0, 7.0);
INSERT INTO cartera_resumen VALUES (6, 18491.0, 17763.0, 4.0);
INSERT INTO cartera_resumen VALUES (7, 16735.0, 17415.0, -4.0);
INSERT INTO cartera_resumen VALUES (8, 20856.0, 18241.0, 13.0);
INSERT INTO cartera_resumen VALUES (9, 17309.0, 19078.0, -10.0);
INSERT INTO cartera_resumen VALUES (10, 19652.0, 20493.0, -4.0);
INSERT INTO cartera_resumen VALUES (11, 20953.0, 18704.0, 22.0);
INSERT INTO cartera_resumen VALUES (12, 16785.0, 16971.0, -1.0);
INSERT INTO cartera_resumen_exp VALUES (1, 14413.0, 17366.0, -17.0);
INSERT INTO cartera_resumen_exp VALUES (2, 15097.0, 17668.0, -15.0);
INSERT INTO cartera_resumen_exp VALUES (3, 15568.0, 18555.0, -16.0);
INSERT INTO cartera_resumen_exp VALUES (4, 17937.0, 17161.0, 5.0);
INSERT INTO cartera_resumen_exp VALUES (5, 18209.0, 16978.0, 7.0);
INSERT INTO cartera_resumen_exp VALUES (6, 18491.0, 17763.0, 4.0);
INSERT INTO cartera_resumen_exp VALUES (7, 16735.0, 17415.0, -4.0);
INSERT INTO cartera_resumen_exp VALUES (8, 20667.0, 18241.0, 13.0);
INSERT INTO cartera_resumen_exp VALUES (9, 17110.0, 19078.0, -10.0);
INSERT INTO cartera_resumen_exp VALUES (10, 19652.0, 20493.0, -4.0);
INSERT INTO cartera_resumen_exp VALUES (11, 22838.0, 18704.0, 22.0);
INSERT INTO cartera_resumen_exp VALUES (12, 16785.0, 16971.0, -1.0);
INSERT INTO cartera_detalle_2025 VALUES ('Jan-25', 14412689391, 6176399177, 43, -1557049190, 19.78, 35.86, 11987878795, 64.13, 21437479983, 33428115870);
INSERT INTO cartera_detalle_2025 VALUES ('Feb-25', 15997421607, 7065964437, 47, 889565260, 16.59, 33.54, 10438364907, 66.46, 20679848688, 31118341330);
INSERT INTO cartera_detalle_2025 VALUES ('Mar-25', 14469921094, 7277405809, 50, 211442372, 16.47, 35.13, 11609872525, 64.87, 21437803674, 33048101757);
INSERT INTO cartera_detalle_2025 VALUES ('Apr-25', 17936508752, 8717656442, 49, 1440249633, 14.39, 33.84, 10356355285, 66.16, 20251153500, 30608104632);
INSERT INTO cartera_detalle_2025 VALUES ('May-25', 18209254924, 7030281613, 39, -1687374829, 15.32, 39.09, 12985883589, 60.91, 20238388567, 33224425996);
INSERT INTO cartera_detalle_2025 VALUES ('Jun-25', 18490901842, 8583907709, 46, 1553626096, 16.79, 38.01, 11041764270, 61.99, 18011416335, 29053428245);
INSERT INTO cartera_detalle_2025 VALUES ('Jul-25', 16734768396, 6118360787, 37, -2465546922, 12.69, 38.59, 12805263305, 61.4, 20372743972, 33178713394);
INSERT INTO cartera_detalle_2025 VALUES ('Aug-25', 20856456595, 10315161061, 49, 4196800274, 17.01, 36.9, 11388755473, 63.1, 19478201008, 30867655227);
INSERT INTO cartera_detalle_2025 VALUES ('Sep-25', 17309202363, 7218602492, 42, -3096568569, 16.06, 36.76, 11061123842, 64.24, 19870276930, 30931784737);
INSERT INTO cartera_detalle_2025 VALUES ('Oct-25', 19652177415, 11656799639, 59, 4438197147, 16.05, 40.81, 15827220099, 59.19, 22958626315, 38785846414);
INSERT INTO cartera_detalle_2025 VALUES ('Nov-25', 20952520953, 10134081938, 48, -1522717701, 16.21, 40.58, 14939957297, 59.42, 21873567783, 36813525080);
INSERT INTO cartera_detalle_2025 VALUES ('Dec-25', 16785466719, 8486129930, 51, -1647952008, 15.4, 46.85, 20054162655, 53.15, 22754467018, 42808629673);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2023, 1, 12.96);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2023, 2, 12.52);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2023, 3, 13.13);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2023, 4, 13.23);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2023, 5, 12.52);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2023, 6, 14.68);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2023, 7, 12.69);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2023, 8, 10.86);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2023, 9, 10.38);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2023, 10, 11.35);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2023, 11, 11.36);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2023, 12, 12.23);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2024, 1, 12.46);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2024, 2, 11.15);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2024, 3, 11.38);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2024, 4, 11.75);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2024, 5, 10.93);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2024, 6, 11.52);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2024, 7, 10.73);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2024, 8, 11.43);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2024, 9, 10.21);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2024, 10, 10.64);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2024, 11, 12.29);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2024, 12, 13.33);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2025, 1, 11.62);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2025, 2, 10.95);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2025, 3, 12.81);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2025, 4, 12.06);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2025, 5, 11.74);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2025, 6, 11.81);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2025, 7, 11.39);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2025, 8, 10.93);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2025, 9, 11.97);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2025, 10, 11.42);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2025, 11, 11.68);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA', 2025, 12, 12.0);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA_PROMEDIO', 2023, NULL, 12.44);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA_PROMEDIO', 2024, NULL, 11.49);
INSERT INTO gestion_auditoria (categoria, anio, mes, valor) VALUES ('MERMA_PROMEDIO', 2025, NULL, 11.70);
INSERT INTO gestion_auditoria (categoria, mes, valor) VALUES ('MERMA_META', NULL, 10.00);
INSERT INTO gestion_auditoria (categoria, sede, anio, valor) VALUES ('MERMA_SEDE', 'SEDE1', 2025, 9.49);
INSERT INTO gestion_auditoria (categoria, sede, anio, valor) VALUES ('MERMA_SEDE', 'SEDE2', 2025, -22.31);
INSERT INTO gestion_auditoria (categoria, sede, anio, valor) VALUES ('MERMA_SEDE', 'SEDE3', 2025, 13.05);
INSERT INTO gestion_auditoria (categoria, anio, valor) VALUES ('DEVOLUCIONES_PROMEDIO', 2024, 2.54);
INSERT INTO gestion_auditoria (categoria, anio, valor) VALUES ('DEVOLUCIONES_PROMEDIO', 2025, 2.26);
INSERT INTO gestion_auditoria (categoria, sede, anio, valor) VALUES ('DEVOLUCIONES_SEDE', 'SEDE1', 2025, 2.85);
INSERT INTO gestion_auditoria (categoria, sede, anio, valor) VALUES ('DEVOLUCIONES_SEDE', 'SEDE2', 2025, 1.61);
INSERT INTO gestion_auditoria (categoria, sede, anio, valor) VALUES ('DEVOLUCIONES_SEDE', 'SEDE3', 2025, 2.31);
INSERT INTO gestion_auditoria (categoria, comentario) VALUES ('NARRATIVA', 'Durante el año 2025, el are de Auditoría Interna y Control Interno ejecutó auditorías mensuales a los procesos misionales de la compañía: Logística, Producción y Comercial (12 auditorías cada uno), así como a Puntos de Venta (12 por punto).');
INSERT INTO gestion_auditoria (categoria, comentario) VALUES ('NARRATIVA', 'Las auditorías exploraron los controles implementados por cada área para mitigar riesgos y su impacto en inventarios, merma y eficiencia operativa.');
INSERT INTO gestion_auditoria (categoria, comentario) VALUES ('NARRATIVA', 'Se analizó el proceso de devoluciones por sede, identificando variaciones y oportunidades de mejora comparando 2025 vs 2024.');
INSERT INTO gestion_auditoria (categoria, comentario) VALUES ('NARRATIVA', 'Se implementaron cambios estructurales en el flujo logístico interno para reducir merma: Sede3 centraliza distribución desde planta principal.');
INSERT INTO gestion_auditoria (categoria, comentario) VALUES ('NARRATIVA', 'Aunque la merma promedio anual muestra estabilidad, en 2do semestre 2025 se observa un mayor control: Sep 10.21%, Jul 10.73%, Oct 10.64%.');
INSERT INTO gestion_auditoria (categoria, comentario) VALUES ('NARRATIVA', 'Persiste una brecha de 1.70 puntos con la meta de merma 10.00%, por lo que sigue siendo un indicador prioritario en 2026.');
INSERT INTO gestion_auditoria (categoria, comentario) VALUES ('NARRATIVA', 'Sede1 merma: pasó de >16% a estabilizarse en 7–8% después de marzo, cierra 2025 en 9.49%.');
INSERT INTO gestion_auditoria (categoria, comentario) VALUES ('NARRATIVA', 'Sede2 (U02) mejora: cierra 2025 en -22.31% acercándose a meta -25%.');
INSERT INTO gestion_auditoria (categoria, comentario) VALUES ('NARRATIVA', 'Sede3 (U03) mejora: cierra 2025 en 13.05%, no alcanza meta 12%, brecha 1.05 puntos.');
INSERT INTO gestion_auditoria (categoria, comentario) VALUES ('NARRATIVA', 'Promedio devoluciones: 2025 2.26% (-0.28 p.p. vs 2024).');
INSERT INTO gestion_auditoria (categoria, comentario) VALUES ('NARRATIVA', 'Auditoría envía alertas preventivas diarias y semanales para corregir desviaciones y apoyar decisiones estratégicas.');
INSERT INTO gestion_cartera (mes, anio, total_cartera, total_vencida, indice_morosi, variacion_cartera_vencida, dias_rotacion, porc_ventas_contado, ventas_contado, porc_ventas_credito, ventas_credito, valor_ventas_netas, t2025_millones, t2024_millones, var_t_percent) VALUES ('ene', 2025, 14412689391, 6176399177, 43, -1557049190, 19.78, 35.86, 11987878785, 64.13, 21437479983, 33428115870, 14.413, 17.366, -17);
INSERT INTO gestion_cartera (mes, anio, total_cartera, total_vencida, indice_morosi, variacion_cartera_vencida, dias_rotacion, porc_ventas_contado, ventas_contado, porc_ventas_credito, ventas_credito, valor_ventas_netas, t2025_millones, t2024_millones, var_t_percent) VALUES ('feb', 2025, 15097421607, 7065964437, 47, 889565260, 16.59, 33.54, 10438364907, 66.46, 20679848689, 31118341350, 15.097, 17.668, -15);
INSERT INTO gestion_cartera (mes, anio, total_cartera, total_vencida, indice_morosi, variacion_cartera_vencida, dias_rotacion, porc_ventas_contado, ventas_contado, porc_ventas_credito, ventas_credito, valor_ventas_netas, t2025_millones, t2024_millones, var_t_percent) VALUES ('mar', 2025, 14469921094, 7277406899, 50, 211442372, 16.47, 35.13, 11609872525, 64.87, 21437803674, 33047101179, 15.568, 18.555, -16);
INSERT INTO gestion_cartera (mes, anio, total_cartera, total_vencida, indice_morosi, variacion_cartera_vencida, dias_rotacion, porc_ventas_contado, ventas_contado, porc_ventas_credito, ventas_credito, valor_ventas_netas, t2025_millones, t2024_millones, var_t_percent) VALUES ('abr', 2025, 17936508732, 8717656442, 49, 1440249933, 14.39, 33.84, 10356355285, 66.16, 20251153500, 30608104623, 17.937, 17.161, 5);
INSERT INTO gestion_cartera (mes, anio, total_cartera, total_vencida, indice_morosi, variacion_cartera_vencida, dias_rotacion, porc_ventas_contado, ventas_contado, porc_ventas_credito, ventas_credito, valor_ventas_netas, t2025_millones, t2024_millones, var_t_percent) VALUES ('may', 2025, 18209525424, 7030281621, 39, -1687374829, 15.32, 39.09, 12985883589, 60.91, 20238388567, 33223462956, 18.209, 16.978, 7);
INSERT INTO gestion_cartera (mes, anio, total_cartera, total_vencida, indice_morosi, variacion_cartera_vencida, dias_rotacion, porc_ventas_contado, ventas_contado, porc_ventas_credito, ventas_credito, valor_ventas_netas, t2025_millones, t2024_millones, var_t_percent) VALUES ('jun', 2025, 18490901842, 8583907709, 46, 1553626096, 16.79, 38.01, 11041764270, 62.01, 18011416335, 29053428245, 18.491, 17.763, 4);
INSERT INTO gestion_cartera (mes, anio, total_cartera, total_vencida, indice_morosi, variacion_cartera_vencida, dias_rotacion, porc_ventas_contado, ventas_contado, porc_ventas_credito, ventas_credito, valor_ventas_netas, t2025_millones, t2024_millones, var_t_percent) VALUES ('jul', 2025, 16734768996, 6118360787, 37, -2465546225, 12.69, 38.59, 12805263305, 61.4, 20372743972, 33178713394, 16.735, 17.415, -4);
INSERT INTO gestion_cartera (mes, anio, total_cartera, total_vencida, indice_morosi, variacion_cartera_vencida, dias_rotacion, porc_ventas_contado, ventas_contado, porc_ventas_credito, ventas_credito, valor_ventas_netas, t2025_millones, t2024_millones, var_t_percent) VALUES ('ago', 2025, 20856456956, 10315161061, 49, 4196800874, 17.01, 36.9, 11388755472, 63.1, 19478030534, 30867060823, 20.667, 18.241, 13);
INSERT INTO gestion_cartera (mes, anio, total_cartera, total_vencida, indice_morosi, variacion_cartera_vencida, dias_rotacion, porc_ventas_contado, ventas_contado, porc_ventas_credito, ventas_credito, valor_ventas_netas, t2025_millones, t2024_millones, var_t_percent) VALUES ('sep', 2025, 17109907253, 7218602492, 42, -3096558569, 16.06, 35.76, 11016123842, 64.24, 19870276930, 30991784737, 17.11, 19.078, -10);
INSERT INTO gestion_cartera (mes, anio, total_cartera, total_vencida, indice_morosi, variacion_cartera_vencida, dias_rotacion, porc_ventas_contado, ventas_contado, porc_ventas_credito, ventas_credito, valor_ventas_netas, t2025_millones, t2024_millones, var_t_percent) VALUES ('oct', 2025, 19523482000, 11656799639, 60, 4235194447, 16.05, 40.81, 15885000000, 59.19, 22958626135, 38785000000, 19.652, 18.704, 5);
INSERT INTO gestion_cartera (mes, anio, total_cartera, total_vencida, indice_morosi, variacion_cartera_vencida, dias_rotacion, porc_ventas_contado, ventas_contado, porc_ventas_credito, ventas_credito, valor_ventas_netas, t2025_millones, t2024_millones, var_t_percent) VALUES ('nov', 2025, 20952520953, 10134081938, 48, -1522171701, 16.21, 40.59, 1493995797, 59.42, 21873567883, 36813525080, 22.838, 18.704, 22);
INSERT INTO gestion_cartera (mes, anio, total_cartera, total_vencida, indice_morosi, variacion_cartera_vencida, dias_rotacion, porc_ventas_contado, ventas_contado, porc_ventas_credito, ventas_credito, valor_ventas_netas, t2025_millones, t2024_millones, var_t_percent) VALUES ('dic', 2025, 16785466719, 8486129930, 51, -1647952008, 15.4, 46.85, 20054162655, 53.15, 22754047018, 42808629753, 16.785, 16.971, -1);
INSERT INTO gestion_cartera (comentario) VALUES ('Cierra el año 2025 con una nueva organización en la estructura y un nuevo director de Cartera.');
INSERT INTO gestion_cartera (comentario) VALUES ('Rotación al final del periodo de 15,40 días a Dic/25, frente al periodo anterior de 20,86 días.');
INSERT INTO gestion_cartera (comentario) VALUES ('Se cumplió la meta de rotación establecida en ISO de 15 días.');
INSERT INTO gestion_cartera (comentario) VALUES ('Las ventas de contado en promedio representan el 37.91% y las ventas de crédito el 62.09%.');
INSERT INTO gestion_cartera (comentario) VALUES ('El porcentaje promedio de índice de cartera morosa vencida es 46.63%.');
INSERT INTO gestion_cartera (comentario) VALUES ('El nivel de cierre de cartera a diciembre 2025 se presenta una disminución de 16.785 millones un 1% frente a Dic/24.');
INSERT INTO gestion_cartera (comentario) VALUES ('En Dic/24 la cartera era 16.971 millones');
INSERT INTO gestion_cartera (comentario) VALUES ('Para el año 2025 no se realiza deterioro de cartera, se está gestionando los respectivos cobros.');
INSERT INTO gestion_cartera (comentario) VALUES ('El reto para el año 2026 es continuar con conciliación de cartera, comités de cartera y consolidar procesos de cobros.');
INSERT INTO gestion_comercial_asadero (categoria, descripcion, anio, total_kl, total_part, total_var) VALUES ('VENTA_PRODUCTO', 'REFRIGERADO', 2025, 10770230, 91.91, 1.77);
INSERT INTO gestion_comercial_asadero (categoria, descripcion, anio, total_kl, total_part) VALUES ('VENTA_PRODUCTO', 'REFRIGERADO', 2024, 10582899, 87.65);
INSERT INTO gestion_comercial_asadero (categoria, descripcion, anio, total_kl, total_part, total_var) VALUES ('VENTA_PRODUCTO', 'POLLO ENTERO', 2025, 6182144, 52.76, -1.31);
INSERT INTO gestion_comercial_asadero (categoria, descripcion, anio, total_kl, total_part) VALUES ('VENTA_PRODUCTO', 'POLLO ENTERO', 2024, 6263935, 51.88);
INSERT INTO gestion_comercial_asadero (categoria, descripcion, anio, total_kl, total_part, total_var) VALUES ('VENTA_PRODUCTO', 'PRESA', 2025, 2309913, 19.71, -4.07);
INSERT INTO gestion_comercial_asadero (categoria, descripcion, anio, total_kl, total_part) VALUES ('VENTA_PRODUCTO', 'PRESA', 2024, 2408034, 19.94);
INSERT INTO gestion_comercial_asadero (categoria, descripcion, anio, total_kl, total_part, total_var) VALUES ('VENTA_PRODUCTO', 'MENUDENCIA', 2025, 2277756, 19.44, 19.23);
INSERT INTO gestion_comercial_asadero (categoria, descripcion, anio, total_kl, total_part) VALUES ('VENTA_PRODUCTO', 'MENUDENCIA', 2024, 1910459, 15.82);
INSERT INTO gestion_comercial_asadero (categoria, descripcion, anio, total_kl, total_part, total_var) VALUES ('VENTA_PRODUCTO', 'CARNES FRIAS', 2025, 417, 0.0, -11.57);
INSERT INTO gestion_comercial_asadero (categoria, descripcion, anio, total_kl, total_part) VALUES ('VENTA_PRODUCTO', 'CARNES FRIAS', 2024, 472, 0.0);
INSERT INTO gestion_comercial_asadero (categoria, descripcion, anio, total_kl, total_part, total_var) VALUES ('VENTA_PRODUCTO', 'CONGELADO', 2025, 948341, 8.09, -36.43);
INSERT INTO gestion_comercial_asadero (categoria, descripcion, anio, total_kl, total_part) VALUES ('VENTA_PRODUCTO', 'CONGELADO', 2024, 1491814, 12.35);
INSERT INTO gestion_comercial_asadero (categoria, descripcion, anio, total_kl, total_part, total_var) VALUES ('VENTA_PRODUCTO', 'CONGELADO POLLO ENTERO', 2025, 1742, 0.01, 4791.88);
INSERT INTO gestion_comercial_asadero (categoria, descripcion, anio, total_kl, total_part) VALUES ('VENTA_PRODUCTO', 'CONGELADO POLLO ENTERO', 2024, 36, 0.0);
INSERT INTO gestion_comercial_asadero (categoria, descripcion, anio, total_kl, total_part, total_var) VALUES ('VENTA_PRODUCTO', 'CONGELADO PRESA', 2025, 944276, 8.06, -30.44);
INSERT INTO gestion_comercial_asadero (categoria, descripcion, anio, total_kl, total_part) VALUES ('VENTA_PRODUCTO', 'CONGELADO PRESA', 2024, 1357549, 11.24);
INSERT INTO gestion_comercial_asadero (categoria, descripcion, anio, total_kl, total_part, total_var) VALUES ('VENTA_PRODUCTO', 'CONGELADO MENUDENCIA', 2025, 1176, 0.01, -93.17);
INSERT INTO gestion_comercial_asadero (categoria, descripcion, anio, total_kl, total_part) VALUES ('VENTA_PRODUCTO', 'CONGELADO MENUDENCIA', 2024, 17212, 0.14);
INSERT INTO gestion_comercial_asadero (categoria, descripcion, anio, total_kl, total_part, total_var) VALUES ('VENTA_PRODUCTO', 'CONGELADO CARNES FRIAS', 2025, 1147, 0.01, -99.02);
INSERT INTO gestion_comercial_asadero (categoria, descripcion, anio, total_kl, total_part) VALUES ('VENTA_PRODUCTO', 'CONGELADO CARNES FRIAS', 2024, 11073, 0.09);
INSERT INTO gestion_comercial_asadero (categoria, descripcion, anio, total_kl, total_part, total_var) VALUES ('VENTA_PRODUCTO', 'TOTAL_GENERAL', 2025, 11718571, 100.00, -2.95);
INSERT INTO gestion_comercial_asadero (categoria, descripcion, anio, total_kl, total_part) VALUES ('VENTA_PRODUCTO', 'TOTAL_GENERAL', 2024, 12074714, 100.00);
INSERT INTO gestion_comercial_asadero (categoria, anio, comentario) VALUES ('NARRATIVA', 2025, 'Resultados en ventas de kilos: cumplimiento de la meta del presupuesto 83.2% con un decrecimiento de -2.9% frente al 2024, aporte importante de la línea de pollo refrigerado que representa una participación del 91.91% de las ventas totales. Las ventas de pollo refrigerado crecen 1.77% en 2025 vs 2024. Las ventas de pollo entero representan 52.76% de participación con un decrecimiento de -1.31%. La presa refrigerada participa con 19.71% con un decrecimiento de -4.07%. Pollo Congelado participa con 8.09% presentando un decrecimiento de -36.43%. Resultado general: decrecimiento -2.95% acumulado año, consolidación de un equipo de 19 vendedores (16 directos, 3 freelance).');
INSERT INTO gestion_comercial_asadero (categoria, anio, comentario) VALUES ('NARRATIVA', 2025, 'Cumplimiento de entregas 96.82% y nivel de cumplimiento kilos pedido vs despachado 96.12%.');
INSERT INTO gestion_comercial_asadero (categoria, anio, comentario) VALUES ('NARRATIVA', 2025, 'Precio Promedio: cumplimiento de la meta 106%, pasando de $8.103 en 2024 a $7.887 en 2025');
INSERT INTO gestion_comercial_asadero (categoria, anio, comentario) VALUES ('NARRATIVA', 2025, 'Los ingresos totales por ventas del equipo comercial sede 1 para fin 2025 ascendieron a $92.422, con una disminución de -11.1% vs 2024.');
INSERT INTO gestion_comercial_asadero (categoria, anio, comentario) VALUES ('NARRATIVA', 2025, 'Desafíos: competencia informal genera precios bajos y disminución de participación de nuestro portafolio');
INSERT INTO gestion_comercial_asadero (categoria, anio, comentario) VALUES ('NARRATIVA', 2025, 'Recomendaciones: generar incentivos de precio diferencial y publicidad para captar clientes nuevos');
INSERT INTO gestion_comercial_asadero (categoria, anio, comentario) VALUES ('NARRATIVA', 2025, 'En resumen, el año 2025 fue desafiante, pero estamos comprometidos a tomar medidas correctivas y mejorar nuestra posición, implementar acciones para alcanzar objetivos y recuperar la confianza de los clientes para 2026.');
INSERT INTO gestion_comercial_sede3 (categoria, descripcion, anio, total_kl, total_part, variacion_kl, porcentaje_var, precio, var_precio) VALUES ('VENTA_PRODUCTO', 'REFRIGERADO', 2025, 8441, 76.68, 1101, 14.99, 10341, -3.43);
INSERT INTO gestion_comercial_sede3 (categoria, descripcion, anio, total_kl, total_part, precio) VALUES ('VENTA_PRODUCTO', 'REFRIGERADO', 2024, 7341, 63.6, 10708);
INSERT INTO gestion_comercial_sede3 (categoria, descripcion, anio, total_kl, total_part, variacion_kl, porcentaje_var, precio, var_precio) VALUES ('VENTA_PRODUCTO', 'POLLO ENTERO', 2025, 2672, 24.27, 322, 13.72, 10213, -2.0);
INSERT INTO gestion_comercial_sede3 (categoria, descripcion, anio, total_kl, total_part, precio) VALUES ('VENTA_PRODUCTO', 'POLLO ENTERO', 2024, 2350, 20.36, 10422);
INSERT INTO gestion_comercial_sede3 (categoria, descripcion, anio, total_kl, total_part, variacion_kl, porcentaje_var, precio, var_precio) VALUES ('VENTA_PRODUCTO', 'POLLO CAMPESINO', 2025, 0, 0.0, -16, -100.0, NULL, NULL);
INSERT INTO gestion_comercial_sede3 (categoria, descripcion, anio, total_kl, total_part, precio) VALUES ('VENTA_PRODUCTO', 'POLLO CAMPESINO', 2024, 16, 0.14, NULL);
INSERT INTO gestion_comercial_sede3 (categoria, descripcion, anio, total_kl, total_part, variacion_kl, porcentaje_var, precio, var_precio) VALUES ('VENTA_PRODUCTO', 'PRESA', 2025, 5024, 45.64, 675, 15.53, 11324, -4.88);
INSERT INTO gestion_comercial_sede3 (categoria, descripcion, anio, total_kl, total_part, precio) VALUES ('VENTA_PRODUCTO', 'PRESA', 2024, 4349, 37.66, 11904);
INSERT INTO gestion_comercial_sede3 (categoria, descripcion, anio, total_kl, total_part, variacion_kl, porcentaje_var, precio, var_precio) VALUES ('VENTA_PRODUCTO', 'MENUDENCIA', 2025, 552, 5.01, -60, -9.87, 3868, 10.41);
INSERT INTO gestion_comercial_sede3 (categoria, descripcion, anio, total_kl, total_part, precio) VALUES ('VENTA_PRODUCTO', 'MENUDENCIA', 2024, 612, 5.31, 3339);
INSERT INTO gestion_comercial_sede3 (categoria, descripcion, anio, total_kl, total_part, variacion_kl, porcentaje_var, precio, var_precio) VALUES ('VENTA_PRODUCTO', 'CARNES FRIAS', 2025, 0, 0.0, -1, -71.34, 8660, 117.95);
INSERT INTO gestion_comercial_sede3 (categoria, descripcion, anio, total_kl, total_part, precio) VALUES ('VENTA_PRODUCTO', 'CARNES FRIAS', 2024, 1, 0.01, 8507);
INSERT INTO gestion_comercial_sede3 (categoria, descripcion, anio, total_kl, total_part, variacion_kl, porcentaje_var, precio, var_precio) VALUES ('VENTA_PRODUCTO', 'MAYORISTA', 2025, 193, 1.75, 13, 1388.58, 5529, 8.96);
INSERT INTO gestion_comercial_sede3 (categoria, descripcion, anio, total_kl, total_part, precio) VALUES ('VENTA_PRODUCTO', 'MAYORISTA', 2024, 180, 1.56, 5075);
INSERT INTO gestion_comercial_sede3 (categoria, descripcion, anio, total_kl, total_part, variacion_kl, porcentaje_var, precio, var_precio) VALUES ('VENTA_PRODUCTO', 'TOTAL GENERAL', 2025, 11009, 100.0, -533, -4.62, 10041, -0.78);
INSERT INTO gestion_comercial_sede3 (categoria, descripcion, anio, total_kl, total_part, precio) VALUES ('VENTA_PRODUCTO', 'TOTAL GENERAL', 2024, 11542, 100.0, 10120);
INSERT INTO gestion_comercial_sede3 (categoria, anio, comentario) VALUES ('NARRATIVA', 2025, 'Gestión comercial de la Sede 3 en un entorno competitivo con presión en precios y actores informales.');
INSERT INTO gestion_comercial_sede3 (categoria, anio, comentario) VALUES ('NARRATIVA', 2025, 'Ventas totales: 11.009 kg en 2025 vs 11.542 kg en 2024, variación -4,62%.');
INSERT INTO gestion_comercial_sede3 (categoria, anio, comentario) VALUES ('NARRATIVA', 2025, 'Incremento de 20,36% en recepción de pollo en canal: de 2.350 en 2024 a 2.672 en 2025, mejorando eficiencia.');
INSERT INTO gestion_comercial_sede3 (categoria, anio, comentario) VALUES ('NARRATIVA', 2025, 'Precio promedio por kilo: $10.120 en 2025, contracción de -0,78% y por kilo pasó de $10.708 (2024) a $10.341 (2025)? But refer individual values.');
INSERT INTO gestion_comercial_sede3 (categoria, anio, comentario) VALUES ('NARRATIVA', 2025, 'Ingresos totales 2025: $109.439.576 vs 2024: $116.115.629, variación -5,75%.');
INSERT INTO gestion_comercial_sede3 (categoria, anio, comentario) VALUES ('NARRATIVA', 2025, 'Mejora de la mezcla de ventas: refrigerado de 63,60% a 76,68% (+13,08');
INSERT INTO gestion_comercial_sede3 (categoria, anio, comentario) VALUES ('NARRATIVA', 2025, 'Participación de pollo entero: total 31,84% en 2025 vs 30,97% en 2024');
INSERT INTO gestion_comercial_sede3 (categoria, anio, comentario) VALUES ('NARRATIVA', 2025, 'Rotación promedio de cartera: 25 días, mejor que objetivo de 30 días. Fuerza comercial: 27 colaboradores, 10 asesores (2 nuevos), 2 servicio al cliente, 12 mercaderistas, 3 parrilleros.');
INSERT INTO gestion_comercial_sede3 (categoria, anio, comentario) VALUES ('NARRATIVA', 2025, 'Conclusión: año 2025 desafiante pero con plan de acción: optimización de recursos, competitividad, crecimiento de líneas estratégicas y sostenibilidad.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Introducción', 'General', 'Gestión 2025', 'Liderazgo transversal en Calidad, Compras, HSEQ, Bienestar Animal y Vigías de Riesgos.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Introducción', 'General', 'Enfoque Estratégico', 'Priorización de riesgos, seguimiento de indicadores y control de planes de acción.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Introducción', 'General', 'Resultados', 'Fortalecimiento de sistemas de gestión, digitalización y sostenibilidad organizacional.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Líneas de Acción', 'Dirección Estratégica', 'Gestión de Procesos', 'Conexión entre estrategia y ejecución, priorización de riesgos estratégicos.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Líneas de Acción', 'Mejora Continua', 'ISO 9001:2026', 'Fortalecimiento de cultura preventiva alineada a la norma.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Líneas de Acción', 'Gestión de Riesgos', 'Cumplimiento Normativo', 'Integración de riesgos y cumplimiento sanitario, ambiental y de calidad.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Líneas de Acción', 'Transformación Digital', 'ISOLUCION y CRM SIESA', 'Migración y actualización para mejorar trazabilidad y control.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Acciones por Proceso', 'Aseguramiento de Calidad', 'HACCP', 'Fortalecimiento del sistema HACCP y control de puntos críticos.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Acciones por Proceso', 'Aseguramiento de Calidad', 'Indicadores', 'Mejora en indicadores y reducción de riesgos al consumidor.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Acciones por Proceso', 'Compras', 'Abastecimiento', 'Optimización de costos y abastecimiento oportuno.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Acciones por Proceso', 'Compras', 'Proveedores', 'Evaluación de proveedores críticos y soporte a auditorías.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Acciones por Proceso', 'Bienestar Animal', 'Formalización', 'Creación de indicadores y capacitaciones.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Acciones por Proceso', 'Bienestar Animal', 'Resultados', 'Reducción de pérdidas económicas y cumplimiento internacional.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Acciones por Proceso', 'SST', 'Accidentalidad', '112 accidentes registrados en 2025 con picos en planta y posproceso.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Acciones por Proceso', 'SST', 'Capacitaciones', '22 capacitaciones con 347 asistentes y simulacro de evacuación.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Acciones por Proceso', 'SST', 'Documentación', 'Actualización de matriz legal, riesgos y reglamento de seguridad.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Acciones por Proceso', 'Gestión Ambiental', 'Consumo de Agua', 'Reducción del 5,9% vs 2024 y 16,07% vs 2023 por ave beneficiada.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Acciones por Proceso', 'Gestión Ambiental', 'Residuos', 'Aumento 24,65% residuos aprovechables y 29,84% peligrosos.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Acciones por Proceso', 'Gestión Ambiental', 'Capacitaciones', '23 capacitaciones y 24 sensibilizaciones ambientales.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Acciones por Proceso', 'Sistema de Gestión de Calidad', 'Auditorías', 'Auditorías internas ISO 9001:2015 en 14 procesos.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Acciones por Proceso', 'Sistema de Gestión de Calidad', 'Planes de Acción', '154 planes de acción en 2025, 27,92% más que 2024.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Acciones por Proceso', 'Sistema de Gestión de Calidad', 'PQRs', 'Reducción del 28,45% respecto a 2024.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Acciones por Proceso', 'Sistema de Gestión de Calidad', 'Encuestas', '1.166 encuestas de satisfacción.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Acciones por Proceso', 'Sistema de Gestión de Calidad', 'Transición', 'Avances hacia ISO 9001:2026 con integración digital.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Acciones por Proceso', 'Vigías de Riesgos', 'Seguridad', 'Mejoras en control de activos, documentos y parqueaderos.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Acciones por Proceso', 'Vigías de Riesgos', 'Alarmas', 'Implementación de sistemas de alarma y colaboración empresarial.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Conclusiones', 'General', 'Resultados Estratégicos', 'Consolidación de procesos maduros, prevención y sostenibilidad.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n, narrativa) VALUES ('Conclusiones', 'General', 'Impacto', 'Mejoras en digitalización, experiencia del cliente y competitividad.', NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (narrativa) VALUES ('GERENCIA ESTRATEGICA Y DE MEJORAMIENTO CONTINUO: Durante 2025 lideró transversalmente Calidad, Compras, HSEQ, Bienestar Animal y Vigías de Riesgos para alinear operación y estrategia y cumplimiento normativo. Priorizó riesgos, articuló líderes, siguió indicadores, controló planes de acción. Se fortalecieron sistemas de gestión, capacidad de respuesta, digitalización y sostenibilidad, consolidando cultura de mejora continua y prevención. Líneas de acción: Conexión estrategia-ejecución, enfoque en mejora continua y prevención (ISO 9001:2026), integración de riesgos y oportunidades, transformación digital (ISOLUCION, CRM SIESA). Acciones: Aseguramiento de Calidad (HACCP), Compras (gestión estratégica y evaluación proveedores), Bienestar Animal, SST (112 accidentes, simulacro, capacitaciones, gimnasia laboral), Gestión Ambiental (reducción consumo de agua, residuos sólidos, capacitaciones, concesiones, reportes), Sistema de Gestión de Calidad (actualización matrices, comité, nueva política, ISO 9001:2015 + transición a 2026, encuestas y PQRs mejoradas), Vigías de Riesgos. Conclusión: Procesos más maduros, alineados con estrategia, prevención, sostenibilidad');
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta, narrativa) VALUES ('Planta de Personal', 'Total Colaboradores', '2024', '830', NULL, NULL, NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta, narrativa) VALUES ('Planta de Personal', 'Total Colaboradores', '2025', '840', '1,20%', '+10', NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta, narrativa) VALUES ('Costo de Nómina', 'Costo Total', '2024', '36597343829', NULL, NULL, NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta, narrativa) VALUES ('Costo de Nómina', 'Costo Total', '2025', '41978924466', '14,70%', '+5.381.580.637', NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta, narrativa) VALUES ('Horas Extras', 'Cantidad Horas', '2024', '127199', NULL, NULL, NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta, narrativa) VALUES ('Horas Extras', 'Cantidad Horas', '2025', '130890', '2,90%', NULL, NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta, narrativa) VALUES ('Horas Extras', 'Valor Horas Extras', '2024', '1065657115', NULL, NULL, NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta, narrativa) VALUES ('Horas Extras', 'Valor Horas Extras', '2025', '1286579002', '20,73%', NULL, NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta, narrativa) VALUES ('Rotación de Personal', 'Retiros', '2024', '534', NULL, NULL, NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta, narrativa) VALUES ('Rotación de Personal', 'Retiros', '2025', '562', '5,24%', '+28', NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta, narrativa) VALUES ('Rotación de Personal', 'Ingresos', '2024', '532', NULL, NULL, NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta, narrativa) VALUES ('Rotación de Personal', 'Ingresos', '2025', '564', '6,02%', '+32', NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta, narrativa) VALUES ('Causas de Desvinculación 2025', 'Mutuo Acuerdo', '2025', '4', '0.71%', NULL, NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta, narrativa) VALUES ('Causas de Desvinculación 2025', 'Renuncia Voluntaria', '2025', '471', '83.81%', NULL, NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta, narrativa) VALUES ('Causas de Desvinculación 2025', 'Terminación con Justa Causa', '2025', '11', '1.96%', NULL, NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta, narrativa) VALUES ('Causas de Desvinculación 2025', 'Terminación Contrato SENA', '2025', '32', '5.69%', NULL, NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta, narrativa) VALUES ('Causas de Desvinculación 2025', 'Terminación de Contrato', '2025', '23', '4.09%', NULL, NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta, narrativa) VALUES ('Causas de Desvinculación 2025', 'Terminación en Período de Prueba', '2025', '15', '2.67%', NULL, NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta, narrativa) VALUES ('Causas de Desvinculación 2025', 'Terminación por Muerte del Trabajador', '2025', '1', '0.18%', NULL, NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta, narrativa) VALUES ('Causas de Desvinculación 2025', 'Terminación por Pensión', '2025', '3', '0.53%', NULL, NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta, narrativa) VALUES ('Causas de Desvinculación 2025', 'Terminación sin Justa Causa', '2025', '2', '0.36%', NULL, NULL);
INSERT INTO gestion_humana_2025 (narrativa) VALUES ('GESTION HUMANA: Costo de la nómina: La planta cerró con 840 personas, un incremento neto del 1,20% (+10 colaboradores) respecto a diciembre de 2024. Costo de Nómina: El costo total de la nómina pasó de $36.597 millones en 2024 a $41.979 millones en 2025 (Var. 14,70%). Costos de horas extras aumentaron de $1.065 a $1.287 millones (+20,73%). Rotación de Personal: Ingresos aumentaron de 532 a 564 (+6,02%) y retiros de 534 a 562 (+5,24%). Causas de desvinculación: 84% renuncia voluntaria, 12% terminaciones de contrato, 3% períodos de prueba, 1% otras.');
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'SEDE1', 'Costo Personal Distribucion', 2024, 764185);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'SEDE1', 'Costo Personal Distribucion', 2025, 852983, 11.62);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'SEDE1', 'Costo Personal Post Proceso', 2024, 1144241);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'SEDE1', 'Costo Personal Post Proceso', 2025, 960105, -16.09);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'SEDE1', 'Fletes, Cargues, Acarreos, Ttes', 2024, 2375263);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'SEDE1', 'Fletes, Cargues, Acarreos, Ttes', 2025, 2354905, -0.86);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'SEDE1', 'Combustibles', 2024, 55747);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'SEDE1', 'Combustibles', 2025, 47208, -15.32);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'SEDE1', 'Peajes y Multas', 2024, 6772);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'SEDE1', 'Peajes y Multas', 2025, 18631, 175.12);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'SEDE1', 'Total Gastos Logisticos', 2024, 4346208);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'SEDE1', 'Total Gastos Logisticos', 2025, 4233832, -2.59);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'SEDE2', 'Costo Personal Distribucion', 2024, 783116);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'SEDE2', 'Costo Personal Distribucion', 2025, 581507, -25.74);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'SEDE2', 'Costo Personal Post Proceso', 2024, 1527071);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'SEDE2', 'Costo Personal Post Proceso', 2025, 1735458, 13.65);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'SEDE2', 'Arriendos y Congelacion', 2024, 982250);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'SEDE2', 'Arriendos y Congelacion', 2025, 1404576, 43.0);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'SEDE2', 'Fletes, Cargues, Acarreos, Ttes', 2024, 773584);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'SEDE2', 'Fletes, Cargues, Acarreos, Ttes', 2025, 961497, 24.29);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'SEDE2', 'Combustibles', 2024, 38762);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'SEDE2', 'Combustibles', 2025, 28642, -26.11);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'SEDE2', 'Peajes y Multas', 2024, 29122);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'SEDE2', 'Peajes y Multas', 2025, 16216, -44.32);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'SEDE2', 'Total Gastos Logisticos', 2024, 4133905);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'SEDE2', 'Total Gastos Logisticos', 2025, 4727896, 14.37);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'SEDE3', 'Costo Personal Distribucion', 2024, 1261004);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'SEDE3', 'Costo Personal Distribucion', 2025, 1204420, -4.49);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'SEDE3', 'Costo Personal Post Proceso', 2024, 1968137);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'SEDE3', 'Costo Personal Post Proceso', 2025, 2429383, 23.44);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'SEDE3', 'Arriendos y Congelacion', 2024, 1406575);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'SEDE3', 'Arriendos y Congelacion', 2025, 394501, -71.95);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'SEDE3', 'Fletes, Cargues, Acarreos, Ttes', 2024, 1736603);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'SEDE3', 'Fletes, Cargues, Acarreos, Ttes', 2025, 2225715, 28.16);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'SEDE3', 'Combustibles', 2024, 109742);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'SEDE3', 'Combustibles', 2025, 102140, -6.93);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'SEDE3', 'Peajes y Multas', 2024, 22462);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'SEDE3', 'Peajes y Multas', 2025, 21179, -5.71);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'SEDE3', 'Total Gastos Logisticos', 2024, 6504523);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'SEDE3', 'Total Gastos Logisticos', 2025, 6377338, -1.96);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'CONSOLIDADO', 'Costo Personal Distribucion', 2024, 2808305);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'CONSOLIDADO', 'Costo Personal Distribucion', 2025, 2638910, -6.03);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'CONSOLIDADO', 'Costo Personal Post Proceso', 2024, 4639449);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'CONSOLIDADO', 'Costo Personal Post Proceso', 2025, 5124946, 10.46);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'CONSOLIDADO', 'Arriendos y Congelacion', 2024, 2388825);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'CONSOLIDADO', 'Arriendos y Congelacion', 2025, 1799077, -24.69);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'CONSOLIDADO', 'Fletes, Cargues, Acarreos, Ttes', 2024, 4885450);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'CONSOLIDADO', 'Fletes, Cargues, Acarreos, Ttes', 2025, 5542117, 13.44);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'CONSOLIDADO', 'Combustibles', 2024, 204251);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'CONSOLIDADO', 'Combustibles', 2025, 177990, -12.86);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'CONSOLIDADO', 'Peajes y Multas', 2024, 58356);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'CONSOLIDADO', 'Peajes y Multas', 2025, 56026, -3.99);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor) VALUES ('GASTOS', 'CONSOLIDADO', 'Total Gastos Logisticos', 2024, 14984636);
INSERT INTO gestion_logistica (categoria, sede, concepto, anio, valor, variacion) VALUES ('GASTOS', 'CONSOLIDADO', 'Total Gastos Logisticos', 2025, 15339066, 2.37);
INSERT INTO gestion_logistica (categoria, comentario) VALUES ('NARRATIVA', 'La Gerencia Logistica administra tres centros de operacion y es responsable del movimiento del pollo desde su recepcion hasta la distribucion final');
INSERT INTO gestion_logistica (categoria, comentario) VALUES ('NARRATIVA', 'Sede1: ventas -9.4% en 2025 vs 2024');
INSERT INTO gestion_logistica (categoria, comentario) VALUES ('NARRATIVA', 'Existencia de 12 muelles de operacion y movilizacion promedio de 3.000.000 kilos mensuales');
INSERT INTO gestion_logistica (categoria, comentario) VALUES ('NARRATIVA', 'Personal: total 197 colaboradores en 2025;');
INSERT INTO gestion_logistica (categoria, comentario) VALUES ('NARRATIVA', 'Incremento salario minimo en 2025 de 9.54% afecta costos de personal');
INSERT INTO gestion_logistica (categoria, comentario) VALUES ('NARRATIVA', 'La unificacion de procesos en Sede3 para postproceso redujo costos en Sede1');
INSERT INTO gestion_logistica (categoria, comentario) VALUES ('NARRATIVA', 'Optimizacion de flota y negociaciones de fletes resultaron en una disminucion de costos de fletes de Sede1');
INSERT INTO gestion_logistica (categoria, comentario) VALUES ('NARRATIVA', 'Realojos de clientes: D1 trasladado de Sede3 a Sede2');
INSERT INTO gestion_logistica (categoria, comentario) VALUES ('NARRATIVA', 'Sede3 optimizo congelacion y redujo costos de arriendo de congelacion en 71.95%');
INSERT INTO encasetado VALUES (2024, 'ENERO', 2701500, 2571400);
INSERT INTO encasetado VALUES (2024, 'FEBRERO', 2529000, 2528300);
INSERT INTO encasetado VALUES (2024, 'MARZO', 2687200, 2645200);
INSERT INTO encasetado VALUES (2024, 'ABRIL', 2534000, 2532600);
INSERT INTO encasetado VALUES (2024, 'MAYO', 2901300, 2897700);
INSERT INTO encasetado VALUES (2024, 'JUNIO', 2644000, 2681600);
INSERT INTO encasetado VALUES (2024, 'JULIO', 2648400, 2426400);
INSERT INTO encasetado VALUES (2024, 'AGOSTO', 2918800, 2808100);
INSERT INTO encasetado VALUES (2024, 'SEPTIEMBRE', 2539500, 2533100);
INSERT INTO encasetado VALUES (2024, 'OCTUBRE', 3016100, 2989200);
INSERT INTO encasetado VALUES (2024, 'NOVIEMBRE', 2820600, 2820300);
INSERT INTO encasetado VALUES (2024, 'DICIEMBRE', 2746100, 2944300);
INSERT INTO encasetado VALUES (2025, 'ENERO', 2709400, 2709400);
INSERT INTO encasetado VALUES (2025, 'FEBRERO', 2351600, 2350600);
INSERT INTO encasetado VALUES (2025, 'MARZO', 2640400, 2640400);
INSERT INTO encasetado VALUES (2025, 'ABRIL', 2649600, 2649400);
INSERT INTO encasetado VALUES (2025, 'MAYO', 2766400, 2702800);
INSERT INTO encasetado VALUES (2025, 'JUNIO', 2561200, 2560700);
INSERT INTO encasetado VALUES (2025, 'JULIO', 2788000, 2768900);
INSERT INTO encasetado VALUES (2025, 'AGOSTO', 2704800, 2703500);
INSERT INTO encasetado VALUES (2025, 'SEPTIEMBRE', 2664000, 2663900);
INSERT INTO encasetado VALUES (2025, 'OCTUBRE', 2976800, 3006800);
INSERT INTO encasetado VALUES (2025, 'NOVIEMBRE', 2760600, 2832600);
INSERT INTO encasetado VALUES (2025, 'DICIEMBRE', 2676300, 2676200);
INSERT INTO encasetado VALUES (2024, 'TOTAL', 32686500, 32378200);
INSERT INTO encasetado VALUES (2025, 'TOTAL', 32249100, 32265200);
INSERT INTO pollo_sacrificado VALUES (2024, 'ENERO', 2389214, 2139140, 7074, 2146214, 308863, 2082799, 1830277);
INSERT INTO pollo_sacrificado VALUES (2024, 'FEBRERO', 2317608, 2278254, 25962, 2304216, 265640, 2017918, 2108781);
INSERT INTO pollo_sacrificado VALUES (2024, 'MARZO', 2517657, 2309872, 39371, 2349243, 201091, 2165012, 2108781);
INSERT INTO pollo_sacrificado VALUES (2024, 'ABRIL', 2525292, 2436828, 16001, 2452829, 300877, 2174514, 2135951);
INSERT INTO pollo_sacrificado VALUES (2024, 'MAYO', 2535881, 2458386, 713099, 2471485, 287070, 2177936, 2171316);
INSERT INTO pollo_sacrificado VALUES (2024, 'JUNIO', 2506391, 2343326, 25237, 2368563, 254691, 2135559, 2088635);
INSERT INTO pollo_sacrificado VALUES (2024, 'JULIO', 2627122, 2480434, 17016, 2497450, 277474, 2257933, 2202960);
INSERT INTO pollo_sacrificado VALUES (2024, 'AGOSTO', 2642238, 2361947, 21321, 2383268, 295749, 2305995, 2066198);
INSERT INTO pollo_sacrificado VALUES (2024, 'SEPTIEMBRE', 2425551, 2269655, 19139, 2288794, 229987, 2041827, 2039668);
INSERT INTO pollo_sacrificado VALUES (2024, 'OCTUBRE', 2682531, 2570460, 24749, 2595209, 242083, 2404428, 2207477);
INSERT INTO pollo_sacrificado VALUES (2024, 'NOVIEMBRE', 2620601, 2566991, 24919, 2591910, 314142, 2236877, 2252849);
INSERT INTO pollo_sacrificado VALUES (2024, 'DICIEMBRE', 2790981, 2703308, 40242, 2743550, 274654, 2464428, 2428654);
INSERT INTO pollo_sacrificado VALUES (2024, 'TOTAL', 30581067, 28918601, 274130, 29192731, 3353221, 26464526, 25565380);
INSERT INTO pollo_sacrificado VALUES (2025, 'ENERO', 2663909, 2312817, 25295, 2338112, 364473, 2318945, 1948344);
INSERT INTO pollo_sacrificado VALUES (2025, 'FEBRERO', 2398096, 2331612, 18874, 2350486, 256891, 2007706, 2074721);
INSERT INTO pollo_sacrificado VALUES (2025, 'MARZO', 2512116, 2492925, 20494, 2513419, 360733, 2116764, 2132192);
INSERT INTO pollo_sacrificado VALUES (2025, 'ABRIL', 2536865, 2406289, 21927, 2428216, 300243, 2248227, 2106046);
INSERT INTO pollo_sacrificado VALUES (2025, 'MAYO', 2616749, 2614029, 22259, 2636288, 373273, 2165195, 2240756);
INSERT INTO pollo_sacrificado VALUES (2025, 'JUNIO', 2282539, 2238965, 11911, 2250876, 243794, 1989901, 1995171);
INSERT INTO pollo_sacrificado VALUES (2025, 'JULIO', 2752082, 2650742, 28076, 2676818, 350112, 2300528, 2300630);
INSERT INTO pollo_sacrificado VALUES (2025, 'AGOSTO', 2479707, 2366203, 10354, 2376557, 244683, 2155489, 2121520);
INSERT INTO pollo_sacrificado VALUES (2025, 'SEPTIEMBRE', 2615696, 2407457, 10730, 2418187, 227837, 2164142, 2079620);
INSERT INTO pollo_sacrificado VALUES (2025, 'OCTUBRE', 2508774, 2499417, 17523, 2516040, 253912, 2247006, 2245505);
INSERT INTO pollo_sacrificado VALUES (2025, 'NOVIEMBRE', 2596779, 2385205, 14707, 2399912, 367807, 2202365, 2017398);
INSERT INTO pollo_sacrificado VALUES (2025, 'DICIEMBRE', 2819474, 2915682, 31659, 2947341, 403432, 2468606, 2512250);
INSERT INTO pollo_sacrificado VALUES (2025, 'TOTAL', 30872786, 29621343, 233809, 29855152, 3847190, 26471954, 25774153);
INSERT INTO capacidad_granjas VALUES ('FRIO', 'B.AIRES', 3435, 62000);
INSERT INTO capacidad_granjas VALUES ('FRIO', 'EL ARROYO', 11520, 196000);
INSERT INTO capacidad_granjas VALUES ('FRIO', 'EL CARMEN', 8400, 145000);
INSERT INTO capacidad_granjas VALUES ('FRIO', 'EL PRADO', 9600, 174000);
INSERT INTO capacidad_granjas VALUES ('FRIO', 'EL SIMON', 22400, 380000);
INSERT INTO capacidad_granjas VALUES ('FRIO', 'LA NEGRA', 4900, 86000);
INSERT INTO capacidad_granjas VALUES ('FRIO', 'OASIS', 9920, 175000);
INSERT INTO capacidad_granjas VALUES ('FRIO', 'OCAMONTE', 26800, 469000);
INSERT INTO capacidad_granjas VALUES ('FRIO', 'PINARES', 10882, 192000);
INSERT INTO capacidad_granjas VALUES ('FRIO', 'PIOPON', 11684, 200000);
INSERT INTO capacidad_granjas VALUES ('FRIO', 'S.ANDRES', 6630, 120000);
INSERT INTO capacidad_granjas VALUES ('FRIO', 'S.ANA', 3478, 60000);
INSERT INTO capacidad_granjas VALUES ('FRIO', 'SISGA', 4551, 82000);
INSERT INTO capacidad_granjas VALUES ('FRIO', 'TABACAL', 13146, 240000);
INSERT INTO capacidad_granjas VALUES ('FRIO', 'VALVERDE', 21200, 350000);
INSERT INTO capacidad_granjas VALUES ('FRIO', 'VENUS', 4323, 78000);
INSERT INTO capacidad_granjas VALUES ('FRIO', 'ZIPATOCA', 25622, 450000);
INSERT INTO capacidad_granjas VALUES ('FRIO', 'TOTAL', 198491, 3459000);
INSERT INTO capacidad_granjas VALUES ('CALIDO', 'ESPERANZA', 4640, 69000);
INSERT INTO capacidad_granjas VALUES ('CALIDO', 'GUADUALES', 2883, 44000);
INSERT INTO capacidad_granjas VALUES ('CALIDO', 'LA BLANQUITA', 1736, 28000);
INSERT INTO capacidad_granjas VALUES ('CALIDO', 'LAS AGUAS', 4200, 66000);
INSERT INTO capacidad_granjas VALUES ('CALIDO', 'NARANJOS', 2304, 32000);
INSERT INTO capacidad_granjas VALUES ('CALIDO', 'PROVIDENCIA', 7392, 98000);
INSERT INTO capacidad_granjas VALUES ('CALIDO', 'S.CAYETANO', 5302, 75000);
INSERT INTO capacidad_granjas VALUES ('CALIDO', 'S.FRANCISCO', 1589, 24000);
INSERT INTO capacidad_granjas VALUES ('CALIDO', 'S.ISABEL', 2681, 32000);
INSERT INTO capacidad_granjas VALUES ('CALIDO', 'S.JORGE', 6333, 98000);
INSERT INTO capacidad_granjas VALUES ('CALIDO', 'S.SEBASTIAN', 5125, 82000);
INSERT INTO capacidad_granjas VALUES ('CALIDO', 'V.CONI', 5554, 90000);
INSERT INTO capacidad_granjas VALUES ('CALIDO', 'TOTAL', 49739, 738000);
INSERT INTO capacidad_granjas VALUES ('CALIENTE', 'ANROWS', 1224, 13000);
INSERT INTO capacidad_granjas VALUES ('CALIENTE', 'MARGARITAS', 3740, 45000);
INSERT INTO capacidad_granjas VALUES ('CALIENTE', 'PRADERA', 12815, 152000);
INSERT INTO capacidad_granjas VALUES ('CALIENTE', 'SOLEDAD', 4409, 38000);
INSERT INTO capacidad_granjas VALUES ('CALIENTE', 'TOTAL', 22188, 248000);
INSERT INTO capacidad_granjas VALUES ('TOTAL GENERAL', '', 270418, 4445000);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'ENERO', 2024, 2701500, 2571400);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'FEBRERO', 2024, 2529000, 2528300);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'MARZO', 2024, 2687000, 2645200);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'ABRIL', 2024, 2534000, 2532600);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'MAYO', 2024, 2901300, 2897700);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'JUNIO', 2024, 2644000, 2681600);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'JULIO', 2024, 2648400, 2426400);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'AGOSTO', 2024, 2918800, 2808100);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'SEPTIEMBRE', 2024, 2539500, 2533100);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'OCTUBRE', 2024, 3016100, 2989200);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'NOVIEMBRE', 2024, 2820600, 2820300);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'DICIEMBRE', 2024, 2746100, 2944300);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'TOTAL', 2024, 32666500, 32378200);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'ENERO', 2025, 2709400, 2709400);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'FEBRERO', 2025, 2351600, 2350600);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'MARZO', 2025, 2640400, 2640400);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'ABRIL', 2025, 2649600, 2649400);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'MAYO', 2025, 2766400, 2702800);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'JUNIO', 2025, 2561200, 2520700);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'JULIO', 2025, 2788000, 2768900);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'AGOSTO', 2025, 2704800, 2703500);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'SEPTIEMBRE', 2025, 2664000, 2663900);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'OCTUBRE', 2025, 2976800, 3006800);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'NOVIEMBRE', 2025, 2760600, 2832600);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'DICIEMBRE', 2025, 2676300, 2676200);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real) VALUES ('ENCASETADO', 'TOTAL', 2025, 32249100, 32265200);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real, valor_comprado, valor_total, valor_maxlim, valor_fiesta, valor_entre_real_pf) VALUES ('POLLO_SACRIFICADO', 'ENERO', 2024, 2389214, 2139140, 7074, 2146214, 308863, 2082799, 1830277);
INSERT INTO gestion_produccion (categoria, mes, anio) VALUES ('POLLO_SACRIFICADO', 'ENERO', 2025);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real, valor_comprado, valor_total, valor_maxlim, valor_fiesta) VALUES ('POLLO_SACRIFICADO', 'TOTAL', 2024, 30581067, 28918601, 274130, 29192731, 3353221, 26456526);
INSERT INTO gestion_produccion (categoria, mes, anio, valor_prog, valor_real, valor_comprado, valor_total, valor_maxlim, valor_fiesta, valor_entre_real_pf) VALUES ('POLLO_SACRIFICADO', 'TOTAL', 2025, 30872786, 29621343, 233809, 29855152, 3847190, 26471954, 25714153);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','FRIO','B.AIRES', 2025, 3435, 62000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','FRIO','EL ARROYO', 2025, 11520, 196000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','FRIO','EL CARMEN', 2025, 8400, 145000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','FRIO','EL PRADO', 2025, 9600, 174000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','FRIO','EL SIMON', 2025, 22200, 380000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','FRIO','LA NEGRA', 2025, 4900, 86000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','FRIO','OASIS', 2025, 9920, 175000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','FRIO','OCOMONTE', 2025, 28600, 469000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','FRIO','PINAERES', 2025, 10882, 192000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','FRIO','PIONON', 2025, 11884, 320000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','FRIO','S.ANDRES', 2025, 20630, 120000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','FRIO','S.ANA', 2025, 3478, 60000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','FRIO','SIGSA', 2025, 4551, 82000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','FRIO','TABACAL', 2025, 13146, 240000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','FRIO','VENUS', 2025, 4323, 78000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','FRIO','VENUS', 2025, 4325, 78000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','FRIO','ZIPATOGA', 2025, 25622, 450000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','CALIENTE','ANROWS', 2025, 1224, 13000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','CALIENTE','MARGARITAS', 2025, 3740, 45000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','CALIENTE','PRADERA', 2025, 12815, 152000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','CALIENTE','SOLEDAD', 2025, 4409, 38000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','CALIDO','ESPERANZA', 2025, 4640, 69000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','CALIDO','GUADUALES', 2025, 2883, 44000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','CALIDO','LA BLANQUITA', 2025, 1736, 28000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','CALIDO','LAS AGUAS', 2025, 4200, 62000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','CALIDO','NARANJOS', 2025, 4204, 32000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','CALIDO','PROVIDENCIA', 2025, 7392, 96000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','CALIDO','S.CAYETANO', 2025, 5502, 76000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','CALIDO','S.FRANCISCO', 2025, 5302, 120000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','CALIDO','S.ISABEL', 2025, 2681, 32000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','CALIDO','S.JORGE', 2025, 6333, 80000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','CALIDO','S.SEBASTIAN', 2025, 5125, 90000);
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, mts, aves) VALUES ('CAPACIDAD_GRANJAS','CALIDO','V.CONI', 2025, 5554, 82000);
INSERT INTO gestion_produccion (categoria, anio, comentario) VALUES ('NARRATIVA', 2025, 'Leve descenso en el encasetamiento (0.35%), pero se entregó más pollo en pie (0.81%) respecto a 2024, gracias al descenso de la mortalidad.');
INSERT INTO gestion_produccion (categoria, anio, comentario) VALUES ('NARRATIVA', 2025, 'La capacidad instalada se afectó por el paso de pollo a gallina de la granja El Edén por cierre de Arrayanes');
INSERT INTO gestion_produccion (categoria, anio, comentario) VALUES ('NARRATIVA', 2025, 'Grupo de mantenimiento de granjas aumentado a 4 personas, con algunos servicios contratados a personal externo por falta de tiempo.');
INSERT INTO gestion_produccion (categoria, anio, comentario) VALUES ('NARRATIVA', 2025, 'Alta rotación de personal (12%), afectando manejo del pollo y parámetros zootécnicos.');
INSERT INTO gestion_produccion (categoria, anio, comentario) VALUES ('NARRATIVA', 2025, 'Área de postura: con salida de Arrayanes e ingreso de El Edén se incrementó en 6000 aves el encasetamiento (4.28%).');
INSERT INTO gestion_produccion (categoria, subcategoria, granja, anio, aves) VALUES ('CAPACIDAD_GRANJAS','FRIO','SAN ISIDRO', 2025, 66000);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2) VALUES ('Información General', 'Periodo Evaluado', '2022-2025', NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2) VALUES ('Información General', 'Stakeholders Validados', '5732', NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2) VALUES ('Información General', 'Stakeholders Rechazados', '314', '5.47%', NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2) VALUES ('Hallazgos Generales', 'Documentación Inadecuada', '24%', 'Meta: 10%', 'Plazo: 6 meses');
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2) VALUES ('Hallazgos Generales', 'Candidatos No Conformes por Antecedentes', '27%', NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2) VALUES ('Hallazgos Generales', 'Transportadores No Conformes por Documentación', '47%', NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2) VALUES ('Hallazgos Generales', 'Transportadores No Aptos por Antecedentes', '8%', NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2) VALUES ('Hallazgos Generales', 'Proveedores con Novedad FT', '50%', '3 casos', NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2) VALUES ('Hallazgos Generales', 'Incumplimiento Documental Comercial', '47%', NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2) VALUES ('Acciones por Área', 'Gestión Humana', 'Actualización procedimiento PGH-04', 'Reunión 14 Enero', 'Nuevos filtros y responsables');
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2) VALUES ('Acciones por Área', 'Logística', 'Actualización procedimiento PGH-06', 'Reunión 23 Enero', 'Actualización FCO-05 y FCO-03');
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2) VALUES ('Acciones por Área', 'Compras', 'Mejora filtros proveedores', NULL, 'Fortalecimiento comunicación');
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2) VALUES ('Acciones por Área', 'Comercial', 'Divulgaciones individuales', NULL, 'Reducción riesgo documental');
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2) VALUES ('Sistema y Cumplimiento', 'Plataforma Debida Diligencia', 'DATALAFT / Risk Consulting', NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2) VALUES ('Sistema y Cumplimiento', 'Normatividad Aplicable', 'Circular 100-00005 de 2017 y 100-000016 de 2020', NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2) VALUES ('Sistema y Cumplimiento', 'Enfoque', 'Basado en Riesgos y Debida Diligencia Intensificada', NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2) VALUES ('Conclusión', 'Resultado Estratégico', 'Sistema sólido y alineado a normatividad', NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2) VALUES ('Conclusión', 'Compromiso', 'Actualización constante y fortalecimiento monitoreo', NULL, NULL);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2) VALUES ('Conclusión', 'Ventaja Estratégica', 'Protección reputacional y sostenibilidad', NULL, NULL);
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Introducción', 'General', 'Gestión 2025', 'Liderazgo transversal en Calidad, Compras, HSEQ, Bienestar Animal y Vigías de Riesgos.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Introducción', 'General', 'Enfoque Estratégico', 'Priorización de riesgos, seguimiento de indicadores y control de planes de acción.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Introducción', 'General', 'Resultados', 'Fortalecimiento de sistemas de gestión, digitalización y sostenibilidad organizacional.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Líneas de Acción', 'Dirección Estratégica', 'Gestión de Procesos', 'Conexión entre estrategia y ejecución, priorización de riesgos estratégicos.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Líneas de Acción', 'Mejora Continua', 'ISO 9001:2026', 'Fortalecimiento de cultura preventiva alineada a la norma.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Líneas de Acción', 'Gestión de Riesgos', 'Cumplimiento Normativo', 'Integración de riesgos y cumplimiento sanitario, ambiental y de calidad.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Líneas de Acción', 'Transformación Digital', 'ISOLUCION y CRM SIESA', 'Migración y actualización para mejorar trazabilidad y control.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Acciones por Proceso', 'Aseguramiento de Calidad', 'HACCP', 'Fortalecimiento del sistema HACCP y control de puntos críticos.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Acciones por Proceso', 'Aseguramiento de Calidad', 'Indicadores', 'Mejora en indicadores y reducción de riesgos al consumidor.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Acciones por Proceso', 'Compras', 'Abastecimiento', 'Optimización de costos y abastecimiento oportuno.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Acciones por Proceso', 'Compras', 'Proveedores', 'Evaluación de proveedores críticos y soporte a auditorías.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Acciones por Proceso', 'Bienestar Animal', 'Formalización', 'Creación de indicadores y capacitaciones.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Acciones por Proceso', 'Bienestar Animal', 'Resultados', 'Reducción de pérdidas económicas y cumplimiento internacional.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Acciones por Proceso', 'SST', 'Accidentalidad', '112 accidentes registrados en 2025 con picos en planta y posproceso.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Acciones por Proceso', 'SST', 'Capacitaciones', '22 capacitaciones con 347 asistentes y simulacro de evacuación.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Acciones por Proceso', 'SST', 'Documentación', 'Actualización de matriz legal, riesgos y reglamento de seguridad.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Acciones por Proceso', 'Gestión Ambiental', 'Consumo de Agua', 'Reducción del 5, 9% vs 2024 y 16, 07% vs 2023 por ave beneficiada.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Acciones por Proceso', 'Gestión Ambiental', 'Residuos', 'Aumento 24, 65% residuos aprovechables y 29, 84% peligrosos.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Acciones por Proceso', 'Gestión Ambiental', 'Capacitaciones', '23 capacitaciones y 24 sensibilizaciones ambientales.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Acciones por Proceso', 'Sistema de Gestión de Calidad', 'Auditorías', 'Auditorías internas ISO 9001:2015 en 14 procesos.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Acciones por Proceso', 'Sistema de Gestión de Calidad', 'Planes de Acción', '154 planes de acción en 2025, 27, 92% más que 2024.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Acciones por Proceso', 'Sistema de Gestión de Calidad', 'PQRs', 'Reducción del 28, 45% respecto a 2024.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Acciones por Proceso', 'Sistema de Gestión de Calidad', 'Encuestas', '1.166 encuestas de satisfacción.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Acciones por Proceso', 'Sistema de Gestión de Calidad', 'Transición', 'Avances hacia ISO 9001:2026 con integración digital.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Acciones por Proceso', 'Vigías de Riesgos', 'Seguridad', 'Mejoras en control de activos, documentos y parqueaderos.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Acciones por Proceso', 'Vigías de Riesgos', 'Alarmas', 'Implementación de sistemas de alarma y colaboración empresarial.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Conclusiones', 'General', 'Resultados Estratégicos', 'Consolidación de procesos maduros, prevención y sostenibilidad.');
INSERT INTO gestion_gerencia_estrategica_2025 (secci_n, proceso, tema, descripci_n) VALUES ('Conclusiones', 'General', 'Impacto', 'Mejoras en digitalización, experiencia del cliente y competitividad.');
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta) VALUES ('Planta de Personal', 'Total Colaboradores', '2024', '830', NULL, NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta) VALUES ('Planta de Personal', 'Total Colaboradores', '2025', '840', '1, 20%', '+10');
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta) VALUES ('Costo de Nómina', 'Costo Total', '2024', '36597343829', NULL, NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta) VALUES ('Costo de Nómina', 'Costo Total', '2025', '41978924466', '14, 70%', '+5.381.580.637');
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta) VALUES ('Horas Extras', 'Cantidad Horas', '2024', '127199', NULL, NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta) VALUES ('Horas Extras', 'Cantidad Horas', '2025', '130890', '2, 90%', NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta) VALUES ('Horas Extras', 'Valor Horas Extras', '2024', '1065657115', NULL, NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta) VALUES ('Horas Extras', 'Valor Horas Extras', '2025', '1286579002', '20, 73%', NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta) VALUES ('Rotación de Personal', 'Retiros', '2024', '534', NULL, NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta) VALUES ('Rotación de Personal', 'Retiros', '2025', '562', '5, 24%', '+28');
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta) VALUES ('Rotación de Personal', 'Ingresos', '2024', '532', NULL, NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta) VALUES ('Rotación de Personal', 'Ingresos', '2025', '564', '6, 02%', '+32');
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta) VALUES ('Causas de Desvinculación 2025', 'Mutuo Acuerdo', '2025', '4', '0.71%', NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta) VALUES ('Causas de Desvinculación 2025', 'Renuncia Voluntaria', '2025', '471', '83.81%', NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta) VALUES ('Causas de Desvinculación 2025', 'Terminación con Justa Causa', '2025', '11', '1.96%', NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta) VALUES ('Causas de Desvinculación 2025', 'Terminación Contrato SENA', '2025', '32', '5.69%', NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta) VALUES ('Causas de Desvinculación 2025', 'Terminación de Contrato', '2025', '23', '4.09%', NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta) VALUES ('Causas de Desvinculación 2025', 'Terminación en Período de Prueba', '2025', '15', '2.67%', NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta) VALUES ('Causas de Desvinculación 2025', 'Terminación por Muerte del Trabajador', '2025', '1', '0.18%', NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta) VALUES ('Causas de Desvinculación 2025', 'Terminación por Pensión', '2025', '3', '0.53%', NULL);
INSERT INTO gestion_humana_2025 (categor_a, descripci_n, a_o, valor, __variaci_n, variaci_n_absoluta) VALUES ('Causas de Desvinculación 2025', 'Terminación sin Justa Causa', '2025', '2', '0.36%', NULL);
INSERT INTO narrativa_analisis_sagrilaft_2025_2026 (narrativa) VALUES ('ANALISIS Y EVALUACION DEL SISTEMA SAGRILAFT: El sistema de Autocontrol y gestión del riesgo integral de lavado de activos y financiación del terrorismo (SAGRILAFT) garantiza la transparencia y la prevención de delitos financieros en Pollo Fiesta S.A., con datos de stakeholders 2022-2025: 5.732 validados, 314 rechazados (5,47%). Se detectó la necesidad de reducir documentación inadecuada del 24% al 10% en 6 meses, actualizar documentación, mejorar filtros y procedimientos, y fortalecer reuniones entre áreas (Gestión Humana, Logistica, Compras, Comercial) para reducir no conformidades. Conclusión: SAGRILAFT es pilar estratégico, requiere actualización constante, capacitación y fortalecimiento de mecanismos de monitoreo. Cumplimiento como ventaja estratégica.');
INSERT INTO narrativa_gestion_gerencia_estrategica_2025 (narrativa) VALUES ('GERENCIA ESTRATEGICA Y DE MEJORAMIENTO CONTINUO: Durante 2025 lideró transversalmente Calidad, Compras, HSEQ, Bienestar Animal y Vigías de Riesgos para alinear operación y estrategia y cumplimiento normativo. Priorizó riesgos, articuló líderes, siguió indicadores, controló planes de acción. Se fortalecieron sistemas de gestión, capacidad de respuesta, digitalización y sostenibilidad, consolidando cultura de mejora continua y prevención. Líneas de acción: Conexión estrategia-ejecución, enfoque en mejora continua y prevención (ISO 9001:2026), integración de riesgos y oportunidades, transformación digital (ISOLUCION, CRM SIESA). Acciones: Aseguramiento de Calidad (HACCP), Compras (gestión estratégica y evaluación proveedores), Bienestar Animal, SST (112 accidentes, simulacro, capacitaciones, gimnasia laboral), Gestión Ambiental (reducción consumo de agua, residuos sólidos, capacitaciones, concesiones, reportes), Sistema de Gestión de Calidad (actualización matrices, comité, nueva política, ISO 9001:2015 + transición a 2026, encuestas y PQRs mejoradas), Vigías de Riesgos. Conclusión: Procesos más maduros, alineados con estrategia, prevención, sostenibilidad;');
INSERT INTO narrativa_gestion_humana_2025 (narrativa) VALUES ('GESTION HUMANA: Costo de la nómina: La planta cerró con 840 personas, un incremento neto del 1,20% (+10 colaboradores) respecto a diciembre de 2024. Costo de Nómina: El costo total de la nómina pasó de $36.597 millones en 2024 a $41.979 millones en 2025 (Var. 14,70%). Costos de horas extras aumentaron de $1.065 a $1.287 millones (+20,73%). Rotación de Personal: Ingresos aumentaron de 532 a 564 (+6,02%) y retiros de 534 a 562 (+5,24%). Causas de desvinculación: 84% renuncia voluntaria, 12% terminaciones de contrato, 3% períodos de prueba, 1% otras.');
INSERT INTO sagrilaft_stakeholders VALUES ('EMPLEADOS', 168, 1.0, 20.0, 6.0, 27.0, 3.0);
INSERT INTO sagrilaft_stakeholders VALUES ('CLIENTES', 128, 6.0, 16.0, 47.0, 12.0, 3.0);
INSERT INTO sagrilaft_stakeholders VALUES ('PROVEEDORES', 6, 17.0, 50.0, 0.0, 0.0, 0.0);
INSERT INTO sagrilaft_stakeholders VALUES ('TRANSPORTADORES', 12, 0.0, 0.0, 42.0, 8.0, 0.0);
INSERT INTO sagrilaft_stakeholders VALUES ('TOTAL NO CONFORMES', 314, 3.0, 18.0, 24.0, 20.0, 3.0);
INSERT INTO sagrilaft_totales VALUES (5732);
INSERT INTO analisis_sagrilaft_2025_2026 (categor_a, elemento, dato_principal, detalle_1, detalle_2) VALUES ('Información General', 'Empresa', 'Pollo Fiesta S.A.', NULL, NULL);