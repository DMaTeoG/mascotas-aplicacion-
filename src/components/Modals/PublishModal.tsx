'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, Sparkles, AlertTriangle, ShieldCheck, Home, Check } from 'lucide-react';
import { Pet, ReportType, SpeciesType, SizeType, GenderType } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Pet>) => Promise<void>;
  initialReportType?: ReportType;
}

export const PublishModal: React.FC<PublishModalProps> = ({ isOpen, onClose, onSubmit, initialReportType = 'LOST' }) => {
  const [reportType, setReportType] = useState<ReportType>(initialReportType);

  React.useEffect(() => {
    if (isOpen && initialReportType) {
      setReportType(initialReportType);
    }
  }, [isOpen, initialReportType]);
  const [species, setSpecies] = useState<SpeciesType>('dog');
  const [title, setTitle] = useState('');
  const [breed, setBreed] = useState('Mestizo / Criollo');
  const [size, setSize] = useState<SizeType>('medium');
  const [gender, setGender] = useState<GenderType>('unknown');
  const [primaryColor, setPrimaryColor] = useState('dorado');
  const [secondaryColor, setSecondaryColor] = useState('');
  const [pattern, setPattern] = useState('solido');
  const [zoneName, setZoneName] = useState('');
  const [distinctiveFeatures, setDistinctiveFeatures] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen) return null;

  // Analizador de imagen por Canvas para extracción automática de color
  const analyzeImageColors = (imgSrc: string) => {
    setAnalyzingImage(true);
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imgSrc;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 50;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 50, 50);
          const data = ctx.getImageData(0, 0, 50, 50).data;
          let r = 0, g = 0, b = 0;
          for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
          }
          const total = data.length / 4;
          r = Math.round(r / total);
          g = Math.round(g / total);
          b = Math.round(b / total);

          // Clasificador heurístico de color dominante
          let detected = 'marron';
          if (r > 200 && g > 200 && b > 200) detected = 'blanco';
          else if (r < 60 && g < 60 && b < 60) detected = 'negro';
          else if (r > 160 && g > 130 && b < 100) detected = 'dorado';
          else if (Math.abs(r - g) < 20 && Math.abs(g - b) < 20) detected = 'gris';
          else detected = 'marron';

          setPrimaryColor(detected);
          setAiSuggestions(`La IA analizó la fotografía y detectó una tonalidad dominante "${detected}". Se asignó automáticamente para mejorar la precisión del matching.`);
        }
      } catch {
        // Fallback silencioso si hay restricciones CORS
      } finally {
        setAnalyzingImage(false);
      }
    };
    img.onerror = () => {
      setAnalyzingImage(false);
    };
  };

  const handleImageInput = (url: string) => {
    setImageUrl(url);
    if (url.startsWith('http')) {
      analyzeImageColors(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !zoneName || !description) {
      alert("Por favor completa los campos requeridos (Título, Zona y Descripción).");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        report_type: reportType,
        species,
        breed,
        size,
        gender,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        pattern,
        zone_name: zoneName,
        distinctive_features: distinctiveFeatures,
        description,
        reward: reportType === 'LOST' ? reward : '',
        contact_name: contactName || 'Comunidad Solidaria',
        contact_phone: contactPhone,
        image_url: imageUrl || (species === 'dog' 
          ? 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80'),
        event_date: new Date().toISOString()
      });
      onClose();
    } catch {
      alert("Error al publicar la mascota. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200/90 my-8 relative z-10"
          >
            {/* Encabezado */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">Publicar Nueva Mascota</h2>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  El motor de IA evaluará este reporte probabilísticamente de forma inmediata.
                </p>
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Tipo de Publicación */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Tipo de Publicación *
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setReportType('LOST')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 font-semibold text-xs transition-all cursor-pointer ${
                  reportType === 'LOST'
                    ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <span>Mascota Perdida</span>
              </button>

              <button
                type="button"
                onClick={() => setReportType('FOUND')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 font-semibold text-xs transition-all cursor-pointer ${
                  reportType === 'FOUND'
                    ? 'border-amber-500 bg-amber-50 text-amber-800 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <span>Mascota Encontrada</span>
              </button>

              <button
                type="button"
                onClick={() => setReportType('ADOPTION')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 font-semibold text-xs transition-all cursor-pointer ${
                  reportType === 'ADOPTION'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Home className="w-5 h-5 text-emerald-500" />
                <span>En Adopción</span>
              </button>
            </div>
          </div>

          {/* Fotografía y Asistente IA de Color */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-orange-500" />
                <span>URL de Fotografía de la Mascota</span>
              </label>
              {analyzingImage && (
                <span className="text-xs text-orange-600 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" /> Analizando paleta de color...
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://images.unsplash.com/... o pega enlace de foto"
                value={imageUrl}
                onChange={(e) => handleImageInput(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-hidden focus:border-orange-500"
              />
              <button
                type="button"
                onClick={() => {
                  const demoUrl = species === 'dog'
                    ? 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&w=800&q=80'
                    : 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80';
                  handleImageInput(demoUrl);
                }}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                Foto Demo
              </button>
            </div>

            {/* Aviso de recomendación de IA */}
            {aiSuggestions && (
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <p>{aiSuggestions}</p>
              </div>
            )}
          </div>

          {/* Título y Especie */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Título del Reporte *</label>
              <input
                type="text"
                required
                placeholder="Ej. Toby - Labrador extraviado en Salitre"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-hidden focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Especie *</label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value as SpeciesType)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-hidden focus:border-orange-500"
              >
                <option value="dog">Canino (Perro)</option>
                <option value="cat">Felino (Gato)</option>
              </select>
            </div>
          </div>

          {/* Raza, Tamaño, Sexo */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Raza</label>
              <input
                type="text"
                placeholder="Ej. Golden / Criollo"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-hidden focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tamaño</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as SizeType)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-hidden focus:border-orange-500"
              >
                <option value="small">Pequeño</option>
                <option value="medium">Mediano</option>
                <option value="large">Grande</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sexo</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as GenderType)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-hidden focus:border-orange-500"
              >
                <option value="male">Macho</option>
                <option value="female">Hembra</option>
                <option value="unknown">Desconocido</option>
              </select>
            </div>
          </div>

          {/* Color Primario, Secundario, Patrón */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Color Principal *</label>
              <select
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-hidden focus:border-orange-500 capitalize"
              >
                <option value="dorado">Dorado / Miel</option>
                <option value="negro">Negro</option>
                <option value="blanco">Blanco</option>
                <option value="marron">Marrón / Café</option>
                <option value="gris">Gris / Plata</option>
                <option value="crema">Crema / Arena</option>
                <option value="atigrado">Atigrado / Carey</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Color Secundario</label>
              <input
                type="text"
                placeholder="Ej. Blanco, negro..."
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-hidden focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Patrón Pelaje</label>
              <select
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-hidden focus:border-orange-500"
              >
                <option value="solido">Sólido</option>
                <option value="manchado">Manchado</option>
                <option value="bicolor">Bicolor</option>
                <option value="tricolor">Tricolor</option>
                <option value="atigrado">Atigrado</option>
              </select>
            </div>
          </div>

          {/* Zona o Sector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Zona, Barrio o Sector *</label>
            <input
              type="text"
              required
              placeholder="Ej. Parque Simón Bolívar / Salitre, Bogotá"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-hidden focus:border-orange-500"
            />
          </div>

          {/* Recompensa (si es perdido) */}
          {reportType === 'LOST' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Recompensa Ofrecida (Opcional)</label>
              <input
                type="text"
                placeholder="Ej. 300.000 COP"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-hidden focus:border-orange-500"
              />
            </div>
          )}

          {/* Descripción y Rasgos */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción y Detalles Distintivos *</label>
            <textarea
              rows={3}
              required
              placeholder="Describe collar, cicatrices, temperamento o estado de salud..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-hidden focus:border-orange-500"
            />
          </div>

          {/* Contacto */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre de Contacto</label>
              <input
                type="text"
                placeholder="Tu nombre o refugio"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-hidden focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono / WhatsApp</label>
              <input
                type="tel"
                placeholder="+57 300 0000000"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-hidden focus:border-orange-500"
              />
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <span>Publicando y calculando IA...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publicar y Evaluar Coincidencias</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
      )}
    </AnimatePresence>
  );
};
