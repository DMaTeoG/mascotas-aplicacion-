'use client';

import React, { useState } from 'react';
import { Pet } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from './ToastContainer';
import { ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PetClaimModalProps {
  pet: Pet | null;
  isOpen: boolean;
  onClose: () => void;
  onClaimSuccess?: () => void;
}

export const PetClaimModal: React.FC<PetClaimModalProps> = ({
  pet,
  isOpen,
  onClose,
  onClaimSuccess,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [proofDescription, setProofDescription] = useState('');
  const [proofImageUrl, setProofImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pet) return;
    if (!user) {
      showToast('Debes iniciar sesión para presentar un reclamo de propiedad', 'warning');
      return;
    }

    if (!proofDescription.trim()) {
      setErrorMsg('Por favor describe detalles privados que solo tú conoces sobre la mascota.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await api.submitClaim({
        pet: pet.id,
        proof_description: proofDescription,
        proof_image_url: proofImageUrl.trim() || undefined,
      });

      showToast('¡Reclamo radicado exitosamente! El rescatista revisará tus pruebas para confirmar.', 'success');
      setProofDescription('');
      setProofImageUrl('');
      if (onClaimSuccess) onClaimSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al radicar el reclamo';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && pet && (
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
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200/90 p-6 md:p-8 overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
                    Reclamar Propiedad de Mascota
                  </h2>
                  <p className="text-xs text-stone-500 font-medium">
                    Demuestra pertenencia para coordinar la entrega segura
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Info Mascota */}
            <div className="bg-stone-50 p-3.5 rounded-2xl mb-4 flex items-center gap-3.5 border border-stone-200/80">
              <img
                src={pet.image_url || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=400&q=80'}
                alt={pet.title}
                className="w-14 h-14 object-cover rounded-xl shadow-2xs border border-stone-200"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-stone-900 truncate">
                  {pet.title}
                </h4>
                <p className="text-xs text-stone-500 font-medium">
                  {pet.breed} • {pet.zone_name}
                </p>
                <span className="inline-block mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 rounded-md">
                  Reporte de Encontrado
                </span>
              </div>
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Pruebas Privadas / Marcas Secretas <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={proofDescription}
                  onChange={(e) => setProofDescription(e.target.value)}
                  placeholder="Describe detalles únicos que demuestren que es tu mascota (ej: marcas de nacimiento, manchas ocultas debajo del lomo, cicatrices, collar viejo, cómo responde ante su nombre o comandos)..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-hidden resize-none font-medium"
                />
                <p className="text-[11px] text-stone-500 mt-1 font-medium">
                  Esta información confidencial solo la verá la persona que tiene actualmente a la mascota para verificar la autenticidad.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  URL de Foto Antigua o Carnet de Vacunación (Opcional)
                </label>
                <input
                  type="url"
                  value={proofImageUrl}
                  onChange={(e) => setProofImageUrl(e.target.value)}
                  placeholder="https://ejemplo.com/foto-con-mi-mascota.jpg"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-hidden font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Radicando...' : 'Confirmar Reclamo'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
