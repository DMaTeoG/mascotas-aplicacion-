'use client';

import React from 'react';
import { PawPrint, Bell, PlusCircle, Sparkles, BookOpen, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

interface HeaderProps {
  unreadNotificationsCount: number;
  onOpenPublish: () => void;
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

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-stone-200/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo & Marca con micro-interacción de física */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.08, rotate: -4 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 flex items-center justify-center shadow-md shadow-orange-500/25 text-white cursor-pointer select-none ring-1 ring-orange-400/40"
            aria-label="Logo Huellitas & Rescate"
          >
            <PawPrint className="w-6 h-6 drop-shadow-sm" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-stone-900 via-stone-800 to-orange-700 bg-clip-text text-transparent">
                Huellitas & Rescate
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>IA Activa</span>
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block font-medium">
              Red comunitaria y motor probabilístico de búsqueda animal
            </p>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botón Alertas de IA */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            onClick={onOpenMatches}
            className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 transition-colors shadow-xs cursor-pointer"
            title="Ver coincidencias detectadas por la Inteligencia Artificial"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="hidden md:inline font-bold">Coincidencias IA</span>
            {highMatchCount > 0 && (
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                className="px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-black shadow-xs"
              >
                {highMatchCount}
              </motion.span>
            )}
          </motion.button>

          {/* Botón Notificaciones */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 transition-colors cursor-pointer border border-stone-200/60"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 ring-2 ring-white"></span>
              </span>
            )}
          </motion.button>

          {/* Enlace a Documentación */}
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="https://github.com"
            onClick={(e) => {
              e.preventDefault();
              alert("Consulta la carpeta /docs con la arquitectura, reglas formales de IA y especificación de endpoints REST.");
            }}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/80 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-stone-500" />
            Docs .md
          </motion.a>

          {/* Botón de Autenticación / Usuario */}
          {user ? (
            <div className="flex items-center gap-1.5 pl-1 border-l border-stone-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenProfile}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100/80 text-orange-900 border border-orange-200 text-xs font-bold transition-colors cursor-pointer"
                title="Abrir Mi Perfil y Trazabilidad"
              >
                <UserIcon className="w-3.5 h-3.5 text-orange-600" />
                <span className="max-w-[100px] truncate">{user.first_name || user.username}</span>
                <span className="text-[10px] text-orange-600 font-normal underline">Perfil</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={logout}
                className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-stone-700 hover:text-indigo-600 hover:bg-indigo-50/60 border border-stone-200 hover:border-indigo-200 transition-colors cursor-pointer"
            >
              <UserIcon className="w-4 h-4" />
              <span>Acceder</span>
            </motion.button>
          )}

          {/* Botón Principal: Publicar Reporte */}
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.96, y: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            onClick={onOpenPublish}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 transition-shadow cursor-pointer select-none"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>Publicar Mascota</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};
