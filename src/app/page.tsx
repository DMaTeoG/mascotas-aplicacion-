'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '../components/Header';
import { StatsBanner } from '../components/StatsBanner';
import { FilterBar } from '../components/Feed/FilterBar';
import { PetCard } from '../components/Feed/PetCard';
import { PublishModal } from '../components/Modals/PublishModal';
import { MatchingModal } from '../components/Modals/MatchingModal';
import { MatchesListModal } from '../components/Modals/MatchesListModal';
import { AdoptionModal } from '../components/Modals/AdoptionModal';
import { CommentsDrawer } from '../components/Drawers/CommentsDrawer';
import { NotificationsDrawer } from '../components/Drawers/NotificationsDrawer';
import { ToastContainer, ToastMessage } from '../components/ToastContainer';
import { AuthModal } from '../components/Modals/AuthModal';
import { VisualMatchModal } from '../components/Modals/VisualMatchModal';
import { PetClaimModal } from '../components/PetClaimModal';
import { UserProfileModal } from '../components/UserProfileModal';
import { HeroSearch } from '../components/HeroSearch';
import { CloseCaseModal } from '../components/Modals/CloseCaseModal';
import { QuickPhotoSearchModal } from '../components/Modals/QuickPhotoSearchModal';
import { BrandLogo } from '../components/BrandLogo';
import { api } from '../services/api';
import { Pet, MatchResult, NotificationItem, AdoptionApplication, ReportType } from '../types';
import { Sparkles, Frown, Compass, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';


export default function HomePage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Filtros
  const [currentTab, setCurrentTab] = useState('ALL');
  const [selectedSpecies, setSelectedSpecies] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modales y Drawers
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [createCaseType, setCreateCaseType] = useState<ReportType>('LOST');
  const [closeCasePet, setCloseCasePet] = useState<Pet | null>(null);
  const [isCloseCaseOpen, setIsCloseCaseOpen] = useState(false);
  const [isQuickPhotoSearchOpen, setIsQuickPhotoSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMatchesListOpen, setIsMatchesListOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const [selectedAdoptionPet, setSelectedAdoptionPet] = useState<Pet | null>(null);
  const [selectedCommentsPet, setSelectedCommentsPet] = useState<Pet | null>(null);
  const [selectedClaimPet, setSelectedClaimPet] = useState<Pet | null>(null);

  // Búsqueda Visual
  const [visualSearchFoundPet, setVisualSearchFoundPet] = useState<Pet | null>(null);
  const [visualSearchResults, setVisualSearchResults] = useState<Array<{ lost_pet: Pet; visual_score: number }>>([]);
  const [visualSearchLoading, setVisualSearchLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [petsList, matchesList, notifsList] = await Promise.all([
        api.getPets(),
        api.getMatches(undefined, 60.0),
        api.getNotifications()
      ]);
      setPets(petsList);
      setMatches(matchesList);
      setNotifications(notifsList);
    } catch {
      addToast('warning', 'Conexión local activa', 'Se cargaron datos de contingencia.');
    } finally {
      setLoading(false);
    }
  };

  // Recalcular motor de IA
  const handleRecalculateMatches = async () => {
    setIsRecalculating(true);
    try {
      await api.recalculateMatches();
      const updatedMatches = await api.getMatches(undefined, 60.0);
      setMatches(updatedMatches);
      addToast('success', 'Motor IA Ejecutado', `Se analizaron las características y se detectaron ${updatedMatches.length} coincidencias.`);
    } catch {
      addToast('error', 'Error en recálculo', 'No fue posible completar el análisis del motor de IA.');
    } finally {
      setIsRecalculating(false);
    }
  };

  // Publicar Mascota
  const handlePublishPet = async (petData: Partial<Pet>) => {
    try {
      const res = await api.createPet(petData);
      setPets(prev => [res.pet, ...prev]);
      addToast('success', 'Reporte Publicado', 'Tu reporte ha sido registrado exitosamente.');

      // Si hubo matches encontrados al momento de crear
      if (res.matches_found && res.matches_found.length > 0) {
        setMatches(prev => [...res.matches_found!, ...prev]);
        setSelectedMatch(res.matches_found[0]);
        addToast('info', '¡Coincidencia Detectada!', `La IA encontró ${res.matches_found.length} posible(s) pareja(s).`);
      } else {
        const updatedMatches = await api.getMatches(undefined, 60.0);
        setMatches(updatedMatches);
      }
    } catch {
      addToast('error', 'Fallo al publicar', 'Revisa los datos e intenta de nuevo.');
    }
  };

  // Dar apoyo / Like
  const handleLikePet = async (petId: number) => {
    try {
      await api.toggleLike(petId);
      addToast('success', 'Apoyo registrado', 'Gracias por visibilizar este caso.');
    } catch {
      addToast('error', 'Error', 'No se pudo registrar tu apoyo.');
    }
  };

  // Cerrar Caso
  const handleCloseCase = async (petId: number, status: 'RESOLVED' | 'ADOPTED') => {
    try {
      const updated = await api.updatePetStatus(petId, status);
      setPets(prev => prev.map(p => p.id === petId ? { ...p, status, status_display: updated.status_display } : p));
      addToast('success', 'Caso Actualizado', `El caso se marcó como ${status === 'RESOLVED' ? 'Resuelto' : 'Adoptado'}.`);
    } catch {
      addToast('error', 'Error al cerrar caso', 'No se pudo actualizar el estado del caso en el servidor.');
    }
  };

  // Postulación a Adopción
  const handleSubmitAdoption = async (appData: AdoptionApplication) => {
    try {
      await api.submitAdoption(appData);
      addToast('success', 'Solicitud Enviada', 'El encargado revisará tu postulación en su panel de perfil.');
    } catch {
      addToast('error', 'Error en el envío', 'No se pudo radicar la solicitud.');
    }
  };

  // Disparar Búsqueda Visual por Imagen (Found -> Lost)
  const handleTriggerVisualSearch = async (foundPet: Pet) => {
    setVisualSearchFoundPet(foundPet);
    setVisualSearchLoading(true);
    try {
      const response = await api.visualSearch(foundPet.id);
      setVisualSearchResults(response.results || []);
    } catch {
      addToast('error', 'Error en búsqueda visual', 'No fue posible completar la comparación por embeddings.');
    } finally {
      setVisualSearchLoading(false);
    }
  };

  const onOpenMatchForPet = (lost: Pet) => {
    setSelectedCommentsPet(lost);
    addToast('info', 'Reporte Seleccionado', `Visualizando pistas y detalles de ${lost.title}`);
  };

  // Conteos
  const counts = useMemo(() => {
    return {
      all: pets.length,
      lost: pets.filter(p => p.report_type === 'LOST').length,
      found: pets.filter(p => p.report_type === 'FOUND').length,
      adoption: pets.filter(p => p.report_type === 'ADOPTION').length,
    };
  }, [pets]);

  // Mascotas filtradas
  const filteredPets = useMemo(() => {
    return pets.filter(pet => {
      if (currentTab !== 'ALL' && pet.report_type !== currentTab) {
        return false;
      }
      if (selectedSpecies && pet.species !== selectedSpecies) {
        return false;
      }
      if (selectedSize && pet.size !== selectedSize) {
        return false;
      }
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesQuery = 
          pet.title.toLowerCase().includes(q) ||
          pet.breed.toLowerCase().includes(q) ||
          pet.zone_name.toLowerCase().includes(q) ||
          pet.description.toLowerCase().includes(q) ||
          pet.primary_color.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      return true;
    });
  }, [pets, currentTab, selectedSpecies, selectedSize, searchTerm]);

  const highMatchCount = matches.filter(m => m.score_percent >= 80.0).length;
  const unreadNotifsCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70">
      {/* Navbar Superior */}
      <Header
        unreadNotificationsCount={unreadNotifsCount}
        highMatchCount={highMatchCount}
        onOpenPublish={(type) => {
          setCreateCaseType(type || 'LOST');
          setIsPublishOpen(true);
        }}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenMatches={() => setIsMatchesListOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Buscador Inteligente Dual en el Centro */}
        <HeroSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedSpecies={selectedSpecies}
          onSpeciesChange={setSelectedSpecies}
          selectedSize={selectedSize}
          onSizeChange={setSelectedSize}
          onOpenPhotoSearch={() => setIsQuickPhotoSearchOpen(true)}
        />

        {/* Dashboard de Métricas Interactivas */}
        <StatsBanner
          lostCount={counts.lost}
          foundCount={counts.found}
          adoptionCount={counts.adoption}
          matchCount={highMatchCount}
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenMatches={() => setIsMatchesListOpen(true)}
          isRecalculating={isRecalculating}
          onRecalculateMatches={handleRecalculateMatches}
        />

        {/* Barra de Filtros y Búsqueda */}
        <FilterBar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          selectedSpecies={selectedSpecies}
          onSpeciesChange={setSelectedSpecies}
          selectedSize={selectedSize}
          onSizeChange={setSelectedSize}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          counts={counts}
        />

        {/* Feed de Mascotas */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-12 h-12 border-4 border-[#C6634A] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-[#233242]">Cargando publicaciones comunitarias...</p>
          </div>
        ) : filteredPets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="py-20 text-center bg-white rounded-3xl border border-[#DBBAA0]/45 p-8 shadow-xs"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#FDF2EE] text-[#C6634A] flex items-center justify-center mx-auto mb-3 border border-[#C6634A]/25">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-[#233242]">No encontramos resultados para tu búsqueda</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto font-medium">
              Intenta cambiar los filtros de especie, tamaño o limpiar el texto de búsqueda.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setCurrentTab('ALL');
                setSelectedSpecies('');
                setSelectedSize('');
                setSearchTerm('');
              }}
              className="mt-4 px-4 py-2 text-xs font-bold bg-[#233242] hover:bg-[#1C2834] text-white rounded-xl transition-colors cursor-pointer"
            >
              Restablecer Filtros
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key={currentTab + selectedSpecies + selectedSize + (searchTerm ? 'searched' : '')}
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.02,
                },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPets.map(pet => (
              <motion.div
                key={pet.id}
                variants={{
                  hidden: { opacity: 0, y: 16, scale: 0.98 },
                  show: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: 'spring', stiffness: 280, damping: 24 }
                  },
                }}
              >
                <PetCard
                  pet={pet}
                  matches={matches}
                  onLike={handleLikePet}
                  onOpenComments={(p) => setSelectedCommentsPet(p)}
                  onOpenMatchModal={(m) => setSelectedMatch(m)}
                  onOpenAdoptionModal={(p) => setSelectedAdoptionPet(p)}
                  onVisualSearch={handleTriggerVisualSearch}
                  onOpenClaimModal={(p) => setSelectedClaimPet(p)}
                  onCloseCase={(p) => {
                    setCloseCasePet(p);
                    setIsCloseCaseOpen(true);
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Footer con Identidad Huellitas & Rescate */}
      <footer className="mt-20 bg-white/95 border-t border-[#DBBAA0]/40 py-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <BrandLogo variant="footer" />

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF7F5] text-[#2C7B6D] border border-[#62BCAB]/30 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#62BCAB]" />
              Motor IA Explicable (XAI)
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2EE] text-[#9A3E28] border border-[#C6634A]/25 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6634A]" />
              Amor en cada huella
            </span>
            <div className="flex items-center gap-2 text-stone-400">
              <ShieldCheck className="w-4 h-4 text-[#C6634A]" />
              <span>Programación Orientada a la Web</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modales y Drawers */}
      <PublishModal
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        onSubmit={handlePublishPet}
        initialReportType={createCaseType}
      />

      <CloseCaseModal
        isOpen={isCloseCaseOpen}
        pet={closeCasePet}
        onClose={() => {
          setIsCloseCaseOpen(false);
          setCloseCasePet(null);
        }}
        onConfirm={handleCloseCase}
      />

      <QuickPhotoSearchModal
        isOpen={isQuickPhotoSearchOpen}
        onClose={() => setIsQuickPhotoSearchOpen(false)}
        pets={pets}
        onSelectPet={(p) => setSelectedCommentsPet(p)}
      />

      <MatchingModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
        onConfirmMatch={(m) => {
          alert(`Iniciando contacto con el rescatista del reporte #${typeof m.found_pet === 'object' ? m.found_pet.id : m.found_pet}...`);
        }}
      />

      <MatchesListModal
        isOpen={isMatchesListOpen}
        matches={matches}
        onClose={() => setIsMatchesListOpen(false)}
        onSelectMatch={(m) => setSelectedMatch(m)}
      />

      <AdoptionModal
        isOpen={!!selectedAdoptionPet}
        pet={selectedAdoptionPet}
        onClose={() => setSelectedAdoptionPet(null)}
        onSubmit={handleSubmitAdoption}
      />

      <CommentsDrawer
        isOpen={!!selectedCommentsPet}
        pet={selectedCommentsPet}
        onClose={() => setSelectedCommentsPet(null)}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        notifications={notifications}
        onClose={() => setIsNotificationsOpen(false)}
        onOpenMatchList={() => setIsMatchesListOpen(true)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(msg) => addToast('success', 'Sesión Iniciada', msg)}
      />

      <VisualMatchModal
        isOpen={!!visualSearchFoundPet}
        foundPet={visualSearchFoundPet}
        results={visualSearchResults}
        loading={visualSearchLoading}
        onClose={() => setVisualSearchFoundPet(null)}
        onSelectLostPet={(lost) => {
          setSelectedAdoptionPet(null);
          onOpenMatchForPet(lost);
        }}
      />

      <PetClaimModal
        isOpen={!!selectedClaimPet}
        pet={selectedClaimPet}
        onClose={() => setSelectedClaimPet(null)}
        onClaimSuccess={() => {
          loadData();
          addToast('success', 'Reclamo Radicado', 'El rescatista verificará las pruebas secretas ingresadas.');
        }}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onPetStatusChanged={() => {
          loadData();
        }}
      />

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
