'use client';

import React from 'react';
import { X, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MatchResult } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface MatchesListModalProps {
  isOpen: boolean;
  matches: MatchResult[];
  onClose: () => void;
  onSelectMatch: (m: MatchResult) => void;
}

export const MatchesListModal: React.FC<MatchesListModalProps> = ({
  isOpen,
  matches,
  onClose,
  onSelectMatch,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop con desenfoque orgánico */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm"
          />

          {/* Modal con física de resorte (spring) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200/90 my-8 relative z-10"
          >
            {/* Header del modal */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/80 shadow-xs">
                  <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">
                    Coincidencias Detectadas por la IA
                  </h2>
                  <p className="text-xs text-stone-500 font-medium">
                    Mascotas con alta correlación probabilística de rescate
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Lista de coincidencias */}
            <div className="mt-5 space-y-3.5 max-h-[62vh] overflow-y-auto pr-1">
              {matches.length === 0 ? (
                <div className="text-center py-14 text-stone-400">
                  <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-7 h-7 text-stone-400" />
                  </div>
                  <p className="text-sm font-bold text-stone-700">No hay coincidencias activas en este momento</p>
                  <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                    El motor de IA evaluará automáticamente cada nuevo reporte registrado en el sistema.
                  </p>
                </div>
              ) : (
                matches.map((m, index) => {
                  const lost = m.lost_pet_detail;
                  const found = m.found_pet_detail;
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04, type: 'spring', stiffness: 300, damping: 22 }}
                      whileHover={{ scale: 1.01, y: -2 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        onClose();
                        onSelectMatch(m);
                      }}
                      className="p-4.5 rounded-2xl border border-stone-200/90 bg-white hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer shadow-xs group"
                    >
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-indigo-600 text-white shadow-xs">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span className="font-mono">{m.score_percent}%</span>
                          <span>Coincidencia ({m.confidence_level})</span>
                        </span>
                        <span className="text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          Comparar Side-by-Side <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      <div className="flex items-center gap-3 my-3">
                        {/* Mascota Perdida */}
                        <div className="flex items-center gap-2.5 flex-1 min-w-0 bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
                          <img
                            src={lost?.image_url || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=400&q=80'}
                            alt="Perdido"
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-rose-300 shadow-2xs"
                          />
                          <div className="min-w-0">
                            <div className="text-[10px] font-black text-rose-600 uppercase tracking-wider">Perdido</div>
                            <div className="text-xs font-bold text-stone-900 truncate">{lost?.title}</div>
                          </div>
                        </div>

                        <div className="text-stone-300 font-extrabold text-xs shrink-0 px-1">VS</div>

                        {/* Mascota Encontrada */}
                        <div className="flex items-center gap-2.5 flex-1 min-w-0 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                          <img
                            src={found?.image_url || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=400&q=80'}
                            alt="Encontrado"
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-amber-300 shadow-2xs"
                          />
                          <div className="min-w-0">
                            <div className="text-[10px] font-black text-amber-700 uppercase tracking-wider">Encontrado</div>
                            <div className="text-xs font-bold text-stone-900 truncate">{found?.title}</div>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-stone-600 line-clamp-1 italic bg-stone-50 p-2.5 rounded-xl border border-stone-100 font-medium">
                        &ldquo;{m.explanation}&rdquo;
                      </p>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
