-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.32-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.13.0.7147
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para erp_pollo_fiesta
CREATE DATABASE IF NOT EXISTS `erp_pollo_fiesta` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci */;
USE `erp_pollo_fiesta`;

-- Volcando estructura para tabla erp_pollo_fiesta.aud_auditorias_ejecutadas
CREATE TABLE IF NOT EXISTS `aud_auditorias_ejecutadas` (
  `id_auditoria` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_auditoria` date NOT NULL,
  `mes_evaluado` int(11) NOT NULL,
  `anio_evaluado` int(11) NOT NULL,
  `tipo_auditoria` enum('Proceso Misional','Punto de Venta') NOT NULL,
  `area_proceso_auditado` varchar(100) DEFAULT NULL,
  `id_pdv` int(11) DEFAULT NULL,
  `auditor_responsable` varchar(100) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_auditoria`),
  KEY `id_pdv` (`id_pdv`),
  CONSTRAINT `aud_auditorias_ejecutadas_ibfk_1` FOREIGN KEY (`id_pdv`) REFERENCES `com_puntos_venta` (`id_pdv`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.aud_auditorias_ejecutadas: ~4 rows (aproximadamente)
INSERT INTO `aud_auditorias_ejecutadas` (`id_auditoria`, `fecha_auditoria`, `mes_evaluado`, `anio_evaluado`, `tipo_auditoria`, `area_proceso_auditado`, `id_pdv`, `auditor_responsable`, `estado`) VALUES
	(1, '2025-12-31', 12, 2025, 'Proceso Misional', 'Logística', NULL, 'Auditoría Interna', 'Completada'),
	(2, '2025-12-31', 12, 2025, 'Proceso Misional', 'Producción', NULL, 'Auditoría Interna', 'Completada'),
	(3, '2025-12-31', 12, 2025, 'Proceso Misional', 'Comercial', NULL, 'Auditoría Interna', 'Completada'),
	(4, '2025-12-31', 12, 2025, 'Punto de Venta', 'Puntos de Venta', NULL, 'Auditoría Interna', 'Completada');

-- Volcando estructura para tabla erp_pollo_fiesta.aud_devoluciones_mensuales
CREATE TABLE IF NOT EXISTS `aud_devoluciones_mensuales` (
  `id_registro` int(11) NOT NULL AUTO_INCREMENT,
  `anio` int(11) NOT NULL,
  `mes_num` int(11) NOT NULL,
  `mes_nombre` varchar(15) NOT NULL,
  `sede_1_pct` decimal(5,2) NOT NULL,
  `sede_2_pct` decimal(5,2) NOT NULL,
  `sede_3_pct` decimal(5,2) NOT NULL,
  PRIMARY KEY (`id_registro`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.aud_devoluciones_mensuales: ~24 rows (aproximadamente)
INSERT INTO `aud_devoluciones_mensuales` (`id_registro`, `anio`, `mes_num`, `mes_nombre`, `sede_1_pct`, `sede_2_pct`, `sede_3_pct`) VALUES
	(1, 2024, 1, 'Enero', 3.20, 1.30, 2.10),
	(2, 2024, 2, 'Febrero', 3.60, 1.60, 2.40),
	(3, 2024, 3, 'Marzo', 3.80, 1.40, 2.90),
	(4, 2024, 4, 'Abril', 4.00, 0.70, 2.30),
	(5, 2024, 5, 'Mayo', 3.40, 3.20, 1.60),
	(6, 2024, 6, 'Junio', 2.90, 1.80, 1.40),
	(7, 2024, 7, 'Julio', 3.10, 1.10, 1.70),
	(8, 2024, 8, 'Agosto', 3.30, 1.00, 1.40),
	(9, 2024, 9, 'Septiembre', 4.20, 1.30, 1.60),
	(10, 2024, 10, 'Octubre', 3.10, 1.20, 1.90),
	(11, 2024, 11, 'Noviembre', 3.20, 0.50, 2.10),
	(12, 2024, 12, 'Diciembre', 2.90, 0.60, 2.30),
	(13, 2025, 1, 'Enero', 3.00, 0.50, 2.20),
	(14, 2025, 2, 'Febrero', 2.80, 0.40, 2.00),
	(15, 2025, 3, 'Marzo', 3.70, 0.50, 1.60),
	(16, 2025, 4, 'Abril', 2.90, 0.60, 1.70),
	(17, 2025, 5, 'Mayo', 2.80, 1.20, 1.60),
	(18, 2025, 6, 'Junio', 2.70, 0.40, 1.80),
	(19, 2025, 7, 'Julio', 2.90, 4.00, 2.00),
	(20, 2025, 8, 'Agosto', 2.10, 2.50, 2.30),
	(21, 2025, 9, 'Septiembre', 2.20, 4.60, 3.00),
	(22, 2025, 10, 'Octubre', 2.40, 5.10, 3.80),
	(23, 2025, 11, 'Noviembre', 3.00, 2.90, 3.10),
	(24, 2025, 12, 'Diciembre', 2.70, 1.50, 2.90);

-- Volcando estructura para tabla erp_pollo_fiesta.aud_devoluciones_resumen_anual
CREATE TABLE IF NOT EXISTS `aud_devoluciones_resumen_anual` (
  `anio` int(11) NOT NULL,
  `promedio_compania_pct` decimal(5,2) NOT NULL,
  `promedio_sede_1_pct` decimal(5,2) DEFAULT NULL,
  `promedio_sede_2_pct` decimal(5,2) DEFAULT NULL,
  `promedio_sede_3_pct` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.aud_devoluciones_resumen_anual: ~2 rows (aproximadamente)
INSERT INTO `aud_devoluciones_resumen_anual` (`anio`, `promedio_compania_pct`, `promedio_sede_1_pct`, `promedio_sede_2_pct`, `promedio_sede_3_pct`) VALUES
	(2024, 2.54, NULL, NULL, NULL),
	(2025, 2.26, 2.85, 1.61, 2.31);

-- Volcando estructura para tabla erp_pollo_fiesta.cal_acciones_proceso
CREATE TABLE IF NOT EXISTS `cal_acciones_proceso` (
  `id_accion` int(11) NOT NULL AUTO_INCREMENT,
  `proceso` varchar(100) NOT NULL,
  `logro_destacado` text NOT NULL,
  PRIMARY KEY (`id_accion`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.cal_acciones_proceso: ~5 rows (aproximadamente)
INSERT INTO `cal_acciones_proceso` (`id_accion`, `proceso`, `logro_destacado`) VALUES
	(1, 'Aseguramiento de Calidad', 'Fortalecimiento del sistema HACCP, control de puntos críticos y certificación HACCP.'),
	(2, 'Aseguramiento de Calidad', 'Avances en la transición hacia la ISO 9001:2026, con mayor integración digital y tecnológica, reorganización del capítulo de mejora y énfasis en la experiencia del cliente.'),
	(3, 'Gestión de Clientes', 'Reducción de las PQRs y aumento de planes de acción efectivos reflejando una cultura enfocada en la mejora continua.'),
	(4, 'Vigías de Riesgos', 'Mejora en procedimientos de seguridad, control de activos, manejo de documentos y parqueaderos.'),
	(5, 'Vigías de Riesgos', 'Implementación de sistemas de alarma y colaboración con grupos de seguridad empresarial.');

-- Volcando estructura para tabla erp_pollo_fiesta.cal_hitos_sistemas
CREATE TABLE IF NOT EXISTS `cal_hitos_sistemas` (
  `id_hito` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id_hito`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.cal_hitos_sistemas: ~4 rows (aproximadamente)
INSERT INTO `cal_hitos_sistemas` (`id_hito`, `descripcion`) VALUES
	(1, 'Transición y preparación hacia norma ISO 9001:2026'),
	(2, 'Certificación HACCP en la planta'),
	(3, 'Migración exitosa al software ISOLUCION'),
	(4, 'Actualización del CRM SIESA');

-- Volcando estructura para tabla erp_pollo_fiesta.cal_indicadores_gestion
CREATE TABLE IF NOT EXISTS `cal_indicadores_gestion` (
  `id_indicador` int(11) NOT NULL AUTO_INCREMENT,
  `anio` int(11) NOT NULL,
  `nombre_indicador` varchar(150) NOT NULL,
  `valor_medido` varchar(50) NOT NULL,
  `variacion_vs_anterior` varchar(50) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  PRIMARY KEY (`id_indicador`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.cal_indicadores_gestion: ~3 rows (aproximadamente)
INSERT INTO `cal_indicadores_gestion` (`id_indicador`, `anio`, `nombre_indicador`, `valor_medido`, `variacion_vs_anterior`, `observaciones`) VALUES
	(1, 2025, 'Encuestas de Satisfacción', '1166 encuestas', '-38% vs 2024', 'Disminución en el volumen de encuestas de satisfacción aplicadas frente al año anterior.'),
	(2, 2025, 'Transición Normativa ISO', 'ISO 9001:2026', 'En progreso', 'Enfoque en integración tecnológica y mejora de la experiencia del cliente.'),
	(3, 2025, 'Adopción de Software', 'ISOLUCION / SIESA', 'Migración exitosa', 'Software ISOLUCION para calidad y actualización de CRM SIESA para trazabilidad.');

-- Volcando estructura para tabla erp_pollo_fiesta.cal_lineas_accion
CREATE TABLE IF NOT EXISTS `cal_lineas_accion` (
  `id_linea` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_linea` varchar(150) NOT NULL,
  `descripcion` text NOT NULL,
  PRIMARY KEY (`id_linea`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.cal_lineas_accion: ~4 rows (aproximadamente)
INSERT INTO `cal_lineas_accion` (`id_linea`, `nombre_linea`, `descripcion`) VALUES
	(1, 'Dirección Estratégica y Gestión de Procesos', 'Se conectó la estrategia con la ejecución, priorizando riesgos estratégicos y facilitando decisiones informadas.'),
	(2, 'Mejora Continua y Enfoque Preventivo', 'Se fortaleció la cultura de mejora continua y se adoptó un enfoque preventivo alineado con la ISO 9001:2026.'),
	(3, 'Gestión de Riesgos y Cumplimiento Normativo', 'Se integraron riesgos y oportunidades en la planificación, garantizando el cumplimiento de requisitos sanitarios, ambientales y de calidad.'),
	(4, 'Transformación Digital', 'Migración al software ISOLUCION y actualización del CRM SIESA, mejorando trazabilidad y control de información.');

-- Volcando estructura para tabla erp_pollo_fiesta.cal_metricas_calidad
CREATE TABLE IF NOT EXISTS `cal_metricas_calidad` (
  `anio` int(11) NOT NULL,
  `encuestas_satisfaccion_realizadas` int(11) DEFAULT NULL,
  `reduccion_pqrs_pct` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.cal_metricas_calidad: ~1 rows (aproximadamente)
INSERT INTO `cal_metricas_calidad` (`anio`, `encuestas_satisfaccion_realizadas`, `reduccion_pqrs_pct`) VALUES
	(2025, 1166, 38.00);

-- Volcando estructura para tabla erp_pollo_fiesta.cmp_compras_mensuales
CREATE TABLE IF NOT EXISTS `cmp_compras_mensuales` (
  `id_compra` int(11) NOT NULL AUTO_INCREMENT,
  `anio` int(11) NOT NULL,
  `mes_num` int(11) NOT NULL,
  `mes_nombre` varchar(20) NOT NULL,
  `valor_compras_pesos` decimal(20,2) NOT NULL,
  PRIMARY KEY (`id_compra`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.cmp_compras_mensuales: ~24 rows (aproximadamente)
INSERT INTO `cmp_compras_mensuales` (`id_compra`, `anio`, `mes_num`, `mes_nombre`, `valor_compras_pesos`) VALUES
	(1, 2023, 1, 'Enero', 567954236.00),
	(2, 2023, 2, 'Febrero', 754021655.00),
	(3, 2023, 3, 'Marzo', 746049436.00),
	(4, 2023, 4, 'Abril', 667457396.00),
	(5, 2023, 5, 'Mayo', 750390042.00),
	(6, 2023, 6, 'Junio', 471275323.00),
	(7, 2023, 7, 'Julio', 534116839.00),
	(8, 2023, 8, 'Agosto', 790757198.00),
	(9, 2023, 9, 'Septiembre', 691076027.00),
	(10, 2023, 10, 'Octubre', 753251674.00),
	(11, 2023, 11, 'Noviembre', 681475575.00),
	(12, 2023, 12, 'Diciembre', 686894329.00),
	(13, 2024, 1, 'Enero', 463258107.00),
	(14, 2024, 2, 'Febrero', 648321242.00),
	(15, 2024, 3, 'Marzo', 527369240.00),
	(16, 2024, 4, 'Abril', 790149068.00),
	(17, 2024, 5, 'Mayo', 683036339.00),
	(18, 2024, 6, 'Junio', 704687788.00),
	(19, 2024, 7, 'Julio', 646620709.00),
	(20, 2024, 8, 'Agosto', 506431876.00),
	(21, 2024, 9, 'Septiembre', 641917319.00),
	(22, 2024, 10, 'Octubre', 519897878.00),
	(23, 2024, 11, 'Noviembre', 607256562.00),
	(24, 2024, 12, 'Diciembre', 966629008.00);

-- Volcando estructura para tabla erp_pollo_fiesta.cmp_compras_mensuales_detalle
CREATE TABLE IF NOT EXISTS `cmp_compras_mensuales_detalle` (
  `mes` varchar(20) NOT NULL,
  `compras_2023_pesos` decimal(20,2) DEFAULT NULL,
  `compras_2024_pesos` decimal(20,2) DEFAULT NULL,
  `variacion_pct` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`mes`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.cmp_compras_mensuales_detalle: ~8 rows (aproximadamente)
INSERT INTO `cmp_compras_mensuales_detalle` (`mes`, `compras_2023_pesos`, `compras_2024_pesos`, `variacion_pct`) VALUES
	('Abril', 667457396.00, 790149068.00, 18.40),
	('Agosto', NULL, 506431870.00, NULL),
	('Enero', 567954236.00, 463258107.00, -18.40),
	('Febrero', 754021655.00, 648321242.00, -14.00),
	('Julio', 534116839.00, 646620709.00, 21.10),
	('Junio', 471275323.00, 704687788.00, 49.50),
	('Marzo', 746049436.00, 527369240.00, -29.30),
	('Mayo', 750390042.00, 683036339.00, -9.00);

-- Volcando estructura para tabla erp_pollo_fiesta.cmp_compras_mes
CREATE TABLE IF NOT EXISTS `cmp_compras_mes` (
  `mes` varchar(20) NOT NULL,
  `compras_2023_pesos` decimal(20,2) DEFAULT NULL,
  `compras_2024_pesos` decimal(20,2) DEFAULT NULL,
  PRIMARY KEY (`mes`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.cmp_compras_mes: ~7 rows (aproximadamente)
INSERT INTO `cmp_compras_mes` (`mes`, `compras_2023_pesos`, `compras_2024_pesos`) VALUES
	('Abril', 667457396.00, 790149068.00),
	('Enero', 567954236.00, 463258107.00),
	('Febrero', 754021655.00, 648321242.00),
	('Julio', 534116839.00, 646620709.00),
	('Junio', 471275323.00, 704687788.00),
	('Marzo', 746049436.00, 527369240.00),
	('Mayo', 750390042.00, 683036339.00);

-- Volcando estructura para tabla erp_pollo_fiesta.com_agrupaciones
CREATE TABLE IF NOT EXISTS `com_agrupaciones` (
  `id_agrupacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_categoria` int(11) DEFAULT NULL,
  `nombre_agrupacion` varchar(100) NOT NULL,
  `lider_comercial` varchar(100) NOT NULL,
  PRIMARY KEY (`id_agrupacion`),
  KEY `id_categoria` (`id_categoria`),
  CONSTRAINT `com_agrupaciones_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `com_categorias` (`id_categoria`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.com_agrupaciones: ~7 rows (aproximadamente)
INSERT INTO `com_agrupaciones` (`id_agrupacion`, `id_categoria`, `nombre_agrupacion`, `lider_comercial`) VALUES
	(1, 1, 'Mayorista', 'Jose Rodriguez'),
	(2, 2, 'Institucional / Grandes Superficies', 'Hernan Benito'),
	(3, 2, 'Asadero', 'German Rodriguez'),
	(4, 2, 'Sede 5 Toberin', 'Yenny Alvarado'),
	(5, 2, 'Puntos de Venta', 'Elmira Gonzales / Michael Arias'),
	(6, 2, 'Yopal', 'Julian Mora'),
	(7, 3, 'Comercial (Huevos)', 'Margarita Roa');

-- Volcando estructura para tabla erp_pollo_fiesta.com_cartera_clientes
CREATE TABLE IF NOT EXISTS `com_cartera_clientes` (
  `id_cartera` int(11) NOT NULL AUTO_INCREMENT,
  `id_cliente` varchar(50) NOT NULL,
  `nombre_cliente` varchar(150) DEFAULT NULL,
  `dias_rotacion_real` int(11) DEFAULT NULL,
  `saldo_pendiente` decimal(15,2) DEFAULT NULL,
  `asesor_asignado` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_cartera`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.com_cartera_clientes: ~26 rows (aproximadamente)
INSERT INTO `com_cartera_clientes` (`id_cartera`, `id_cliente`, `nombre_cliente`, `dias_rotacion_real`, `saldo_pendiente`, `asesor_asignado`) VALUES
	(1, 'RESUMEN_2024', 'Resumen Cartera Diciembre 2024', 21, 16953000000.00, 'Gestión Cartera'),
	(2, 'RESUMEN_2025', 'Resumen Cartera Diciembre 2025', 15, 16785000000.00, 'Gestión Cartera'),
	(3, 'CARTERA_2024_01', 'Cartera Enero 2024', 0, 17366000000.00, 'Gestión Cartera - Mes 1'),
	(4, 'CARTERA_2025_01', 'Cartera Enero 2025', 0, 14413000000.00, 'Gestión Cartera - Mes 1 - Variación -17%'),
	(5, 'CARTERA_2024_02', 'Cartera Febrero 2024', 0, 17668000000.00, 'Gestión Cartera - Mes 2'),
	(6, 'CARTERA_2025_02', 'Cartera Febrero 2025', 0, 15097000000.00, 'Gestión Cartera - Mes 2 - Variación -15%'),
	(7, 'CARTERA_2024_03', 'Cartera Marzo 2024', 0, 18555000000.00, 'Gestión Cartera - Mes 3'),
	(8, 'CARTERA_2025_03', 'Cartera Marzo 2025', 0, 15568000000.00, 'Gestión Cartera - Mes 3 - Variación -16%'),
	(9, 'CARTERA_2024_04', 'Cartera Abril 2024', 0, 17161000000.00, 'Gestión Cartera - Mes 4'),
	(10, 'CARTERA_2025_04', 'Cartera Abril 2025', 0, 17937000000.00, 'Gestión Cartera - Mes 4 - Variación +5%'),
	(11, 'CARTERA_2024_05', 'Cartera Mayo 2024', 0, 16978000000.00, 'Gestión Cartera - Mes 5'),
	(12, 'CARTERA_2025_05', 'Cartera Mayo 2025', 0, 18209000000.00, 'Gestión Cartera - Mes 5 - Variación +7%'),
	(13, 'CARTERA_2024_06', 'Cartera Junio 2024', 0, 17763000000.00, 'Gestión Cartera - Mes 6'),
	(14, 'CARTERA_2025_06', 'Cartera Junio 2025', 0, 18491000000.00, 'Gestión Cartera - Mes 6 - Variación +4%'),
	(15, 'CARTERA_2024_07', 'Cartera Julio 2024', 0, 17415000000.00, 'Gestión Cartera - Mes 7'),
	(16, 'CARTERA_2025_07', 'Cartera Julio 2025', 0, 16735000000.00, 'Gestión Cartera - Mes 7 - Variación -4%'),
	(17, 'CARTERA_2024_08', 'Cartera Agosto 2024', 0, 18241000000.00, 'Gestión Cartera - Mes 8'),
	(18, 'CARTERA_2025_08', 'Cartera Agosto 2025', 0, 20667000000.00, 'Gestión Cartera - Mes 8 - Variación +13%'),
	(19, 'CARTERA_2024_09', 'Cartera Septiembre 2024', 0, 19078000000.00, 'Gestión Cartera - Mes 9'),
	(20, 'CARTERA_2025_09', 'Cartera Septiembre 2025', 0, 17110000000.00, 'Gestión Cartera - Mes 9 - Variación -10%'),
	(21, 'CARTERA_2024_10', 'Cartera Octubre 2024', 0, 20493000000.00, 'Gestión Cartera - Mes 10'),
	(22, 'CARTERA_2025_10', 'Cartera Octubre 2025', 0, 19652000000.00, 'Gestión Cartera - Mes 10 - Variación -4%'),
	(23, 'CARTERA_2024_11', 'Cartera Noviembre 2024', 0, 18704000000.00, 'Gestión Cartera - Mes 11'),
	(24, 'CARTERA_2025_11', 'Cartera Noviembre 2025', 0, 22838000000.00, 'Gestión Cartera - Mes 11 - Variación +22%'),
	(25, 'CARTERA_2024_12', 'Cartera Diciembre 2024', 21, 16971000000.00, 'Gestión Cartera - Mes 12'),
	(26, 'CARTERA_2025_12', 'Cartera Diciembre 2025', 15, 16785000000.00, 'Gestión Cartera - Mes 12 - Variación -1%');

-- Volcando estructura para tabla erp_pollo_fiesta.com_categorias
CREATE TABLE IF NOT EXISTS `com_categorias` (
  `id_categoria` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(50) NOT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.com_categorias: ~3 rows (aproximadamente)
INSERT INTO `com_categorias` (`id_categoria`, `nombre_categoria`) VALUES
	(1, 'Pollo en pie'),
	(2, 'Pollo en canal'),
	(3, 'Huevos');

-- Volcando estructura para tabla erp_pollo_fiesta.com_objetivo_pollo_entero
CREATE TABLE IF NOT EXISTS `com_objetivo_pollo_entero` (
  `id_objetivo` int(11) NOT NULL AUTO_INCREMENT,
  `anio` int(11) NOT NULL,
  `pollo_entero_planta` bigint(20) NOT NULL,
  `venta_unidad_linea_asadero` bigint(20) NOT NULL,
  PRIMARY KEY (`id_objetivo`),
  UNIQUE KEY `anio` (`anio`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.com_objetivo_pollo_entero: ~3 rows (aproximadamente)
INSERT INTO `com_objetivo_pollo_entero` (`id_objetivo`, `anio`, `pollo_entero_planta`, `venta_unidad_linea_asadero`) VALUES
	(1, 2023, 16684117, 7643906),
	(2, 2024, 15303087, 7300167),
	(3, 2025, 15556087, 7652843);

-- Volcando estructura para tabla erp_pollo_fiesta.com_pdv_maestro
CREATE TABLE IF NOT EXISTS `com_pdv_maestro` (
  `id_pdv` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_pdv` varchar(100) NOT NULL,
  `zona_geografica` varchar(50) NOT NULL,
  `coordinador` varchar(100) NOT NULL,
  `tipo_sede` enum('Punto de Venta','Unidad Central') DEFAULT 'Punto de Venta',
  `estado` enum('Activo','Inactivo') DEFAULT 'Activo',
  PRIMARY KEY (`id_pdv`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.com_pdv_maestro: ~24 rows (aproximadamente)
INSERT INTO `com_pdv_maestro` (`id_pdv`, `nombre_pdv`, `zona_geografica`, `coordinador`, `tipo_sede`, `estado`) VALUES
	(1, '20 de Julio', 'Zona Sur', 'Elmira González', 'Punto de Venta', 'Activo'),
	(2, 'Abastos', 'Zona Sur', 'Elmira González', 'Punto de Venta', 'Activo'),
	(3, 'Kennedy', 'Zona Sur', 'Elmira González', 'Punto de Venta', 'Activo'),
	(4, 'Santa Rita', 'Zona Sur', 'Elmira González', 'Punto de Venta', 'Activo'),
	(5, 'Pradera', 'Zona Sur', 'Elmira González', 'Punto de Venta', 'Activo'),
	(6, 'Soacha', 'Zona Sur', 'Elmira González', 'Punto de Venta', 'Activo'),
	(7, 'Fusagasugá', 'Zona Sur', 'Elmira González', 'Punto de Venta', 'Activo'),
	(8, 'Market Toberín', 'Zona Norte', 'Michael Arias', 'Punto de Venta', 'Activo'),
	(9, 'Engativá Centro', 'Zona Norte', 'Michael Arias', 'Punto de Venta', 'Activo'),
	(10, 'Floresta', 'Zona Norte', 'Michael Arias', 'Punto de Venta', 'Activo'),
	(11, 'Suba', 'Zona Norte', 'Michael Arias', 'Punto de Venta', 'Activo'),
	(12, 'Cabaña', 'Zona Norte', 'Michael Arias', 'Punto de Venta', 'Activo'),
	(13, 'Yopal Alcaraván', 'Casanare', 'Julián Mora', 'Punto de Venta', 'Activo'),
	(14, 'Yopal Garcero', 'Casanare', 'Julián Mora', 'Punto de Venta', 'Activo'),
	(15, 'Yopal Canaguaro', 'Casanare', 'Julián Mora', 'Punto de Venta', 'Activo'),
	(16, 'Yopal Aguazul', 'Casanare', 'Julián Mora', 'Punto de Venta', 'Activo'),
	(17, 'Morichal', 'Casanare', 'Julián Mora', 'Punto de Venta', 'Inactivo'),
	(18, 'Tunja', 'Boyacá', 'John Ramírez', 'Punto de Venta', 'Activo'),
	(19, 'Sogamoso', 'Boyacá', 'John Ramírez', 'Punto de Venta', 'Activo'),
	(20, 'Chiquinquirá', 'Chiquinquirá', 'Adriana', 'Punto de Venta', 'Activo'),
	(21, 'Central de Carnes Guadalupe', 'Guadalupe', 'Iván Romero', 'Punto de Venta', 'Activo'),
	(22, 'Visión Colombia', 'Bogotá Occidente', 'Belisario Eguis', 'Punto de Venta', 'Activo'),
	(23, 'Planta Principal', 'Híbrida', 'Directivo', 'Unidad Central', 'Activo'),
	(24, 'Fiesta Express', 'Central', 'Directivo', 'Unidad Central', 'Activo');

-- Volcando estructura para tabla erp_pollo_fiesta.com_pdv_top_desempeno
CREATE TABLE IF NOT EXISTS `com_pdv_top_desempeno` (
  `id_top` int(11) NOT NULL AUTO_INCREMENT,
  `anio` int(11) NOT NULL,
  `zona_asignacion` varchar(50) NOT NULL,
  `id_pdv` int(11) NOT NULL,
  `kilos_pollo` decimal(15,2) DEFAULT 0.00,
  `ingresos_pollo_pesos` decimal(20,2) DEFAULT 0.00,
  `unidades_huevo` bigint(20) DEFAULT 0,
  `ingresos_huevo_pesos` decimal(20,2) DEFAULT 0.00,
  PRIMARY KEY (`id_top`),
  KEY `id_pdv` (`id_pdv`),
  CONSTRAINT `com_pdv_top_desempeno_ibfk_1` FOREIGN KEY (`id_pdv`) REFERENCES `com_pdv_maestro` (`id_pdv`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.com_pdv_top_desempeno: ~4 rows (aproximadamente)
INSERT INTO `com_pdv_top_desempeno` (`id_top`, `anio`, `zona_asignacion`, `id_pdv`, `kilos_pollo`, `ingresos_pollo_pesos`, `unidades_huevo`, `ingresos_huevo_pesos`) VALUES
	(1, 2024, 'Zona Sur', 1, 156623.00, 1360791288.00, 516629, 263481000.00),
	(2, 2024, 'Zona Sur', 23, 0.00, 0.00, 1061176, 546180392.00),
	(3, 2024, 'Zona Norte', 23, 82312.00, 1331801155.00, 566359, 288843212.00),
	(4, 2024, 'Zona Norte', 12, 0.00, 0.00, 422106, 215274054.00);

-- Volcando estructura para tabla erp_pollo_fiesta.com_pdv_ventas_zonales
CREATE TABLE IF NOT EXISTS `com_pdv_ventas_zonales` (
  `id_venta_zona` int(11) NOT NULL AUTO_INCREMENT,
  `anio` int(11) NOT NULL,
  `zona_geografica` varchar(50) NOT NULL,
  `kilos_pollo` decimal(15,2) DEFAULT NULL,
  `ingresos_pollo_pesos` decimal(20,2) DEFAULT NULL,
  `unidades_huevo` bigint(20) DEFAULT NULL,
  `ingresos_huevo_pesos` decimal(20,2) DEFAULT NULL,
  PRIMARY KEY (`id_venta_zona`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.com_pdv_ventas_zonales: ~3 rows (aproximadamente)
INSERT INTO `com_pdv_ventas_zonales` (`id_venta_zona`, `anio`, `zona_geografica`, `kilos_pollo`, `ingresos_pollo_pesos`, `unidades_huevo`, `ingresos_huevo_pesos`) VALUES
	(1, 2023, 'Zona Sur', 470630.00, 5457913736.00, 3472899, 1954308798.00),
	(2, 2024, 'Zona Sur', 423306.00, 5233812645.00, 4244706, 2184721556.00),
	(3, 2024, 'Zona Norte', 338719.00, 3556192829.00, 2757992, 1406576011.00);

-- Volcando estructura para tabla erp_pollo_fiesta.com_puntos_venta
CREATE TABLE IF NOT EXISTS `com_puntos_venta` (
  `id_pdv` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_pdv` varchar(100) NOT NULL,
  `zona` varchar(50) DEFAULT NULL,
  `coordinador_responsable` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_pdv`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.com_puntos_venta: ~26 rows (aproximadamente)
INSERT INTO `com_puntos_venta` (`id_pdv`, `nombre_pdv`, `zona`, `coordinador_responsable`) VALUES
	(1, '20 de Julio', 'Sur', 'Elmira Gonzalez'),
	(2, 'Abastos', 'Sur', 'Elmira Gonzalez'),
	(3, 'Kennedy', 'Sur', 'Elmira Gonzalez'),
	(4, 'Santa Rita', 'Sur', 'Elmira Gonzalez'),
	(5, 'Pradera', 'Sur', 'Elmira Gonzalez'),
	(6, 'Soacha', 'Sur', 'Elmira Gonzalez'),
	(7, 'Fusagasugá', 'Sur', 'Elmira Gonzalez'),
	(8, 'PDV Norte 1', 'Norte', 'Michael Arias'),
	(9, 'PDV Norte 2', 'Norte', 'Michael Arias'),
	(10, 'PDV Norte 3', 'Norte', 'Michael Arias'),
	(11, 'PDV Norte 4', 'Norte', 'Michael Arias'),
	(12, 'PDV Norte 5', 'Norte', 'Michael Arias'),
	(13, 'Chiquinquirá', 'Centro', 'Adriana'),
	(14, 'Tunja', 'Centro', 'John Ramirez'),
	(15, 'Sogamoso', 'Centro', 'John Ramirez'),
	(16, 'Yopal 1', 'Oriente', 'Julián Mora'),
	(17, 'Yopal 2', 'Oriente', 'Julián Mora'),
	(18, 'Yopal 3', 'Oriente', 'Julián Mora'),
	(19, 'Yopal 4', 'Oriente', 'Julián Mora'),
	(20, 'Aguazul', 'Oriente', 'Julián Mora'),
	(21, 'Central de Carnes Guadalupe', 'Sur', 'Ivan Romero'),
	(22, 'Visión Colombia', 'Centro', 'Belisario Eguis'),
	(23, 'Total Zona Sur', 'Sur', 'Elmira Gonzalez'),
	(24, '20 de Julio', 'Sur', 'Elmira Gonzalez'),
	(25, 'Total Zona Norte', 'Norte', 'Michael Arias'),
	(26, 'PDV Planta', 'Norte', 'Michael Arias');

-- Volcando estructura para tabla erp_pollo_fiesta.com_sede3_metas_operativas
CREATE TABLE IF NOT EXISTS `com_sede3_metas_operativas` (
  `id_meta_s3` int(11) NOT NULL AUTO_INCREMENT,
  `anio` int(11) NOT NULL,
  `kilos_recibidos_canal` bigint(20) DEFAULT NULL,
  `ventas_kilos_generales` decimal(15,2) DEFAULT NULL,
  `ingresos_totales` decimal(20,2) DEFAULT NULL,
  `precio_promedio_kilo` decimal(10,2) DEFAULT NULL,
  `dias_rotacion_cartera` int(11) DEFAULT NULL,
  `fuerza_comercial_asesores` int(11) DEFAULT NULL,
  `fuerza_comercial_servicio_cliente` int(11) DEFAULT NULL,
  `fuerza_comercial_mercaderistas` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_meta_s3`),
  UNIQUE KEY `anio` (`anio`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.com_sede3_metas_operativas: ~2 rows (aproximadamente)
INSERT INTO `com_sede3_metas_operativas` (`id_meta_s3`, `anio`, `kilos_recibidos_canal`, `ventas_kilos_generales`, `ingresos_totales`, `precio_promedio_kilo`, `dias_rotacion_cartera`, `fuerza_comercial_asesores`, `fuerza_comercial_servicio_cliente`, `fuerza_comercial_mercaderistas`) VALUES
	(1, 2023, 6867672, 13297068.00, 125172094000.00, 9415.00, NULL, NULL, NULL, NULL),
	(2, 2024, 7121267, 11541646.00, 116735892000.00, 10125.00, 28, 8, 2, 25);

-- Volcando estructura para tabla erp_pollo_fiesta.com_sede3_ventas_detalle
CREATE TABLE IF NOT EXISTS `com_sede3_ventas_detalle` (
  `id_venta_s3` int(11) NOT NULL AUTO_INCREMENT,
  `anio` int(11) NOT NULL,
  `estado_conservacion` enum('Refrigerado','Congelado') NOT NULL,
  `codigo_linea` int(11) NOT NULL,
  `nombre_linea` varchar(100) NOT NULL,
  `kilos_vendidos` decimal(15,2) NOT NULL,
  `precio_promedio` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_venta_s3`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.com_sede3_ventas_detalle: ~22 rows (aproximadamente)
INSERT INTO `com_sede3_ventas_detalle` (`id_venta_s3`, `anio`, `estado_conservacion`, `codigo_linea`, `nombre_linea`, `kilos_vendidos`, `precio_promedio`) VALUES
	(1, 2024, 'Refrigerado', 100, 'Pollo Entero', 2104976.00, 10327.00),
	(2, 2024, 'Refrigerado', 102, 'Pollo Campesino', 346.00, 13164.00),
	(3, 2024, 'Refrigerado', 105, 'Presa', 4718855.00, 11242.00),
	(4, 2024, 'Refrigerado', 110, 'Menudencia', 976141.00, 2019.00),
	(5, 2024, 'Refrigerado', 120, 'Carnes Frías', 1687.00, 18038.00),
	(6, 2024, 'Refrigerado', 122, 'Combos', 0.00, 0.00),
	(7, 2025, 'Refrigerado', 100, 'Pollo Entero', 3456220.00, 10199.00),
	(8, 2025, 'Refrigerado', 102, 'Pollo Campesino', 0.00, 0.00),
	(9, 2025, 'Refrigerado', 105, 'Presa', 4935246.00, 10448.00),
	(10, 2025, 'Refrigerado', 110, 'Menudencia', 1109430.00, 1629.00),
	(11, 2025, 'Refrigerado', 120, 'Carnes Frías', 735.00, 40250.00),
	(12, 2025, 'Refrigerado', 122, 'Combos', 1056.00, 24042.00),
	(13, 2024, 'Congelado', 100, 'Pollo Entero', 1083815.00, 10429.00),
	(14, 2024, 'Congelado', 102, 'Pollo Campesino', 9571.00, 14312.00),
	(15, 2024, 'Congelado', 105, 'Presa', 1165862.00, 10347.00),
	(16, 2024, 'Congelado', 110, 'Menudencia', 0.00, 0.00),
	(17, 2024, 'Congelado', 120, 'Carnes Frías', 233497.00, 5071.00),
	(18, 2025, 'Congelado', 100, 'Pollo Entero', 620394.00, 11484.00),
	(19, 2025, 'Congelado', 102, 'Pollo Campesino', 42.00, 15895.00),
	(20, 2025, 'Congelado', 105, 'Presa', 265997.00, 11933.00),
	(21, 2025, 'Congelado', 110, 'Menudencia', 2.00, 3200.00),
	(22, 2025, 'Congelado', 120, 'Carnes Frías', 8097.00, 4068.00);

-- Volcando estructura para tabla erp_pollo_fiesta.com_unidades_procesadas
CREATE TABLE IF NOT EXISTS `com_unidades_procesadas` (
  `id_asignacion` int(11) NOT NULL AUTO_INCREMENT,
  `anio` int(11) NOT NULL,
  `centro_operacion` varchar(100) NOT NULL,
  `unidades` bigint(20) NOT NULL,
  PRIMARY KEY (`id_asignacion`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.com_unidades_procesadas: ~12 rows (aproximadamente)
INSERT INTO `com_unidades_procesadas` (`id_asignacion`, `anio`, `centro_operacion`, `unidades`) VALUES
	(1, 2024, 'Mayorista', 12593533),
	(2, 2024, 'Sede U03', 6426267),
	(3, 2024, 'Sede U01', 8810975),
	(4, 2024, 'Guadalupe', 697099),
	(5, 2024, 'Vision Colombia', 266948),
	(6, 2024, 'Gallinas', 83667),
	(7, 2025, 'Mayorista', 13071884),
	(8, 2025, 'Sede U03', 14091282),
	(9, 2025, 'Sede U01', 1369892),
	(10, 2025, 'Guadalupe', 660863),
	(11, 2025, 'Vision Colombia', 386246),
	(12, 2025, 'Gallinas', 94047);

-- Volcando estructura para tabla erp_pollo_fiesta.com_ventas_huevo
CREATE TABLE IF NOT EXISTS `com_ventas_huevo` (
  `id_venta_huevo` int(11) NOT NULL AUTO_INCREMENT,
  `anio` int(11) NOT NULL,
  `raza_produccion` varchar(50) DEFAULT 'Hy-Line Brown',
  `unidades_vendidas` bigint(20) NOT NULL,
  `precio_promedio_unidad` decimal(10,2) NOT NULL,
  `ingresos_totales_calculados` decimal(20,2) GENERATED ALWAYS AS (`unidades_vendidas` * `precio_promedio_unidad`) STORED,
  `utilidad_neta_millones` decimal(15,2) DEFAULT NULL,
  `margen_neto_pct` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id_venta_huevo`),
  UNIQUE KEY `anio` (`anio`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.com_ventas_huevo: ~3 rows (aproximadamente)
INSERT INTO `com_ventas_huevo` (`id_venta_huevo`, `anio`, `raza_produccion`, `unidades_vendidas`, `precio_promedio_unidad`, `utilidad_neta_millones`, `margen_neto_pct`) VALUES
	(1, 2023, 'Hy-Line Brown', 34248429, 512.00, 2701.00, 12.15),
	(2, 2024, 'Hy-Line Brown', 34592030, 435.00, 197.00, 1.24),
	(3, 2025, 'Hy-Line Brown', 34322252, 403.00, NULL, NULL);

-- Volcando estructura para tabla erp_pollo_fiesta.com_ventas_pie_canal
CREATE TABLE IF NOT EXISTS `com_ventas_pie_canal` (
  `id_venta` int(11) NOT NULL AUTO_INCREMENT,
  `anio` int(11) NOT NULL,
  `id_categoria` int(11) DEFAULT NULL,
  `kilos_vendidos` decimal(15,2) NOT NULL,
  `ingresos_pesos` decimal(20,2) NOT NULL,
  PRIMARY KEY (`id_venta`),
  KEY `id_categoria` (`id_categoria`),
  CONSTRAINT `com_ventas_pie_canal_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `com_categorias` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.com_ventas_pie_canal: ~4 rows (aproximadamente)
INSERT INTO `com_ventas_pie_canal` (`id_venta`, `anio`, `id_categoria`, `kilos_vendidos`, `ingresos_pesos`) VALUES
	(1, 2024, 1, 27231028.00, 167688498909.00),
	(2, 2024, 2, 27469628.00, 242754910560.00),
	(3, 2025, 1, 28879638.00, 170397059122.00),
	(4, 2025, 2, 27476870.00, 243191026074.00);

-- Volcando estructura para tabla erp_pollo_fiesta.fin_accionistas
CREATE TABLE IF NOT EXISTS `fin_accionistas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_accionista` varchar(150) DEFAULT NULL,
  `nit_cc` varchar(50) DEFAULT NULL,
  `num_acciones` int(11) DEFAULT NULL,
  `capital_suscrito_pagado` decimal(20,2) DEFAULT NULL,
  `porcentaje` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.fin_accionistas: ~7 rows (aproximadamente)
INSERT INTO `fin_accionistas` (`id`, `nombre_accionista`, `nit_cc`, `num_acciones`, `capital_suscrito_pagado`, `porcentaje`) VALUES
	(1, 'INVERSIONES LILLY SAS', '900.684.932-9', 174000, 870000000.00, 14.29),
	(2, 'INVERSIONES PROJEKTE SAS', '900.683.453-8', 174000, 870000000.00, 14.29),
	(3, 'FENISY SAS', '900.684.142-7', 174000, 870000000.00, 14.29),
	(4, 'DAVID ERNESTO CAMACHO', '80.876.029', 30000, 150000000.00, 2.46),
	(5, 'LORENA CAMACHO ROA', '52.990.725', 30000, 150000000.00, 2.46),
	(6, 'INVERSIONES AMLODA SAS', '900.682.651-5', 114000, 570000000.00, 9.36),
	(7, 'MARIA CLEMENCIA ROA BARRERA', '41.643.024', 59905, 299525000.00, 4.92);

-- Volcando estructura para tabla erp_pollo_fiesta.fin_balance_general
CREATE TABLE IF NOT EXISTS `fin_balance_general` (
  `anio` int(11) NOT NULL,
  `activos_totales` decimal(15,2) NOT NULL,
  `pasivos_totales` decimal(15,2) NOT NULL,
  `patrimonio_contable` decimal(15,2) NOT NULL,
  PRIMARY KEY (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.fin_balance_general: ~2 rows (aproximadamente)
INSERT INTO `fin_balance_general` (`anio`, `activos_totales`, `pasivos_totales`, `patrimonio_contable`) VALUES
	(2023, 136645.00, 61891.00, 74754.00),
	(2024, 137287.00, 53756.00, 83530.00);

-- Volcando estructura para tabla erp_pollo_fiesta.fin_composicion_accionaria
CREATE TABLE IF NOT EXISTS `fin_composicion_accionaria` (
  `id_accionista` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_accionista` varchar(150) NOT NULL,
  `identificacion_nit` varchar(50) NOT NULL,
  `numero_acciones` int(11) NOT NULL,
  `capital_suscrito_pagado` decimal(20,2) NOT NULL,
  `porcentaje_participacion` decimal(5,2) NOT NULL,
  PRIMARY KEY (`id_accionista`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.fin_composicion_accionaria: ~13 rows (aproximadamente)
INSERT INTO `fin_composicion_accionaria` (`id_accionista`, `nombre_accionista`, `identificacion_nit`, `numero_acciones`, `capital_suscrito_pagado`, `porcentaje_participacion`) VALUES
	(1, 'INVERSIONES LILLY SAS', '900.684.932-9', 174000, 870000000.00, 14.29),
	(2, 'INVERSIONES PROJEKTE SAS', '900.683.453-8', 174000, 870000000.00, 14.29),
	(3, 'FENISY SAS', '900.684.142-7', 174000, 870000000.00, 14.29),
	(4, 'DAVID ERNESTO CAMACHO', '80.876.029', 30000, 150000000.00, 2.46),
	(5, 'LORENA CAMACHO ROA', '52.990.725', 30000, 150000000.00, 2.46),
	(6, 'INVERSIONES AMLODA SAS', '900.682.651-5', 114000, 570000000.00, 9.36),
	(7, 'MARIA CLEMENCIA ROA BARRERA', '41.643.024', 59905, 299525000.00, 4.92),
	(8, 'DANIEL ROJAS ROA', '80.137.053', 57047, 285235000.00, 4.68),
	(9, 'LAURA JIMENA ROJAS ROA', '52.452.397', 57048, 285240000.00, 4.68),
	(10, 'LUZ MARINA ROA BARRERA', '41.751.837', 12000, 60000000.00, 0.99),
	(11, 'UNION RB S.A.S.', '900.441.703-6', 162000, 810000000.00, 13.30),
	(12, 'CARLOS ERNESTO ROA BARRERA', '79.144.600', 24000, 120000000.00, 1.97),
	(13, 'MAFERCAR SAS', '900.681.733-6', 150000, 750000000.00, 12.32);

-- Volcando estructura para tabla erp_pollo_fiesta.fin_cuentas_por_pagar_accionistas
CREATE TABLE IF NOT EXISTS `fin_cuentas_por_pagar_accionistas` (
  `anio` int(11) NOT NULL,
  `valor_deuda_pesos` decimal(20,2) NOT NULL,
  PRIMARY KEY (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.fin_cuentas_por_pagar_accionistas: ~2 rows (aproximadamente)
INSERT INTO `fin_cuentas_por_pagar_accionistas` (`anio`, `valor_deuda_pesos`) VALUES
	(2023, 4083639133.00),
	(2024, 1401203060.00);

-- Volcando estructura para tabla erp_pollo_fiesta.fin_estado_resultados
CREATE TABLE IF NOT EXISTS `fin_estado_resultados` (
  `anio` int(11) NOT NULL,
  `ingresos_operacionales` decimal(15,2) NOT NULL,
  `costo_ventas` decimal(15,2) NOT NULL,
  `utilidad_bruta` decimal(15,2) NOT NULL,
  `gastos_administracion` decimal(15,2) NOT NULL,
  `gastos_ventas` decimal(15,2) NOT NULL,
  `gastos_beneficios_empleados` decimal(15,2) NOT NULL,
  `utilidad_operacional` decimal(15,2) NOT NULL,
  `costo_neto_financiero` decimal(15,2) NOT NULL,
  `otros_ingresos_financieros` decimal(15,2) NOT NULL,
  `utilidad_neta` decimal(15,2) NOT NULL,
  PRIMARY KEY (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.fin_estado_resultados: ~2 rows (aproximadamente)
INSERT INTO `fin_estado_resultados` (`anio`, `ingresos_operacionales`, `costo_ventas`, `utilidad_bruta`, `gastos_administracion`, `gastos_ventas`, `gastos_beneficios_empleados`, `utilidad_operacional`, `costo_neto_financiero`, `otros_ingresos_financieros`, `utilidad_neta`) VALUES
	(2023, 432900.00, 381924.00, 55426.00, 2432.00, 10834.00, 16856.00, 24159.00, 11381.00, 849.00, 9157.00),
	(2024, 426600.00, 370332.00, 58309.00, 3744.00, 10490.00, 19369.00, 22534.00, 6880.00, 2555.00, 12129.00);

-- Volcando estructura para tabla erp_pollo_fiesta.fin_inversiones_vinculados
CREATE TABLE IF NOT EXISTS `fin_inversiones_vinculados` (
  `id_inversion` int(11) NOT NULL AUTO_INCREMENT,
  `empresa_vinculada` varchar(150) NOT NULL,
  `porcentaje_participacion` decimal(8,4) NOT NULL,
  `numero_acciones` int(11) NOT NULL,
  `valor_nominal_accion` decimal(10,2) NOT NULL,
  `valor_patrimonial_total` decimal(20,2) NOT NULL,
  PRIMARY KEY (`id_inversion`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.fin_inversiones_vinculados: ~1 rows (aproximadamente)
INSERT INTO `fin_inversiones_vinculados` (`id_inversion`, `empresa_vinculada`, `porcentaje_participacion`, `numero_acciones`, `valor_nominal_accion`, `valor_patrimonial_total`) VALUES
	(1, 'ALBATEQ S.A.', 17.1717, 15235348, 1000.00, 22397222727.00);

-- Volcando estructura para tabla erp_pollo_fiesta.gh_metricas_globales
CREATE TABLE IF NOT EXISTS `gh_metricas_globales` (
  `concepto` varchar(100) NOT NULL,
  `valor_2024` decimal(20,2) DEFAULT NULL,
  `valor_2025` decimal(20,2) DEFAULT NULL,
  `variacion_pct` decimal(10,2) DEFAULT NULL,
  `variacion_absoluta` decimal(20,2) DEFAULT NULL,
  PRIMARY KEY (`concepto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.gh_metricas_globales: ~6 rows (aproximadamente)
INSERT INTO `gh_metricas_globales` (`concepto`, `valor_2024`, `valor_2025`, `variacion_pct`, `variacion_absoluta`) VALUES
	('Costo de Nómina ($)', 36597343829.00, 41978924466.00, 14.70, 5381580637.00),
	('Horas Extras (Cantidad)', 127199.00, 130890.00, 2.90, 3691.00),
	('Horas Extras (Valor $)', 1065657115.00, 1286579002.00, 20.73, 220921887.00),
	('Ingresos de Personal', 532.00, 564.00, 6.02, 32.00),
	('Planta de Personal (Diciembre)', 830.00, 840.00, 1.20, 10.00),
	('Retiros de Personal', 534.00, 562.00, 5.24, 28.00);

-- Volcando estructura para tabla erp_pollo_fiesta.gh_motivos_retiro
CREATE TABLE IF NOT EXISTS `gh_motivos_retiro` (
  `id_retiro` int(11) NOT NULL AUTO_INCREMENT,
  `anio` int(11) NOT NULL,
  `motivo` varchar(100) NOT NULL,
  `cantidad` int(11) NOT NULL,
  PRIMARY KEY (`id_retiro`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.gh_motivos_retiro: ~18 rows (aproximadamente)
INSERT INTO `gh_motivos_retiro` (`id_retiro`, `anio`, `motivo`, `cantidad`) VALUES
	(1, 2025, 'MUTUO ACUERDO', 4),
	(2, 2025, 'RENUNCIA VOLUNTARIA', 471),
	(3, 2025, 'TERMINACIÓN CON JUSTA CAUSA', 11),
	(4, 2025, 'TERMINACIÓN CONTRATO SENA', 32),
	(5, 2025, 'TERMINACIÓN DE CONTRATO', 23),
	(6, 2025, 'TERMINACIÓN EN PERÍODO DE PRUEBA', 15),
	(7, 2025, 'TERMINACIÓN POR MUERTE DEL TRABAJADOR', 1),
	(8, 2025, 'TERMINACIÓN POR PENSIÓN', 3),
	(9, 2025, 'TERMINACIÓN SIN JUSTA CAUSA', 2),
	(10, 0, 'MUTUO ACUERDO', 4),
	(11, 0, 'RENUNCIA VOLUNTARIA', 471),
	(12, 0, 'TERMINACIÓN CON JUSTA CAUSA', 11),
	(13, 0, 'TERMINACIÓN CONTRATO SENA', 32),
	(14, 0, 'TERMINACIÓN DE CONTRATO', 23),
	(15, 0, 'TERMINACIÓN EN PERÍODO DE PRUEBA', 15),
	(16, 0, 'TERMINACIÓN POR MUERTE DEL TRABAJADOR', 1),
	(17, 0, 'TERMINACIÓN POR PENSIÓN', 3),
	(18, 0, 'TERMINACIÓN SIN JUSTA CAUSA', 2);

-- Volcando estructura para tabla erp_pollo_fiesta.gh_resumen_nomina_rotacion
CREATE TABLE IF NOT EXISTS `gh_resumen_nomina_rotacion` (
  `anio` int(11) NOT NULL,
  `headcount_cierre` int(11) DEFAULT NULL,
  `costo_nomina_total` decimal(20,2) DEFAULT NULL,
  `horas_extras_cantidad` int(11) DEFAULT NULL,
  `horas_extras_valor` decimal(20,2) DEFAULT NULL,
  `ingresos_personal` int(11) DEFAULT NULL,
  `retiros_personal` int(11) DEFAULT NULL,
  PRIMARY KEY (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.gh_resumen_nomina_rotacion: ~2 rows (aproximadamente)
INSERT INTO `gh_resumen_nomina_rotacion` (`anio`, `headcount_cierre`, `costo_nomina_total`, `horas_extras_cantidad`, `horas_extras_valor`, `ingresos_personal`, `retiros_personal`) VALUES
	(2024, 830, 36597343829.00, 127199, 1065657115.00, 532, 534),
	(2025, 840, 41978924466.00, 130890, 1286579002.00, 564, 562);

-- Volcando estructura para tabla erp_pollo_fiesta.log_control_mermas
CREATE TABLE IF NOT EXISTS `log_control_mermas` (
  `id_merma` int(11) NOT NULL AUTO_INCREMENT,
  `anio` int(11) NOT NULL,
  `sede` varchar(50) NOT NULL,
  `porcentaje_merma_real` decimal(5,2) NOT NULL,
  `porcentaje_meta` decimal(5,2) NOT NULL,
  PRIMARY KEY (`id_merma`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.log_control_mermas: ~12 rows (aproximadamente)
INSERT INTO `log_control_mermas` (`id_merma`, `anio`, `sede`, `porcentaje_merma_real`, `porcentaje_meta`) VALUES
	(1, 2023, 'General', 12.44, 10.00),
	(2, 2023, 'U01', 16.98, 7.50),
	(3, 2023, 'U02', -17.19, -25.00),
	(4, 2023, 'U03', 15.05, 12.00),
	(5, 2024, 'General', 11.49, 10.00),
	(6, 2024, 'U01', 16.29, 7.50),
	(7, 2024, 'U02', -20.33, -25.00),
	(8, 2024, 'U03', 14.57, 12.00),
	(9, 2025, 'General', 11.70, 10.00),
	(10, 2025, 'U01', 9.49, 7.50),
	(11, 2025, 'U02', -22.31, -25.00),
	(12, 2025, 'U03', 13.05, 12.00);

-- Volcando estructura para tabla erp_pollo_fiesta.log_gastos_comparativo
CREATE TABLE IF NOT EXISTS `log_gastos_comparativo` (
  `concepto` varchar(100) NOT NULL,
  `costo_2024` decimal(15,2) DEFAULT NULL,
  `costo_2025` decimal(15,2) DEFAULT NULL,
  `variacion_pct` decimal(6,2) DEFAULT NULL,
  `variacion_pesos` decimal(15,2) DEFAULT NULL,
  `participacion_pct` decimal(6,2) DEFAULT NULL,
  `participacion_pesos` decimal(15,2) DEFAULT NULL,
  PRIMARY KEY (`concepto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.log_gastos_comparativo: ~6 rows (aproximadamente)
INSERT INTO `log_gastos_comparativo` (`concepto`, `costo_2024`, `costo_2025`, `variacion_pct`, `variacion_pesos`, `participacion_pct`, `participacion_pesos`) VALUES
	('ARRIENDOS Y CONGELACIÓN', 2388825.00, 1799077.00, -24.69, -589748.00, 8.00, 226938.38),
	('COMBUSTIBLES (ACPM)', 204251.00, 177990.00, -12.86, -26261.00, 10.00, 19403.85),
	('COSTO PERSONAL POST PROCESO', 4639449.00, 5124946.00, 10.46, 485497.00, 9.50, 440747.66),
	('FLETES, CARGUES, ACARREOS, TTES', 4885450.00, 5542117.00, 13.44, 656667.00, 9.50, 464117.78),
	('PEAJES Y MULTAS', 58356.00, 56026.00, -3.99, -2330.00, 5.10, 5543.82),
	('TOTAL GASTOS LOGISTICOS', 14984636.00, 15339066.00, 2.37, 354430.00, NULL, NULL);

-- Volcando estructura para tabla erp_pollo_fiesta.log_gastos_operacionales
CREATE TABLE IF NOT EXISTS `log_gastos_operacionales` (
  `id_gasto` int(11) NOT NULL AUTO_INCREMENT,
  `id_sede` int(11) NOT NULL,
  `anio` int(11) NOT NULL,
  `concepto_gasto` varchar(100) NOT NULL,
  `valor_pesos` decimal(20,2) NOT NULL,
  PRIMARY KEY (`id_gasto`),
  KEY `id_sede` (`id_sede`),
  CONSTRAINT `log_gastos_operacionales_ibfk_1` FOREIGN KEY (`id_sede`) REFERENCES `log_sedes_operacion` (`id_sede`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.log_gastos_operacionales: ~34 rows (aproximadamente)
INSERT INTO `log_gastos_operacionales` (`id_gasto`, `id_sede`, `anio`, `concepto_gasto`, `valor_pesos`) VALUES
	(1, 1, 2024, 'COSTO PERSONAL DISTRIBUCIÓN', 764185000.00),
	(2, 1, 2025, 'COSTO PERSONAL DISTRIBUCIÓN', 852983000.00),
	(3, 1, 2024, 'COSTO PERSONAL POST PROCESO', 1144241000.00),
	(4, 1, 2025, 'COSTO PERSONAL POST PROCESO', 960105000.00),
	(5, 1, 2024, 'FLETES, CARGUES, ACARREOS, TTES', 2375263000.00),
	(6, 1, 2025, 'FLETES, CARGUES, ACARREOS, TTES', 2354905000.00),
	(7, 1, 2024, 'COMBUSTIBLES', 55747000.00),
	(8, 1, 2025, 'COMBUSTIBLES', 47208000.00),
	(9, 1, 2024, 'PEAJES Y MULTAS', 6772000.00),
	(10, 1, 2025, 'PEAJES Y MULTAS', 18631000.00),
	(11, 2, 2024, 'COSTO PERSONAL DISTRIBUCIÓN', 783116000.00),
	(12, 2, 2025, 'COSTO PERSONAL DISTRIBUCIÓN', 581507000.00),
	(13, 2, 2024, 'COSTO PERSONAL POST PROCESO', 1527071000.00),
	(14, 2, 2025, 'COSTO PERSONAL POST PROCESO', 1735458000.00),
	(15, 2, 2024, 'ARRIENDOS Y CONGELACIÓN', 982250000.00),
	(16, 2, 2025, 'ARRIENDOS Y CONGELACIÓN', 1404576000.00),
	(17, 2, 2024, 'FLETES, CARGUES, ACARREOS, TTES', 773584000.00),
	(18, 2, 2025, 'FLETES, CARGUES, ACARREOS, TTES', 961497000.00),
	(19, 2, 2024, 'COMBUSTIBLES', 38762000.00),
	(20, 2, 2025, 'COMBUSTIBLES', 28642000.00),
	(21, 2, 2024, 'PEAJES Y MULTAS', 29122000.00),
	(22, 2, 2025, 'PEAJES Y MULTAS', 16216000.00),
	(23, 3, 2024, 'COSTO PERSONAL DISTRIBUCIÓN', 1261004000.00),
	(24, 3, 2025, 'COSTO PERSONAL DISTRIBUCIÓN', 1204420000.00),
	(25, 3, 2024, 'COSTO PERSONAL POST PROCESO', 1968137000.00),
	(26, 3, 2025, 'COSTO PERSONAL POST PROCESO', 2429383000.00),
	(27, 3, 2024, 'ARRIENDOS Y CONGELACIÓN', 1406575000.00),
	(28, 3, 2025, 'ARRIENDOS Y CONGELACIÓN', 394501000.00),
	(29, 3, 2024, 'FLETES, CARGUES, ACARREOS, TTES', 1736603000.00),
	(30, 3, 2025, 'FLETES, CARGUES, ACARREOS, TTES', 2225715000.00),
	(31, 3, 2024, 'COMBUSTIBLES', 109742000.00),
	(32, 3, 2025, 'COMBUSTIBLES', 102140000.00),
	(33, 3, 2024, 'PEAJES Y MULTAS', 22462000.00),
	(34, 3, 2025, 'PEAJES Y MULTAS', 21179000.00);

-- Volcando estructura para tabla erp_pollo_fiesta.log_gastos_operativos_detalle
CREATE TABLE IF NOT EXISTS `log_gastos_operativos_detalle` (
  `concepto` varchar(100) NOT NULL,
  `costo_2024` decimal(20,2) DEFAULT NULL,
  `costo_2025` decimal(20,2) DEFAULT NULL,
  PRIMARY KEY (`concepto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.log_gastos_operativos_detalle: ~5 rows (aproximadamente)
INSERT INTO `log_gastos_operativos_detalle` (`concepto`, `costo_2024`, `costo_2025`) VALUES
	('ARRIENDOS Y CONGELACIÓN', 2388825.00, 1799077.00),
	('COMBUSTIBLES (ACPM)', 204251.00, 177990.00),
	('COSTO PERSONAL POST PROCESO', 4639449.00, 5124946.00),
	('FLETES, CARGUES, ACARREOS, TTES', 4885450.00, 5542117.00),
	('PEAJES Y MULTAS', 58356.00, 56026.00);

-- Volcando estructura para tabla erp_pollo_fiesta.log_headcount_historico
CREATE TABLE IF NOT EXISTS `log_headcount_historico` (
  `anio` int(11) NOT NULL,
  `total_colaboradores` int(11) DEFAULT NULL,
  PRIMARY KEY (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.log_headcount_historico: ~2 rows (aproximadamente)
INSERT INTO `log_headcount_historico` (`anio`, `total_colaboradores`) VALUES
	(2024, 231),
	(2025, 197);

-- Volcando estructura para tabla erp_pollo_fiesta.log_sedes_operacion
CREATE TABLE IF NOT EXISTS `log_sedes_operacion` (
  `id_sede` int(11) NOT NULL,
  `nombre_sede` varchar(50) NOT NULL,
  `director_encargado` varchar(100) NOT NULL,
  `colaboradores_2025` int(11) NOT NULL,
  `enfoque_operacion` text NOT NULL,
  PRIMARY KEY (`id_sede`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.log_sedes_operacion: ~3 rows (aproximadamente)
INSERT INTO `log_sedes_operacion` (`id_sede`, `nombre_sede`, `director_encargado`, `colaboradores_2025`, `enfoque_operacion`) VALUES
	(1, 'Sede 1', 'Clara Fontalvo', 52, 'Comercialización de pollo entero tipo asadero.'),
	(2, 'Sede 2', 'Alexis Pérez', 56, 'Transformación en productos congelados y aprovechamiento de sobrantes (Clientes ARA, D1).'),
	(3, 'Sede 3', 'Angélica Cárdenas', 89, 'Atención de clientes institucionales y postproceso unificado.');

-- Volcando estructura para tabla erp_pollo_fiesta.mkt_campanas_publicidad
CREATE TABLE IF NOT EXISTS `mkt_campanas_publicidad` (
  `id_campana` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_campana` varchar(100) NOT NULL,
  `medios_utilizados` varchar(255) NOT NULL,
  `descripcion_estrategia` text NOT NULL,
  PRIMARY KEY (`id_campana`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.mkt_campanas_publicidad: ~5 rows (aproximadamente)
INSERT INTO `mkt_campanas_publicidad` (`id_campana`, `tipo_campana`, `medios_utilizados`, `descripcion_estrategia`) VALUES
	(1, 'Campaña 360 - Masiva', 'Radio, Prensa (El Tiempo), TV (City TV, Red Más Noticias)', 'Presencia de marca en medios masivos de alto alcance a nivel nacional/regional.'),
	(2, 'Patrocinios Deportivos', 'Transmisiones Deportivas', 'Publicidad durante la transmisión del Tour de Francia y la Vuelta a España.'),
	(3, 'Eventos y Relaciones Públicas', 'Eventos Presenciales', 'Participación y presencia en eventos puntuales con el Estado.'),
	(4, 'Campaña Estacional', 'Prensa (El Tiempo)', 'Página completa en el diario El Tiempo para promocionar los portafolios de productos navideños.'),
	(5, 'Venta Directa', 'Autoventas', 'Continuidad de la estrategia de autoventas en Bogotá y en zonas regionales.');

-- Volcando estructura para tabla erp_pollo_fiesta.mkt_hitos_infraestructura
CREATE TABLE IF NOT EXISTS `mkt_hitos_infraestructura` (
  `id_hito` int(11) NOT NULL AUTO_INCREMENT,
  `sede_pdv` varchar(100) NOT NULL,
  `tipo_movimiento` varchar(100) NOT NULL,
  `fecha_hito` date DEFAULT NULL,
  `descripcion_detallada` text NOT NULL,
  PRIMARY KEY (`id_hito`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.mkt_hitos_infraestructura: ~4 rows (aproximadamente)
INSERT INTO `mkt_hitos_infraestructura` (`id_hito`, `sede_pdv`, `tipo_movimiento`, `fecha_hito`, `descripcion_detallada`) VALUES
	(1, 'Sede 5 (Toberín)', 'Apertura de Sede', '2024-12-21', 'Inicio de labores en la nueva sede (antes Frigo-norte D05), ubicada en la calle 166 #16c-28, actuando como centro operativo del norte de Bogotá con punto de venta en sitio.'),
	(2, 'Sede 5 (Toberín)', 'Sistematización', '2024-12-26', 'Inicio oficial de facturación desde el sistema Siesa Enterprise a nombre de Pollo Fiesta S.A.'),
	(3, 'PDV Kennedy', 'Reubicación', NULL, 'Reubicación estratégica del punto de venta en el barrio Kennedy para mejorar presencia comercial.'),
	(4, 'PDV Visión Colombia', 'Transformación Comercial', NULL, 'Fortalecimiento del punto de venta: Transición de vender exclusivamente pollo en pie a manejar pollo en canal, consumidor final y amas de casa.');

-- Volcando estructura para tabla erp_pollo_fiesta.mkt_iniciativas_comerciales
CREATE TABLE IF NOT EXISTS `mkt_iniciativas_comerciales` (
  `id_iniciativa` int(11) NOT NULL AUTO_INCREMENT,
  `categoria` varchar(50) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  PRIMARY KEY (`id_iniciativa`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.mkt_iniciativas_comerciales: ~4 rows (aproximadamente)
INSERT INTO `mkt_iniciativas_comerciales` (`id_iniciativa`, `categoria`, `descripcion`) VALUES
	(1, 'Apertura', 'Apertura de Sede 5 (Toberín) el 21-Dic-2024. Inicio de facturación 26-Dic-2024.'),
	(2, 'Reubicación', 'Reubicación PDV Barrio Kennedy.'),
	(3, 'Estrategia', 'Visión Colombia: Evolución de venta de pollo en pie a comercialización de canal para consumidor final.'),
	(4, 'Pauta Publicitaria', 'Pautas 360: City TV, Red Más Noticias, Tour de Francia, Vuelta a España y diario El Tiempo.');

-- Volcando estructura para tabla erp_pollo_fiesta.ope_equipos_ofensores
CREATE TABLE IF NOT EXISTS `ope_equipos_ofensores` (
  `id_equipo` int(11) NOT NULL AUTO_INCREMENT,
  `anio` int(11) NOT NULL DEFAULT 2025,
  `nombre_equipo` varchar(150) NOT NULL,
  `horas_paro` decimal(10,2) NOT NULL,
  `cantidad_novedades` int(11) NOT NULL,
  `impacto_oee` varchar(100) NOT NULL,
  `accion_mitigacion` text DEFAULT NULL,
  PRIMARY KEY (`id_equipo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.ope_equipos_ofensores: ~5 rows (aproximadamente)
INSERT INTO `ope_equipos_ofensores` (`id_equipo`, `anio`, `nombre_equipo`, `horas_paro`, `cantidad_novedades`, `impacto_oee`, `accion_mitigacion`) VALUES
	(1, 2025, 'Línea de Descargue', 17.32, 22, 'Crítico (17% del tiempo total)', 'Se realizó un overhaul mecánico y eléctrico dando buenos resultados.'),
	(2, 2025, 'Zona de Máquinas y Calderas', 14.15, 23, 'Muy Alto (14% del tiempo total)', 'Se logró estabilizar aplicando mantenimiento preventivo e inspecciones periódicas.'),
	(3, 2025, 'Transferidor', 10.47, 42, 'Frecuencia Alarmante (42 eventos)', 'Fue puntual luego del cambio de la línea de descargue; reparaciones más largas.'),
	(4, 2025, 'Línea de Selección Linco', 9.70, 17, 'Alto (9% del tiempo total)', 'Se cambió cadena y accesorios importantes.'),
	(5, 2025, 'Desplumadora #1 (ITA)', 6.78, 20, 'Moderado-Alto (7% del tiempo total)', 'Se debe priorizar inspecciones y recambios más frecuentes en bocines y dedos.');

-- Volcando estructura para tabla erp_pollo_fiesta.ope_kpi_mantenimiento
CREATE TABLE IF NOT EXISTS `ope_kpi_mantenimiento` (
  `id_kpi` int(11) NOT NULL AUTO_INCREMENT,
  `indicador` varchar(50) NOT NULL,
  `unidad_medida` varchar(20) NOT NULL,
  `valor_2024` decimal(10,2) NOT NULL,
  `valor_2025` decimal(10,2) NOT NULL,
  `observaciones` text DEFAULT NULL,
  PRIMARY KEY (`id_kpi`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.ope_kpi_mantenimiento: ~4 rows (aproximadamente)
INSERT INTO `ope_kpi_mantenimiento` (`id_kpi`, `indicador`, `unidad_medida`, `valor_2024`, `valor_2025`, `observaciones`) VALUES
	(1, 'Disponibilidad Mantenimiento', 'Porcentaje (%)', 97.00, 95.70, 'Picos en Sep (98.75%) y Dic (98.51%). Puntos críticos en Ago (94.77%) y Nov (94.71%).'),
	(2, 'OEE (Eficiencia Global)', 'Porcentaje (%)', 84.00, 86.40, 'Se acumularon 104,30 horas de paro. Promedio supera la meta general del 86%.'),
	(3, 'MTBF (Tiempo entre fallas)', 'Horas', 13.35, 10.42, 'Inestable. Valor más alto en abril (4.16), caída en septiembre a 1.77 (alta frecuencia de intervenciones cortas).'),
	(4, 'MTTR (Tiempo de reparación)', 'Horas', 0.35, 0.47, 'Gestión rápida (promedio < 0.30 hrs). Mayo y octubre (0.37) muestran reparaciones más complejas.');

-- Volcando estructura para tabla erp_pollo_fiesta.ope_kpis_tpm
CREATE TABLE IF NOT EXISTS `ope_kpis_tpm` (
  `indicador` varchar(50) NOT NULL,
  `valor_2024` decimal(10,2) DEFAULT NULL,
  `valor_2025` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`indicador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.ope_kpis_tpm: ~5 rows (aproximadamente)
INSERT INTO `ope_kpis_tpm` (`indicador`, `valor_2024`, `valor_2025`) VALUES
	('Costo Mantenimiento Vehículos ($)', 99999999.99, 99999999.99),
	('Disponibilidad (%)', 97.00, 95.70),
	('MTBF (Horas)', 13.35, 10.42),
	('MTTR (Horas)', 0.35, 0.47),
	('OEE (%)', 84.00, 86.40);

-- Volcando estructura para tabla erp_pollo_fiesta.ope_kpis_tpm_detalle
CREATE TABLE IF NOT EXISTS `ope_kpis_tpm_detalle` (
  `indicador` varchar(50) NOT NULL,
  `valor_2024` decimal(10,2) DEFAULT NULL,
  `valor_2025` decimal(10,2) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  PRIMARY KEY (`indicador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.ope_kpis_tpm_detalle: ~5 rows (aproximadamente)
INSERT INTO `ope_kpis_tpm_detalle` (`indicador`, `valor_2024`, `valor_2025`, `observaciones`) VALUES
	('Disponibilidad mantenimiento (%)', 97.00, 95.70, 'Picos: Sep (98.75%), Dic (98.51%). Críticos: Ago (94.77%), Nov (94.71%). OEE de Nov cayó al 80.1%.'),
	('Mantenimiento Vehículos ($)', 99999999.99, 99999999.99, 'El vehículo SPS-047 fue el costo más alto (abril), daño en sistema hidráulico de dirección y caja.'),
	('MTBF (hrs)', 13.35, 10.42, 'Disminución indica fallas más frecuentes.'),
	('MTTR (hrs)', 0.35, 0.47, 'Aumento indica reparaciones más largas.'),
	('OEE (%)', 84.00, 86.40, '104.30 horas de paro acumuladas. Se superó meta del 86%.');

-- Volcando estructura para tabla erp_pollo_fiesta.ope_mantenimiento_vehiculos
CREATE TABLE IF NOT EXISTS `ope_mantenimiento_vehiculos` (
  `anio` int(11) NOT NULL,
  `costo_pesos` decimal(20,2) NOT NULL,
  `observaciones` text DEFAULT NULL,
  PRIMARY KEY (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.ope_mantenimiento_vehiculos: ~2 rows (aproximadamente)
INSERT INTO `ope_mantenimiento_vehiculos` (`anio`, `costo_pesos`, `observaciones`) VALUES
	(2024, 356022963.00, 'Gasto anual consolidado.'),
	(2025, 189938418.00, 'Reducción de costos (Diciembre aún no contabilizado). Vehículo SPS-047 tuvo el costo más alto en abril por cambio de sistema hidráulico y caja de dirección.');

-- Volcando estructura para tabla erp_pollo_fiesta.ope_novedades_arquitectura
CREATE TABLE IF NOT EXISTS `ope_novedades_arquitectura` (
  `sede` varchar(50) NOT NULL,
  `abierta` int(11) DEFAULT NULL,
  `cerrada` int(11) DEFAULT NULL,
  `total` int(11) DEFAULT NULL,
  `ejecucion_pct` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`sede`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.ope_novedades_arquitectura: ~5 rows (aproximadamente)
INSERT INTO `ope_novedades_arquitectura` (`sede`, `abierta`, `cerrada`, `total`, `ejecucion_pct`) VALUES
	('PLANTA DE BENEFICIO', 42, 175, 217, 81.00),
	('SEDE 1', 22, 4, 26, 15.00),
	('SEDE 2', 46, 29, 75, 39.00),
	('SEDE 3', 58, 36, 94, 38.00),
	('SEDE 4', 9, 5, 14, 36.00);

-- Volcando estructura para tabla erp_pollo_fiesta.ope_novedades_infraestructura
CREATE TABLE IF NOT EXISTS `ope_novedades_infraestructura` (
  `id_novedad` int(11) NOT NULL AUTO_INCREMENT,
  `anio` int(11) NOT NULL DEFAULT 2025,
  `categoria` varchar(50) NOT NULL,
  `sede_planta` varchar(100) NOT NULL,
  `tickets_abiertos` int(11) NOT NULL,
  `tickets_cerrados` int(11) NOT NULL,
  `total_tickets` int(11) GENERATED ALWAYS AS (`tickets_abiertos` + `tickets_cerrados`) STORED,
  `ejecucion_pct` decimal(5,2) GENERATED ALWAYS AS (`tickets_cerrados` / (`tickets_abiertos` + `tickets_cerrados`) * 100) STORED,
  PRIMARY KEY (`id_novedad`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.ope_novedades_infraestructura: ~10 rows (aproximadamente)
INSERT INTO `ope_novedades_infraestructura` (`id_novedad`, `anio`, `categoria`, `sede_planta`, `tickets_abiertos`, `tickets_cerrados`) VALUES
	(1, 2025, 'Arquitectura', 'PLANTA DE BENEFICIO', 42, 175),
	(2, 2025, 'Arquitectura', 'SEDE 1', 22, 4),
	(3, 2025, 'Arquitectura', 'SEDE 2', 46, 29),
	(4, 2025, 'Arquitectura', 'SEDE 3', 58, 36),
	(5, 2025, 'Arquitectura', 'SEDE 4', 9, 5),
	(6, 2025, 'Mantenimiento', 'PLANTA DE BENEFICIO', 13, 145),
	(7, 2025, 'Mantenimiento', 'SEDE 1', 3, 17),
	(8, 2025, 'Mantenimiento', 'SEDE 2', 37, 70),
	(9, 2025, 'Mantenimiento', 'SEDE 3', 5, 70),
	(10, 2025, 'Mantenimiento', 'SEDE 4', 2, 13);

-- Volcando estructura para tabla erp_pollo_fiesta.ope_ordenes_trabajo_mensual
CREATE TABLE IF NOT EXISTS `ope_ordenes_trabajo_mensual` (
  `id_ot` int(11) NOT NULL AUTO_INCREMENT,
  `anio` int(11) NOT NULL DEFAULT 2025,
  `mes_nombre` varchar(20) NOT NULL,
  `ot_correctivas` int(11) NOT NULL,
  `ot_preventivas` int(11) NOT NULL,
  `total_ot` int(11) GENERATED ALWAYS AS (`ot_correctivas` + `ot_preventivas`) STORED,
  `pct_correctivas` decimal(5,2) GENERATED ALWAYS AS (`ot_correctivas` / (`ot_correctivas` + `ot_preventivas`) * 100) STORED,
  PRIMARY KEY (`id_ot`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.ope_ordenes_trabajo_mensual: ~12 rows (aproximadamente)
INSERT INTO `ope_ordenes_trabajo_mensual` (`id_ot`, `anio`, `mes_nombre`, `ot_correctivas`, `ot_preventivas`) VALUES
	(1, 2025, 'ENERO', 24, 43),
	(2, 2025, 'FEBRERO', 26, 75),
	(3, 2025, 'MARZO', 44, 142),
	(4, 2025, 'ABRIL', 21, 195),
	(5, 2025, 'MAYO', 37, 265),
	(6, 2025, 'JUNIO', 22, 485),
	(7, 2025, 'JULIO', 80, 405),
	(8, 2025, 'AGOSTO', 61, 174),
	(9, 2025, 'SEPTIEMBRE', 52, 327),
	(10, 2025, 'OCTUBRE', 20, 257),
	(11, 2025, 'NOVIEMBRE', 9, 291),
	(12, 2025, 'DICIEMBRE', 7, 339);

-- Volcando estructura para tabla erp_pollo_fiesta.ope_tickets_novedades
CREATE TABLE IF NOT EXISTS `ope_tickets_novedades` (
  `id_ticket` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_novedad` varchar(50) DEFAULT NULL,
  `sede` varchar(50) DEFAULT NULL,
  `abiertos` int(11) DEFAULT NULL,
  `cerrados` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_ticket`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.ope_tickets_novedades: ~6 rows (aproximadamente)
INSERT INTO `ope_tickets_novedades` (`id_ticket`, `tipo_novedad`, `sede`, `abiertos`, `cerrados`) VALUES
	(1, 'Arquitectura', 'PLANTA DE BENEFICIO', 42, 175),
	(2, 'Arquitectura', 'SEDE 1', 22, 4),
	(3, 'Arquitectura', 'SEDE 2', 46, 29),
	(4, 'Arquitectura', 'SEDE 3', 58, 36),
	(5, 'Arquitectura', 'SEDE 4', 9, 5),
	(6, 'Mantenimiento', 'PLANTA DE BENEFICIO', 13, 145);

-- Volcando estructura para tabla erp_pollo_fiesta.pb_aves_beneficiadas
CREATE TABLE IF NOT EXISTS `pb_aves_beneficiadas` (
  `id_registro` int(11) NOT NULL AUTO_INCREMENT,
  `anio` int(11) NOT NULL,
  `mes_nombre` varchar(15) NOT NULL,
  `cantidad_aves` int(11) NOT NULL,
  PRIMARY KEY (`id_registro`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.pb_aves_beneficiadas: ~24 rows (aproximadamente)
INSERT INTO `pb_aves_beneficiadas` (`id_registro`, `anio`, `mes_nombre`, `cantidad_aves`) VALUES
	(1, 2024, 'ene', 1381940),
	(2, 2024, 'feb', 1497420),
	(3, 2024, 'mar', 1514470),
	(4, 2024, 'abr', 1565990),
	(5, 2024, 'may', 1460260),
	(6, 2024, 'jun', 1474570),
	(7, 2024, 'jul', 1381820),
	(8, 2024, 'ago', 1502890),
	(9, 2024, 'sep', 1398310),
	(10, 2024, 'oct', 1736570),
	(11, 2024, 'nov', 1526970),
	(12, 2024, 'dic', 1441070),
	(13, 2025, 'ene', 1138590),
	(14, 2025, 'feb', 987813),
	(15, 2025, 'mar', 1503670),
	(16, 2025, 'abr', 1461700),
	(17, 2025, 'may', 1743130),
	(18, 2025, 'jun', 1536490),
	(19, 2025, 'jul', 1455100),
	(20, 2025, 'ago', 1587210),
	(21, 2025, 'sep', 1417860),
	(22, 2025, 'oct', 1844070),
	(23, 2025, 'nov', 1663280),
	(24, 2025, 'dic', 1405190);

-- Volcando estructura para tabla erp_pollo_fiesta.pb_aves_mensual
CREATE TABLE IF NOT EXISTS `pb_aves_mensual` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mes` varchar(15) DEFAULT NULL,
  `aves_2024` int(11) DEFAULT NULL,
  `aves_2025` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.pb_aves_mensual: ~12 rows (aproximadamente)
INSERT INTO `pb_aves_mensual` (`id`, `mes`, `aves_2024`, `aves_2025`) VALUES
	(1, 'Enero', 1381940, 1138590),
	(2, 'Febrero', 1497420, 987813),
	(3, 'Marzo', 1514470, 1503670),
	(4, 'Abril', 1565990, 1461700),
	(5, 'Mayo', 1460260, 1743130),
	(6, 'Junio', 1474570, 1536490),
	(7, 'Julio', 1381820, 1455100),
	(8, 'Agosto', 1502890, 1587210),
	(9, 'Septiembre', 1398310, 1417860),
	(10, 'Octubre', 1736570, 1844070),
	(11, 'Noviembre', 1526970, 1663280),
	(12, 'Diciembre', 1441070, 1405190);

-- Volcando estructura para tabla erp_pollo_fiesta.pb_aves_procesadas_mensual
CREATE TABLE IF NOT EXISTS `pb_aves_procesadas_mensual` (
  `id_registro` int(11) NOT NULL AUTO_INCREMENT,
  `mes` varchar(15) NOT NULL,
  `aves_2024` int(11) NOT NULL,
  `aves_2025` int(11) NOT NULL,
  PRIMARY KEY (`id_registro`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.pb_aves_procesadas_mensual: ~12 rows (aproximadamente)
INSERT INTO `pb_aves_procesadas_mensual` (`id_registro`, `mes`, `aves_2024`, `aves_2025`) VALUES
	(1, 'Enero', 1381940, 1138590),
	(2, 'Febrero', 1497420, 987813),
	(3, 'Marzo', 1514470, 1503670),
	(4, 'Abril', 1565990, 1461700),
	(5, 'Mayo', 1460260, 1743130),
	(6, 'Junio', 1474570, 1536490),
	(7, 'Julio', 1381820, 1455100),
	(8, 'Agosto', 1502890, 1587210),
	(9, 'Septiembre', 1398310, 1417860),
	(10, 'Octubre', 1736570, 1844070),
	(11, 'Noviembre', 1526970, 1663280),
	(12, 'Diciembre', 1441070, 1405190);

-- Volcando estructura para tabla erp_pollo_fiesta.pb_decomisos_menores
CREATE TABLE IF NOT EXISTS `pb_decomisos_menores` (
  `producto` varchar(50) NOT NULL,
  `kilos_2024` decimal(10,2) DEFAULT NULL,
  `kilos_2025` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.pb_decomisos_menores: ~3 rows (aproximadamente)
INSERT INTO `pb_decomisos_menores` (`producto`, `kilos_2024`, `kilos_2025`) VALUES
	('Higado', 72579.00, 62799.00),
	('Pierna Pernil', 2671.35, 5866.15),
	('Piernas', 3025.20, 2605.95);

-- Volcando estructura para tabla erp_pollo_fiesta.pb_descartes_detallado
CREATE TABLE IF NOT EXISTS `pb_descartes_detallado` (
  `concepto` varchar(100) NOT NULL,
  `kilos_2024` decimal(15,2) DEFAULT NULL,
  `kilos_2025` decimal(15,2) DEFAULT NULL,
  `variacion_pct` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`concepto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.pb_descartes_detallado: ~8 rows (aproximadamente)
INSERT INTO `pb_descartes_detallado` (`concepto`, `kilos_2024`, `kilos_2025`, `variacion_pct`) VALUES
	('AHOGADAS', 120230.00, 78088.00, -35.10),
	('AVES DESCARTADAS POR GRANJA', 116105.30, 176136.30, 51.70),
	('CANALES DECOMISADOS PARCIALMENTE', 5875.30, 6972.70, NULL),
	('CONTAMINACIÓN ESTOMACAL/BILIAR/FECAL', 7458.40, 6391.90, NULL),
	('HIGADO', 72579.00, 62799.00, NULL),
	('PATAS', 230243.00, 284379.00, 23.50),
	('PIERNA PERNIL', 2671.35, 5866.15, NULL),
	('PIERNAS', 3025.20, 2605.95, NULL);

-- Volcando estructura para tabla erp_pollo_fiesta.pb_descartes_detalle
CREATE TABLE IF NOT EXISTS `pb_descartes_detalle` (
  `id_descarte` int(11) NOT NULL AUTO_INCREMENT,
  `concepto` varchar(100) DEFAULT NULL,
  `kilos_2024` decimal(15,2) DEFAULT NULL,
  `kilos_2025` decimal(15,2) DEFAULT NULL,
  PRIMARY KEY (`id_descarte`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.pb_descartes_detalle: ~6 rows (aproximadamente)
INSERT INTO `pb_descartes_detalle` (`id_descarte`, `concepto`, `kilos_2024`, `kilos_2025`) VALUES
	(1, 'AHOGADAS', 120229.50, 78087.84),
	(2, 'AVES DESCARTADAS POR GRANJA', 116105.33, 176136.30),
	(3, 'HIGADO', 72579.00, 62799.00),
	(4, 'PATAS', 230243.00, 284379.00),
	(5, 'PIERNA PERNIL', 2671.35, 5866.15),
	(6, 'PIERNAS', 3025.20, 2605.95);

-- Volcando estructura para tabla erp_pollo_fiesta.pb_descartes_kilos
CREATE TABLE IF NOT EXISTS `pb_descartes_kilos` (
  `id_descarte` int(11) NOT NULL AUTO_INCREMENT,
  `anio` int(11) NOT NULL,
  `categoria_descarte` varchar(100) NOT NULL,
  `kilos_descartados` decimal(15,4) NOT NULL,
  PRIMARY KEY (`id_descarte`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.pb_descartes_kilos: ~16 rows (aproximadamente)
INSERT INTO `pb_descartes_kilos` (`id_descarte`, `anio`, `categoria_descarte`, `kilos_descartados`) VALUES
	(1, 2024, 'AHOGADAS', 120229.5000),
	(2, 2025, 'AHOGADAS', 78087.8410),
	(3, 2024, 'AVES DESCARTADAS POR GRANJA', 116105.3366),
	(4, 2025, 'AVES DESCARTADAS POR GRANJA', 176136.3026),
	(5, 2024, 'AVES DESCARTADAS POR PLANTA', 15307.9802),
	(6, 2025, 'AVES DESCARTADAS POR PLANTA', 8399.1170),
	(7, 2024, 'COMIDA EN BUCHE', 7458.4000),
	(8, 2025, 'COMIDA EN BUCHE', 6391.9000),
	(9, 2024, 'HIGADO', 72579.0000),
	(10, 2025, 'HIGADO', 62799.0000),
	(11, 2024, 'PATAS', 230243.0000),
	(12, 2025, 'PATAS', 284379.0000),
	(13, 2024, 'PIERNA PERNIL', 2671.3500),
	(14, 2025, 'PIERNA PERNIL', 5866.1500),
	(15, 2024, 'PIERNAS', 3025.2000),
	(16, 2025, 'PIERNAS', 2605.9500);

-- Volcando estructura para tabla erp_pollo_fiesta.pb_participacion_canal
CREATE TABLE IF NOT EXISTS `pb_participacion_canal` (
  `anio` int(11) NOT NULL,
  `pct_canal` decimal(5,2) DEFAULT NULL,
  `pct_viscera` decimal(5,2) DEFAULT NULL,
  `pct_merma` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.pb_participacion_canal: ~4 rows (aproximadamente)
INSERT INTO `pb_participacion_canal` (`anio`, `pct_canal`, `pct_viscera`, `pct_merma`) VALUES
	(2021, 80.14, 12.57, 7.29),
	(2023, 79.91, 12.27, 7.82),
	(2024, 81.34, 12.11, 6.55),
	(2025, 82.19, 12.49, 5.38);

-- Volcando estructura para tabla erp_pollo_fiesta.pb_participacion_rangos
CREATE TABLE IF NOT EXISTS `pb_participacion_rangos` (
  `anio` int(11) NOT NULL,
  `rango_gramos` varchar(50) NOT NULL,
  `porcentaje_participacion` decimal(5,2) NOT NULL,
  PRIMARY KEY (`anio`,`rango_gramos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.pb_participacion_rangos: ~6 rows (aproximadamente)
INSERT INTO `pb_participacion_rangos` (`anio`, `rango_gramos`, `porcentaje_participacion`) VALUES
	(2024, '1378-1816', 50.95),
	(2024, '1817-1928', 36.74),
	(2024, '570-1377', 11.84),
	(2025, '1378-1816', 49.42),
	(2025, '1817-1928', 37.43),
	(2025, '570-1377', 10.16);

-- Volcando estructura para tabla erp_pollo_fiesta.pb_promedio_pesos
CREATE TABLE IF NOT EXISTS `pb_promedio_pesos` (
  `id_promedio` int(11) NOT NULL AUTO_INCREMENT,
  `anio` int(11) NOT NULL,
  `mes_nombre` varchar(15) NOT NULL,
  `peso_promedio_gramos` int(11) NOT NULL,
  PRIMARY KEY (`id_promedio`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.pb_promedio_pesos: ~24 rows (aproximadamente)
INSERT INTO `pb_promedio_pesos` (`id_promedio`, `anio`, `mes_nombre`, `peso_promedio_gramos`) VALUES
	(1, 2024, 'ene', 1981),
	(2, 2024, 'feb', 1973),
	(3, 2024, 'mar', 1994),
	(4, 2024, 'abr', 1883),
	(5, 2024, 'may', 2013),
	(6, 2024, 'jun', 2018),
	(7, 2024, 'jul', 2021),
	(8, 2024, 'ago', 1981),
	(9, 2024, 'sep', 1967),
	(10, 2024, 'oct', 2016),
	(11, 2024, 'nov', 2011),
	(12, 2024, 'dic', 1937),
	(13, 2025, 'ene', 1954),
	(14, 2025, 'feb', 2023),
	(15, 2025, 'mar', 2006),
	(16, 2025, 'abr', 1991),
	(17, 2025, 'may', 2013),
	(18, 2025, 'jun', 1995),
	(19, 2025, 'jul', 1993),
	(20, 2025, 'ago', 1993),
	(21, 2025, 'sep', 1980),
	(22, 2025, 'oct', 1971),
	(23, 2025, 'nov', 1966),
	(24, 2025, 'dic', 1959);

-- Volcando estructura para tabla erp_pollo_fiesta.pb_rendimiento_canal
CREATE TABLE IF NOT EXISTS `pb_rendimiento_canal` (
  `anio` int(11) NOT NULL,
  `participacion_canal_pct` decimal(5,2) NOT NULL,
  `participacion_viscera_pct` decimal(5,2) NOT NULL,
  `merma_planta_pct` decimal(5,2) NOT NULL,
  `caliente_seco_pct` decimal(5,2) NOT NULL,
  `hidratacion_pct` decimal(5,2) NOT NULL,
  `total_canal_viscera_pct` decimal(5,2) NOT NULL,
  PRIMARY KEY (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.pb_rendimiento_canal: ~5 rows (aproximadamente)
INSERT INTO `pb_rendimiento_canal` (`anio`, `participacion_canal_pct`, `participacion_viscera_pct`, `merma_planta_pct`, `caliente_seco_pct`, `hidratacion_pct`, `total_canal_viscera_pct`) VALUES
	(2021, 80.14, 12.57, 7.29, 72.00, 8.14, 92.71),
	(2022, 79.32, 12.53, 8.15, 72.00, 7.32, 91.85),
	(2023, 79.91, 12.27, 7.82, 72.10, 7.77, 92.18),
	(2024, 81.34, 12.11, 6.55, 72.50, 8.86, 93.45),
	(2025, 82.19, 12.49, 5.38, 71.86, 10.27, 94.68);

-- Volcando estructura para tabla erp_pollo_fiesta.pre_ejecucion_trimestral
CREATE TABLE IF NOT EXISTS `pre_ejecucion_trimestral` (
  `id_ejecucion` int(11) NOT NULL AUTO_INCREMENT,
  `categoria_negocio` varchar(50) NOT NULL,
  `tipo_metrica` varchar(20) NOT NULL,
  `q1_valor` int(11) NOT NULL,
  `q2_valor` int(11) NOT NULL,
  `q3_valor` int(11) NOT NULL,
  `q4_valor` int(11) NOT NULL,
  `total_anual` int(11) GENERATED ALWAYS AS (`q1_valor` + `q2_valor` + `q3_valor` + `q4_valor`) STORED,
  PRIMARY KEY (`id_ejecucion`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.pre_ejecucion_trimestral: ~8 rows (aproximadamente)
INSERT INTO `pre_ejecucion_trimestral` (`id_ejecucion`, `categoria_negocio`, `tipo_metrica`, `q1_valor`, `q2_valor`, `q3_valor`, `q4_valor`) VALUES
	(1, 'TOTAL PF', 'Real 2024', 6734448, 7026825, 6881796, 7560474),
	(2, 'TOTAL PF', 'Ppto 2024', 6987899, 7622916, 7410998, 8113600),
	(3, 'TOTAL PF', 'Real 2023', 6971748, 7073246, 7408003, 7538839),
	(4, 'TOTAL PF', 'Real 2022', 7247575, 8039176, 7959641, 7755396),
	(5, 'MAYORISTA', 'Real 2024', 2980989, 3136864, 3225507, 3622933),
	(6, 'MAYORISTA', 'Ppto 2024', 2924899, 3475916, 3492037, 3783600),
	(7, 'MAYORISTA', 'Real 2023', 2749116, 2798473, 3319781, 3500124),
	(8, 'MAYORISTA', 'Real 2022', 3256899, 3782378, 3642292, 3246831);

-- Volcando estructura para tabla erp_pollo_fiesta.pre_ejecucion_trimestral_detalle
CREATE TABLE IF NOT EXISTS `pre_ejecucion_trimestral_detalle` (
  `tipo` varchar(50) DEFAULT NULL,
  `trimestre_1` int(11) DEFAULT NULL,
  `trimestre_2` int(11) DEFAULT NULL,
  `trimestre_3` int(11) DEFAULT NULL,
  `trimestre_4` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.pre_ejecucion_trimestral_detalle: ~2 rows (aproximadamente)
INSERT INTO `pre_ejecucion_trimestral_detalle` (`tipo`, `trimestre_1`, `trimestre_2`, `trimestre_3`, `trimestre_4`) VALUES
	('TOTAL PF Real 2024', 6734448, 7026825, 6881796, 7560474),
	('TOTAL PF Ppto 2024', 6987899, 7622916, 7410998, 8113600);

-- Volcando estructura para tabla erp_pollo_fiesta.pre_impuestos_tributacion
CREATE TABLE IF NOT EXISTS `pre_impuestos_tributacion` (
  `id_impuesto` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_impuesto` varchar(100) DEFAULT NULL,
  `anio_aplicacion` varchar(50) DEFAULT NULL,
  `tasa_aplicada_pct` decimal(5,2) DEFAULT NULL,
  `notas` text DEFAULT NULL,
  PRIMARY KEY (`id_impuesto`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.pre_impuestos_tributacion: ~4 rows (aproximadamente)
INSERT INTO `pre_impuestos_tributacion` (`id_impuesto`, `tipo_impuesto`, `anio_aplicacion`, `tasa_aplicada_pct`, `notas`) VALUES
	(1, 'Impuesto Saludable (Ultraprocesados)', '2023', 10.00, 'Alimentos y bebidas ultraprocesadas/azucaradas'),
	(2, 'Impuesto Saludable (Ultraprocesados)', '2024', 15.00, 'Alimentos y bebidas ultraprocesadas/azucaradas'),
	(3, 'Impuesto Saludable (Ultraprocesados)', '2025 y siguientes', 20.00, 'Tarifa máxima establecida'),
	(4, 'Tasa de Tributación Depurada (TTD)', 'General', 15.00, 'Pollo Fiesta incrementó tributación en un 36% vs 2023 según Artículo 240 Parágrafo 6');

-- Volcando estructura para tabla erp_pollo_fiesta.pre_indicadores_adicionales
CREATE TABLE IF NOT EXISTS `pre_indicadores_adicionales` (
  `anio` int(11) NOT NULL,
  `mortalidad_granjas_pct` decimal(5,2) DEFAULT NULL,
  `incremento_tributacion_pct` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.pre_indicadores_adicionales: ~2 rows (aproximadamente)
INSERT INTO `pre_indicadores_adicionales` (`anio`, `mortalidad_granjas_pct`, `incremento_tributacion_pct`) VALUES
	(2023, 11.59, NULL),
	(2024, 10.47, 36.00);

-- Volcando estructura para tabla erp_pollo_fiesta.pre_indicadores_operativos
CREATE TABLE IF NOT EXISTS `pre_indicadores_operativos` (
  `anio` int(11) NOT NULL,
  `mortalidad_general_pct` decimal(5,2) NOT NULL,
  `variacion_volumen_comercial_pct` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.pre_indicadores_operativos: ~2 rows (aproximadamente)
INSERT INTO `pre_indicadores_operativos` (`anio`, `mortalidad_general_pct`, `variacion_volumen_comercial_pct`) VALUES
	(2023, 11.59, NULL),
	(2024, 10.47, -6.41);

-- Volcando estructura para tabla erp_pollo_fiesta.pre_presupuesto_caja
CREATE TABLE IF NOT EXISTS `pre_presupuesto_caja` (
  `anio` int(11) NOT NULL,
  `efectivo_equivalentes_millones` decimal(15,2) NOT NULL,
  `crecimiento_vs_anterior_pct` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.pre_presupuesto_caja: ~2 rows (aproximadamente)
INSERT INTO `pre_presupuesto_caja` (`anio`, `efectivo_equivalentes_millones`, `crecimiento_vs_anterior_pct`) VALUES
	(2023, 10959.00, NULL),
	(2024, 48627.00, 344.00);

-- Volcando estructura para tabla erp_pollo_fiesta.pre_variables_entorno
CREATE TABLE IF NOT EXISTS `pre_variables_entorno` (
  `anio` int(11) NOT NULL,
  `inflacion_nacional_pct` decimal(5,2) DEFAULT NULL,
  `impuesto_ultraprocesados_pct` decimal(5,2) DEFAULT NULL,
  `tasa_minima_tributacion_pct` decimal(5,2) DEFAULT 15.00,
  `observaciones` text DEFAULT NULL,
  PRIMARY KEY (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.pre_variables_entorno: ~3 rows (aproximadamente)
INSERT INTO `pre_variables_entorno` (`anio`, `inflacion_nacional_pct`, `impuesto_ultraprocesados_pct`, `tasa_minima_tributacion_pct`, `observaciones`) VALUES
	(2023, 9.20, 10.00, 15.00, 'Entrada gradual del impuesto a alimentos ultraprocesados/azucarados.'),
	(2024, 5.20, 15.00, 15.00, 'Aumento de 36% en la tasa de tributación respecto al 2023 por la TTD y reformas.'),
	(2025, NULL, 20.00, 15.00, 'Tarifa plena aplicable a bebidas y alimentos ultraprocesados.');

-- Volcando estructura para tabla erp_pollo_fiesta.pre_variables_macro
CREATE TABLE IF NOT EXISTS `pre_variables_macro` (
  `anio` int(11) NOT NULL,
  `inflacion_pct` decimal(5,2) DEFAULT NULL,
  `mortalidad_granjas_pct` decimal(5,2) DEFAULT NULL,
  `presupuesto_caja_mm` decimal(15,2) DEFAULT NULL,
  PRIMARY KEY (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.pre_variables_macro: ~2 rows (aproximadamente)
INSERT INTO `pre_variables_macro` (`anio`, `inflacion_pct`, `mortalidad_granjas_pct`, `presupuesto_caja_mm`) VALUES
	(2023, 9.20, 11.59, 10959.00),
	(2024, 5.20, 10.47, 48627.00);

-- Volcando estructura para tabla erp_pollo_fiesta.prod_capacidad_clima
CREATE TABLE IF NOT EXISTS `prod_capacidad_clima` (
  `anio` int(11) NOT NULL,
  `zona_climatica` enum('FRIO','CALIDO','CALIENTE') NOT NULL,
  `mts_total_calculado` int(11) NOT NULL,
  `aves_total_calculado` int(11) NOT NULL,
  `pct_participacion_calculado` decimal(6,2) NOT NULL,
  `aves_reportado_texto` int(11) DEFAULT NULL,
  `pct_reportado_texto` decimal(6,2) DEFAULT NULL,
  `fuente_calculo` varchar(60) NOT NULL DEFAULT 'prod_granjas',
  `fuente_texto` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`anio`,`zona_climatica`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.prod_capacidad_clima: ~3 rows (aproximadamente)
INSERT INTO `prod_capacidad_clima` (`anio`, `zona_climatica`, `mts_total_calculado`, `aves_total_calculado`, `pct_participacion_calculado`, `aves_reportado_texto`, `pct_reportado_texto`, `fuente_calculo`, `fuente_texto`) VALUES
	(2025, 'FRIO', 198491, 3459000, 77.82, 3459000, 77.82, 'prod_granjas', NULL),
	(2025, 'CALIDO', 49739, 738000, 16.60, 740000, 16.60, 'prod_granjas', NULL),
	(2025, 'CALIENTE', 22188, 248000, 5.58, 248000, 5.58, 'prod_granjas', NULL);

-- Volcando estructura para tabla erp_pollo_fiesta.prod_encasetamiento
CREATE TABLE IF NOT EXISTS `prod_encasetamiento` (
  `id_encasetamiento` int(11) NOT NULL AUTO_INCREMENT,
  `anio` int(11) NOT NULL,
  `mes` tinyint(4) NOT NULL,
  `valor_programado` int(11) NOT NULL,
  `valor_real` int(11) NOT NULL,
  PRIMARY KEY (`id_encasetamiento`),
  UNIQUE KEY `uq_encasetamiento` (`anio`,`mes`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.prod_encasetamiento: ~24 rows (aproximadamente)
INSERT INTO `prod_encasetamiento` (`id_encasetamiento`, `anio`, `mes`, `valor_programado`, `valor_real`) VALUES
	(1, 2024, 1, 2701500, 2571400),
	(2, 2024, 2, 2529000, 2528300),
	(3, 2024, 3, 2687200, 2645200),
	(4, 2024, 4, 2534000, 2532600),
	(5, 2024, 5, 2901300, 2897700),
	(6, 2024, 6, 2644000, 2681600),
	(7, 2024, 7, 2648400, 2426400),
	(8, 2024, 8, 2918800, 2808100),
	(9, 2024, 9, 2539500, 2533100),
	(10, 2024, 10, 3016100, 2989200),
	(11, 2024, 11, 2820600, 2820300),
	(12, 2024, 12, 2746100, 2944300),
	(13, 2025, 1, 2709400, 2709400),
	(14, 2025, 2, 2351600, 2350600),
	(15, 2025, 3, 2640400, 2640400),
	(16, 2025, 4, 2649600, 2649400),
	(17, 2025, 5, 2766400, 2702800),
	(18, 2025, 6, 2561200, 2560700),
	(19, 2025, 7, 2788000, 2768900),
	(20, 2025, 8, 2704800, 2703500),
	(21, 2025, 9, 2664000, 2663900),
	(22, 2025, 10, 2976800, 3006800),
	(23, 2025, 11, 2760600, 2832600),
	(24, 2025, 12, 2676300, 2676200);

-- Volcando estructura para tabla erp_pollo_fiesta.prod_encasetamiento_anual
CREATE TABLE IF NOT EXISTS `prod_encasetamiento_anual` (
  `anio` int(11) NOT NULL,
  `programado_total_calculado` int(11) NOT NULL,
  `real_total_calculado` int(11) NOT NULL,
  `diferencia_calculada` int(11) NOT NULL,
  `variacion_pct_calculada` decimal(6,2) NOT NULL,
  `programado_total_reportado` int(11) DEFAULT NULL,
  `real_total_reportado` int(11) DEFAULT NULL,
  `variacion_pct_reportada` decimal(6,2) DEFAULT NULL,
  `fuente_calculo` varchar(60) NOT NULL DEFAULT 'prod_encasetamiento',
  `fuente_texto` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.prod_encasetamiento_anual: ~2 rows (aproximadamente)
INSERT INTO `prod_encasetamiento_anual` (`anio`, `programado_total_calculado`, `real_total_calculado`, `diferencia_calculada`, `variacion_pct_calculada`, `programado_total_reportado`, `real_total_reportado`, `variacion_pct_reportada`, `fuente_calculo`, `fuente_texto`) VALUES
	(2024, 32686500, 32378200, -308300, -0.94, 32686000, 32378000, -0.94, 'prod_encasetamiento', 'INFORME DE GESTIÓN 2025- 2024 ide.docx'),
	(2025, 32249100, 32265200, 16100, 0.05, 32249000, 32265000, 0.04, 'prod_encasetamiento', 'INFORME DE GESTIÓN 2025- 2024 ide.docx');

-- Volcando estructura para tabla erp_pollo_fiesta.prod_equipo_produccion
CREATE TABLE IF NOT EXISTS `prod_equipo_produccion` (
  `id_equipo` int(11) NOT NULL AUTO_INCREMENT,
  `anio` int(11) NOT NULL,
  `linea` enum('ENGORDE','POSTURA') NOT NULL,
  `gerente` varchar(120) NOT NULL,
  `director` varchar(120) DEFAULT NULL,
  `apoyo` varchar(120) DEFAULT NULL,
  `profesionales_campo` int(11) DEFAULT NULL,
  `total_personas` int(11) DEFAULT NULL,
  `granjas_capacidad_instalada` int(11) DEFAULT NULL,
  `notas` text DEFAULT NULL,
  PRIMARY KEY (`id_equipo`),
  UNIQUE KEY `uq_equipo_anio_linea` (`anio`,`linea`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.prod_equipo_produccion: ~2 rows (aproximadamente)
INSERT INTO `prod_equipo_produccion` (`id_equipo`, `anio`, `linea`, `gerente`, `director`, `apoyo`, `profesionales_campo`, `total_personas`, `granjas_capacidad_instalada`, `notas`) VALUES
	(1, 2025, 'ENGORDE', 'Dr. Alex Leopoldo Garcia', 'Dr. Juan Manuel Ibañez', NULL, 6, 7, 33, 'Capacidad instalada de granjas de pollo de engorde sin integrado. Granjas cercanas a Bogotá, distribuidas en 3 zonas climáticas.'),
	(2, 2025, 'POSTURA', 'Dr. Alex García', NULL, 'Dr. Francisco Javier Monsalve', NULL, NULL, NULL, 'Procesos 2025 reflejan persistencia de parámetros zootécnicos y productivos para optimizar y mantener costo competitivo frente al mercado local.');

-- Volcando estructura para tabla erp_pollo_fiesta.prod_granjas
CREATE TABLE IF NOT EXISTS `prod_granjas` (
  `id_granja` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_granja` varchar(100) NOT NULL,
  `linea` enum('ENGORDE','POSTURA') NOT NULL DEFAULT 'ENGORDE',
  `zona_climatica` enum('FRIO','CALIDO','CALIENTE') NOT NULL,
  `metros_cuadrados` int(11) NOT NULL,
  `capacidad_aves` int(11) NOT NULL,
  PRIMARY KEY (`id_granja`),
  UNIQUE KEY `uq_granja_linea` (`nombre_granja`,`linea`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.prod_granjas: ~33 rows (aproximadamente)
INSERT INTO `prod_granjas` (`id_granja`, `nombre_granja`, `linea`, `zona_climatica`, `metros_cuadrados`, `capacidad_aves`) VALUES
	(1, 'B.AIRES', 'ENGORDE', 'FRIO', 3435, 62000),
	(2, 'EL ARROYO', 'ENGORDE', 'FRIO', 11520, 196000),
	(3, 'EL CARMEN', 'ENGORDE', 'FRIO', 8400, 145000),
	(4, 'EL PRADO', 'ENGORDE', 'FRIO', 9600, 174000),
	(5, 'EL SIMON', 'ENGORDE', 'FRIO', 22400, 380000),
	(6, 'LA NEGRA', 'ENGORDE', 'FRIO', 4900, 86000),
	(7, 'OASIS', 'ENGORDE', 'FRIO', 9920, 175000),
	(8, 'OCAMONTE', 'ENGORDE', 'FRIO', 26800, 469000),
	(9, 'PINARES', 'ENGORDE', 'FRIO', 10882, 192000),
	(10, 'PIPON', 'ENGORDE', 'FRIO', 11684, 200000),
	(11, 'S.ANDRES', 'ENGORDE', 'FRIO', 6630, 120000),
	(12, 'S.ANA', 'ENGORDE', 'FRIO', 3478, 60000),
	(13, 'SISGA', 'ENGORDE', 'FRIO', 4551, 82000),
	(14, 'TABACAL', 'ENGORDE', 'FRIO', 13146, 240000),
	(15, 'VALVERDE', 'ENGORDE', 'FRIO', 21200, 350000),
	(16, 'VENUS', 'ENGORDE', 'FRIO', 4323, 78000),
	(17, 'ZIPATOCA', 'ENGORDE', 'FRIO', 25622, 450000),
	(18, 'ESPERANZA', 'ENGORDE', 'CALIDO', 4640, 69000),
	(19, 'GUADUALES', 'ENGORDE', 'CALIDO', 2883, 44000),
	(20, 'LA BLANQUITA', 'ENGORDE', 'CALIDO', 1736, 28000),
	(21, 'LAS AGUAS', 'ENGORDE', 'CALIDO', 4200, 66000),
	(22, 'NARANJOS', 'ENGORDE', 'CALIDO', 2304, 32000),
	(23, 'PROVIDENCIA', 'ENGORDE', 'CALIDO', 7392, 98000),
	(24, 'S.CAYETANO', 'ENGORDE', 'CALIDO', 5302, 75000),
	(25, 'S.FRANCISCO', 'ENGORDE', 'CALIDO', 1589, 24000),
	(26, 'S.ISABEL', 'ENGORDE', 'CALIDO', 2681, 32000),
	(27, 'S.JORGE', 'ENGORDE', 'CALIDO', 6333, 98000),
	(28, 'S.SEBASTIAN', 'ENGORDE', 'CALIDO', 5125, 82000),
	(29, 'V.CONI', 'ENGORDE', 'CALIDO', 5554, 90000),
	(30, 'ANROWS', 'ENGORDE', 'CALIENTE', 1224, 13000),
	(31, 'MARGARITAS', 'ENGORDE', 'CALIENTE', 3740, 45000),
	(32, 'PRADERA', 'ENGORDE', 'CALIENTE', 12815, 152000),
	(33, 'SOLEDAD', 'ENGORDE', 'CALIENTE', 4409, 38000);

-- Volcando estructura para tabla erp_pollo_fiesta.prod_pollo_entregado_anual
CREATE TABLE IF NOT EXISTS `prod_pollo_entregado_anual` (
  `anio` int(11) NOT NULL,
  `programado` int(11) NOT NULL,
  `real_granjas` int(11) NOT NULL,
  `comprado` int(11) NOT NULL,
  `total` int(11) NOT NULL,
  `var_pct` decimal(6,2) DEFAULT NULL,
  `var_unidades_calc` int(11) DEFAULT NULL,
  `var_unidades_reportada` int(11) DEFAULT NULL,
  `notas` text DEFAULT NULL,
  PRIMARY KEY (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.prod_pollo_entregado_anual: ~7 rows (aproximadamente)
INSERT INTO `prod_pollo_entregado_anual` (`anio`, `programado`, `real_granjas`, `comprado`, `total`, `var_pct`, `var_unidades_calc`, `var_unidades_reportada`, `notas`) VALUES
	(2018, 26617724, 26353497, 664575, 27018072, NULL, NULL, NULL, NULL),
	(2019, 27353834, 27201661, 618577, 27820238, 3.00, 802166, NULL, NULL),
	(2020, 27816195, 23666296, 659756, 24326052, -12.50, -3494186, NULL, NULL),
	(2021, 31212400, 28303721, 398578, 28702299, 18.00, 4376247, NULL, NULL),
	(2022, 33632300, 30042350, 582264, 30624614, 6.70, 1922315, NULL, NULL),
	(2023, 30805997, 29171431, 427670, 29599101, -3.30, -1025513, NULL, NULL),
	(2024, 30581067, 28604260, 274229, 28878489, -2.40, -720612, -733456, NULL);

-- Volcando estructura para tabla erp_pollo_fiesta.prod_postura_flujo
CREATE TABLE IF NOT EXISTS `prod_postura_flujo` (
  `id_flujo` int(11) NOT NULL AUTO_INCREMENT,
  `anio` int(11) NOT NULL,
  `municipio_levante` varchar(100) NOT NULL,
  `granja_levante` varchar(100) NOT NULL,
  `semana_salida_productiva` tinyint(4) DEFAULT NULL,
  `granjas_destino_produccion` text DEFAULT NULL,
  `notas` text DEFAULT NULL,
  PRIMARY KEY (`id_flujo`),
  UNIQUE KEY `uq_flujo_anio` (`anio`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.prod_postura_flujo: ~1 rows (aproximadamente)
INSERT INTO `prod_postura_flujo` (`id_flujo`, `anio`, `municipio_levante`, `granja_levante`, `semana_salida_productiva`, `granjas_destino_produccion`, `notas`) VALUES
	(1, 2025, 'El Rosal', 'Granja Vagones', 16, 'S. German, Álamos, Verdum y Eden', 'Levante en El Rosal (Vagones). Sale a producción semana 16 y se traslada a granjas destino; Eden pasó de pollo engorde a postura.');

-- Volcando estructura para tabla erp_pollo_fiesta.prod_postura_resumen_anual
CREATE TABLE IF NOT EXISTS `prod_postura_resumen_anual` (
  `anio` int(11) NOT NULL,
  `aves_en_produccion_cierre` int(11) DEFAULT NULL,
  `huevos_producidos` bigint(20) DEFAULT NULL,
  `var_pct_vs_2024_reportado` decimal(6,2) DEFAULT NULL,
  `huevos_tabla_x_gallina` decimal(10,2) DEFAULT NULL,
  `huevos_real_x_gallina_reportado` decimal(10,2) DEFAULT NULL,
  `mejora_vs_estandar_reportado` decimal(10,2) DEFAULT NULL,
  `huevos_real_x_gallina_calculado` decimal(10,2) DEFAULT NULL,
  `mejora_vs_estandar_calculado` decimal(10,2) DEFAULT NULL,
  `notas` text DEFAULT NULL,
  PRIMARY KEY (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.prod_postura_resumen_anual: ~1 rows (aproximadamente)
INSERT INTO `prod_postura_resumen_anual` (`anio`, `aves_en_produccion_cierre`, `huevos_producidos`, `var_pct_vs_2024_reportado`, `huevos_tabla_x_gallina`, `huevos_real_x_gallina_reportado`, `mejora_vs_estandar_reportado`, `huevos_real_x_gallina_calculado`, `mejora_vs_estandar_calculado`, `notas`) VALUES
	(2025, 1376180, 34894949, 0.84, 24.77, 25.51, 0.74, 25.36, 0.59, NULL);

-- Volcando estructura para tabla erp_pollo_fiesta.prod_zootecnia_huevo
CREATE TABLE IF NOT EXISTS `prod_zootecnia_huevo` (
  `anio` int(11) NOT NULL,
  `saldo_inicial_aves` int(11) DEFAULT NULL,
  `mortalidad_aves` int(11) DEFAULT NULL,
  `mortalidad_aves_tabla_pct` decimal(6,2) DEFAULT NULL,
  `mortalidad_aves_real_pct` decimal(6,2) DEFAULT NULL,
  `venta_seleccion_aves` int(11) DEFAULT NULL,
  `huevos_producidos` bigint(20) DEFAULT NULL,
  `huevos_enviados_bodega` bigint(20) DEFAULT NULL,
  `inventario_final_huevo` bigint(20) DEFAULT NULL,
  `huevos_producidos_tabla_x_ave_mes` decimal(10,2) DEFAULT NULL,
  `huevos_producidos_real_x_ave_mes` decimal(10,2) DEFAULT NULL,
  `consumo_alimento_x_ave_kg_tabla` decimal(10,2) DEFAULT NULL,
  `consumo_alimento_x_ave_kg_real` decimal(10,2) DEFAULT NULL,
  `consumo_alimento_balanceado_kl` bigint(20) DEFAULT NULL,
  `variacion_absoluta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`variacion_absoluta`)),
  `variacion_relativa_pct` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`variacion_relativa_pct`)),
  PRIMARY KEY (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.prod_zootecnia_huevo: ~2 rows (aproximadamente)
INSERT INTO `prod_zootecnia_huevo` (`anio`, `saldo_inicial_aves`, `mortalidad_aves`, `mortalidad_aves_tabla_pct`, `mortalidad_aves_real_pct`, `venta_seleccion_aves`, `huevos_producidos`, `huevos_enviados_bodega`, `inventario_final_huevo`, `huevos_producidos_tabla_x_ave_mes`, `huevos_producidos_real_x_ave_mes`, `consumo_alimento_x_ave_kg_tabla`, `consumo_alimento_x_ave_kg_real`, `consumo_alimento_balanceado_kl`, `variacion_absoluta`, `variacion_relativa_pct`) VALUES
	(2024, 1361497, 8431, 1.02, 0.62, 67098, 34602687, 34576572, 1360080, 33.45, 26.80, 4.72, 3.37, 4376157, NULL, NULL),
	(2025, 1387154, 10974, 0.51, 0.89, 95493, 34894949, 34770415, 1148891, 24.77, 25.51, 3.27, 3.28, 4408522, '{"saldo_inicial_aves": 25657, "mortalidad_aves": 2543, "mortalidad_aves_tabla_pct": -0.51, "mortalidad_aves_real_pct": 0.27, "venta_seleccion_aves": 28395, "huevos_producidos": 292262, "huevos_enviados_bodega": 193843, "inventario_final_huevo": -211189, "huevos_producidos_tabla_x_ave_mes": -8.69, "huevos_producidos_real_x_ave_mes": -1.29, "consumo_alimento_x_ave_kg_tabla": -1.45, "consumo_alimento_x_ave_kg_real": -0.1, "consumo_alimento_balanceado_kl": 32365}', '{"saldo_inicial_aves": 1.88, "mortalidad_aves": 30.16, "mortalidad_aves_tabla_pct": -49.85, "mortalidad_aves_real_pct": 43.62, "venta_seleccion_aves": 42.32, "huevos_producidos": 0.84, "huevos_enviados_bodega": 0.56, "inventario_final_huevo": -15.53, "huevos_producidos_tabla_x_ave_mes": -25.97, "huevos_producidos_real_x_ave_mes": -4.82, "consumo_alimento_x_ave_kg_tabla": -30.8, "consumo_alimento_x_ave_kg_real": -2.87, "consumo_alimento_balanceado_kl": 0.74}');

-- Volcando estructura para tabla erp_pollo_fiesta.prod_zootecnia_pollo
CREATE TABLE IF NOT EXISTS `prod_zootecnia_pollo` (
  `anio` int(11) NOT NULL,
  `pollo_encasetado` int(11) DEFAULT NULL,
  `pollo_procesado` int(11) DEFAULT NULL,
  `mortalidad_acumulada` int(11) DEFAULT NULL,
  `mortalidad_pct` decimal(6,2) DEFAULT NULL,
  `peso_esperado` decimal(10,2) DEFAULT NULL,
  `peso_promedio` decimal(10,3) DEFAULT NULL,
  `dsg` decimal(10,2) DEFAULT NULL,
  `conversion` decimal(10,2) DEFAULT NULL,
  `kg_alimento_consumido` bigint(20) DEFAULT NULL,
  `consumo_alimento_x_pollo` decimal(10,2) DEFAULT NULL,
  `efi_alim_ip` decimal(10,2) DEFAULT NULL,
  `vr_kg_alimento` decimal(12,2) DEFAULT NULL,
  `kg_pollo_procesado` bigint(20) DEFAULT NULL,
  `dias_promedio_engorde` decimal(10,2) DEFAULT NULL,
  `dias_ciclo` decimal(10,2) DEFAULT NULL,
  `variacion_absoluta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`variacion_absoluta`)),
  `variacion_relativa_pct` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`variacion_relativa_pct`)),
  PRIMARY KEY (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.prod_zootecnia_pollo: ~2 rows (aproximadamente)
INSERT INTO `prod_zootecnia_pollo` (`anio`, `pollo_encasetado`, `pollo_procesado`, `mortalidad_acumulada`, `mortalidad_pct`, `peso_esperado`, `peso_promedio`, `dsg`, `conversion`, `kg_alimento_consumido`, `consumo_alimento_x_pollo`, `efi_alim_ip`, `vr_kg_alimento`, `kg_pollo_procesado`, `dias_promedio_engorde`, `dias_ciclo`, `variacion_absoluta`, `variacion_relativa_pct`) VALUES
	(2024, 31905014, 28604260, 3300754, 10.05, 2092.10, 1.998, -94.40, 1.54, 87875647, 3.07, 84.47, 2061.42, 57141622, 38.16, 50.97, NULL, NULL),
	(2025, 31912177, 29064824, 2881656, 9.03, 2072.50, 2.042, -31.00, 1.49, 88227164, 3.04, 92.35, 2015.54, 59337413, 40.37, 57.37, '{"pollo_encasetado": 7163, "pollo_procesado": 460564, "mortalidad_acumulada": -419098, "mortalidad_pct": -1.02, "peso_esperado": -19.57, "peso_promedio": 0.04, "dsg": 63.48, "conversion": -0.05, "kg_alimento_consumido": 351517, "consumo_alimento_x_pollo": -0.04, "efi_alim_ip": 7.88, "vr_kg_alimento": -45.88, "kg_pollo_procesado": 2195791, "dias_promedio_engorde": 2.21, "dias_ciclo": 6.41}', '{"pollo_encasetado": 0.02, "pollo_procesado": 1.61, "mortalidad_acumulada": -12.7, "mortalidad_pct": -10.16, "peso_esperado": -0.94, "peso_promedio": 2.2, "dsg": -67.21, "conversion": -3.32, "kg_alimento_consumido": 0.4, "consumo_alimento_x_pollo": -1.19, "efi_alim_ip": 9.33, "vr_kg_alimento": -2.23, "kg_pollo_procesado": 3.84, "dias_promedio_engorde": 5.79, "dias_ciclo": 12.57}');

-- Volcando estructura para tabla erp_pollo_fiesta.rh_causas_variacion_costos
CREATE TABLE IF NOT EXISTS `rh_causas_variacion_costos` (
  `id_causa` int(11) NOT NULL AUTO_INCREMENT,
  `anio_impacto` int(11) NOT NULL,
  `categoria` varchar(100) NOT NULL,
  `descripcion_causa` text NOT NULL,
  PRIMARY KEY (`id_causa`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.rh_causas_variacion_costos: ~4 rows (aproximadamente)
INSERT INTO `rh_causas_variacion_costos` (`id_causa`, `anio_impacto`, `categoria`, `descripcion_causa`) VALUES
	(1, 2025, 'Nómina', 'Pago efectivo de horas diurnas antes compensadas con tiempo.'),
	(2, 2025, 'Nómina', 'Reconocimiento de primas de antigüedad y otros beneficios laborales.'),
	(3, 2025, 'Nómina', 'Ajustes necesarios para reflejar el costo real de la operación y cumplir obligaciones laborales.'),
	(4, 2025, 'Horas Extras', 'Mayor costo promedio por hora, asociado a la reforma laboral y reducción de la jornada laboral.');

-- Volcando estructura para tabla erp_pollo_fiesta.rh_costos_nomina
CREATE TABLE IF NOT EXISTS `rh_costos_nomina` (
  `anio` int(11) NOT NULL,
  `costo_nomina_total_pesos` decimal(20,2) NOT NULL,
  `horas_extras_cantidad` int(11) NOT NULL,
  `costo_horas_extras_pesos` decimal(20,2) NOT NULL,
  `costo_promedio_hora_extra` decimal(10,2) GENERATED ALWAYS AS (`costo_horas_extras_pesos` / `horas_extras_cantidad`) STORED,
  PRIMARY KEY (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.rh_costos_nomina: ~2 rows (aproximadamente)
INSERT INTO `rh_costos_nomina` (`anio`, `costo_nomina_total_pesos`, `horas_extras_cantidad`, `costo_horas_extras_pesos`) VALUES
	(2024, 36597343829.00, 127199, 1065657115.00),
	(2025, 41978924466.00, 130890, 1286579002.00);

-- Volcando estructura para tabla erp_pollo_fiesta.rh_planta_personal
CREATE TABLE IF NOT EXISTS `rh_planta_personal` (
  `anio` int(11) NOT NULL,
  `mes_corte` varchar(20) NOT NULL,
  `numero_personas` int(11) NOT NULL,
  PRIMARY KEY (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.rh_planta_personal: ~2 rows (aproximadamente)
INSERT INTO `rh_planta_personal` (`anio`, `mes_corte`, `numero_personas`) VALUES
	(2024, 'Diciembre', 830),
	(2025, 'Diciembre', 840);

-- Volcando estructura para tabla erp_pollo_fiesta.rh_rotacion_personal
CREATE TABLE IF NOT EXISTS `rh_rotacion_personal` (
  `anio` int(11) NOT NULL,
  `ingresos_personas` int(11) NOT NULL,
  `retiros_personas` int(11) NOT NULL,
  `crecimiento_neto` int(11) GENERATED ALWAYS AS (`ingresos_personas` - `retiros_personas`) STORED,
  PRIMARY KEY (`anio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.rh_rotacion_personal: ~2 rows (aproximadamente)
INSERT INTO `rh_rotacion_personal` (`anio`, `ingresos_personas`, `retiros_personas`) VALUES
	(2024, 532, 534),
	(2025, 564, 562);

-- Volcando estructura para tabla erp_pollo_fiesta.sgr_hallazgos_auditoria
CREATE TABLE IF NOT EXISTS `sgr_hallazgos_auditoria` (
  `area_evaluada` varchar(50) NOT NULL,
  `incumplimiento_pct` decimal(5,2) DEFAULT NULL,
  `riesgo_detectado` text DEFAULT NULL,
  `plan_accion` text DEFAULT NULL,
  PRIMARY KEY (`area_evaluada`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.sgr_hallazgos_auditoria: ~3 rows (aproximadamente)
INSERT INTO `sgr_hallazgos_auditoria` (`area_evaluada`, `incumplimiento_pct`, `riesgo_detectado`, `plan_accion`) VALUES
	('Comercial', 47.00, 'Incumplimiento y riesgo de manejo documental por los vendedores', 'Divulgaciones individuales para eliminar riesgo de manejo documental'),
	('Compras', 50.00, '3 proveedores presentaron novedades por Financiación al Terrorismo (FT)', 'Mejora en comunicación y filtros mediante DATALAFT/Risk Consulting'),
	('Gestión Humana', NULL, 'Falta inclusión del código de ética a nuevos ingresos y transportadores', 'Inducción de 1.5h (100% virtual) e inclusión de transportadores a matriz SAGRILAFT');

-- Volcando estructura para tabla erp_pollo_fiesta.sgr_hallazgos_planes_accion
CREATE TABLE IF NOT EXISTS `sgr_hallazgos_planes_accion` (
  `id_hallazgo` int(11) NOT NULL AUTO_INCREMENT,
  `area_auditada` varchar(50) NOT NULL,
  `porcentaje_incumplimiento` decimal(5,2) DEFAULT NULL,
  `descripcion_riesgo` text NOT NULL,
  `plan_accion_implementado` text NOT NULL,
  `estado_mitigacion` varchar(50) DEFAULT 'En Monitoreo',
  PRIMARY KEY (`id_hallazgo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.sgr_hallazgos_planes_accion: ~3 rows (aproximadamente)
INSERT INTO `sgr_hallazgos_planes_accion` (`id_hallazgo`, `area_auditada`, `porcentaje_incumplimiento`, `descripcion_riesgo`, `plan_accion_implementado`, `estado_mitigacion`) VALUES
	(1, 'Gestión Humana', NULL, 'Falta de capacitación sobre el código de ética y normatividad a nuevos ingresos y transportadores.', 'Programación de inducción de 1 hora y 30 minutos (100% virtual) con evaluación. Inclusión en lista de inducción a transportadores nuevos.', 'En Monitoreo'),
	(2, 'Compras', 50.00, '3 proveedores presentaron novedades por FT (Financiación del Terrorismo).', 'Mejora en la comunicación y filtros de debida diligencia a través de la plataforma DATALAFT / Risk Consulting para evitar futuras vinculaciones riesgosas.', 'En Monitoreo'),
	(3, 'Comercial', 47.00, 'Incumplimiento y riesgo en el manejo documental por parte del equipo de ventas.', 'Realización de divulgaciones individuales a los vendedores con el fin de reducir o eliminar el riesgo de manejo documental.', 'En Monitoreo');

-- Volcando estructura para tabla erp_pollo_fiesta.sgr_marco_normativo
CREATE TABLE IF NOT EXISTS `sgr_marco_normativo` (
  `id_norma` int(11) NOT NULL AUTO_INCREMENT,
  `ente_regulador` varchar(100) NOT NULL DEFAULT 'Superintendencia de Sociedades',
  `normativa` varchar(100) NOT NULL,
  `anio` int(11) NOT NULL,
  `descripcion_enfoque` text NOT NULL,
  PRIMARY KEY (`id_norma`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.sgr_marco_normativo: ~3 rows (aproximadamente)
INSERT INTO `sgr_marco_normativo` (`id_norma`, `ente_regulador`, `normativa`, `anio`, `descripcion_enfoque`) VALUES
	(1, 'Superintendencia de Sociedades', 'Circular Externa 100-00005', 2017, 'Implementación inicial del Sistema de Autocontrol y Gestión del Riesgo (SAGRILAFT).'),
	(2, 'Superintendencia de Sociedades', 'Circular Externa 100-000016', 2020, 'Modificación a la circular de 2017. Enfoque basado en riesgos para la identificación, segmentación, calificación y control.'),
	(3, 'Superintendencia de Sociedades', 'Circular Externa 100-000015', 2021, 'Proceso de debida diligencia intensificada que incluye la identificación del beneficiario final y Personas Expuestas Políticamente (PEPs).');

-- Volcando estructura para tabla erp_pollo_fiesta.sgr_normatividad_aplicada
CREATE TABLE IF NOT EXISTS `sgr_normatividad_aplicada` (
  `circular_aplicada` varchar(100) NOT NULL,
  `anio` int(11) DEFAULT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`circular_aplicada`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.sgr_normatividad_aplicada: ~3 rows (aproximadamente)
INSERT INTO `sgr_normatividad_aplicada` (`circular_aplicada`, `anio`, `descripcion`) VALUES
	('Circular 100-000015', 2021, 'Inclusión de Beneficiario Final a PEPs y debida diligencia intensificada'),
	('Circular 100-000016', 2020, 'Modificación y complemento del sistema de prevención de Superintendencia de Sociedades'),
	('Circular 100-00005', 2017, 'Enfoque basado en riesgos (identificación, segmentación, calificación)');

-- Volcando estructura para tabla erp_pollo_fiesta.ti_aplicaciones_internas
CREATE TABLE IF NOT EXISTS `ti_aplicaciones_internas` (
  `id_app` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_aplicacion` varchar(150) NOT NULL,
  `plataforma` varchar(50) DEFAULT 'Power Apps',
  PRIMARY KEY (`id_app`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.ti_aplicaciones_internas: ~5 rows (aproximadamente)
INSERT INTO `ti_aplicaciones_internas` (`id_app`, `nombre_aplicacion`, `plataforma`) VALUES
	(1, 'Manejo de agenda salas de capacitación', 'Power Apps'),
	(2, 'Seguimiento Producto Congelado Sede 2', 'Power Apps'),
	(3, 'Archivo Digital Version 3.0', 'Power Apps'),
	(4, 'Digiturno Cartera', 'Power Apps'),
	(5, 'Verificador empleados activos e inactivos', 'Power Apps');

-- Volcando estructura para tabla erp_pollo_fiesta.ti_aplicaciones_powerapps
CREATE TABLE IF NOT EXISTS `ti_aplicaciones_powerapps` (
  `id_app` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_app` varchar(150) NOT NULL,
  PRIMARY KEY (`id_app`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.ti_aplicaciones_powerapps: ~5 rows (aproximadamente)
INSERT INTO `ti_aplicaciones_powerapps` (`id_app`, `nombre_app`) VALUES
	(1, 'Manejo de agenda salas de capacitación'),
	(2, 'Seguimiento Producto Congelado Sede 2'),
	(3, 'Archivo Digital Versión 3.0 (Retención 90 años)'),
	(4, 'Digiturno Cartera'),
	(5, 'Verificador empleados activos e inactivos');

-- Volcando estructura para tabla erp_pollo_fiesta.ti_ecosistema_componentes
CREATE TABLE IF NOT EXISTS `ti_ecosistema_componentes` (
  `plataforma` varchar(100) NOT NULL,
  `area_aplicacion` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`plataforma`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.ti_ecosistema_componentes: ~4 rows (aproximadamente)
INSERT INTO `ti_ecosistema_componentes` (`plataforma`, `area_aplicacion`) VALUES
	('BOT RPA', 'Certificados de calidad, envío correo con tarjeta de cumpleaños a colaboradores'),
	('CCTV', 'POSPROCESO PROCESADOS DESPACHOS, EXTERIORES BODEGA ANGEL BLANCO'),
	('Microsoft 365', 'Backups equipos en OneDrive, Microsoft Teams'),
	('SIESA Enterprise', 'Atención a cliente final interno (Nómina, Comercial, Finanzas)');

-- Volcando estructura para tabla erp_pollo_fiesta.ti_ecosistema_mapa
CREATE TABLE IF NOT EXISTS `ti_ecosistema_mapa` (
  `sistema` varchar(150) NOT NULL,
  `funcionalidades` text DEFAULT NULL,
  PRIMARY KEY (`sistema`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.ti_ecosistema_mapa: ~5 rows (aproximadamente)
INSERT INTO `ti_ecosistema_mapa` (`sistema`, `funcionalidades`) VALUES
	('Aplicaciones', 'Manejo de agenda salas de capacitación, Seguimiento Producto Congelado Sede 2, Archivo Digital Versión 3.0, Digiturno Cartera, Verificador empleados activos e inactivos'),
	('BOT', 'Envía correo con tarjeta de cumpleaños a todos los colaboradores'),
	('Microsoft 365', 'Backups equipos One Drive, Power Apps, Power Automate'),
	('SIESA', 'Atención a cliente final Interno'),
	('Sistemas de videovigilancia empresarial (CCTV)', 'POSPROCESO PROCESADOS DESPACHOS, EXTERIORES BODEGA ANGEL BLANCO');

-- Volcando estructura para tabla erp_pollo_fiesta.ti_ecosistema_tecnologico
CREATE TABLE IF NOT EXISTS `ti_ecosistema_tecnologico` (
  `id_sistema` int(11) NOT NULL AUTO_INCREMENT,
  `sistema_principal` varchar(150) NOT NULL,
  `funcionalidades_asociadas` text NOT NULL,
  PRIMARY KEY (`id_sistema`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.ti_ecosistema_tecnologico: ~5 rows (aproximadamente)
INSERT INTO `ti_ecosistema_tecnologico` (`id_sistema`, `sistema_principal`, `funcionalidades_asociadas`) VALUES
	(1, 'Sistemas de videovigilancia empresarial (CCTV)', 'POSPROCESO PROCESADOS DESPACHOS. EXTERIORES BODEGA ANGEL BLANCO. Sede principal, plantas, PDV y granjas.'),
	(2, 'SIESA Enterprise (ERP)', 'Atencion a cliente final Interno. Aplicativos en firme: Nómina, Comercial y Finanzas.'),
	(3, 'Microsoft 365', 'Backups equipos en OneDrive. Uso de Power Apps y Power Automate. Microsoft Teams para toda la organización.'),
	(4, 'BOT Automatizado', 'Envía correo con tarjeta de cumpleaños a todos los colaboradores. BOT para certificados de calidad.'),
	(5, 'Aplicaciones Propias (Power Apps)', 'Manejo de agenda salas de capacitación. Seguimiento Producto Congelado Sede 2. Archivo Digital Version 3.0. Digiturno Cartera. Verificador empleados activos e inactivos.');

-- Volcando estructura para tabla erp_pollo_fiesta.ti_hitos_proyectos
CREATE TABLE IF NOT EXISTS `ti_hitos_proyectos` (
  `id_proyecto` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_proyecto` varchar(150) NOT NULL,
  `estado_implementacion` varchar(50) NOT NULL,
  `descripcion_impacto` text NOT NULL,
  PRIMARY KEY (`id_proyecto`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.ti_hitos_proyectos: ~4 rows (aproximadamente)
INSERT INTO `ti_hitos_proyectos` (`id_proyecto`, `nombre_proyecto`, `estado_implementacion`, `descripcion_impacto`) VALUES
	(1, 'Digitalización de Archivos y Tablas de Retención', 'Completado / Activo', 'Digitalización con enfoque a perpetuidad de archivos laborales (90 años) y gestión documental por procesos misionales.'),
	(2, 'Montaje Redes Estructuradas Bodega Ángel Blanco', 'Completado', 'Instalación completa de red de datos con personal propio de T.I. en las antiguas instalaciones de Vanti.'),
	(3, 'Re-parametrización Módulos ERP SIESA', 'En Proceso', 'Adecuación y re-parametrización de las áreas de: Compras, Almacén, Inventarios y Mantenimiento en la nube.'),
	(4, 'Arquitectura de Backup Híbrido', 'Completado / Activo', 'Respaldo de información en la nube (OneDrive) con copia de seguridad espejo en un servidor propio autónomo físico de la empresa.');

-- Volcando estructura para tabla erp_pollo_fiesta.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('admin','analyst','viewer') DEFAULT 'viewer',
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `idx_username` (`username`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla erp_pollo_fiesta.users: ~5 rows (aproximadamente)
INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `email`, `role`, `active`, `created_at`, `updated_at`) VALUES
	(1, 'admin', 'admin123', 'Administrador del Sistema', 'admin@pollofiesta.com', 'admin', 1, '2026-03-10 16:59:46', '2026-03-10 16:59:46'),
	(2, 'analista', 'analista123', 'Analista de Datos', 'analista@pollofiesta.com', 'analyst', 1, '2026-03-10 16:59:46', '2026-03-10 16:59:46'),
	(3, 'viewer', 'viewer123', 'Usuario Visualizador', 'viewer@pollofiesta.com', 'viewer', 1, '2026-03-10 16:59:46', '2026-03-10 16:59:46'),
	(4, 'gerente', 'gerente123', 'Gerente General', 'gerente@pollofiesta.com', 'admin', 1, '2026-03-10 16:59:46', '2026-03-10 16:59:46'),
	(5, 'comercial', 'comercial123', 'Jefe Comercial', 'comercial@pollofiesta.com', 'analyst', 1, '2026-03-10 16:59:46', '2026-03-10 16:59:46');

-- Volcando estructura para vista erp_pollo_fiesta.vista_aud_variacion_devoluciones_25_vs_24
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_aud_variacion_devoluciones_25_vs_24` (
	`indicador` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_general_ci',
	`pct_2025` DECIMAL(5,2) NOT NULL,
	`pct_2024` DECIMAL(5,2) NOT NULL,
	`variacion_puntos_porcentuales` DECIMAL(6,2) NOT NULL,
	`estado_auditoria` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_general_ci'
);

-- Volcando estructura para vista erp_pollo_fiesta.vista_cal_resumen_gestion
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_cal_resumen_gestion` (
	`pilar_gestion` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_general_ci',
	`item` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_spanish_ci',
	`detalle` MEDIUMTEXT NOT NULL COLLATE 'utf8mb4_spanish_ci'
);

-- Volcando estructura para vista erp_pollo_fiesta.vista_cmp_analisis_compras_24_vs_23
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_cmp_analisis_compras_24_vs_23` (
	`mes_num` INT(11) NOT NULL,
	`mes_nombre` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_spanish_ci',
	`compras_2024` DECIMAL(20,2) NOT NULL,
	`compras_2023` DECIMAL(20,2) NOT NULL,
	`variacion_absoluta_pesos` DECIMAL(21,2) NOT NULL,
	`variacion_pct` DECIMAL(26,1) NULL,
	`justificacion_comportamiento` VARCHAR(1) NULL COLLATE 'utf8mb4_general_ci'
);

-- Volcando estructura para vista erp_pollo_fiesta.vista_cmp_total_anual_compras
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_cmp_total_anual_compras` (
	`anio` INT(11) NOT NULL,
	`gran_total_compras_pesos` DECIMAL(42,2) NULL
);

-- Volcando estructura para vista erp_pollo_fiesta.vista_com_analisis_ventas
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_com_analisis_ventas` (
	`anio` INT(11) NOT NULL,
	`nombre_categoria` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_spanish_ci',
	`kilos_vendidos` DECIMAL(15,2) NOT NULL,
	`participacion_kilos_pct` DECIMAL(21,2) NULL,
	`ingresos_pesos` DECIMAL(20,2) NOT NULL,
	`participacion_ingresos_pct` DECIMAL(26,2) NULL
);

-- Volcando estructura para vista erp_pollo_fiesta.vista_com_huevo_comparativo_multianual
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_com_huevo_comparativo_multianual` (
	`periodo_comparado` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_general_ci',
	`variacion_unidades` BIGINT(21) NOT NULL,
	`variacion_unidades_pct` DECIMAL(26,2) NULL,
	`variacion_precio` DECIMAL(11,2) NOT NULL,
	`variacion_precio_pct` DECIMAL(17,2) NULL
);

-- Volcando estructura para vista erp_pollo_fiesta.vista_com_kpi_pollo_entero
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_com_kpi_pollo_entero` (
	`anio` INT(11) NOT NULL,
	`pollo_entero_planta` BIGINT(20) NOT NULL,
	`venta_unidad_linea_asadero` BIGINT(20) NOT NULL,
	`participacion_lograda_pct` DECIMAL(25,2) NULL,
	`meta_objetivo_pct` DECIMAL(4,2) NOT NULL,
	`puntos_faltantes` DECIMAL(26,2) NULL
);

-- Volcando estructura para vista erp_pollo_fiesta.vista_com_pdv_participacion_zona_2024
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_com_pdv_participacion_zona_2024` (
	`zona_asignacion` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_spanish_ci',
	`nombre_pdv` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_spanish_ci',
	`pdv_kilos_pollo` DECIMAL(15,2) NULL,
	`zona_total_kilos` DECIMAL(15,2) NULL,
	`participacion_pollo_pct` DECIMAL(21,2) NULL,
	`pdv_unidades_huevo` BIGINT(20) NULL,
	`zona_total_huevos` BIGINT(20) NULL,
	`participacion_huevo_pct` DECIMAL(25,2) NULL
);

-- Volcando estructura para vista erp_pollo_fiesta.vista_com_unidades_procesadas
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_com_unidades_procesadas` (
	`centro_operacion` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_spanish_ci',
	`anio` INT(11) NOT NULL,
	`unidades` BIGINT(20) NOT NULL,
	`participacion_porcentaje` DECIMAL(25,2) NULL
);

-- Volcando estructura para vista erp_pollo_fiesta.vista_fin_estado_resultados_analisis
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_fin_estado_resultados_analisis` (
	`indicador` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_general_ci',
	`valor_2024_MM` DECIMAL(15,2) NOT NULL,
	`valor_2023_MM` DECIMAL(15,2) NOT NULL,
	`variacion_MM` DECIMAL(16,2) NOT NULL,
	`variacion_pct` DECIMAL(22,2) NULL
);

-- Volcando estructura para vista erp_pollo_fiesta.vista_log_cumplimiento_mermas_2025
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_log_cumplimiento_mermas_2025` (
	`sede` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_spanish_ci',
	`merma_2025` DECIMAL(5,2) NOT NULL,
	`meta_establecida` DECIMAL(5,2) NOT NULL,
	`brecha_puntos_porcentuales` DECIMAL(6,2) NOT NULL,
	`estado_evaluacion` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_general_ci'
);

-- Volcando estructura para vista erp_pollo_fiesta.vista_log_gastos_consolidados_25_vs_24
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_log_gastos_consolidados_25_vs_24` (
	`concepto_gasto` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_spanish_ci',
	`total_2024_pesos` DECIMAL(42,2) NULL,
	`total_2025_pesos` DECIMAL(42,2) NULL,
	`variacion_absoluta_pesos` DECIMAL(43,2) NULL,
	`variacion_relativa_pct` DECIMAL(49,2) NULL
);

-- Volcando estructura para vista erp_pollo_fiesta.vista_log_gastos_por_sede
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_log_gastos_por_sede` (
	`nombre_sede` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_spanish_ci',
	`concepto_gasto` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_spanish_ci',
	`total_2024_pesos` DECIMAL(42,2) NULL,
	`total_2025_pesos` DECIMAL(42,2) NULL,
	`var_pct` DECIMAL(49,2) NULL
);

-- Volcando estructura para vista erp_pollo_fiesta.vista_mkt_resumen_estrategico
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_mkt_resumen_estrategico` (
	`categoria` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_general_ci',
	`concepto` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_spanish_ci',
	`alcance` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_spanish_ci',
	`detalle` MEDIUMTEXT NOT NULL COLLATE 'utf8mb4_spanish_ci'
);

-- Volcando estructura para vista erp_pollo_fiesta.vista_ope_alerta_arquitectura
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_ope_alerta_arquitectura` (
	`categoria` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_spanish_ci',
	`sede_planta` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_spanish_ci',
	`nivel_cumplimiento` DECIMAL(5,2) NULL,
	`estado_operativo` VARCHAR(1) NULL COLLATE 'utf8mb4_general_ci'
);

-- Volcando estructura para vista erp_pollo_fiesta.vista_ope_enfoque_mantenimiento_2025
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_ope_enfoque_mantenimiento_2025` (
	`metrica` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_general_ci',
	`total_correctivas` DECIMAL(32,0) NULL,
	`total_preventivas` DECIMAL(32,0) NULL,
	`gran_total_intervenciones` DECIMAL(32,0) NULL,
	`porcentaje_preventivo_real` DECIMAL(38,2) NULL
);

-- Volcando estructura para vista erp_pollo_fiesta.vista_pb_variacion_descartes
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_pb_variacion_descartes` (
	`categoria_descarte` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_spanish_ci',
	`kilos_2025` DECIMAL(15,4) NOT NULL,
	`kilos_2024` DECIMAL(15,4) NOT NULL,
	`variacion_kg` DECIMAL(16,4) NOT NULL,
	`variacion_pct` DECIMAL(22,2) NULL
);

-- Volcando estructura para vista erp_pollo_fiesta.vista_pre_cumplimiento_presupuesto
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_pre_cumplimiento_presupuesto` (
	`categoria_negocio` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_spanish_ci',
	`ejecucion_real` INT(11) NULL,
	`meta_presupuestada` INT(11) NULL,
	`brecha_unidades` BIGINT(12) NULL,
	`cumplimiento_pct` DECIMAL(17,2) NULL
);

-- Volcando estructura para vista erp_pollo_fiesta.vista_rh_analisis_costos_25_vs_24
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_rh_analisis_costos_25_vs_24` (
	`indicador` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_general_ci',
	`valor_2025` DECIMAL(20,2) NOT NULL,
	`valor_2024` DECIMAL(20,2) NOT NULL,
	`variacion_absoluta` DECIMAL(21,2) NOT NULL,
	`variacion_porcentual` DECIMAL(27,2) NULL
);

-- Volcando estructura para vista erp_pollo_fiesta.vista_rh_movimiento_planta_25_vs_24
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_rh_movimiento_planta_25_vs_24` (
	`anio` INT(11) NOT NULL,
	`headcount_cierre` INT(11) NOT NULL,
	`ingresos_personas` INT(11) NOT NULL,
	`retiros_personas` INT(11) NOT NULL,
	`saldo_neto_movimientos` INT(11) NULL
);

-- Volcando estructura para vista erp_pollo_fiesta.vista_sgr_mapa_calor_riesgos
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_sgr_mapa_calor_riesgos` (
	`area_auditada` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_spanish_ci',
	`tasa_incumplimiento` VARCHAR(1) NULL COLLATE 'utf8mb4_general_ci',
	`descripcion_riesgo` TEXT NOT NULL COLLATE 'utf8mb4_spanish_ci',
	`plan_accion_implementado` TEXT NOT NULL COLLATE 'utf8mb4_spanish_ci',
	`nivel_alerta_sagrilaft` VARCHAR(1) NULL COLLATE 'utf8mb4_general_ci'
);

-- Volcando estructura para vista erp_pollo_fiesta.vista_ti_mapa_tecnologico
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_ti_mapa_tecnologico` (
	`categoria` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_spanish_ci',
	`elemento` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_spanish_ci',
	`detalle` MEDIUMTEXT NOT NULL COLLATE 'utf8mb4_spanish_ci'
);

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_aud_variacion_devoluciones_25_vs_24`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_aud_variacion_devoluciones_25_vs_24` AS SELECT 
    'Promedio Compañía' AS indicador,
    a25.promedio_compania_pct AS pct_2025,
    a24.promedio_compania_pct AS pct_2024,
    ROUND(a25.promedio_compania_pct - a24.promedio_compania_pct, 2) AS variacion_puntos_porcentuales,
    CASE 
        WHEN (a25.promedio_compania_pct - a24.promedio_compania_pct) < 0 THEN 'Mejora (Reducción)'
        ELSE 'Alerta (Aumento)'
    END AS estado_auditoria
FROM aud_devoluciones_resumen_anual a25
JOIN aud_devoluciones_resumen_anual a24 ON a24.anio = 2024
WHERE a25.anio = 2025 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_cal_resumen_gestion`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_cal_resumen_gestion` AS SELECT 
    'Línea Estratégica' AS pilar_gestion,
    nombre_linea AS item,
    descripcion AS detalle
FROM cal_lineas_accion
UNION ALL
SELECT 
    'Logro Operativo' AS pilar_gestion,
    proceso AS item,
    logro_destacado AS detalle
FROM cal_acciones_proceso 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_cmp_analisis_compras_24_vs_23`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_cmp_analisis_compras_24_vs_23` AS SELECT 
    c24.mes_num,
    c24.mes_nombre,
    c24.valor_compras_pesos AS compras_2024,
    c23.valor_compras_pesos AS compras_2023,
    (c24.valor_compras_pesos - c23.valor_compras_pesos) AS variacion_absoluta_pesos,
    ROUND(((c24.valor_compras_pesos - c23.valor_compras_pesos) / c23.valor_compras_pesos) * 100, 1) AS variacion_pct,
    -- Agregamos un indicador lógico para identificar los meses de abastecimiento de temporada
    CASE 
        WHEN ((c24.valor_compras_pesos - c23.valor_compras_pesos) / c23.valor_compras_pesos) > 0 THEN 'Incremento (Refuerzo Temporada)'
        ELSE 'Ahorro (Tendencia a la baja)'
    END AS justificacion_comportamiento
FROM cmp_compras_mensuales c24
JOIN cmp_compras_mensuales c23 ON c24.mes_num = c23.mes_num AND c23.anio = 2023
WHERE c24.anio = 2024
ORDER BY c24.mes_num ASC 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_cmp_total_anual_compras`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_cmp_total_anual_compras` AS SELECT 
    anio,
    SUM(valor_compras_pesos) AS gran_total_compras_pesos
FROM cmp_compras_mensuales
GROUP BY anio
ORDER BY anio DESC 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_com_analisis_ventas`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_com_analisis_ventas` AS SELECT 
    v.anio,
    cat.nombre_categoria,
    v.kilos_vendidos,
    ROUND((v.kilos_vendidos / (SELECT SUM(kilos_vendidos) FROM com_ventas_pie_canal WHERE anio = v.anio)) * 100, 2) AS participacion_kilos_pct,
    v.ingresos_pesos,
    ROUND((v.ingresos_pesos / (SELECT SUM(ingresos_pesos) FROM com_ventas_pie_canal WHERE anio = v.anio)) * 100, 2) AS participacion_ingresos_pct
FROM com_ventas_pie_canal v
JOIN com_categorias cat ON v.id_categoria = cat.id_categoria
ORDER BY v.anio DESC 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_com_huevo_comparativo_multianual`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_com_huevo_comparativo_multianual` AS SELECT 
    '2024 vs 2023' AS periodo_comparado,
    (v24.unidades_vendidas - v23.unidades_vendidas) AS variacion_unidades,
    ROUND(((v24.unidades_vendidas - v23.unidades_vendidas) / v23.unidades_vendidas) * 100, 2) AS variacion_unidades_pct,
    (v24.precio_promedio_unidad - v23.precio_promedio_unidad) AS variacion_precio,
    ROUND(((v24.precio_promedio_unidad - v23.precio_promedio_unidad) / v23.precio_promedio_unidad) * 100, 2) AS variacion_precio_pct
FROM com_ventas_huevo v24
JOIN com_ventas_huevo v23 ON v24.anio = 2024 AND v23.anio = 2023

UNION ALL

SELECT 
    '2025 vs 2024' AS periodo_comparado,
    (v25.unidades_vendidas - v24.unidades_vendidas) AS variacion_unidades,
    ROUND(((v25.unidades_vendidas - v24.unidades_vendidas) / v24.unidades_vendidas) * 100, 2) AS variacion_unidades_pct,
    (v25.precio_promedio_unidad - v24.precio_promedio_unidad) AS variacion_precio,
    ROUND(((v25.precio_promedio_unidad - v24.precio_promedio_unidad) / v24.precio_promedio_unidad) * 100, 2) AS variacion_precio_pct
FROM com_ventas_huevo v25
JOIN com_ventas_huevo v24 ON v25.anio = 2025 AND v24.anio = 2024

UNION ALL

SELECT 
    '2025 vs 2023 (Acumulado 2 años)' AS periodo_comparado,
    (v25.unidades_vendidas - v23.unidades_vendidas) AS variacion_unidades,
    ROUND(((v25.unidades_vendidas - v23.unidades_vendidas) / v23.unidades_vendidas) * 100, 2) AS variacion_unidades_pct,
    (v25.precio_promedio_unidad - v23.precio_promedio_unidad) AS variacion_precio,
    ROUND(((v25.precio_promedio_unidad - v23.precio_promedio_unidad) / v23.precio_promedio_unidad) * 100, 2) AS variacion_precio_pct
FROM com_ventas_huevo v25
JOIN com_ventas_huevo v23 ON v25.anio = 2025 AND v23.anio = 2023 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_com_kpi_pollo_entero`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_com_kpi_pollo_entero` AS SELECT 
    anio,
    pollo_entero_planta,
    venta_unidad_linea_asadero,
    ROUND((venta_unidad_linea_asadero / pollo_entero_planta) * 100, 2) AS participacion_lograda_pct,
    50.00 AS meta_objetivo_pct,
    ROUND(50.00 - ((venta_unidad_linea_asadero / pollo_entero_planta) * 100), 2) AS puntos_faltantes
FROM com_objetivo_pollo_entero
ORDER BY anio ASC 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_com_pdv_participacion_zona_2024`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_com_pdv_participacion_zona_2024` AS SELECT 
    t.zona_asignacion,
    m.nombre_pdv,
    t.kilos_pollo AS pdv_kilos_pollo,
    z.kilos_pollo AS zona_total_kilos,
    ROUND((t.kilos_pollo / z.kilos_pollo) * 100, 2) AS participacion_pollo_pct,
    
    t.unidades_huevo AS pdv_unidades_huevo,
    z.unidades_huevo AS zona_total_huevos,
    ROUND((t.unidades_huevo / z.unidades_huevo) * 100, 2) AS participacion_huevo_pct
FROM com_pdv_top_desempeno t
JOIN com_pdv_maestro m ON t.id_pdv = m.id_pdv
JOIN com_pdv_ventas_zonales z ON t.zona_asignacion = z.zona_geografica AND t.anio = z.anio
WHERE t.anio = 2024 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_com_unidades_procesadas`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_com_unidades_procesadas` AS SELECT 
    centro_operacion,
    anio,
    unidades,
    ROUND((unidades / (SELECT SUM(unidades) FROM com_unidades_procesadas WHERE anio = c.anio)) * 100, 2) AS participacion_porcentaje
FROM com_unidades_procesadas c
ORDER BY anio DESC, unidades DESC 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_fin_estado_resultados_analisis`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_fin_estado_resultados_analisis` AS SELECT 
    'Utilidad Bruta' AS indicador,
    r24.utilidad_bruta AS valor_2024_MM,
    r23.utilidad_bruta AS valor_2023_MM,
    (r24.utilidad_bruta - r23.utilidad_bruta) AS variacion_MM,
    ROUND(((r24.utilidad_bruta - r23.utilidad_bruta) / r23.utilidad_bruta) * 100, 2) AS variacion_pct
FROM fin_estado_resultados r24
JOIN fin_estado_resultados r23 ON r24.anio = 2024 AND r23.anio = 2023
UNION ALL
SELECT 
    'Utilidad Neta', r24.utilidad_neta, r23.utilidad_neta, (r24.utilidad_neta - r23.utilidad_neta),
    ROUND(((r24.utilidad_neta - r23.utilidad_neta) / r23.utilidad_neta) * 100, 2)
FROM fin_estado_resultados r24
JOIN fin_estado_resultados r23 ON r24.anio = 2024 AND r23.anio = 2023
UNION ALL
SELECT 
    'Costo Neto Financiero', r24.costo_neto_financiero, r23.costo_neto_financiero, (r24.costo_neto_financiero - r23.costo_neto_financiero),
    ROUND(((r24.costo_neto_financiero - r23.costo_neto_financiero) / r23.costo_neto_financiero) * 100, 2)
FROM fin_estado_resultados r24
JOIN fin_estado_resultados r23 ON r24.anio = 2024 AND r23.anio = 2023 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_log_cumplimiento_mermas_2025`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_log_cumplimiento_mermas_2025` AS SELECT 
    sede,
    porcentaje_merma_real AS merma_2025,
    porcentaje_meta AS meta_establecida,
    
    -- Calculamos la brecha (Si es positiva es mala, si es negativa superó la meta)
    ROUND((porcentaje_merma_real - porcentaje_meta), 2) AS brecha_puntos_porcentuales,
    
    -- Ponemos un semáforo lógico
    CASE 
        WHEN (porcentaje_merma_real - porcentaje_meta) <= 0 THEN 'Meta Cumplida'
        ELSE 'No Cumple'
    END AS estado_evaluacion

FROM log_control_mermas
WHERE anio = 2025 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_log_gastos_consolidados_25_vs_24`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_log_gastos_consolidados_25_vs_24` AS SELECT 
    concepto_gasto,
    SUM(CASE WHEN anio = 2024 THEN valor_pesos ELSE 0 END) AS total_2024_pesos,
    SUM(CASE WHEN anio = 2025 THEN valor_pesos ELSE 0 END) AS total_2025_pesos,
    SUM(CASE WHEN anio = 2025 THEN valor_pesos ELSE 0 END) - SUM(CASE WHEN anio = 2024 THEN valor_pesos ELSE 0 END) AS variacion_absoluta_pesos,
    ROUND(((SUM(CASE WHEN anio = 2025 THEN valor_pesos ELSE 0 END) - SUM(CASE WHEN anio = 2024 THEN valor_pesos ELSE 0 END)) / SUM(CASE WHEN anio = 2024 THEN valor_pesos ELSE 0 END)) * 100, 2) AS variacion_relativa_pct
FROM log_gastos_operacionales
GROUP BY concepto_gasto 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_log_gastos_por_sede`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_log_gastos_por_sede` AS SELECT 
    s.nombre_sede,
    g.concepto_gasto,
    SUM(CASE WHEN g.anio = 2024 THEN g.valor_pesos ELSE 0 END) AS total_2024_pesos,
    SUM(CASE WHEN g.anio = 2025 THEN g.valor_pesos ELSE 0 END) AS total_2025_pesos,
    ROUND(((SUM(CASE WHEN g.anio = 2025 THEN g.valor_pesos ELSE 0 END) - SUM(CASE WHEN g.anio = 2024 THEN g.valor_pesos ELSE 0 END)) / NULLIF(SUM(CASE WHEN g.anio = 2024 THEN g.valor_pesos ELSE 0 END), 0)) * 100, 2) AS var_pct
FROM log_gastos_operacionales g
JOIN log_sedes_operacion s ON g.id_sede = s.id_sede
GROUP BY s.nombre_sede, g.concepto_gasto
ORDER BY s.id_sede, g.concepto_gasto 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_mkt_resumen_estrategico`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_mkt_resumen_estrategico` AS SELECT 
    'Campaña Publicitaria' AS categoria,
    tipo_campana AS concepto,
    medios_utilizados AS alcance,
    descripcion_estrategia AS detalle
FROM mkt_campanas_publicidad
UNION ALL
SELECT 
    'Movimiento de Infraestructura' AS categoria,
    tipo_movimiento AS concepto,
    sede_pdv AS alcance,
    descripcion_detallada AS detalle
FROM mkt_hitos_infraestructura 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_ope_alerta_arquitectura`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_ope_alerta_arquitectura` AS SELECT 
    categoria,
    sede_planta,
    ejecucion_pct AS nivel_cumplimiento,
    CASE 
        WHEN ejecucion_pct < 50.00 THEN 'CRÍTICO: Requiere apoyo urgente de RH'
        WHEN ejecucion_pct BETWEEN 50.00 AND 80.00 THEN 'ALERTA: Ejecución Media'
        ELSE 'ÓPTIMO: Cumplimiento adecuado'
    END AS estado_operativo
FROM ope_novedades_infraestructura
ORDER BY ejecucion_pct ASC 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_ope_enfoque_mantenimiento_2025`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_ope_enfoque_mantenimiento_2025` AS SELECT 
    'Resumen Anual OT' AS metrica,
    SUM(ot_correctivas) AS total_correctivas,
    SUM(ot_preventivas) AS total_preventivas,
    SUM(total_ot) AS gran_total_intervenciones,
    ROUND((SUM(ot_preventivas) / SUM(total_ot)) * 100, 2) AS porcentaje_preventivo_real
FROM ope_ordenes_trabajo_mensual 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_pb_variacion_descartes`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_pb_variacion_descartes` AS SELECT 
    d25.categoria_descarte,
    d25.kilos_descartados AS kilos_2025,
    d24.kilos_descartados AS kilos_2024,
    (d25.kilos_descartados - d24.kilos_descartados) AS variacion_kg,
    ROUND(((d25.kilos_descartados - d24.kilos_descartados) / d24.kilos_descartados) * 100, 2) AS variacion_pct
FROM pb_descartes_kilos d25
JOIN pb_descartes_kilos d24 ON d25.categoria_descarte = d24.categoria_descarte AND d24.anio = 2024
WHERE d25.anio = 2025 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_pre_cumplimiento_presupuesto`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_pre_cumplimiento_presupuesto` AS SELECT 
    r.categoria_negocio,
    r.total_anual AS ejecucion_real,
    p.total_anual AS meta_presupuestada,
    (r.total_anual - p.total_anual) AS brecha_unidades,
    ROUND(((r.total_anual - p.total_anual) / p.total_anual) * 100, 2) AS cumplimiento_pct
FROM pre_ejecucion_trimestral r
JOIN pre_ejecucion_trimestral p ON r.categoria_negocio = p.categoria_negocio
WHERE r.tipo_metrica = 'Real 2024' AND p.tipo_metrica = 'Ppto 2024' 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_rh_analisis_costos_25_vs_24`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_rh_analisis_costos_25_vs_24` AS SELECT 
    'Costo Total de Nómina' AS indicador,
    n25.costo_nomina_total_pesos AS valor_2025,
    n24.costo_nomina_total_pesos AS valor_2024,
    (n25.costo_nomina_total_pesos - n24.costo_nomina_total_pesos) AS variacion_absoluta,
    ROUND(((n25.costo_nomina_total_pesos - n24.costo_nomina_total_pesos) / n24.costo_nomina_total_pesos) * 100, 2) AS variacion_porcentual
FROM rh_costos_nomina n25
JOIN rh_costos_nomina n24 ON n25.anio = 2025 AND n24.anio = 2024
UNION ALL
SELECT 
    'Costo de Horas Extras',
    n25.costo_horas_extras_pesos,
    n24.costo_horas_extras_pesos,
    (n25.costo_horas_extras_pesos - n24.costo_horas_extras_pesos),
    ROUND(((n25.costo_horas_extras_pesos - n24.costo_horas_extras_pesos) / n24.costo_horas_extras_pesos) * 100, 2)
FROM rh_costos_nomina n25
JOIN rh_costos_nomina n24 ON n25.anio = 2025 AND n24.anio = 2024
UNION ALL
SELECT 
    'Cantidad de Horas Extras',
    n25.horas_extras_cantidad,
    n24.horas_extras_cantidad,
    (n25.horas_extras_cantidad - n24.horas_extras_cantidad),
    ROUND(((n25.horas_extras_cantidad - n24.horas_extras_cantidad) / n24.horas_extras_cantidad) * 100, 2)
FROM rh_costos_nomina n25
JOIN rh_costos_nomina n24 ON n25.anio = 2025 AND n24.anio = 2024 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_rh_movimiento_planta_25_vs_24`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_rh_movimiento_planta_25_vs_24` AS SELECT
    p.anio,
    p.numero_personas AS headcount_cierre,
    r.ingresos_personas,
    r.retiros_personas,
    r.crecimiento_neto AS saldo_neto_movimientos
FROM rh_planta_personal p
JOIN rh_rotacion_personal r ON p.anio = r.anio
ORDER BY p.anio DESC 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_sgr_mapa_calor_riesgos`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_sgr_mapa_calor_riesgos` AS SELECT 
    area_auditada,
    COALESCE(CONCAT(porcentaje_incumplimiento, '%'), 'N/A') AS tasa_incumplimiento,
    descripcion_riesgo,
    plan_accion_implementado,
    CASE 
        WHEN porcentaje_incumplimiento >= 50.00 THEN 'RIESGO CRÍTICO - Requiere Auditoría Inmediata'
        WHEN porcentaje_incumplimiento >= 30.00 THEN 'RIESGO ALTO - Intervención en curso'
        ELSE 'RIESGO MODERADO - Monitoreo Activo'
    END AS nivel_alerta_sagrilaft
FROM sgr_hallazgos_planes_accion
ORDER BY porcentaje_incumplimiento DESC 
;

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_ti_mapa_tecnologico`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vista_ti_mapa_tecnologico` AS SELECT 
    'Plataforma Base' AS categoria,
    sistema_principal AS elemento,
    funcionalidades_asociadas AS detalle
FROM ti_ecosistema_tecnologico
UNION ALL
SELECT 
    CONCAT('Proyecto: ', estado_implementacion) AS categoria,
    nombre_proyecto AS elemento,
    descripcion_impacto AS detalle
FROM ti_hitos_proyectos
ORDER BY categoria DESC 
;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
