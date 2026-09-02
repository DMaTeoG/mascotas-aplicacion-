'use client';

import React from 'react';
import { Pet } from '../../types';
import { X, Sparkles, MapPin, Search, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VisualMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  foundPet: Pet | null;
  results: Array<{ lost_pet: Pet; visual_score: number }>;
  loading: boolean;
  onSelectLostPet: (pet: Pet) => void;
}

export const VisualMatchModal: React.FC<VisualMatchModalProps> = ({
  isOpen,
  onClose,
  foundPet,
  results,
  loading,
  onSelectLostPet,
}) => {
  return (
    <AnimatePresence>
      {isOpen && foundPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop con desvanecimiento */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/65 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-stone-200/90 max-h-[90vh] flex flex-col relative z-10"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100 shadow-xs">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
                  Búsqueda Visual por Imagen (Deep Learning)
                </h2>
                <p className="text-xs text-stone-500 font-medium">
                  Analizando mascotas perdidas compatibles con la foto del reporte encontrado.
                </p>
              </div>
            </div>

            {/* Mascota Encontrada Base */}
            <div className="flex items-center gap-3.5 p-3.5 bg-stone-50 border border-stone-200/90 rounded-2xl mb-4">
              <img
                src={foundPet.image_url}
                alt={foundPet.title}
                className="w-16 h-16 rounded-xl object-cover border border-stone-200 shadow-2xs"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                  Mascota Encontrada de Referencia
                </span>
                <h4 className="font-bold text-sm text-stone-900 truncate mt-0.5">
                  {foundPet.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5 font-medium">
                  <span>{foundPet.breed}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {foundPet.zone_name}
                  </span>
                </div>
              </div>
            </div>

            {/* Resultados */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-stone-600 mb-1">
                <span>Reportes de Perdidos con mayor similitud visual:</span>
                <span className="font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border border-purple-100">{results.length} coincidencias</span>
              </div>

              {loading ? (
                <div className="py-14 text-center text-stone-400 flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-semibold text-stone-700 mt-1">
                    Extrayendo vectores de imagen y computando similitud de coseno...
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="py-14 text-center text-stone-400">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-2">
                    <Search className="w-6 h-6 text-stone-400" />
                  </div>
                  <p className="text-sm font-bold text-stone-700">No se hallaron mascotas perdidas similares.</p>
                  <p className="text-xs text-stone-400 mt-1">
                    Puedes probar más tarde a medida que la comunidad publique nuevos reportes.
                  </p>
                </div>
              ) : (
                results.map(({ lost_pet, visual_score }, i) => (
                  <motion.div
                    key={lost_pet.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 24 }}
                    whileHover={{ scale: 1.01, y: -1 }}
                    className="p-3.5 bg-white border border-stone-200/90 hover:border-purple-300 rounded-2xl flex items-center justify-between gap-3 shadow-xs hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={lost_pet.image_url}
                        alt={lost_pet.title}
                        className="w-14 h-14 rounded-xl object-cover border border-stone-200 shadow-2xs"
                      />
                      <div className="min-w-0">
                        <h5 className="font-extrabold text-sm text-stone-900 truncate group-hover:text-purple-600 transition-colors">
                          {lost_pet.title}
                        </h5>
                        <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5 font-medium">
                          <span className="font-bold text-stone-700">{lost_pet.breed}</span>
                          <span>•</span>
                          <span>{lost_pet.zone_name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-base font-black text-purple-600 font-mono">
                          {visual_score}%
                        </div>
                        <span className="text-[10px] text-stone-400 font-semibold">Similitud Visual</span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          onSelectLostPet(lost_pet);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl bg-purple-50 group-hover:bg-purple-600 text-purple-600 group-hover:text-white transition-all cursor-pointer shadow-xs"
                        title="Ver reporte completo"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
