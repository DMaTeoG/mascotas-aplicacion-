'use client';

import React from 'react';
import { Search, Camera, Dog, Cat, Sparkles, X, Filter } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSearchProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedSpecies: string;
  onSpeciesChange: (sp: string) => void;
  selectedSize: string;
  onSizeChange: (sz: string) => void;
  onOpenPhotoSearch: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  searchTerm,
  onSearchChange,
  selectedSpecies,
  onSpeciesChange,
  selectedSize,
  onSizeChange,
  onOpenPhotoSearch,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-stone-100/90 to-amber-50/40 border border-stone-200/90 p-6 sm:p-9 my-6 text-center shadow-xs">
      {/* Título & Propósito Humano */}
      <div className="max-w-2xl mx-auto mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100/90 text-amber-900 border border-amber-300/80 mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Búsqueda Inteligente Comunitaria</span>
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight leading-tight">
          Encuentra a tu mascota o ayuda a devolver una a su hogar
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-2 font-medium">
          Describe características visibles, raza, zona o sube una fotografía para cruzar reportes con nuestro motor probabilístico de coincidencia.
        </p>
      </div>

      {/* Barra de Búsqueda Dual Central */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg shadow-stone-900/5 border border-stone-200/90 p-2 sm:p-2.5 flex flex-col sm:flex-row items-center gap-2">
          {/* Input de texto en lenguaje natural */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Ej: Labrador dorado en Salitre, gata siamesa con collar, criollo cachorro..."
              className="w-full pl-11 pr-8 py-3 text-xs sm:text-sm rounded-xl bg-transparent text-stone-900 placeholder:text-stone-400 font-medium focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
                aria-label="Borrar texto"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Botón de Búsqueda Visual por Foto */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenPhotoSearch}
            type="button"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
            title="Comparar fotografía con IA"
          >
            <Camera className="w-4 h-4" />
            <span>Buscar por Foto IA</span>
          </motion.button>
        </div>

        {/* Píldoras Rápidas de Filtrado */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs font-semibold">
          <span className="text-stone-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <span>Filtrar:</span>
          </span>

          <button
            onClick={() => onSpeciesChange('')}
            className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              selectedSpecies === ''
                ? 'bg-stone-900 text-white border-stone-900 font-bold'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            Todas las especies
          </button>

          <button
            onClick={() => onSpeciesChange('dog')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              selectedSpecies === 'dog'
                ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Dog className="w-3.5 h-3.5" />
            <span>Perros</span>
          </button>

          <button
            onClick={() => onSpeciesChange('cat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              selectedSpecies === 'cat'
                ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Cat className="w-3.5 h-3.5" />
            <span>Gatos</span>
          </button>

          <select
            value={selectedSize}
            onChange={(e) => onSizeChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-stone-700 cursor-pointer focus:outline-none"
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
