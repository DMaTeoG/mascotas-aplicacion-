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
      {/* Perdidos Activos (Terracota de marca) */}
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -3, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectTab(currentTab === 'LOST' ? 'ALL' : 'LOST')}
        className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 border shadow-2xs flex items-center gap-3.5 cursor-pointer transition-all ${
          currentTab === 'LOST'
            ? 'bg-[#FDF2EE] border-[#C6634A] ring-2 ring-[#C6634A]/30'
            : 'bg-white border-[#DBBAA0]/45 hover:border-[#C6634A]/50'
        }`}
      >
        <div className="w-11 h-11 rounded-xl bg-[#FDF2EE] text-[#C6634A] flex items-center justify-center shrink-0 border border-[#C6634A]/20 shadow-xs">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-[#233242] font-mono">
            {lostCount}
          </div>
          <div className="text-[11px] font-bold text-[#C6634A] uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6634A] animate-ping inline-block" />
            <span>Perdidos {currentTab === 'LOST' && '✓'}</span>
          </div>
        </div>
      </motion.div>

      {/* En Resguardo (Tono arena / sand de marca) */}
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -3, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectTab(currentTab === 'FOUND' ? 'ALL' : 'FOUND')}
        className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 border shadow-2xs flex items-center gap-3.5 cursor-pointer transition-all ${
          currentTab === 'FOUND'
            ? 'bg-[#F9F5F0] border-[#DBBAA0] ring-2 ring-[#DBBAA0]/40'
            : 'bg-white border-[#DBBAA0]/45 hover:border-[#DBBAA0]'
        }`}
      >
        <div className="w-11 h-11 rounded-xl bg-[#F9F5F0] text-[#8F6C4C] flex items-center justify-center shrink-0 border border-[#DBBAA0]/50 shadow-xs">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-[#233242] font-mono">
            {foundCount}
          </div>
          <div className="text-[11px] font-bold text-[#8F6C4C] uppercase tracking-wider mt-0.5">
            En Resguardo {currentTab === 'FOUND' && '✓'}
          </div>
        </div>
      </motion.div>

      {/* En Adopción (Teal verde mar de marca) */}
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -3, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectTab(currentTab === 'ADOPTION' ? 'ALL' : 'ADOPTION')}
        className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 border shadow-2xs flex items-center gap-3.5 cursor-pointer transition-all ${
          currentTab === 'ADOPTION'
            ? 'bg-[#EBF7F5] border-[#62BCAB] ring-2 ring-[#62BCAB]/30'
            : 'bg-white border-[#DBBAA0]/45 hover:border-[#62BCAB]/50'
        }`}
      >
        <div className="w-11 h-11 rounded-xl bg-[#EBF7F5] text-[#2C7B6D] flex items-center justify-center shrink-0 border border-[#62BCAB]/30 shadow-xs">
          <Heart className="w-5 h-5 fill-[#62BCAB]/30" />
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-[#233242] font-mono">
            {adoptionCount}
          </div>
          <div className="text-[11px] font-bold text-[#2C7B6D] uppercase tracking-wider mt-0.5">
            En Adopción {currentTab === 'ADOPTION' && '✓'}
          </div>
        </div>
      </motion.div>

      {/* Coincidencias IA */}
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -3, scale: 1.01 }}
        className="relative overflow-hidden bg-white rounded-2xl p-4 sm:p-5 border border-[#DBBAA0]/45 hover:border-[#62BCAB] shadow-2xs flex items-center justify-between"
      >
        <div 
          onClick={onOpenMatches}
          className="flex items-center gap-3.5 cursor-pointer flex-1"
        >
          <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] text-[#233242] flex items-center justify-center shrink-0 border border-[#DBBAA0]/40 shadow-xs">
            <Sparkles className="w-5 h-5 text-[#62BCAB]" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-[#233242] font-mono">
              {matchCount}
            </div>
            <div className="text-[11px] font-bold text-[#233242] uppercase tracking-wider mt-0.5 flex items-center gap-1">
              <span>Coincidencias</span>
              <span className="text-[#C6634A]">IA</span>
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
          className="p-2 rounded-xl text-[#233242] hover:text-[#C6634A] hover:bg-[#FDF2EE] transition-colors cursor-pointer border border-[#DBBAA0]/40"
          aria-label="Recalcular coincidencias IA"
          title="Recalcular análisis probabilístico"
        >
          <RefreshCw className={`w-4 h-4 ${isRecalculating ? 'animate-spin text-[#C6634A]' : ''}`} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
