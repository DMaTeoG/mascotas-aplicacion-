'use client';

import React, { useState, useEffect } from 'react';
import { X, Send, MapPin, Eye, MessageSquare } from 'lucide-react';
import { Pet, CommentItem } from '../../types';
import { api } from '../../services/api';
import { motion, AnimatePresence } from 'motion/react';

interface CommentsDrawerProps {
  isOpen: boolean;
  pet: Pet | null;
  onClose: () => void;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  isOpen,
  pet,
  onClose,
}) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [isSighting, setIsSighting] = useState(false);
  const [sightingLocation, setSightingLocation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && pet) {
      loadComments(pet.id);
    }
  }, [isOpen, pet]);

  const loadComments = async (petId: number) => {
    const list = await api.getComments(petId);
    setComments(list);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !pet) return;

    setLoading(true);
    try {
      const newComment: CommentItem = {
        pet: pet.id,
        author_name: authorName || 'Vecino Solidario',
        content,
        is_sighting: isSighting,
        sighting_location: isSighting ? sightingLocation : ''
      };
      const created = await api.postComment(newComment);
      setComments(prev => [created, ...prev]);
      setContent('');
      setIsSighting(false);
      setSightingLocation('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && pet && (
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
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100/80 shadow-xs">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="min-w-0 pr-2">
                  <h3 className="font-extrabold text-sm text-stone-900 tracking-tight">Pistas y Comentarios</h3>
                  <p className="text-xs text-stone-500 truncate font-medium">{pet.title}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
                aria-label="Cerrar drawer"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Lista de Comentarios */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
              {comments.length === 0 ? (
                <div className="text-center py-20 text-stone-400">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-6 h-6 text-stone-400" />
                  </div>
                  <p className="text-xs font-bold text-stone-700">No hay pistas registradas aún</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">Sé el primero en aportar un avistamiento o mensaje solidario.</p>
                </div>
              ) : (
                comments.map((c, idx) => (
                  <motion.div
                    key={c.id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03, type: 'spring', stiffness: 300, damping: 24 }}
                    className={`p-3.5 rounded-2xl border text-xs ${
                      c.is_sighting 
                        ? 'bg-amber-50/70 border-amber-200 text-amber-950' 
                        : 'bg-stone-50/80 border-stone-200/90 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="flex items-center gap-1.5 font-extrabold">
                        {c.author_name}
                        {c.is_sighting && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] bg-amber-400 text-amber-950 font-black shadow-2xs">
                            ¡Avistamiento!
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {c.created_at ? new Date(c.created_at).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : 'Reciente'}
                      </span>
                    </div>
                    <p className="leading-relaxed font-medium">{c.content}</p>
                    {c.sighting_location && (
                      <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-amber-800">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Visto en: {c.sighting_location}</span>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Formulario de Aportar Pista */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-stone-200 bg-stone-50/90 space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Tu nombre o alias"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-white border border-stone-200 text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:border-orange-500 font-medium"
                />
                <label className="flex items-center gap-2 text-xs text-stone-700 p-2 bg-white rounded-xl border border-stone-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isSighting}
                    onChange={(e) => setIsSighting(e.target.checked)}
                    className="rounded text-orange-500 accent-orange-500"
                  />
                  <span className="text-[11px] font-bold">¿Es un avistamiento?</span>
                </label>
              </div>

              {isSighting && (
                <motion.input
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  type="text"
                  placeholder="Lugar exacto (ej. Parque frente a estación Transmilenio)"
                  value={sightingLocation}
                  onChange={(e) => setSightingLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-amber-50 border border-amber-300 text-amber-950 placeholder:text-amber-700/60 focus:outline-hidden font-medium"
                />
              )}

              <div className="flex gap-2">
                <textarea
                  rows={2}
                  required
                  placeholder="Escribe tu pista o mensaje solidario..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-stone-200 text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:border-orange-500 resize-none font-medium"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  type="submit"
                  disabled={loading}
                  className="px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
