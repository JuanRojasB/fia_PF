import { useState, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { generateAutocompleteSuggestions } from '../utils/searchEngine';

const AISearch = memo(({ data, onCompare }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    setIsTyping(value.length > 0);

    if (value.length > 0) {
      const autocomplete = generateAutocompleteSuggestions(value);
      setAutocompleteSuggestions(autocomplete);
    } else {
      setAutocompleteSuggestions([]);
    }

    if (value.length > 2) {
      generateSuggestions(value);
    } else {
      setSuggestions([]);
    }
  }, []);

  const generateSuggestions = useCallback((searchQuery) => {
    const query = searchQuery.toLowerCase();
    const allItems = [
      ...data.activos.map(item => ({ ...item, category: 'ACTIVOS' })),
      ...data.pasivos.map(item => ({ ...item, category: 'PASIVOS' })),
      ...data.patrimonio.map(item => ({ ...item, category: 'PATRIMONIO' }))
    ];

    // Búsqueda inteligente
    const matches = allItems.filter(item => 
      item.accountName.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.subcategory?.toLowerCase().includes(query)
    ).slice(0, 5);

    setSuggestions(matches);
  }, [data]);

  const handleAutocompleteClick = useCallback((suggestion) => {
    setQuery(suggestion);
    setAutocompleteSuggestions([]);
    generateSuggestions(suggestion);
  }, [generateSuggestions]);

  const handleSuggestionClick = useCallback((item) => {
    setQuery(item.accountName);
    setSuggestions([]);
    onCompare([item]);
  }, [onCompare]);

  const quickActions = useMemo(() => [
    {
      label: 'Comparar Activos vs Pasivos',
      action: () => {
        const totalActivos = data.activos.find(i => i.subcategory === 'TOTAL');
        const totalPasivos = data.pasivos.find(i => i.subcategory === 'TOTAL');
        if (totalActivos && totalPasivos) {
          onCompare([totalActivos, totalPasivos]);
        }
      }
    },
    {
      label: 'Análisis de Liquidez',
      action: () => {
        const disponible = data.activos.find(i => i.accountName.includes('DISPONIBLE'));
        const obligaciones = data.pasivos.find(i => i.accountName.includes('OBLIGACIONES FINANCIERAS'));
        if (disponible && obligaciones) {
          onCompare([disponible, obligaciones]);
        }
      }
    },
    {
      label: 'Evolución Patrimonio',
      action: () => {
        const patrimonio = data.patrimonio.filter(i => i.subcategory !== 'TOTAL');
        onCompare(patrimonio);
      }
    }
  ], [data, onCompare]);

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 sm:mb-8">
      {/* Search Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl"
        style={{
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(148, 163, 184, 0.3)'
        }}
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" />
          <h3 className="text-base sm:text-lg font-semibold text-white">Búsqueda Inteligente</h3>
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
          </div>
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Busca cuentas, compara datos..."
            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-full text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none transition"
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(148, 163, 184, 0.7)',
              boxShadow: isTyping ? '0 0 0 1px rgba(56, 189, 248, 0.6)' : 'none'
            }}
          />
        </div>

        {/* Autocomplete Suggestions */}
        <AnimatePresence>
          {autocompleteSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 rounded-xl overflow-hidden"
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}
            >
              <div className="px-4 py-2 border-b border-gray-700/50">
                <p className="text-xs text-gray-400 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  Sugerencias inteligentes
                </p>
              </div>
              {autocompleteSuggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleAutocompleteClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-sky-900/20 transition-colors border-b border-gray-700/30 last:border-b-0 flex items-center gap-3"
                >
                  <Zap className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span className="text-white text-sm">{suggestion}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Account Suggestions */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 rounded-xl overflow-hidden"
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(31, 41, 55, 0.9)'
              }}
            >
              <div className="px-4 py-2 border-b border-gray-700/50">
                <p className="text-xs text-gray-400">Cuentas encontradas</p>
              </div>
              {suggestions.map((item, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-900/20 transition-colors border-b border-gray-700/50 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{item.accountName}</p>
                      <p className="text-sm text-gray-400">{item.category} • {item.subcategory}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.variation > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : item.variation < 0 ? (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      ) : null}
                      <span className="text-sky-400 text-sm">Ver detalles →</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        <div className="mt-3 sm:mt-4">
          <p className="text-xs text-gray-500 mb-2">Acciones rápidas:</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#7dd3fc',
                  border: '1px solid rgba(56, 189, 248, 0.5)'
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
});

AISearch.displayName = 'AISearch';

export default AISearch;
