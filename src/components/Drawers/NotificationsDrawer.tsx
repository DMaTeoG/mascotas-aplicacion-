'use client';

import React from 'react';
import { X, Sparkles, Bell, CheckCircle2, ArrowRight } from 'lucide-react';
import { NotificationItem } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  notifications: NotificationItem[];
  onClose: () => void;
  onOpenMatchList: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  notifications,
  onClose,
  onOpenMatchList,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop con desvanecimiento */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/45 backdrop-blur-xs"
          />

          {/* Drawer con física de resorte */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col relative z-10 border-l border-stone-200"
          >
            {/* Header */}
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/80 shadow-xs">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-stone-900 tracking-tight">Centro de Notificaciones</h3>
                  <p className="text-xs text-stone-500 font-medium">Alertas de coincidencias y avisos comunitarios</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Cerrar drawer"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Lista de Alertas */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-20 text-stone-400">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-stone-700">Estás al día</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">No hay nuevas alertas pendientes en tu bandeja.</p>
                </div>
              ) : (
                notifications.map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, type: 'spring', stiffness: 320, damping: 24 }}
                    className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/90 text-xs text-stone-800 space-y-2 hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold text-indigo-950">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        {n.title}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {new Date(n.created_at).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-stone-600 leading-relaxed font-medium">{n.message}</p>

                    {n.notification_type === 'MATCH' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          onClose();
                          onOpenMatchList();
                        }}
                        className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] cursor-pointer shadow-xs transition-colors"
                      >
                        <span>Ver Coincidencias en Comparador</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </motion.button>
                    )}
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
