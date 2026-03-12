/**
 * Dashboard de Ejemplo - Muestra cómo usar los componentes reutilizables
 */

import { 
  HeaderCard, 
  GridContainer, 
  StatCard, 
  ChartCard, 
  TableCard,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TableFooterCell,
  InfoBadge,
  EmptyState
} from '../ui';
import { Modal } from '../ui/Modal';
import { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Package,
  Info 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  CHART_COLORS, 
  COMPARISON_COLORS, 
  TOOLTIP_STYLES, 
  AXIS_STYLES, 
  GRID_STYLES 
} from '../../utils/chartConfig';

export default function ExampleDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  const openModal = (title, message) => {
    setModalContent({ title, message });
    setModalOpen(true);
  };

  // Datos de ejemplo
  const statsData = [
    { label: 'Ventas Totales', value: '$125.5M', icon: DollarSign, color: 'blue', trend: 'up', trendValue: '+12.5% vs 2024' },
    { label: 'Clientes Activos', value: '1,234', icon: Users, color: 'green', trend: 'up', trendValue: '+8.3%' },
    { label: 'Productos', value: '456', icon: Package, color: 'purple', subtitle: 'En inventario' },
    { label: 'Crecimiento', value: '23%', icon: TrendingUp, color: 'cyan', trend: 'up', trendValue: 'Anual' },
  ];

  const chartData = [
    { mes: 'Ene', 2024: 4000, 2025: 4800 },
    { mes: 'Feb', 2024: 3000, 2025: 3900 },
    { mes: 'Mar', 2024: 2000, 2025: 2800 },
    { mes: 'Abr', 2024: 2780, 2025: 3200 },
    { mes: 'May', 2024: 1890, 2025: 2500 },
    { mes: 'Jun', 2024: 2390, 2025: 3100 },
  ];

  const tableData = [
    { producto: 'Producto A', ventas2024: 15000, ventas2025: 18000 },
    { producto: 'Producto B', ventas2024: 12000, ventas2025: 14500 },
    { producto: 'Producto C', ventas2024: 9000, ventas2025: 11000 },
  ];

  return (
    <div>
      {/* Header */}
      <HeaderCard
        icon={TrendingUp}
        title="Dashboard de Ejemplo"
        subtitle="Ejemplo de uso de componentes reutilizables con tema blanco"
      />

      {/* Stats Grid */}
      <GridContainer cols={4} className="mb-6">
        {statsData.map((stat, idx) => (
          <StatCard
            key={idx}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            subtitle={stat.subtitle}
            color={stat.color}
            trend={stat.trend}
            trendValue={stat.trendValue}
            delay={idx * 0.1}
            onClick={() => openModal(stat.label, `Información detallada sobre ${stat.label}`)}
          />
        ))}
      </GridContainer>

      {/* Chart */}
      <ChartCard title="Comparativa Mensual 2024 vs 2025" icon={TrendingUp} delay={0.4} className="mb-6">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid {...GRID_STYLES} />
            <XAxis dataKey="mes" {...AXIS_STYLES} />
            <YAxis {...AXIS_STYLES} />
            <Tooltip {...TOOLTIP_STYLES} />
            <Legend />
            <Bar dataKey="2024" fill={COMPARISON_COLORS.year2024} name="Año 2024" radius={[8, 8, 0, 0]} />
            <Bar dataKey="2025" fill={COMPARISON_COLORS.year2025} name="Año 2025" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Table */}
      <TableCard title="Ventas por Producto" delay={0.6}>
        <Table>
          <TableHeader>
            <TableHeaderCell>Producto</TableHeaderCell>
            <TableHeaderCell align="right">Ventas 2024</TableHeaderCell>
            <TableHeaderCell align="right">Ventas 2025</TableHeaderCell>
            <TableHeaderCell align="right">Variación</TableHeaderCell>
          </TableHeader>
          <TableBody>
            {tableData.map((row, idx) => {
              const variacion = ((row.ventas2025 - row.ventas2024) / row.ventas2024 * 100).toFixed(1);
              return (
                <TableRow key={idx}>
                  <TableCell>{row.producto}</TableCell>
                  <TableCell align="right" color="text-gray-600">
                    ${row.ventas2024.toLocaleString()}
                  </TableCell>
                  <TableCell align="right" color="text-blue-600">
                    ${row.ventas2025.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    <InfoBadge color={variacion > 0 ? 'green' : 'red'}>
                      {variacion > 0 ? '+' : ''}{variacion}%
                    </InfoBadge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableFooterCell>TOTAL</TableFooterCell>
            <TableFooterCell align="right">
              ${tableData.reduce((sum, row) => sum + row.ventas2024, 0).toLocaleString()}
            </TableFooterCell>
            <TableFooterCell align="right">
              ${tableData.reduce((sum, row) => sum + row.ventas2025, 0).toLocaleString()}
            </TableFooterCell>
            <TableFooterCell align="right">-</TableFooterCell>
          </TableFooter>
        </Table>
      </TableCard>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent.title}
        icon={Info}
      >
        <p>{modalContent.message}</p>
      </Modal>
    </div>
  );
}

