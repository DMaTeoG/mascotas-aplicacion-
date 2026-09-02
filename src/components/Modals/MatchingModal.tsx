'use client';

import React from 'react';
import { X, Sparkles, MapPin, Phone } from 'lucide-react';
import { MatchResult } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface MatchingModalProps {
  match: MatchResult | null;
  onClose: () => void;
  onConfirmMatch: (match: MatchResult) => void;
}

export const MatchingModal: React.FC<MatchingModalProps> = ({
  match,
  onClose,
  onConfirmMatch,
}) => {
  if (!match) return null;

  const lost = match.lost_pet_detail;
  const found = match.found_pet_detail;

  if (!lost || !found) return null;

  const breakdown = match.factors_breakdown || {
    species_score: 1.0,
    breed_score: 0.85,
    color_score: 1.0,
    size_gender_score: 1.0,
    geo_score: 0.95,
    distance_km: 0.6,
    time_score: 1.0,
    diff_hours: 15
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop con desenfoque orgánico */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/65 backdrop-blur-sm"
        />

        {/* Modal con física de resorte (spring) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 16 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200/90 my-8 relative z-10"
        >
          {/* Header del Modal */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-xs">
                <Sparkles className="w-5 h-5 animate-pulse text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">
                  Comparador Inteligente de Coincidencia (Side-by-Side)
                </h2>
                <p className="text-xs text-stone-500 font-medium">
                  Análisis probabilístico explicable de rasgos físicos, zona y ventana temporal
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              aria-label="Cerrar modal de coincidencia"
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Resumen del Score y Explicabilidad (XAI) */}
          <div className="my-6 p-4.5 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-pink-50/50 border border-indigo-200/80">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl font-black text-indigo-950 font-mono tracking-tight">
                    {match.score_percent}%
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold shadow-2xs ${
                    match.score_percent >= 80 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    Confianza: {match.confidence_level}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-stone-700 leading-relaxed font-medium">
                  {match.explanation}
                </p>
              </div>

              {/* Barra de progreso visual con animación suave */}
              <div className="w-full sm:w-48 bg-stone-200/80 rounded-full h-3 overflow-hidden shrink-0">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${match.score_percent}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Comparación Visual Lado a Lado (Side-by-Side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative">
            {/* Mascota Perdida */}
            <div className="p-5 rounded-2xl border-2 border-rose-200 bg-rose-50/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500 text-white shadow-xs">
                    Mascota Perdida 🚨
                  </span>
                  <span className="text-xs text-stone-500 font-mono font-bold">Reporte #{lost.id}</span>
                </div>

                <div className="aspect-4/3 rounded-xl overflow-hidden bg-stone-100 mb-3 shadow-inner">
                  <img
                    src={lost.image_url}
                    alt={lost.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h4 className="font-extrabold text-stone-900 text-sm mb-2">{lost.title}</h4>

                <div className="space-y-1.5 text-xs text-stone-600 font-medium">
                  <p><strong>Especie:</strong> {lost.species === 'dog' ? 'Perro' : 'Gato'} ({lost.breed})</p>
                  <p><strong>Color:</strong> {lost.primary_color} {lost.secondary_color && `con ${lost.secondary_color}`}</p>
                  <p><strong>Tamaño:</strong> {lost.size} | <strong>Sexo:</strong> {lost.gender}</p>
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{lost.zone_name}</span>
                  </p>
                  <p className="text-stone-500 italic mt-2">&ldquo;{lost.description}&rdquo;</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-200/80 text-xs text-rose-950 font-medium">
                <p><strong>Contacto:</strong> {lost.contact_name} ({lost.contact_phone || 'Sin tel.'})</p>
              </div>
            </div>

            {/* Mascota Encontrada */}
            <div className="p-5 rounded-2xl border-2 border-amber-200 bg-amber-50/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-white shadow-xs">
                    Mascota Encontrada 🐾
                  </span>
                  <span className="text-xs text-stone-500 font-mono font-bold">Reporte #{found.id}</span>
                </div>

                <div className="aspect-4/3 rounded-xl overflow-hidden bg-stone-100 mb-3 shadow-inner">
                  <img
                    src={found.image_url}
                    alt={found.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h4 className="font-extrabold text-stone-900 text-sm mb-2">{found.title}</h4>

                <div className="space-y-1.5 text-xs text-stone-600 font-medium">
                  <p><strong>Especie:</strong> {found.species === 'dog' ? 'Perro' : 'Gato'} ({found.breed})</p>
                  <p><strong>Color:</strong> {found.primary_color} {found.secondary_color && `con ${found.secondary_color}`}</p>
                  <p><strong>Tamaño:</strong> {found.size} | <strong>Sexo:</strong> {found.gender}</p>
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{found.zone_name}</span>
                  </p>
                  <p className="text-stone-500 italic mt-2">&ldquo;{found.description}&rdquo;</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/80 text-xs text-amber-950 font-medium">
                <p><strong>Resguardado por:</strong> {found.contact_name} ({found.contact_phone || 'Sin tel.'})</p>
              </div>
            </div>
          </div>

          {/* Desglose Matemático de Factores de Similitud */}
          <div className="mt-6 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <h4 className="text-xs font-extrabold text-stone-700 uppercase tracking-wider mb-3">
              Desglose de Coincidencias por Factor (Reglas del Algoritmo)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-stone-200">
                <div className="text-stone-500 font-medium">Especie</div>
                <div className="font-bold text-stone-900 mt-0.5">100% (Coincide)</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-stone-200">
                <div className="text-stone-500 font-medium">Color y Patrón</div>
                <div className="font-bold text-stone-900 mt-0.5">{Math.round((breakdown.color_score || 1) * 100)}% Similitud</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-stone-200">
                <div className="text-stone-500 font-medium">Proximidad Geográfica</div>
                <div className="font-bold text-stone-900 mt-0.5">~{breakdown.distance_km || 0.6} km</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-stone-200">
                <div className="text-stone-500 font-medium">Delta Temporal</div>
                <div className="font-bold text-stone-900 mt-0.5">~{Math.round(breakdown.diff_hours || 12)} horas</div>
              </div>
            </div>
          </div>

          {/* Acciones de Resolución */}
          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-stone-500 text-center sm:text-left font-medium">
              💡 Verifica siempre señales distintivas físicas antes de movilizarte.
            </p>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              >
                Cerrar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onConfirmMatch(match)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Contactar Rescatista</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
