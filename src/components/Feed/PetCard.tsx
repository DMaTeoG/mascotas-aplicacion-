'use client';

import React, { useState } from 'react';
import { 
  MapPin, Calendar, Heart, MessageSquare, Sparkles, 
  ExternalLink, AlertTriangle, ShieldCheck, Home, CheckCircle 
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
  onCloseCase?: (pet: Pet) => void;
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
  onCloseCase,
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

  // Configuración visual por tipo de reporte alineada a la marca Huellitas & Rescate
  const getBadgeConfig = () => {
    switch (pet.report_type) {
      case 'LOST':
        return {
          label: 'Perdido',
          classes: 'bg-[#C6634A]/95 text-white ring-1 ring-[#C6634A]/50',
          icon: AlertTriangle,
        };
      case 'FOUND':
        return {
          label: 'Encontrado',
          classes: 'bg-[#8F6C4C]/95 text-white ring-1 ring-[#DBBAA0]',
          icon: ShieldCheck,
        };
      case 'ADOPTION':
        return {
          label: 'En Adopción',
          classes: 'bg-[#62BCAB]/95 text-white ring-1 ring-[#62BCAB]/50',
          icon: Home,
        };
    }
  };

  const badge = getBadgeConfig();

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="group bg-white rounded-3xl border border-[#DBBAA0]/45 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#DBBAA0] transition-all flex flex-col justify-between"
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
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-xs backdrop-blur-xs ${badge.classes}`}>
              <badge.icon className="w-3.5 h-3.5" />
              {badge.label}
            </span>
            {pet.status === 'RESOLVED' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-[#2C7B6D] text-white shadow-md border border-[#62BCAB]">
                ✅ Resuelto / Reunido
              </span>
            )}
            {pet.status === 'ADOPTED' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-[#233242] text-white shadow-md border border-[#DBBAA0]/50">
                🏠 Adoptado
              </span>
            )}
          </div>

          {/* Recompensa (si aplica) */}
          {pet.reward && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute top-3 right-3 z-10"
            >
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#C6634A] text-white shadow-md border border-white/40">
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
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#233242]/90 text-stone-100 backdrop-blur-md text-xs font-bold hover:bg-[#233242] border border-[#62BCAB]/40 shadow-lg cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#62BCAB] animate-pulse" />
                  <span>Coincidencia IA: <strong className="text-white font-mono">{petMatch.score_percent}%</strong></span>
                </span>
                <span className="text-[11px] underline text-[#62BCAB] group-hover:text-white">Comparar →</span>
              </motion.button>
            </div>
          )}
        </div>

        {/* Cuerpo de la Tarjeta */}
        <div className="p-5">
          <h3 className="text-base font-extrabold text-[#233242] line-clamp-1 group-hover:text-[#C6634A] transition-colors">
            {pet.title}
          </h3>

          {/* Atributos Clave */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[#FAF8F5] text-[#233242] border border-[#DBBAA0]/30">
              {pet.species === 'dog' ? '🐕 Canino' : '🐈 Felino'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[#FAF8F5] text-[#233242] border border-[#DBBAA0]/30">
              {pet.breed}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[#FAF8F5] text-[#233242] border border-[#DBBAA0]/30 capitalize">
              Color: {pet.primary_color}
            </span>
          </div>

          <p className="mt-3 text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {pet.description}
          </p>

          {/* Ubicación y Fecha */}
          <div className="mt-4 pt-3 border-t border-[#DBBAA0]/20 flex items-center justify-between text-xs text-stone-500">
            <div className="flex items-center gap-1.5 max-w-[65%] truncate">
              <MapPin className="w-3.5 h-3.5 text-[#C6634A] shrink-0" />
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
      <div className="px-5 py-3.5 bg-[#FAF8F5] border-t border-[#DBBAA0]/25 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* Botón Reacción / Like con física de pop */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer select-none ${
              isLiked 
                ? 'bg-[#FDF2EE] text-[#C6634A] border border-[#C6634A]/30 shadow-2xs' 
                : 'text-stone-600 hover:bg-[#FDF2EE]/70 border border-transparent'
            }`}
          >
            <motion.div
              animate={isLiked ? { scale: [1, 1.45, 0.9, 1] } : {}}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#C6634A] text-[#C6634A]' : ''}`} />
            </motion.div>
            <span className="font-mono">{likes}</span>
          </motion.button>

          {/* Botón Comentarios / Pistas */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => onOpenComments(pet)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-[#FAF8F5] hover:text-[#233242] transition-colors cursor-pointer border border-transparent"
          >
            <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
            <span>Pistas</span>
          </motion.button>
        </div>

        {/* Botón Principal de Acción Contextual */}
        <div className="flex flex-wrap items-center gap-1.5">
          {pet.status === 'ACTIVE' && onCloseCase && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onCloseCase(pet)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-stone-600 hover:text-[#2C7B6D] hover:bg-[#EBF7F5] border border-[#DBBAA0]/45 transition-colors cursor-pointer"
              title="Marcar este caso como resuelto o adoptado"
            >
              <CheckCircle className="w-3.5 h-3.5 text-[#62BCAB]" />
              <span>Cerrar caso</span>
            </motion.button>
          )}

          {pet.status === 'RESOLVED' || pet.status === 'ADOPTED' ? (
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF8F5] text-stone-600 border border-[#DBBAA0]/40">
              Caso concluido
            </span>
          ) : (
            <>
              {pet.report_type === 'FOUND' && onVisualSearch && (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => onVisualSearch(pet)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#EBF7F5] hover:bg-[#D8F0EC] text-[#2C7B6D] border border-[#62BCAB]/40 transition-colors cursor-pointer shadow-2xs"
                  title="Buscar mascotas perdidas similares a esta foto mediante IA"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#62BCAB]" />
                  <span>Foto IA</span>
                </motion.button>
              )}

              {pet.report_type === 'ADOPTION' ? (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => onOpenAdoptionModal(pet)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#62BCAB] hover:bg-[#52AA9A] text-white shadow-xs transition-colors cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Adoptar</span>
                </motion.button>
              ) : pet.report_type === 'FOUND' ? (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => onOpenClaimModal ? onOpenClaimModal(pet) : onOpenComments(pet)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#62BCAB] hover:bg-[#52AA9A] text-white shadow-xs transition-colors cursor-pointer"
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
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#C6634A] hover:bg-[#B3553E] text-white shadow-xs transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>¿Lo viste?</span>
                </motion.button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.article>
  );
};
