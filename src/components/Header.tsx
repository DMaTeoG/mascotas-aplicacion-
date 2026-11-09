'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, PlusCircle, Sparkles, User as UserIcon, LogOut, ChevronDown, AlertTriangle, ShieldCheck, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { ReportType } from '../types';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  unreadNotificationsCount: number;
  onOpenPublish: (type?: ReportType) => void;
  onOpenNotifications: () => void;
  onOpenMatches: () => void;
  onOpenAuth: () => void;
  onOpenProfile?: () => void;
  highMatchCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  unreadNotificationsCount,
  onOpenPublish,
  onOpenNotifications,
  onOpenMatches,
  onOpenAuth,
  onOpenProfile,
  highMatchCount,
}) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCaseType = (type: ReportType) => {
    setIsMenuOpen(false);
    onOpenPublish(type);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#DBBAA0]/35 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Identidad Oficial Huellitas & Rescate */}
        <BrandLogo variant="header" />

        {/* Acciones Rápidas */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botón Alertas de IA */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            onClick={onOpenMatches}
            className="relative flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-[#EBF7F5] text-[#233242] border border-[#DBBAA0]/50 transition-colors shadow-2xs cursor-pointer"
            title="Ver coincidencias detectadas por la Inteligencia Artificial"
          >
            <Sparkles className="w-4 h-4 text-[#62BCAB]" />
            <span className="hidden md:inline">Coincidencias</span>
            {highMatchCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#C6634A] text-white text-[11px] font-black">
                {highMatchCount}
              </span>
            )}
          </motion.button>

          {/* Botón Notificaciones */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-xl bg-white text-[#233242] hover:text-[#C6634A] hover:bg-[#FDF2EE] transition-colors cursor-pointer border border-[#DBBAA0]/40 shadow-2xs"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6634A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C6634A] ring-2 ring-white"></span>
              </span>
            )}
          </motion.button>

          {/* Botón de Autenticación / Usuario */}
          {user ? (
            <div className="flex items-center gap-1.5 pl-1 border-l border-[#DBBAA0]/50">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenProfile}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FDF2EE] hover:bg-[#FBE4DD] text-[#9A3E28] border border-[#C6634A]/30 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                title="Abrir Mi Perfil y Casos"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#C6634A]" />
                <span className="max-w-[100px] truncate">{user.first_name || user.username}</span>
                <span className="text-[10px] text-[#C6634A] font-semibold underline">Perfil</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={logout}
                className="p-2 rounded-xl text-stone-400 hover:text-[#C6634A] hover:bg-[#FDF2EE] transition-colors cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#233242] hover:text-[#C6634A] hover:bg-white bg-white/70 border border-[#DBBAA0]/50 transition-colors cursor-pointer shadow-2xs"
            >
              <UserIcon className="w-4 h-4 text-[#C6634A]" />
              <span>Ingresar</span>
            </motion.button>
          )}

          {/* Menú Desplegable: Crear un caso */}
          <div className="relative" ref={menuRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 px-4 sm:px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#233242] hover:bg-[#1C2834] text-white shadow-sm transition-colors cursor-pointer select-none"
            >
              <PlusCircle className="w-4 h-4 text-[#62BCAB] shrink-0" />
              <span>Crear un caso</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#DBBAA0]/40 py-2 z-50 overflow-hidden"
                >
                  <div className="px-3 py-1.5 border-b border-stone-100 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Selecciona el tipo de caso
                  </div>
                  <button
                    onClick={() => handleSelectCaseType('LOST')}
                    className="w-full flex items-start gap-3 px-3.5 py-2.5 hover:bg-[#FDF2EE] text-left transition-colors cursor-pointer group"
                  >
                    <div className="p-2 rounded-xl bg-[#FDF2EE] text-[#C6634A] mt-0.5 group-hover:scale-105 transition-transform border border-[#C6634A]/20">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#233242] group-hover:text-[#C6634A]">Mascota Perdida</div>
                      <div className="text-[11px] text-stone-500">Extravié a mi mascota y busco apoyo de la comunidad</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectCaseType('FOUND')}
                    className="w-full flex items-start gap-3 px-3.5 py-2.5 hover:bg-[#F9F5F0] text-left transition-colors cursor-pointer group"
                  >
                    <div className="p-2 rounded-xl bg-[#F9F5F0] text-[#8F6C4C] mt-0.5 group-hover:scale-105 transition-transform border border-[#DBBAA0]/40">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#233242] group-hover:text-[#8F6C4C]">Mascota Encontrada</div>
                      <div className="text-[11px] text-stone-500">Hallé un animalito y lo tengo en resguardo temporal</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectCaseType('ADOPTION')}
                    className="w-full flex items-start gap-3 px-3.5 py-2.5 hover:bg-[#EBF7F5] text-left transition-colors cursor-pointer group"
                  >
                    <div className="p-2 rounded-xl bg-[#EBF7F5] text-[#2C7B6D] mt-0.5 group-hover:scale-105 transition-transform border border-[#62BCAB]/30">
                      <Home className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#233242] group-hover:text-[#2C7B6D]">Poner en Adopción</div>
                      <div className="text-[11px] text-stone-500">Busco un hogar responsable y definitivo para un animal</div>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
