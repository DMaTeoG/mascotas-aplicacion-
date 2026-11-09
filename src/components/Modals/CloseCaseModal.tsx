'use client';

import React, { useState } from 'react';
import { X, CheckCircle, Heart, Home, AlertCircle } from 'lucide-react';
import { Pet } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface CloseCaseModalProps {
  isOpen: boolean;
  pet: Pet | null;
  onClose: () => void;
  onConfirm: (petId: number, newStatus: 'RESOLVED' | 'ADOPTED') => Promise<void>;
}

export const CloseCaseModal: React.FC<CloseCaseModalProps> = ({
  isOpen,
  pet,
  onClose,
  onConfirm,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<'RESOLVED' | 'ADOPTED'>(
    pet?.report_type === 'ADOPTION' ? 'ADOPTED' : 'RESOLVED'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !pet) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm(pet.id, selectedStatus);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el estado del caso');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAdoption = pet.report_type === 'ADOPTION';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
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
          className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 relative z-10"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </motion.button>

          <div className="text-center mb-6">
            <div className="inline-flex p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 mb-3 border border-emerald-100">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900">
              Cerrar Caso Exitosamente
            </h2>
            <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
              Indica el motivo de resolución para actualizar el estado del caso y celebrar este resultado con la comunidad.
            </p>
          </div>

          {/* Tarjeta resumen de la mascota */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 mb-5">
            <img
              src={pet.image_url || '/placeholder-pet.jpg'}
              alt={pet.title}
              className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-stone-900 truncate">
                {pet.title}
              </h4>
              <p className="text-xs text-stone-500">
                {pet.zone_name} • {pet.breed}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Opciones de Estado */}
          <div className="space-y-2.5 mb-6">
            <label
              onClick={() => setSelectedStatus('RESOLVED')}
              className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                selectedStatus === 'RESOLVED'
                  ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                  : 'border-stone-200 hover:bg-stone-50'
              }`}
            >
              <input
                type="radio"
                name="caseStatus"
                checked={selectedStatus === 'RESOLVED'}
                onChange={() => setSelectedStatus('RESOLVED')}
                className="mt-1 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <div className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-emerald-600" />
                  <span>Mascota reunida con su familia / Resuelto</span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  La mascota regresó a salvo con su tutor o el reporte ya fue atendido.
                </p>
              </div>
            </label>

            <label
              onClick={() => setSelectedStatus('ADOPTED')}
              className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                selectedStatus === 'ADOPTED'
                  ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                  : 'border-stone-200 hover:bg-stone-50'
              }`}
            >
              <input
                type="radio"
                name="caseStatus"
                checked={selectedStatus === 'ADOPTED'}
                onChange={() => setSelectedStatus('ADOPTED')}
                className="mt-1 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <div className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-emerald-600" />
                  <span>Adoptado responsablemente</span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Se completó el proceso de adopción y ya cuenta con un hogar definitivo.
                </p>
              </div>
            </label>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Confirmar y Cerrar'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
