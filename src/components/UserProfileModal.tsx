'use client';

import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, Heart, FileText, CheckCircle, XCircle, 
  Clock, ShieldCheck, AlertCircle, Home, Mail, Phone, MapPin 
} from 'lucide-react';
import { Pet, PetClaim, AdoptionApplication } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from './ToastContainer';
import { motion, AnimatePresence } from 'motion/react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPetStatusChanged?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onPetStatusChanged,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'my_posts' | 'received_adoptions' | 'sent_adoptions' | 'claims'>('my_posts');
  const [loading, setLoading] = useState(false);

  // Estados de datos
  const [myPets, setMyPets] = useState<Pet[]>([]);
  const [receivedAdoptions, setReceivedAdoptions] = useState<AdoptionApplication[]>([]);
  const [sentAdoptions, setSentAdoptions] = useState<AdoptionApplication[]>([]);
  const [receivedClaims, setReceivedClaims] = useState<PetClaim[]>([]);
  const [sentClaims, setSentClaims] = useState<PetClaim[]>([]);

  // Carga de datos del perfil
  const loadProfileData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [pets, rAdoptions, sAdoptions, rClaims, sClaims] = await Promise.all([
        api.getUserPets(user.id),
        api.getAdoptionApplications({ owner_id: user.id }),
        api.getAdoptionApplications({ applicant_user_id: user.id }),
        api.getClaims({ author_id: user.id }),
        api.getClaims({ claimant_id: user.id }),
      ]);

      setMyPets(pets);
      setReceivedAdoptions(rAdoptions);
      setSentAdoptions(sAdoptions);
      setReceivedClaims(rClaims);
      setSentClaims(sClaims);
    } catch {
      showToast('Error al cargar la información del perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      loadProfileData();
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  // Acciones sobre Solicitudes de Adopción (Requisito 5)
  const handleAdoptionDecision = async (applicationId: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await api.updateAdoptionStatus(applicationId, status);
      showToast(
        status === 'APPROVED' 
          ? '¡Solicitud aceptada con éxito! La mascota ahora figura como ADOPTADA.' 
          : 'Solicitud rechazada.',
        status === 'APPROVED' ? 'success' : 'info'
      );
      // Recargar datos
      await loadProfileData();
      if (onPetStatusChanged) onPetStatusChanged();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al procesar la solicitud';
      showToast(msg, 'error');
    }
  };

  // Acciones sobre Reclamos de Propiedad (Requisito 3)
  const handleClaimDecision = async (claimId: number, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        await api.approveClaim(claimId, 'Entrega confirmada y pertenencia validada');
        showToast('¡Reclamo aprobado! Mascota confirmada como entregada (Reporte Resuelto).', 'success');
      } else {
        await api.rejectClaim(claimId, 'Las pruebas no concuerdan con la mascota');
        showToast('Reclamo rechazado.', 'info');
      }
      await loadProfileData();
      if (onPetStatusChanged) onPetStatusChanged();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al procesar el reclamo';
      showToast(msg, 'error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
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
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-stone-200/90 flex flex-col overflow-hidden z-10"
          >
            {/* Encabezado del Perfil */}
            <div className="p-6 bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600 text-white shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-black shadow-inner">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold flex items-center gap-2">
                      <span>{user.username}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 font-normal">
                        {user.email}
                      </span>
                    </h2>
                    <p className="text-xs text-orange-100 mt-0.5 font-medium">
                      Trazabilidad de publicaciones, solicitudes de adopción y reclamos
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-lg font-bold transition cursor-pointer"
                >
                  ✕
                </motion.button>
              </div>

          {/* Navegación por Pestañas */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('my_posts')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'my_posts'
                  ? 'bg-white text-orange-700 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              🐾 Mis Publicaciones ({myPets.length})
            </button>
            <button
              onClick={() => setActiveTab('received_adoptions')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'received_adoptions'
                  ? 'bg-white text-emerald-700 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              📥 Solicitudes Recibidas ({receivedAdoptions.length})
            </button>
            <button
              onClick={() => setActiveTab('sent_adoptions')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'sent_adoptions'
                  ? 'bg-white text-indigo-700 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              📤 Mis Postulaciones ({sentAdoptions.length})
            </button>
            <button
              onClick={() => setActiveTab('claims')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'claims'
                  ? 'bg-white text-amber-700 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              🏠 Reclamos de Propiedad ({receivedClaims.length + sentClaims.length})
            </button>
          </div>
        </div>

        {/* Cuerpo del Perfil */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs">Cargando trazabilidad de tu perfil...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: MIS PUBLICACIONES */}
              {activeTab === 'my_posts' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                    Mascotas que has publicado
                  </h3>
                  {myPets.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Aún no has registrado ningún reporte o mascota en adopción.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {myPets.map((pet) => (
                        <div
                          key={pet.id}
                          className="flex gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-xs"
                        >
                          <img
                            src={pet.image_url || '/placeholder-pet.jpg'}
                            alt={pet.title}
                            className="w-20 h-20 object-cover rounded-xl shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                pet.status === 'ACTIVE' 
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' 
                                  : pet.status === 'ADOPTED'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                                  : 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                              }`}>
                                {pet.status === 'ACTIVE' ? 'Activo' : pet.status === 'ADOPTED' ? 'Adoptado 🎉' : 'Resuelto 🤝'}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-400">
                                {pet.report_type_display || pet.report_type}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">
                              {pet.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {pet.breed} • {pet.zone_name}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-1">
                              {pet.likes_count} apoyos comunitarios
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: SOLICITUDES DE ADOPCIÓN RECIBIDAS (REQUISITO 5) */}
              {activeTab === 'received_adoptions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                        Solicitudes de personas que desean adoptar tus mascotas
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Evalúa las respuestas del formulario y decide si aceptar o rechazar al adoptante
                      </p>
                    </div>
                  </div>

                  {receivedAdoptions.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        No has recibido solicitudes de adopción para tus publicaciones aún.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {receivedAdoptions.map((app) => (
                        <div
                          key={app.id}
                          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-base text-slate-800 dark:text-white">
                                  {app.applicant_name}
                                </span>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                  app.status === 'APPROVED'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : app.status === 'REJECTED'
                                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                }`}>
                                  {app.status === 'APPROVED' ? 'Aprobada' : app.status === 'REJECTED' ? 'Rechazada' : 'Pendiente'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Postulación para: <strong>{app.pet_detail?.title || `Mascota #${app.pet}`}</strong>
                              </p>
                            </div>

                            {/* Botones de decisión para el dueño de la publicación */}
                            {app.status === 'PENDING' && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleAdoptionDecision(app.id!, 'APPROVED')}
                                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-xs transition"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Aceptar Adoptante</span>
                                </button>
                                <button
                                  onClick={() => handleAdoptionDecision(app.id!, 'REJECTED')}
                                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Rechazar</span>
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Datos del Formulario Llenado por el Adoptante */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs text-slate-600 dark:text-slate-300">
                            <div>
                              <span className="font-semibold text-slate-400 block text-[11px]">Contacto:</span>
                              <p className="flex items-center gap-1.5 mt-0.5">
                                <Mail className="w-3 h-3 text-slate-400" /> {app.applicant_email}
                              </p>
                              <p className="flex items-center gap-1.5 mt-0.5">
                                <Phone className="w-3 h-3 text-slate-400" /> {app.applicant_phone}
                              </p>
                              <p className="flex items-center gap-1.5 mt-0.5">
                                <MapPin className="w-3 h-3 text-slate-400" /> {app.city} • {app.housing_type}
                              </p>
                            </div>
                            <div>
                              <span className="font-semibold text-slate-400 block text-[11px]">Convivencia y Tiempo:</span>
                              <p className="mt-0.5">Otras mascotas: {app.has_other_pets ? `Sí (${app.other_pets_description || 'declaradas'})` : 'No'}</p>
                              <p className="mt-0.5">Tiempo disponible: {app.time_dedicated}</p>
                              <p className="mt-0.5">Acepta visita domiciliaria: {app.agree_to_home_visit ? 'Sí' : 'No'}</p>
                            </div>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs">
                            <span className="font-semibold text-slate-400 block text-[11px]">Experiencia previa:</span>
                            <p className="text-slate-700 dark:text-slate-300 italic mt-0.5">
                              "{app.experience_description}"
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: MIS POSTULACIONES ENVIADAS */}
              {activeTab === 'sent_adoptions' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                    Solicitudes de adopción que has enviado
                  </h3>
                  {sentAdoptions.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        No te has postulado a ninguna adopción todavía.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sentAdoptions.map((app) => (
                        <div
                          key={app.id}
                          className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-xs"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={app.pet_detail?.image_url || '/placeholder-pet.jpg'}
                              alt="Pet"
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                            <div>
                              <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                                {app.pet_detail?.title || `Mascota #${app.pet}`}
                              </h4>
                              <p className="text-xs text-slate-400">
                                Radicada el {new Date(app.created_at || '').toLocaleDateString('es-CO')}
                              </p>
                            </div>
                          </div>
                          <div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                              app.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : app.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}>
                              {app.status === 'APPROVED' ? 'Aprobada 🎉' : app.status === 'REJECTED' ? 'No seleccionada' : 'En Evaluación ⏳'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: RECLAMOS DE PROPIEDAD */}
              {activeTab === 'claims' && (
                <div className="space-y-6">
                  {/* Reclamos Recibidos */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-3">
                      Reclamos recibidos sobre mascotas que encontraste ({receivedClaims.length})
                    </h3>
                    {receivedClaims.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No hay reclamos sobre tus reportes.</p>
                    ) : (
                      <div className="space-y-3">
                        {receivedClaims.map((claim) => (
                          <div
                            key={claim.id}
                            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-xs"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                              <div>
                                <span className="font-bold text-sm text-slate-800 dark:text-white">
                                  {claim.claimant_detail?.username || 'Usuario'} afirma ser el dueño
                                </span>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  Para la mascota: <strong>{claim.pet_detail?.title || `#${claim.pet}`}</strong>
                                </p>
                              </div>

                              {claim.status === 'PENDING' ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleClaimDecision(claim.id, 'approve')}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                                  >
                                    Confirmar Entrega
                                  </button>
                                  <button
                                    onClick={() => handleClaimDecision(claim.id, 'reject')}
                                    className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold border border-rose-200 transition"
                                  >
                                    Rechazar
                                  </button>
                                </div>
                              ) : (
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                  claim.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {claim.status === 'APPROVED' ? 'Entregada / Resuelto' : 'Rechazado'}
                                </span>
                              )}
                            </div>

                            <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
                              <span className="font-semibold text-slate-400 block text-[11px]">Pruebas secretas descritas:</span>
                              <p className="mt-1 italic bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl">
                                "{claim.proof_description}"
                              </p>
                              {claim.proof_image_url && (
                                <div className="mt-2">
                                  <a
                                    href={claim.proof_image_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-orange-600 hover:underline text-xs inline-flex items-center gap-1"
                                  >
                                    Ver foto de prueba previa adjunta ↗
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reclamos Enviados por Mí */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-3">
                      Reclamos que has presentado ("Esta mascota es mía") ({sentClaims.length})
                    </h3>
                    {sentClaims.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No has presentado ningún reclamo de pertenencia.</p>
                    ) : (
                      <div className="space-y-3">
                        {sentClaims.map((claim) => (
                          <div
                            key={claim.id}
                            className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={claim.pet_detail?.image_url || '/placeholder-pet.jpg'}
                                alt="Pet"
                                className="w-12 h-12 rounded-xl object-cover"
                              />
                              <div>
                                <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                                  {claim.pet_detail?.title || `Mascota #${claim.pet}`}
                                </h4>
                                <p className="text-xs text-slate-400">
                                  Reclamado el {new Date(claim.created_at).toLocaleDateString('es-CO')}
                                </p>
                              </div>
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                              claim.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : claim.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {claim.status === 'APPROVED' ? 'Aprobado (Entregado)' : claim.status === 'REJECTED' ? 'Rechazado' : 'Pendiente de Respuesta'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
      )}
    </AnimatePresence>
  );
};
