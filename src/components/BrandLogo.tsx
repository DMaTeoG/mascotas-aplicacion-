'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';

interface BrandLogoProps {
  variant?: 'header' | 'hero' | 'symbol' | 'footer';
  showTagline?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'header',
  showTagline = true,
  className = '',
  size = 'md',
}) => {
  // Dimension mapping for the symbol
  const symbolDimensions = {
    sm: { width: 34, height: 26, container: 'w-9 h-9' },
    md: { width: 44, height: 34, container: 'w-11 h-11' },
    lg: { width: 64, height: 50, container: 'w-16 h-16' },
    xl: { width: 96, height: 74, container: 'w-24 h-24' },
  }[size];

  if (variant === 'symbol') {
    return (
      <motion.div
        whileHover={{ scale: 1.05, rotate: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        className={`relative flex items-center justify-center rounded-2xl bg-white shadow-xs border border-stone-200/80 p-1.5 select-none ${symbolDimensions.container} ${className}`}
        aria-label="Logo Huellitas & Rescate"
      >
        <Image
          src="/brand-symbol.png"
          alt="Huellitas & Rescate"
          width={symbolDimensions.width}
          height={symbolDimensions.height}
          priority
          className="object-contain"
        />
      </motion.div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-3 flex items-center justify-center p-2 rounded-3xl bg-white/90 backdrop-blur-sm shadow-sm border border-[#DBBAA0]/40"
        >
          <Image
            src="/brand-symbol.png"
            alt="Huellitas & Rescate Simbolo"
            width={86}
            height={66}
            priority
            className="object-contain drop-shadow-xs"
          />
        </motion.div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#233242]">
          Huellitas <span className="text-[#C6634A]">&</span> Rescate
        </h1>

        {showTagline && (
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#62BCAB] uppercase mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6634A]" />
            <span>Amor en cada huella</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#62BCAB]" />
          </p>
        )}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center border border-stone-200/80 p-1 shrink-0 shadow-2xs">
          <Image
            src="/brand-symbol.png"
            alt="Huellitas & Rescate"
            width={34}
            height={26}
            className="object-contain"
          />
        </div>
        <div>
          <div className="text-sm font-black text-[#233242] tracking-tight leading-none">
            Huellitas <span className="text-[#C6634A]">& Rescate</span>
          </div>
          <div className="text-[11px] text-stone-500 font-medium mt-0.5">
            Amor en cada huella • Red comunitaria con IA
          </div>
        </div>
      </div>
    );
  }

  // Default: variant === 'header'
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div
        whileHover={{ scale: 1.05, rotate: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        className="relative flex items-center justify-center rounded-2xl bg-white shadow-xs border border-stone-200/90 p-1.5 cursor-pointer select-none w-11 h-11 shrink-0"
        aria-label="Logo Huellitas & Rescate"
      >
        <Image
          src="/brand-symbol.png"
          alt="Huellitas & Rescate"
          width={40}
          height={32}
          priority
          className="object-contain"
        />
      </motion.div>

      <div>
        <div className="flex items-center gap-2">
          <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#233242]">
            Huellitas <span className="text-[#C6634A] font-extrabold">&</span> Rescate
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#EBF7F5] text-[#2C7B6D] border border-[#62BCAB]/40">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#62BCAB] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#62BCAB]"></span>
            </span>
            <span>Comunidad Activa</span>
          </span>
        </div>

        {showTagline && (
          <p className="text-[11px] text-stone-500 hidden sm:block font-medium">
            <span className="text-[#C6634A] font-semibold">Amor en cada huella</span> • Red comunitaria y búsqueda colaborativa
          </p>
        )}
      </div>
    </div>
  );
};
