'use client';

import React, { useState } from 'react';
import { 
  MapPin, Calendar, Heart, MessageSquare, Sparkles, 
  ExternalLink, AlertTriangle, ShieldCheck, Home 
} from 'lucide-react';
import { Pet, MatchResult } from '../../types';
import { motion } from 'motion/react';

interface PetCardProps {
  pet: Pet;
  matches: MatchResult[];
  onLike: (petId: number) => void;
  onOpenComments: (pet: Pet) => void;
  onOpenMatchModal: (match: MatchResult) => void;
  onOpenAdoptionModal: (pet: Pet) => void;
  onVisualSearch?: (pet: Pet) => void;
  onOpenClaimModal?: (pet: Pet) => void;
}

export const PetCard: React.FC<PetCardProps> = ({
  pet,
  matches,
  onLike,
  onOpenComments,
  onOpenMatchModal,
  onOpenAdoptionModal,
  onVisualSearch,
  onOpenClaimModal,
}) => {
  const [likes, setLikes] = useState(pet.likes_count || 0);
  const [isLiked, setIsLiked] = useState(false);

  // Buscar si esta mascota tiene coincidencias altas asociadas
  const petMatch = matches.find(m => {
    const lId = typeof m.lost_pet === 'object' ? (m.lost_pet as Pet).id : m.lost_pet;
    const fId = typeof m.found_pet === 'object' ? (m.found_pet as Pet).id : m.found_pet;
    return lId === pet.id || fId === pet.id;
  });

  const handleLike = () => {
    if (!isLiked) {
      setLikes(prev => prev + 1);
      setIsLiked(true);
      onLike(pet.id);
    }
  };

  // Formato de fecha
  const formattedDate = new Date(pet.event_date || pet.created_at).toLocaleDateString('es-CO', {
    month: 'short',
    day: 'numeric'
  });

  // Configuración visual por tipo de reporte
  const getBadgeConfig = () => {
    switch (pet.report_type) {
      case 'LOST':
        return {
          label: 'Perdido',
          classes: 'bg-rose-500/95 text-white ring-1 ring-rose-400/50',
          icon: AlertTriangle,
        };
      case 'FOUND':
        return {
          label: 'Encontrado',
          classes: 'bg-amber-500/95 text-white ring-1 ring-amber-400/50',
          icon: ShieldCheck,
        };
      case 'ADOPTION':
        return {
          label: 'En Adopción',
          classes: 'bg-emerald-500/95 text-white ring-1 ring-emerald-400/50',
          icon: Home,
        };
    }
  };

  const badge = getBadgeConfig();

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="group bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-stone-300 transition-all flex flex-col justify-between"
    >
      <div>
        {/* Contenedor de Imagen y Badges */}
        <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
          <img
            src={pet.image_url || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80'}
            alt={pet.title}
            className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25 pointer-events-none" />

          {/* Badge de Estado */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-xs backdrop-blur-xs ${badge.classes}`}>
              <badge.icon className="w-3.5 h-3.5" />
              {badge.label}
            </span>
          </div>

          {/* Recompensa (si aplica) */}
          {pet.reward && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute top-3 right-3 z-10"
            >
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-stone-950 shadow-md border border-amber-300/80">
                🎁 {pet.reward}
              </span>
            </motion.div>
          )}

          {/* Alerta de Coincidencia de IA Destacada */}
          {petMatch && (
            <div className="absolute bottom-3 left-3 right-3 z-10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenMatchModal(petMatch)}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-indigo-950/90 text-indigo-100 backdrop-blur-md text-xs font-bold hover:bg-indigo-900 border border-indigo-400/40 shadow-lg cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>Coincidencia IA: <strong className="text-white font-mono">{petMatch.score_percent}%</strong></span>
                </span>
                <span className="text-[11px] underline text-indigo-300 group-hover:text-white">Comparar →</span>
              </motion.button>
            </div>
          )}
        </div>

        {/* Cuerpo de la Tarjeta */}
        <div className="p-5">
          <h3 className="text-base font-extrabold text-stone-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
            {pet.title}
          </h3>

          {/* Atributos Clave */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-stone-100 text-stone-700">
              {pet.species === 'dog' ? '🐕 Canino' : '🐈 Felino'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-stone-100 text-stone-700">
              {pet.breed}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-stone-100 text-stone-700 capitalize">
              Color: {pet.primary_color}
            </span>
          </div>

          <p className="mt-3 text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {pet.description}
          </p>

          {/* Ubicación y Fecha */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <div className="flex items-center gap-1.5 max-w-[65%] truncate">
              <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span className="truncate font-medium">{pet.zone_name}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0 font-medium text-stone-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer de Acciones Comunitarias */}
      <div className="px-5 py-3.5 bg-stone-50/90 border-t border-stone-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* Botón Reacción / Like con física de pop */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer select-none ${
              isLiked 
                ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-2xs' 
                : 'text-stone-600 hover:bg-stone-200/70 border border-transparent'
            }`}
          >
            <motion.div
              animate={isLiked ? { scale: [1, 1.45, 0.9, 1] } : {}}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            </motion.div>
            <span className="font-mono">{likes}</span>
          </motion.button>

          {/* Botón Comentarios / Pistas */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => onOpenComments(pet)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-200/70 transition-colors cursor-pointer border border-transparent"
          >
            <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
            <span>Pistas</span>
          </motion.button>
        </div>

        {/* Botón Principal de Acción Contextual */}
        <div className="flex items-center gap-1.5">
          {pet.report_type === 'FOUND' && onVisualSearch && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onVisualSearch(pet)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 transition-colors cursor-pointer shadow-2xs"
              title="Buscar mascotas perdidas similares a esta foto mediante IA"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Foto IA</span>
            </motion.button>
          )}

          {pet.report_type === 'ADOPTION' ? (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onOpenAdoptionModal(pet)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Adoptar</span>
            </motion.button>
          ) : pet.report_type === 'FOUND' ? (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onOpenClaimModal ? onOpenClaimModal(pet) : onOpenComments(pet)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
              title="Demostrar que esta mascota te pertenece"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Es mía</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                if (petMatch) {
                  onOpenMatchModal(petMatch);
                } else {
                  onOpenComments(pet);
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>¿Lo viste?</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.article>
  );
};
