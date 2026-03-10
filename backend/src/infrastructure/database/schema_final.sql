-- Schema FINAL - Tablas separadas y claras
-- Configuración de charset UTF-8
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ELIMINAR TODAS LAS TABLAS EXISTENTES
DROP TABLE IF EXISTS auditoria_merma;
DROP TABLE IF EXISTS fuentes_usos;
DROP TABLE IF EXISTS gestion_cartera;
DROP TABLE IF EXISTS gestion_humana;
DROP TABLE IF EXISTS gestion_humana_costos;
DROP TABLE IF EXISTS gestion_humana_retiros;
DROP TABLE IF EXISTS gestion_humana_horas;
DROP TABLE IF EXISTS gestion_logistica;
DROP TABLE IF EXISTS produccion;
DROP TABLE IF EXISTS produccion_encasetado;
DROP TABLE IF EXISTS produccion_granjas;
DROP TABLE IF EXISTS gestion_comercial;
DROP TABLE IF EXISTS equipo_ventas;
DROP TABLE IF EXISTS sistema_sagrilaft;
DROP TABLE IF EXISTS gestion_gerencia;

-- 1. AUDITORÍA
CREATE TABLE auditoria_merma (
  id INT AUTO_INCREMENT PRIMARY KEY,
  anio INT NOT NULL,
  mes VARCHAR(20),
  mes_numero INT,
  porcentaje_merma DECIMAL(5,2),
  serie VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_anio_mes (anio, mes_numero)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. FUENTES Y USOS (Balance General)
CREATE TABLE fuentes_usos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  anio INT NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  tipo VARCHAR(20) NOT NULL, -- 'ACTIVO', 'PASIVO', 'PATRIMONIO'
  valor_actual DECIMAL(18,2),
  valor_anterior DECIMAL(18,2),
  variacion DECIMAL(18,2),
  fuentes DECIMAL(18,2),
  usos DECIMAL(18,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_anio_tipo (anio, tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. GESTIÓN DE CARTERA
CREATE TABLE gestion_cartera (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mes VARCHAR(20) NOT NULL,
  anio INT NOT NULL,
  total_cartera DECIMAL(15,2),
  cartera_vencida DECIMAL(15,2),
  indice_morosidad DECIMAL(5,2),
  variacion_cartera_vencida DECIMAL(15,2),
  dias_rotacion DECIMAL(8,2),
  porcentaje_ventas_contado DECIMAL(5,2),
  ventas_contado DECIMAL(15,2),
  porcentaje_ventas_credito DECIMAL(5,2),
  ventas_credito DECIMAL(15,2),
  ventas_netas_empresa DECIMAL(15,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_anio_mes (anio, mes)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. GESTIÓN HUMANA - Personal
CREATE TABLE gestion_humana_personal (
  id INT AUTO_INCREMENT PRIMARY KEY,
  anio INT NOT NULL,
  mes VARCHAR(20),
  numero_personas INT,
  variacion_porcentaje DECIMAL(5,2),
  variacion_personas INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_anio (anio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. GESTIÓN HUMANA - Costos
CREATE TABLE gestion_humana_costos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  anio INT NOT NULL,
  concepto VARCHAR(100),
  valor DECIMAL(15,2),
  variacion_porcentaje DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_anio (anio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. GESTIÓN HUMANA - Retiros
CREATE TABLE gestion_humana_retiros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  anio INT NOT NULL,
  motivo VARCHAR(100),
  cantidad INT,
  porcentaje DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_anio (anio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. GESTIÓN HUMANA - Horas Extras
CREATE TABLE gestion_humana_horas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  anio INT NOT NULL,
  concepto VARCHAR(50),
  horas INT,
  valor DECIMAL(15,2),
  variacion_porcentaje DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_anio (anio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. GESTIÓN LOGÍSTICA
CREATE TABLE gestion_logistica (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sede VARCHAR(50) NOT NULL,
  anio INT NOT NULL,
  concepto VARCHAR(100) NOT NULL,
  total_2024 DECIMAL(15,2),
  total_2025 DECIMAL(15,2),
  variacion_porcentaje DECIMAL(8,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sede_anio (sede, anio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. PRODUCCIÓN - Encasetado
CREATE TABLE produccion_encasetado (
  id INT AUTO_INCREMENT PRIMARY KEY,
  anio INT NOT NULL,
  mes VARCHAR(20),
  mes_numero INT,
  programado INT,
  real_value INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_anio_mes (anio, mes_numero)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. PRODUCCIÓN - Granjas
CREATE TABLE produccion_granjas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(20) NOT NULL, -- 'FRIO', 'CALIENTE', 'CALIDO'
  granja VARCHAR(50) NOT NULL,
  metros INT,
  aves INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. GESTIÓN COMERCIAL - Ventas por Canal
CREATE TABLE gestion_comercial_ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sede VARCHAR(50),
  canal VARCHAR(100),
  anio INT NOT NULL,
  concepto VARCHAR(200),
  valor_kg DECIMAL(15,2),
  porcentaje_participacion DECIMAL(5,2),
  variacion DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sede_anio (sede, anio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. EQUIPO DE VENTAS
CREATE TABLE equipo_ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sede VARCHAR(50),
  vendedor VARCHAR(100),
  anio INT NOT NULL,
  ventas_kg DECIMAL(15,2),
  ventas_valor DECIMAL(15,2),
  meta DECIMAL(15,2),
  cumplimiento DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sede_anio (sede, anio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. SISTEMA SAGRILAFT
CREATE TABLE sistema_sagrilaft (
  id INT AUTO_INCREMENT PRIMARY KEY,
  anio INT NOT NULL,
  contraparte VARCHAR(100),
  stakeholders_validados INT,
  stakeholders_rechazados INT,
  porcentaje_la DECIMAL(5,2),
  porcentaje_ft DECIMAL(5,2),
  porcentaje_documentacion DECIMAL(5,2),
  porcentaje_antecedentes DECIMAL(5,2),
  porcentaje_peps DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_anio (anio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. GESTIÓN GERENCIA ESTRATÉGICA
CREATE TABLE gestion_gerencia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  anio INT NOT NULL,
  area VARCHAR(100) NOT NULL, -- 'SST', 'AMBIENTAL', 'CALIDAD', etc.
  indicador VARCHAR(200),
  valor VARCHAR(200),
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_anio_area (anio, area)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
