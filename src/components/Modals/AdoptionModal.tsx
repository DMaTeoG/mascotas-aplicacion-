'use client';

import React, { useState } from 'react';
import { X, Heart, CheckCircle2 } from 'lucide-react';
import { Pet, AdoptionApplication } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface AdoptionModalProps {
  isOpen: boolean;
  pet: Pet | null;
  onClose: () => void;
  onSubmit: (app: AdoptionApplication) => Promise<void>;
}

export const AdoptionModal: React.FC<AdoptionModalProps> = ({
  isOpen,
  pet,
  onClose,
  onSubmit,
}) => {
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [city, setCity] = useState('Bogotá');
  const [housingType, setHousingType] = useState('Apartamento propio');
  const [hasOtherPets, setHasOtherPets] = useState(false);
  const [otherPetsDesc, setOtherPetsDesc] = useState('');
  const [hasChildren, setHasChildren] = useState(false);
  const [timeDedicated, setTimeDedicated] = useState('Más de 4 horas diarias');
  const [experience, setExperience] = useState('');
  const [agreeVisit, setAgreeVisit] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail || !applicantPhone || !experience || !pet) {
      alert("Por favor completa todos los campos del formulario de postulación.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        pet: pet.id,
        applicant_name: applicantName,
        applicant_email: applicantEmail,
        applicant_phone: applicantPhone,
        city,
        housing_type: housingType,
        has_other_pets: hasOtherPets,
        other_pets_description: otherPetsDesc,
        has_children: hasChildren,
        time_dedicated: timeDedicated,
        experience_description: experience,
        agree_to_home_visit: agreeVisit,
        status: 'PENDING'
      });
      setSubmitted(true);
    } catch {
      alert("Error al enviar solicitud. Intenta nuevamente.");
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

          {/* Modal con física de resorte */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200/90 my-8 relative z-10"
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-xs">
                  <Heart className="w-5 h-5 fill-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">
                    Solicitud de Adopción Responsable
                  </h2>
                  <p className="text-xs text-stone-500 font-medium">
                    Postulación para brindar un hogar a: <strong className="text-stone-800">{pet.title}</strong>
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

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-stone-900 tracking-tight">¡Solicitud Radicada con Éxito!</h3>
                <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed font-medium">
                  El refugio o rescatista de <strong>{pet.title}</strong> validará tu perfil y se contactará a tu WhatsApp (<span className="font-mono font-bold text-stone-800">{applicantPhone}</span>) en un plazo menor a 48 horas.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="mt-4 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                >
                  Entendido
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre y apellido"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-800 focus:bg-white focus:outline-hidden focus:border-emerald-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+57 300 0000000"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-800 focus:bg-white focus:outline-hidden focus:border-emerald-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      placeholder="correo@ejemplo.com"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-800 focus:bg-white focus:outline-hidden focus:border-emerald-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Ciudad / Localidad</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-800 focus:bg-white focus:outline-hidden focus:border-emerald-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tipo de Vivienda</label>
                  <select
                    value={housingType}
                    onChange={(e) => setHousingType(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-stone-200 text-stone-800 focus:outline-hidden focus:border-emerald-500 font-medium cursor-pointer"
                  >
                    <option value="Apartamento propio">Apartamento propio</option>
                    <option value="Apartamento en arriendo">Apartamento en arriendo (permite mascotas)</option>
                    <option value="Casa con patio o jardín">Casa con patio o jardín</option>
                    <option value="Finca o zona campestre">Finca o zona campestre</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 text-xs text-stone-700 p-2.5 rounded-xl border border-stone-200 bg-stone-50/60 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={hasOtherPets}
                      onChange={(e) => setHasOtherPets(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                    />
                    <span className="font-semibold">¿Otras mascotas?</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-stone-700 p-2.5 rounded-xl border border-stone-200 bg-stone-50/60 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={hasChildren}
                      onChange={(e) => setHasChildren(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                    />
                    <span className="font-semibold">¿Niños en casa?</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ¿Por qué deseas adoptar a {pet.title}? Experiencia previa *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Cuéntanos sobre tu rutina, tiempo para paseos y compromiso con su cuidado veterinario..."
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-800 focus:bg-white focus:outline-hidden focus:border-emerald-500 resize-none font-medium"
                  />
                </div>

                <label className="flex items-start gap-2.5 text-xs text-stone-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeVisit}
                    onChange={(e) => setAgreeVisit(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                  />
                  <span className="font-medium leading-relaxed">
                    Acepto una entrevista virtual o visita de seguimiento para validar las condiciones de bienestar del animal.
                  </span>
                </label>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Solicitud de Adopción'}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
