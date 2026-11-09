'use client';

import React from 'react';
import { Search, Dog, Cat, Flame, X, AlertTriangle, ShieldCheck, Home } from 'lucide-react';
import { motion } from 'motion/react';

interface FilterBarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  selectedSpecies: string;
  onSpeciesChange: (sp: string) => void;
  selectedSize: string;
  onSizeChange: (sz: string) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  counts: {
    all: number;
    lost: number;
    found: number;
    adoption: number;
  };
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentTab,
  onTabChange,
  selectedSpecies,
  onSpeciesChange,
  selectedSize,
  onSizeChange,
  searchTerm,
  onSearchChange,
  counts,
}) => {
  const tabs = [
    {
      id: 'ALL',
      label: 'Explorar Todo',
      icon: Flame,
      count: counts.all,
      accentColor: 'text-[#C6634A]',
    },
    {
      id: 'LOST',
      label: 'Perdidos',
      icon: AlertTriangle,
      count: counts.lost,
      accentColor: 'text-[#C6634A]',
    },
    {
      id: 'FOUND',
      label: 'Encontrados',
      icon: ShieldCheck,
      count: counts.found,
      accentColor: 'text-[#8F6C4C]',
    },
    {
      id: 'ADOPTION',
      label: 'En Adopción',
      icon: Home,
      count: counts.adoption,
      accentColor: 'text-[#62BCAB]',
    },
  ];

  return (
    <div className="bg-white/95 rounded-2xl border border-[#DBBAA0]/45 p-4 sm:p-5 shadow-xs space-y-4 mb-6 backdrop-blur-md">
      {/* Pestañas Principales con Pastilla Deslizante Fluida (layoutId) */}
      <div className="relative flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none p-1 bg-[#FAF8F5] rounded-2xl border border-[#DBBAA0]/35">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap z-10 ${
                isActive ? 'text-[#233242]' : 'text-stone-500 hover:text-[#233242]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilterTabIndicator"
                  className="absolute inset-0 bg-white rounded-xl shadow-xs border border-[#DBBAA0]/50 z-[-1]"
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                />
              )}
              <Icon className={`w-4 h-4 shrink-0 ${tab.accentColor}`} />
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold transition-colors ${
                  isActive
                    ? 'bg-[#233242] text-white'
                    : 'bg-[#DBBAA0]/25 text-stone-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Controles de Búsqueda y Filtros Secundarios */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-1 border-t border-[#DBBAA0]/20">
        {/* Input de Búsqueda */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nombre, raza, color o zona (ej. Golden, Salitre)..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl bg-[#FAF8F5] border border-[#DBBAA0]/45 focus:bg-white focus:border-[#C6634A] focus:ring-2 focus:ring-[#C6634A]/20 outline-hidden transition-all text-[#233242] placeholder:text-stone-400 font-medium"
          />
          {searchTerm && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-[#C6634A] rounded-lg hover:bg-[#FDF2EE] cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </div>

        {/* Filtros Rápidos de Especie */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSpeciesChange(selectedSpecies === 'dog' ? '' : 'dog')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              selectedSpecies === 'dog'
                ? 'bg-[#62BCAB] text-white border-[#62BCAB] shadow-xs'
                : 'bg-white border-[#DBBAA0]/45 text-stone-700 hover:bg-[#EBF7F5]'
            }`}
          >
            <Dog className="w-3.5 h-3.5" />
            <span>Perros</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSpeciesChange(selectedSpecies === 'cat' ? '' : 'cat')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              selectedSpecies === 'cat'
                ? 'bg-[#C6634A] text-white border-[#C6634A] shadow-xs'
                : 'bg-white border-[#DBBAA0]/45 text-stone-700 hover:bg-[#FDF2EE]'
            }`}
          >
            <Cat className="w-3.5 h-3.5" />
            <span>Gatos</span>
          </motion.button>

          {/* Filtro de Tamaño */}
          <select
            value={selectedSize}
            onChange={(e) => onSizeChange(e.target.value)}
            aria-label="Filtrar por tamaño de mascota"
            className="px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-white border border-[#DBBAA0]/45 text-[#233242] hover:border-[#DBBAA0] focus:outline-hidden focus:border-[#C6634A] cursor-pointer shadow-2xs"
          >
            <option value="">Cualquier tamaño</option>
            <option value="small">Pequeño</option>
            <option value="medium">Mediano</option>
            <option value="large">Grande</option>
          </select>
        </div>
      </div>
    </div>
  );
};
