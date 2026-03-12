/**
 * Componentes de tabla reutilizables con tema blanco
 */

export function Table({ children, className = '' }) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }) {
  return (
    <thead>
      <tr className="bg-gradient-to-r from-blue-500 to-blue-600 border-b-2 border-blue-700">
        {children}
      </tr>
    </thead>
  );
}

export function TableHeaderCell({ children, align = 'left', className = '' }) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <th className={`py-3 px-4 text-white font-bold ${alignClass[align]} ${className}`}>
      {children}
    </th>
  );
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children, className = '', hover = true }) {
  return (
    <tr className={`border-b border-gray-200 ${hover ? 'hover:bg-blue-50/50 transition-colors' : ''} ${className}`}>
      {children}
    </tr>
  );
}

export function TableCell({ children, align = 'left', className = '', color }) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const colorClass = color || 'text-gray-900';

  return (
    <td className={`py-2 px-4 ${alignClass[align]} ${colorClass} ${className}`}>
      {children}
    </td>
  );
}

export function TableFooter({ children }) {
  return (
    <tfoot>
      <tr className="bg-gradient-to-r from-gray-100 to-gray-200 border-t-2 border-gray-300 font-bold">
        {children}
      </tr>
    </tfoot>
  );
}

export function TableFooterCell({ children, align = 'left', className = '' }) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <td className={`py-3 px-4 text-gray-900 ${alignClass[align]} ${className}`}>
      {children}
    </td>
  );
}
