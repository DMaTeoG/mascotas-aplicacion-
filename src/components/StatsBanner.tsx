'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, Heart, Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsBannerProps {
  lostCount: number;
  foundCount: number;
  adoptionCount: number;
  matchCount: number;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenMatches: () => void;
  isRecalculating: boolean;
  onRecalculateMatches: () => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  lostCount,
  foundCount,
  adoptionCount,
  matchCount,
  currentTab,
  onSelectTab,
  onOpenMatches,
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
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectTab(currentTab === 'LOST' ? 'ALL' : 'LOST')}
        className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 border shadow-xs flex items-center gap-3.5 cursor-pointer transition-all ${
          currentTab === 'LOST'
            ? 'bg-rose-50/90 border-rose-500 ring-2 ring-rose-500/30'
            : 'bg-white border-stone-200/90 hover:border-rose-300'
        }`}
      >
        <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100 shadow-xs">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 font-mono">
            {lostCount}
          </div>
          <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block" />
            <span>Perdidos {currentTab === 'LOST' && '✓'}</span>
          </div>
        </div>
      </motion.div>

      {/* En Resguardo */}
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -3, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectTab(currentTab === 'FOUND' ? 'ALL' : 'FOUND')}
        className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 border shadow-xs flex items-center gap-3.5 cursor-pointer transition-all ${
          currentTab === 'FOUND'
            ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-500/30'
            : 'bg-white border-stone-200/90 hover:border-amber-300'
        }`}
      >
        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100 shadow-xs">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 font-mono">
            {foundCount}
          </div>
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mt-0.5">
            En Resguardo {currentTab === 'FOUND' && '✓'}
          </div>
        </div>
      </motion.div>

      {/* En Adopción */}
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -3, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectTab(currentTab === 'ADOPTION' ? 'ALL' : 'ADOPTION')}
        className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 border shadow-xs flex items-center gap-3.5 cursor-pointer transition-all ${
          currentTab === 'ADOPTION'
            ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/30'
            : 'bg-white border-stone-200/90 hover:border-emerald-300'
        }`}
      >
        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-xs">
          <Heart className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 font-mono">
            {adoptionCount}
          </div>
          <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mt-0.5">
            En Adopción {currentTab === 'ADOPTION' && '✓'}
          </div>
        </div>
      </motion.div>

      {/* Coincidencias IA */}
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -3, scale: 1.01 }}
        className="relative overflow-hidden bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 hover:border-indigo-300 shadow-xs flex items-center justify-between"
      >
        <div 
          onClick={onOpenMatches}
          className="flex items-center gap-3.5 cursor-pointer flex-1"
        >
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 font-mono">
              {matchCount}
            </div>
            <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider mt-0.5">
              Coincidencias IA
            </div>
          </div>
        </div>

        {/* Botón recalcular */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.88, rotate: 180 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          onClick={(e) => {
            e.stopPropagation();
            onRecalculateMatches();
          }}
          disabled={isRecalculating}
          className="p-2 rounded-xl text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 transition-colors cursor-pointer border border-indigo-200/50"
          aria-label="Recalcular coincidencias IA"
          title="Recalcular análisis probabilístico"
        >
          <RefreshCw className={`w-4 h-4 ${isRecalculating ? 'animate-spin text-indigo-700' : ''}`} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
