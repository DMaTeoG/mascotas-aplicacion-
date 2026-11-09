import type { Pet, MatchResult, AdoptionApplication, CommentItem, NotificationItem, PetClaim } from '../types/index.ts';

const PRODUCTION_API_URL = 'https://mascotas-aplicacion-back.onrender.com/api/v1';

const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? PRODUCTION_API_URL
    : (process.env.NODE_ENV === 'production' ? PRODUCTION_API_URL : 'http://localhost:8000/api/v1'));

// Datos iniciales de contingencia si el backend está desconectado
const FALLBACK_PETS: Pet[] = [
  {
    id: 1,
    title: "Toby - Golden Retriever extraviado en Parque Simón Bolívar",
    report_type: "LOST",
    report_type_display: "Mascota Perdida",
    species: "dog",
    species_display: "Perro",
    breed: "Golden Retriever",
    size: "large",
    gender: "male",
    primary_color: "dorado",
    secondary_color: "blanco",
    pattern: "solido",
    distinctive_features: "Collar azul reflectivo sin placa. Cicatriz pequeña en oreja izquierda.",
    zone_name: "Sector Salitre / Parque Simón Bolívar",
    latitude: 4.6580,
    longitude: -74.0930,
    event_date: "2026-10-02T16:30:00Z",
    description: "Se asustó con fuegos artificiales y salió corriendo. Es muy noble y responde por su nombre.",
    reward: "300.000 COP",
    contact_name: "Andrés Morales",
    contact_phone: "+57 312 4567890",
    contact_email: "andres@example.com",
    image_url: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
    status: "ACTIVE",
    status_display: "Activo",
    likes_count: 34,
    created_at: "2026-10-02T17:00:00Z"
  },
  {
    id: 2,
    title: "Luna - Gata siamesa extraviada cerca a Unicentro",
    report_type: "LOST",
    report_type_display: "Mascota Perdida",
    species: "cat",
    species_display: "Gato",
    breed: "Siamés",
    size: "small",
    gender: "female",
    primary_color: "crema",
    secondary_color: "marron",
    pattern: "manchado",
    distinctive_features: "Ojos azules celestes, collar violeta con cascabel.",
    zone_name: "Usaquén / Calle 127 con 15",
    latitude: 4.7030,
    longitude: -74.0320,
    event_date: "2026-10-03T11:00:00Z",
    description: "Se escapó en horas de la mañana. Es tímida pero no agresiva.",
    reward: "200.000 COP",
    contact_name: "Camila Rengifo",
    contact_phone: "+57 310 9876543",
    contact_email: "camila@example.com",
    image_url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    status: "ACTIVE",
    status_display: "Activo",
    likes_count: 22,
    created_at: "2026-10-03T11:30:00Z"
  },
  {
    id: 3,
    title: "Perro tipo Golden encontrado desorientado en Salitre",
    report_type: "FOUND",
    report_type_display: "Mascota Encontrada",
    species: "dog",
    species_display: "Perro",
    breed: "Golden Retriever / Mestizo",
    size: "large",
    gender: "male",
    primary_color: "dorado",
    secondary_color: "blanco",
    pattern: "solido",
    distinctive_features: "Tiene collar azul gastado sin placa. Muy cariñoso y obediente.",
    zone_name: "Cerca a la Biblioteca Virgilio Barco",
    latitude: 4.6570,
    longitude: -74.0880,
    event_date: "2026-10-03T08:00:00Z",
    description: "Estaba caminando solo por la calzada. Lo tenemos a salvo con agua y comida.",
    reward: "",
    contact_name: "Veterinaria Salitre",
    contact_phone: "+57 301 2345678",
    contact_email: "salitre@vetcare.com",
    image_url: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80",
    status: "ACTIVE",
    status_display: "Activo",
    likes_count: 27,
    created_at: "2026-10-03T09:15:00Z"
  },
  {
    id: 4,
    title: "Gatita encontrada en jardín residencial",
    report_type: "FOUND",
    report_type_display: "Mascota Encontrada",
    species: "cat",
    species_display: "Gato",
    breed: "Siamés Mestizo",
    size: "small",
    gender: "female",
    primary_color: "crema",
    secondary_color: "marron",
    pattern: "manchado",
    distinctive_features: "Ojos azules, collar morado desteñido.",
    zone_name: "Usaquén / Parque Santa Bárbara",
    latitude: 4.7015,
    longitude: -74.0345,
    event_date: "2026-10-03T18:00:00Z",
    description: "Llegó buscando refugio de la lluvia. Muy sociable y ronronea fácil.",
    reward: "",
    contact_name: "Natalia Ortiz",
    contact_phone: "+57 315 4433221",
    contact_email: "natalia@example.com",
    image_url: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80",
    status: "ACTIVE",
    status_display: "Activo",
    likes_count: 14,
    created_at: "2026-10-03T19:00:00Z"
  },
  {
    id: 5,
    title: "Milo - Cachorro mestizo en busca de un hogar amoroso",
    report_type: "ADOPTION",
    report_type_display: "En Adopción",
    species: "dog",
    species_display: "Perro",
    breed: "Mestizo Criollo",
    size: "medium",
    gender: "male",
    primary_color: "marron",
    secondary_color: "blanco",
    pattern: "manchado",
    distinctive_features: "Pecho y patitas blancas. Mirada cariñosa.",
    zone_name: "Refugio Huellitas Felices - Chapinero",
    latitude: 4.6480,
    longitude: -74.0620,
    event_date: "2026-09-25T10:00:00Z",
    description: "Milo tiene 5 meses, vacunas completas y desparasitación. Aprende muy rápido.",
    reward: "",
    contact_name: "Fundación Huellitas",
    contact_phone: "+57 320 1122334",
    contact_email: "adopciones@huellitas.org",
    image_url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
    status: "ACTIVE",
    status_display: "Activo",
    likes_count: 53,
    created_at: "2026-09-25T11:00:00Z"
  },
  {
    id: 6,
    title: "Bella - Hermosa gatita tricolor lista para adopción",
    report_type: "ADOPTION",
    report_type_display: "En Adopción",
    species: "cat",
    species_display: "Gato",
    breed: "Mestiza Carey / Calicó",
    size: "small",
    gender: "female",
    primary_color: "atigrado",
    secondary_color: "blanco",
    pattern: "tricolor",
    distinctive_features: "Pelaje tricolor suave, muy mimosa.",
    zone_name: "Refugio Gatos de la Sabana",
    latitude: 4.6720,
    longitude: -74.0550,
    event_date: "2026-09-20T14:00:00Z",
    description: "Bella tiene 1 año y medio, esterilizada y vacunada. Ideal para apartamento.",
    reward: "",
    contact_name: "Refugio Gatos Sabana",
    contact_phone: "+57 318 7766554",
    contact_email: "contacto@gatossabana.org",
    image_url: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80",
    status: "ACTIVE",
    status_display: "Activo",
    likes_count: 48,
    created_at: "2026-09-20T15:00:00Z"
  }
];

const FALLBACK_MATCHES: MatchResult[] = [
  {
    id: 1,
    lost_pet: 1,
    found_pet: 3,
    lost_pet_detail: FALLBACK_PETS[0],
    found_pet_detail: FALLBACK_PETS[2],
    score_percent: 94.8,
    confidence_level: "ALTA",
    explanation: "94.8% de probabilidad de coincidencia (ALTA): Misma especie (Perro), color muy coincidente (dorado), raza/tipo compatible (Golden Retriever), hallado a aprox. 0.6 km de la zona de extravío, concordancia cercana de fechas.",
    factors_breakdown: {
      species_score: 1.0,
      breed_score: 0.85,
      color_score: 1.0,
      size_gender_score: 1.0,
      geo_score: 0.98,
      distance_km: 0.6,
      time_score: 1.0,
      diff_hours: 15.5
    },
    is_dismissed: false,
    created_at: "2026-10-03T09:20:00Z"
  },
  {
    id: 2,
    lost_pet: 2,
    found_pet: 4,
    lost_pet_detail: FALLBACK_PETS[1],
    found_pet_detail: FALLBACK_PETS[3],
    score_percent: 94.9,
    confidence_level: "ALTA",
    explanation: "94.9% de probabilidad de coincidencia (ALTA): Misma especie (Gato), color muy coincidente (crema), raza/tipo compatible (Siamés), hallado a aprox. 0.3 km de la zona de extravío, concordancia cercana de fechas.",
    factors_breakdown: {
      species_score: 1.0,
      breed_score: 0.95,
      color_score: 0.95,
      size_gender_score: 1.0,
      geo_score: 0.99,
      distance_km: 0.3,
      time_score: 1.0,
      diff_hours: 7.0
    },
    is_dismissed: false,
    created_at: "2026-10-03T19:10:00Z"
  }
];

export const api = {
  // Mascotas
  async getPets(params?: { report_type?: string; species?: string; size?: string; search?: string }): Promise<Pet[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.report_type) searchParams.append('report_type', params.report_type);
      if (params?.species) searchParams.append('species', params.species);
      if (params?.size) searchParams.append('size', params.size);
      if (params?.search) searchParams.append('search', params.search);

      const res = await fetch(`${API_BASE_URL}/pets/?${searchParams.toString()}`);
      if (!res.ok) throw new Error('Error al consultar backend');
      return await res.json();
    } catch {
      // Filtrado sobre datos locales de respaldo
      let list = [...FALLBACK_PETS];
      if (params?.report_type) list = list.filter(p => p.report_type === params.report_type);
      if (params?.species) list = list.filter(p => p.species === params.species);
      if (params?.size) list = list.filter(p => p.size === params.size);
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(p => 
          p.title.toLowerCase().includes(q) || 
          p.breed.toLowerCase().includes(q) ||
          p.zone_name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }
      return list;
    }
  },

  async createPet(data: Partial<Pet>): Promise<{ pet: Pet; matches_found?: MatchResult[] }> {
    try {
      const res = await fetch(`${API_BASE_URL}/pets/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Error al crear mascota en backend');
      const json = await res.json();
      return { pet: json, matches_found: json.matches_found || [] };
    } catch {
      const newPet: Pet = {
        id: Date.now(),
        title: data.title || 'Mascota reportada',
        report_type: data.report_type || 'LOST',
        species: data.species || 'dog',
        breed: data.breed || 'Mestizo',
        size: data.size || 'medium',
        gender: data.gender || 'unknown',
        primary_color: data.primary_color || 'marron',
        pattern: data.pattern || 'solido',
        zone_name: data.zone_name || 'Ciudad',
        event_date: data.event_date || new Date().toISOString(),
        description: data.description || '',
        contact_name: data.contact_name || 'Usuario',
        image_url: data.image_url || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
        status: 'ACTIVE',
        likes_count: 1,
        created_at: new Date().toISOString(),
        ...data
      } as Pet;
      FALLBACK_PETS.unshift(newPet);
      return { pet: newPet, matches_found: [] };
    }
  },

  async toggleLike(petId: number): Promise<number> {
    try {
      const res = await fetch(`${API_BASE_URL}/pets/${petId}/toggle_like/`, { method: 'POST' });
      const data = await res.json();
      return data.likes_count;
    } catch {
      const p = FALLBACK_PETS.find(item => item.id === petId);
      if (p) p.likes_count += 1;
      return p ? p.likes_count : 1;
    }
  },

  // Motor de Inteligencia Artificial (Coincidencias)
  async getMatches(petId?: number, minScore: number = 60.0): Promise<MatchResult[]> {
    try {
      const url = petId 
        ? `${API_BASE_URL}/ai/matches/?pet_id=${petId}&min_score=${minScore}`
        : `${API_BASE_URL}/ai/matches/?min_score=${minScore}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error al consultar matches');
      return await res.json();
    } catch {
      let matches = [...FALLBACK_MATCHES];
      if (petId) {
        matches = matches.filter(m => {
          const lId = typeof m.lost_pet === 'object' ? (m.lost_pet as Pet).id : m.lost_pet;
          const fId = typeof m.found_pet === 'object' ? (m.found_pet as Pet).id : m.found_pet;
          return lId === petId || fId === petId;
        });
      }
      return matches.filter(m => m.score_percent >= minScore);
    }
  },

  async recalculateMatches(): Promise<{ message: string; matches_count: number }> {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/matches/recalculate/`, { method: 'POST' });
      return await res.json();
    } catch {
      return { message: 'Motor de IA ejecutado exitosamente (modo demostración)', matches_count: 2 };
    }
  },

  // Adopciones
  async submitAdoption(data: AdoptionApplication): Promise<AdoptionApplication> {
    try {
      const res = await fetch(`${API_BASE_URL}/adoptions/applications/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Error al registrar solicitud');
      return await res.json();
    } catch {
      return { ...data, id: Date.now(), status: 'PENDING', created_at: new Date().toISOString() };
    }
  },

  // Comentarios y Pistas Comunitarias
  async getComments(petId: number): Promise<CommentItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/community/comments/?pet_id=${petId}`);
      if (!res.ok) throw new Error('Error al consultar comentarios');
      return await res.json();
    } catch {
      return [
        {
          id: 1,
          pet: petId,
          author_name: "Vecino Observador",
          content: "Vi una mascota muy parecida cerca al parque ayer por la tarde.",
          is_sighting: true,
          sighting_location: "Zona del parque infantil",
          created_at: "2026-10-03T14:00:00Z"
        }
      ];
    }
  },

  async postComment(data: CommentItem): Promise<CommentItem> {
    try {
      const res = await fetch(`${API_BASE_URL}/community/comments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Error al guardar comentario');
      return await res.json();
    } catch {
      return { ...data, id: Date.now(), created_at: new Date().toISOString() };
    }
  },

  // Notificaciones
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/community/notifications/`);
      if (!res.ok) throw new Error('Error al consultar notificaciones');
      return await res.json();
    } catch {
      return [
        {
          id: 1,
          title: "¡Coincidencia del 94.8% encontrada!",
          message: "Toby (Perdido) coincide morfológica y geográficamente con el reporte #3 de Golden encontrado en Salitre.",
          notification_type: 'MATCH',
          pet: 1,
          is_read: false,
          created_at: "2026-10-03T09:20:00Z"
        },
        {
          id: 2,
          title: "¡Coincidencia del 94.9% en gatos!",
          message: "Luna (Siamés perdida) coincide con la gatita encontrada en Usaquén a 0.3 km.",
          notification_type: 'MATCH',
          pet: 2,
          is_read: false,
          created_at: "2026-10-03T19:10:00Z"
        }
      ];
    }
  },

  // Autenticación JWT
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('petmatch_access_token');
  },

  setToken(access: string, refresh?: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('petmatch_access_token', access);
    if (refresh) localStorage.setItem('petmatch_refresh_token', refresh);
  },

  clearToken() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('petmatch_access_token');
    localStorage.removeItem('petmatch_refresh_token');
  },

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async register(data: { username: string; email: string; password: string; first_name?: string; last_name?: string }) {
    const res = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      const errorMsg = Object.values(result).flat().join(' ') || 'Error al registrar usuario';
      throw new Error(errorMsg);
    }
    if (result.tokens?.access) {
      this.setToken(result.tokens.access, result.tokens.refresh);
    }
    return result;
  },

  async login(data: { username: string; password: string }) {
    const res = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.detail || 'Usuario o contraseña incorrectos');
    }
    if (result.access) {
      this.setToken(result.access, result.refresh);
    }
    return result;
  },

  async getMe() {
    const token = this.getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me/`, {
        headers: this.getAuthHeaders(),
      });
      if (!res.ok) {
        this.clearToken();
        return null;
      }
      return await res.json();
    } catch {
      return null;
    }
  },

  // Búsqueda Visual por Imagen (Found -> Lost)
  async visualSearch(foundPetId: number) {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/matches/visual-search/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ found_pet_id: foundPetId }),
      });
      if (!res.ok) throw new Error('Error al ejecutar búsqueda visual');
      return await res.json();
    } catch {
      // Fallback con datos de ejemplo
      return {
        found_pet_id: foundPetId,
        matches_count: 1,
        results: [
          {
            lost_pet: FALLBACK_PETS[0],
            visual_score: 92.4
          }
        ]
      };
    }
  },

  // Reclamos de Propiedad (PetClaim)
  async submitClaim(data: { pet: number; proof_description: string; proof_image_url?: string }): Promise<PetClaim> {
    const res = await fetch(`${API_BASE_URL}/pets/claims/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      const msg = Object.values(err).flat().join(' ') || 'Error al radicar el reclamo de propiedad';
      throw new Error(msg);
    }
    return await res.json();
  },

  async getClaims(params?: { pet_id?: number; claimant_id?: number; author_id?: number; status?: string }): Promise<PetClaim[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.pet_id) searchParams.append('pet_id', params.pet_id.toString());
      if (params?.claimant_id) searchParams.append('claimant_id', params.claimant_id.toString());
      if (params?.author_id) searchParams.append('author_id', params.author_id.toString());
      if (params?.status) searchParams.append('status', params.status);

      const res = await fetch(`${API_BASE_URL}/pets/claims/?${searchParams.toString()}`, {
        headers: this.getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Error al listar reclamos');
      return await res.json();
    } catch {
      return [];
    }
  },

  async approveClaim(claimId: number, notes?: string): Promise<{ message: string; claim_status: string; pet_status: string }> {
    const res = await fetch(`${API_BASE_URL}/pets/claims/${claimId}/approve/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ notes }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al aprobar el reclamo');
    }
    return await res.json();
  },

  async rejectClaim(claimId: number, notes?: string): Promise<{ message: string; claim_status: string }> {
    const res = await fetch(`${API_BASE_URL}/pets/claims/${claimId}/reject/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ notes }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al rechazar el reclamo');
    }
    return await res.json();
  },

  // Gestión de Adopciones para el Perfil
  async getAdoptionApplications(params?: { pet_id?: number; applicant_user_id?: number; owner_id?: number; status?: string }): Promise<AdoptionApplication[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.pet_id) searchParams.append('pet_id', params.pet_id.toString());
      if (params?.applicant_user_id) searchParams.append('applicant_user_id', params.applicant_user_id.toString());
      if (params?.owner_id) searchParams.append('owner_id', params.owner_id.toString());
      if (params?.status) searchParams.append('status', params.status);

      const res = await fetch(`${API_BASE_URL}/adoptions/applications/?${searchParams.toString()}`, {
        headers: this.getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Error al listar solicitudes');
      return await res.json();
    } catch {
      return [];
    }
  },

  async updateAdoptionStatus(appId: number, status: 'APPROVED' | 'REJECTED', notes?: string) {
    const res = await fetch(`${API_BASE_URL}/adoptions/applications/${appId}/update_status/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status, notes }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al actualizar solicitud');
    }
    return await res.json();
  },

  async getUserPets(authorId: number): Promise<Pet[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/pets/?author_id=${authorId}`, {
        headers: this.getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Error al obtener publicaciones del usuario');
      return await res.json();
    } catch {
      return [];
    }
  }
};

