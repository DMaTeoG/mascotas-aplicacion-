'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, Heart, Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsBannerProps {
  lostCount: number;
  foundCount: number;
  adoptionCount: number;
  matchCount: number;
  isRecalculating: boolean;
  onRecalculateMatches: () => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  lostCount,
  foundCount,
  adoptionCount,
  matchCount,
  isRecalculating,
  onRecalculateMatches,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 280, damping: 22 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 my-6"
    >
      {/* Perdidos Activos */}
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -3, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        className="relative overflow-hidden bg-white/95 rounded-2xl p-4 sm:p-5 border border-rose-200/90 shadow-xs flex items-center gap-3.5 group"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-100/50 to-transparent rounded-bl-full pointer-events-none" />
        <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100 shadow-xs group-hover:scale-105 transition-transform">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="relative z-10">
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 font-mono">
            {lostCount}
          </div>
          <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block" />
            <span>Perdidos</span>
          </div>
        </div>
      </motion.div>

      {/* En Resguardo */}
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -3, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        className="relative overflow-hidden bg-white/95 rounded-2xl p-4 sm:p-5 border border-amber-200/90 shadow-xs flex items-center gap-3.5 group"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-100/50 to-transparent rounded-bl-full pointer-events-none" />
        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 shadow-xs group-hover:scale-105 transition-transform">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="relative z-10">
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 font-mono">
            {foundCount}
          </div>
          <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mt-0.5">
            En Resguardo
          </div>
        </div>
      </motion.div>

      {/* En Adopción */}
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -3, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        className="relative overflow-hidden bg-white/95 rounded-2xl p-4 sm:p-5 border border-emerald-200/90 shadow-xs flex items-center gap-3.5 group"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-bl-full pointer-events-none" />
        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-xs group-hover:scale-105 transition-transform">
          <Heart className="w-5 h-5" />
        </div>
        <div className="relative z-10">
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 font-mono">
            {adoptionCount}
          </div>
          <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mt-0.5">
            En Adopción
          </div>
        </div>
      </motion.div>

      {/* Coincidencias IA */}
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -3, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        className="relative overflow-hidden bg-white/95 rounded-2xl p-4 sm:p-5 border border-indigo-200/90 shadow-xs flex items-center justify-between group"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-100/50 to-transparent rounded-bl-full pointer-events-none" />
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 shadow-xs group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 font-mono">
              {matchCount}
            </div>
            <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider mt-0.5">
              Matches IA (&gt;80%)
            </div>
          </div>
        </div>

        {/* Botón recalcular con retroalimentación física */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.88, rotate: 180 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          onClick={onRecalculateMatches}
          disabled={isRecalculating}
          className="relative z-10 p-2.5 rounded-xl text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 transition-colors cursor-pointer border border-indigo-200/50"
          aria-label="Recalcular coincidencias IA"
          title="Recalcular motor de coincidencia probabilística"
        >
          <RefreshCw className={`w-4 h-4 ${isRecalculating ? 'animate-spin text-indigo-700' : ''}`} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
