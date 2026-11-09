'use client';

import React from 'react';
import { Search, Camera, Dog, Cat, Sparkles, X, Filter, Heart } from 'lucide-react';
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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-[#FAF8F5] to-[#F9F5F0] border border-[#DBBAA0]/45 p-6 sm:p-9 my-6 text-center shadow-xs">
      {/* Detalle visual sutil de fondo */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#62BCAB]/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#C6634A]/10 blur-2xl pointer-events-none" />

      {/* Título & Slogan Oficial */}
      <div className="relative max-w-2xl mx-auto mb-6 z-10">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-white text-[#233242] border border-[#DBBAA0]/60 mb-3 shadow-2xs">
          <Heart className="w-3.5 h-3.5 text-[#C6634A] fill-[#C6634A]" />
          <span className="text-[#C6634A] font-extrabold">Amor en cada huella</span>
          <span className="text-stone-400">•</span>
          <span className="text-[#2C7B6D] font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#62BCAB]" /> Búsqueda Inteligente
          </span>
        </span>

        <h1 className="text-2xl sm:text-4xl font-black text-[#233242] tracking-tight leading-tight">
          Encuentra a tu mascota o ayuda a devolver una a su hogar
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-2 font-medium">
          Describe características visibles, raza, zona o compara una fotografía con nuestro motor probabilístico de coincidencia visual.
        </p>
      </div>

      {/* Barra de Búsqueda Dual Central */}
      <div className="relative max-w-3xl mx-auto z-10">
        <div className="bg-white rounded-2xl shadow-lg shadow-[#233242]/5 border border-[#DBBAA0]/60 p-2 sm:p-2.5 flex flex-col sm:flex-row items-center gap-2">
          {/* Input de texto en lenguaje natural */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Ej: Labrador dorado en Salitre, gata siamesa con collar, criollo cachorro..."
              className="w-full pl-11 pr-8 py-3 text-xs sm:text-sm rounded-xl bg-transparent text-[#233242] placeholder:text-stone-400 font-medium focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-[#C6634A] rounded-lg cursor-pointer"
                aria-label="Borrar texto"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Botón de Búsqueda Visual por Foto con color terracota de marca */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenPhotoSearch}
            type="button"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#C6634A] hover:bg-[#B3553E] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
            title="Comparar fotografía con IA"
          >
            <Camera className="w-4 h-4" />
            <span>Buscar por Foto IA</span>
          </motion.button>
        </div>

        {/* Píldoras Rápidas de Filtrado */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs font-semibold">
          <span className="text-stone-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#C6634A]" />
            <span>Filtrar:</span>
          </span>

          <button
            onClick={() => onSpeciesChange('')}
            className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              selectedSpecies === ''
                ? 'bg-[#233242] text-white border-[#233242] font-bold shadow-2xs'
                : 'bg-white text-stone-600 border-[#DBBAA0]/50 hover:bg-[#F9F5F0]'
            }`}
          >
            Todas las especies
          </button>

          <button
            onClick={() => onSpeciesChange('dog')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              selectedSpecies === 'dog'
                ? 'bg-[#62BCAB] text-white border-[#62BCAB] font-bold shadow-2xs'
                : 'bg-white text-stone-600 border-[#DBBAA0]/50 hover:bg-[#EBF7F5]'
            }`}
          >
            <Dog className="w-3.5 h-3.5" />
            <span>Perros</span>
          </button>

          <button
            onClick={() => onSpeciesChange('cat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              selectedSpecies === 'cat'
                ? 'bg-[#C6634A] text-white border-[#C6634A] font-bold shadow-2xs'
                : 'bg-white text-stone-600 border-[#DBBAA0]/50 hover:bg-[#FDF2EE]'
            }`}
          >
            <Cat className="w-3.5 h-3.5" />
            <span>Gatos</span>
          </button>

          <select
            value={selectedSize}
            onChange={(e) => onSizeChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#DBBAA0]/50 bg-white text-[#233242] font-semibold cursor-pointer focus:outline-none"
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
