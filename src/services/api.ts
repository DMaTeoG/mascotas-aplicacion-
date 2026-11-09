import type { Pet, MatchResult, AdoptionApplication, CommentItem, NotificationItem, PetClaim } from '../types/index.ts';

function getCleanApiUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  let raw = envUrl;
  
  if (!raw && typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    raw = 'https://mascotas-aplicacion-back.onrender.com/api/v1';
  } else if (!raw) {
    raw = process.env.NODE_ENV === 'production' 
      ? 'https://mascotas-aplicacion-back.onrender.com/api/v1' 
      : 'http://localhost:8000/api/v1';
  }

  let clean = raw.trim().replace(/([^:])\/\/+/g, '$1/');
  if (!clean.includes('/api/v1')) {
    clean = `${clean.replace(/\/+$/, '')}/api/v1`;
  }
  return clean.replace(/\/+$/, '');
}

const API_BASE_URL = getCleanApiUrl();

// Datos iniciales de contingencia si el backend está desconectado
// Datos realistas de contingencia de rescate comunitario
const FALLBACK_PETS: Pet[] = [
  {
    id: 1,
    title: "Negrito - Criollo 'cuatro ojos' extraviado cerca al Portal de Suba",
    report_type: "LOST",
    report_type_display: "Mascota Perdida",
    species: "dog",
    species_display: "Perro",
    breed: "Criollo Mestizo (Cuatro ojos)",
    size: "medium",
    gender: "male",
    primary_color: "negro",
    secondary_color: "marron",
    pattern: "manchado",
    distinctive_features: "Manchas marrón claro sobre los ojos, pechito blanco, orejas caídas.",
    zone_name: "Suba / Cra 104 con Calle 145",
    latitude: 4.7450,
    longitude: -74.0950,
    event_date: "2026-11-06T14:30:00Z",
    description: "Se asustó al cruzar la avenida cuando sonó un pito de camión y corrió hacia los conjuntos de Tibabuyes. Es asustadizo pero muy manso.",
    reward: "150.000 COP",
    contact_name: "Doña Esperanza Ruiz",
    contact_phone: "+57 314 2894510",
    contact_email: "esperanza.suba@gmail.com",
    image_url: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&w=800&q=80",
    status: "ACTIVE",
    status_display: "Activo",
    likes_count: 38,
    created_at: "2026-11-06T15:00:00Z"
  },
  {
    id: 2,
    title: "Michi - Gata carey comunitaria extraviada en La Candelaria",
    report_type: "LOST",
    report_type_display: "Mascota Perdida",
    species: "cat",
    species_display: "Gato",
    breed: "Criolla Carey Calicó",
    size: "small",
    gender: "female",
    primary_color: "atigrado",
    secondary_color: "marron",
    pattern: "tricolor",
    distinctive_features: "Pelaje carey oscuro con motas naranja quemado. Corte en orejita izquierda de esterilización.",
    zone_name: "La Candelaria / Calle 10 con Cra 3",
    latitude: 4.5960,
    longitude: -74.0720,
    event_date: "2026-11-07T08:00:00Z",
    description: "Es la gatita consentida de la cuadra, duerme en la panadería del barrio. Ayer no regresó a comer y estamos muy preocupados.",
    reward: "100.000 COP",
    contact_name: "Alonso Parra (Panadería El Trigal)",
    contact_phone: "+57 321 4509822",
    contact_email: "alonso.candelaria@gmail.com",
    image_url: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80",
    status: "ACTIVE",
    status_display: "Activo",
    likes_count: 29,
    created_at: "2026-11-07T09:00:00Z"
  },
  {
    id: 3,
    title: "Perrito criollo barcino encontrado desorientado en la Autopista Sur",
    report_type: "FOUND",
    report_type_display: "Mascota Encontrada",
    species: "dog",
    species_display: "Perro",
    breed: "Criollo Barcino Atigrado",
    size: "medium",
    gender: "male",
    primary_color: "marron",
    secondary_color: "negro",
    pattern: "atigrado",
    distinctive_features: "Rayas atigradas oscuras sobre fondo marrón claro, cicatriz en la trufa.",
    zone_name: "Kennedy / Cerca a estación Venecia (Autopista Sur)",
    latitude: 4.5980,
    longitude: -74.1350,
    event_date: "2026-11-08T18:15:00Z",
    description: "Estaba esquivando carros bajo la lluvia en el separador. Lo subimos al carro para salvarlo, está seco y alimentado en hogar de paso.",
    reward: "",
    contact_name: "Rescate Canino Solidario",
    contact_phone: "+57 318 6723419",
    contact_email: "rescate.venecia@gmail.com",
    image_url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
    status: "ACTIVE",
    status_display: "Activo",
    likes_count: 45,
    created_at: "2026-11-08T19:00:00Z"
  },
  {
    id: 4,
    title: "Gato atigrado gris rescatado de un tejado en Fontibón",
    report_type: "FOUND",
    report_type_display: "Mascota Encontrada",
    species: "cat",
    species_display: "Gato",
    breed: "Criollo Común Europeo",
    size: "medium",
    gender: "male",
    primary_color: "gris",
    secondary_color: "blanco",
    pattern: "atigrado",
    distinctive_features: "Ojos verde aceituna, patitas delanteras con 'guantecitos' blancos.",
    zone_name: "Fontibón / Parque Fundacional (Calle 18)",
    latitude: 4.6730,
    longitude: -74.1440,
    event_date: "2026-11-08T10:00:00Z",
    description: "Llevaba dos días maullando en el tejado de un taller mecánico. Se rescató con escalera, está sano y listo para volver a casa.",
    reward: "",
    contact_name: "Taller Los Amigos",
    contact_phone: "+57 302 3349180",
    contact_email: "mecanica.fontibon@gmail.com",
    image_url: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80",
    status: "ACTIVE",
    status_display: "Activo",
    likes_count: 19,
    created_at: "2026-11-08T11:00:00Z"
  },
  {
    id: 5,
    title: "Canelo - Joven criollo mestizo rescatado de la calle en adopción",
    report_type: "ADOPTION",
    report_type_display: "En Adopción",
    species: "dog",
    species_display: "Perro",
    breed: "Mestizo Criollo Orejón",
    size: "medium",
    gender: "male",
    primary_color: "marron",
    secondary_color: "blanco",
    pattern: "solido",
    distinctive_features: "Orejas grandes expresivas, pecho canela claro, mirada dulce y noble.",
    zone_name: "Refugio Huellitas de la Sabana (Siberia)",
    latitude: 4.7620,
    longitude: -74.1520,
    event_date: "2026-10-25T10:00:00Z",
    description: "Canelo fue rescatado en la carretera en desnutrición. Ya fue rehabilitado, esterilizado y vacunado. Convive de maravilla con otros perros y niños.",
    reward: "",
    contact_name: "Fundación Patitas Callejeras",
    contact_phone: "+57 315 9012344",
    contact_email: "adopciones.sabana@gmail.com",
    image_url: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80",
    status: "ACTIVE",
    status_display: "Activo",
    likes_count: 67,
    created_at: "2026-10-25T11:00:00Z"
  },
  {
    id: 6,
    title: "Pecas - Cachorra mestiza rescatada del río en adopción responsable",
    report_type: "ADOPTION",
    report_type_display: "En Adopción",
    species: "dog",
    species_display: "Perro",
    breed: "Mestiza Criolla de Rescate",
    size: "small",
    gender: "female",
    primary_color: "blanco",
    secondary_color: "marron",
    pattern: "manchado",
    distinctive_features: "Manchas tipo pecas en el lomo y hocico, colita enroscadita.",
    zone_name: "San Cristóbal Sur / Barrio 20 de Julio",
    latitude: 4.5710,
    longitude: -74.0890,
    event_date: "2026-10-28T15:00:00Z",
    description: "Pecas tiene 4 meses. Fue rescatada junto a sus 3 hermanitos de una caja. Es juguetona, cariñosa y busca una familia para siempre.",
    reward: "",
    contact_name: "Red de Rescatistas del Sur",
    contact_phone: "+57 311 8847291",
    contact_email: "rescates.sur@gmail.com",
    image_url: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80",
    status: "ACTIVE",
    status_display: "Activo",
    likes_count: 51,
    created_at: "2026-10-28T16:00:00Z"
  },
  {
    id: 7,
    title: "Sombra - Panterita criolla rescatada, muy dulce y tranquila",
    report_type: "ADOPTION",
    report_type_display: "En Adopción",
    species: "cat",
    species_display: "Gato",
    breed: "Criolla Negra Bombay",
    size: "small",
    gender: "female",
    primary_color: "negro",
    secondary_color: "blanco",
    pattern: "solido",
    distinctive_features: "Pelaje negro azabache, medalla blanca en el pecho, ojos dorados.",
    zone_name: "Chapinero Alto / Calle 63 con Cra 3",
    latitude: 4.6490,
    longitude: -74.0600,
    event_date: "2026-10-30T11:00:00Z",
    description: "Sombra fue encontrada en un parqueadero. Es sumamente tranquila, educada con su arenero y adora ronronear. Negativa a leucemia y sida felino.",
    reward: "",
    contact_name: "Gaticos en Adopción Bogotá",
    contact_phone: "+57 319 7654321",
    contact_email: "gatos.bogota@gmail.com",
    image_url: "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=800&q=80",
    status: "ACTIVE",
    status_display: "Activo",
    likes_count: 42,
    created_at: "2026-10-30T12:00:00Z"
  },
  {
    id: 8,
    title: "Lucas - Perrito criollo rubio extraviado en Parque El Virrey",
    report_type: "LOST",
    report_type_display: "Mascota Perdida",
    species: "dog",
    species_display: "Perro",
    breed: "Criollo Mestizo Rubio",
    size: "medium",
    gender: "male",
    primary_color: "dorado",
    secondary_color: "blanco",
    pattern: "solido",
    distinctive_features: "Color arena claro, collar rojo desgastado, cojea un poco de patita trasera.",
    zone_name: "Chicó / Parque El Virrey (Calle 87)",
    latitude: 4.6740,
    longitude: -74.0580,
    event_date: "2026-11-05T19:00:00Z",
    description: "Rescatado hace 2 años. Se asustó en el parque y salió corriendo. Requiere medicamento diario para articulaciones.",
    reward: "250.000 COP",
    contact_name: "Julián Gómez",
    contact_phone: "+57 316 4321098",
    contact_email: "julian.virrey@gmail.com",
    image_url: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80",
    status: "ACTIVE",
    status_display: "Activo",
    likes_count: 31,
    created_at: "2026-11-05T20:00:00Z"
  },
  {
    id: 9,
    title: "Mono - Perrito criollo amarillo hallado buscando comida en Corabastos",
    report_type: "FOUND",
    report_type_display: "Mascota Encontrada",
    species: "dog",
    species_display: "Perro",
    breed: "Criollo Mestizo Callejero",
    size: "medium",
    gender: "male",
    primary_color: "dorado",
    secondary_color: "marron",
    pattern: "solido",
    distinctive_features: "Mestizo típico colombiano, color caramelo con hocico oscuro, muy dócil y acostumbrado a pedir comida.",
    zone_name: "Kennedy / Corabastos Puerta 4",
    latitude: 4.6280,
    longitude: -74.1530,
    event_date: "2026-11-08T07:00:00Z",
    description: "Estaba entre las bodegas de plátano. Tiene signos de haber tenido dueño reciente porque está limpio. Lo resguardamos en una bodega segura.",
    reward: "",
    contact_name: "Comerciantes Unidos Corabastos",
    contact_phone: "+57 317 5544332",
    contact_email: "abastos.rescate@gmail.com",
    image_url: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80",
    status: "ACTIVE",
    status_display: "Activo",
    likes_count: 24,
    created_at: "2026-11-08T08:00:00Z"
  }
];

const FALLBACK_MATCHES: MatchResult[] = [
  {
    id: 1,
    lost_pet: 8,
    found_pet: 3,
    lost_pet_detail: FALLBACK_PETS[7],
    found_pet_detail: FALLBACK_PETS[2],
    score_percent: 88.5,
    confidence_level: "ALTA",
    explanation: "88.5% de probabilidad (ALTA): Ambos caninos mestizos de tamaño mediano con tonalidad marrón/dorada y concordancia geográfica en cuadrante urbano cercano.",
    factors_breakdown: {
      species_score: 1.0,
      breed_score: 0.85,
      color_score: 0.90,
      size_gender_score: 1.0,
      geo_score: 0.82,
      distance_km: 2.1,
      time_score: 0.95,
      diff_hours: 48.0
    },
    is_dismissed: false,
    created_at: "2026-11-08T20:00:00Z"
  },
  {
    id: 2,
    lost_pet: 2,
    found_pet: 4,
    lost_pet_detail: FALLBACK_PETS[1],
    found_pet_detail: FALLBACK_PETS[3],
    score_percent: 78.4,
    confidence_level: "MEDIA",
    explanation: "78.4% de probabilidad (MEDIA): Felinos criollos rescatados en zonas urbanas con características cromáticas compatibles.",
    factors_breakdown: {
      species_score: 1.0,
      breed_score: 0.75,
      color_score: 0.80,
      size_gender_score: 0.85,
      geo_score: 0.70,
      distance_km: 4.5,
      time_score: 0.90,
      diff_hours: 24.0
    },
    is_dismissed: false,
    created_at: "2026-11-08T21:00:00Z"
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

  async updatePetStatus(petId: number, status: 'ACTIVE' | 'RESOLVED' | 'ADOPTED'): Promise<Pet> {
    try {
      const res = await fetch(`${API_BASE_URL}/pets/${petId}/`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Error al actualizar estado');
      return await res.json();
    } catch {
      const p = FALLBACK_PETS.find(item => item.id === petId);
      if (p) {
        p.status = status;
        p.status_display = status === 'RESOLVED' ? 'Resuelto / Encontrado' : status === 'ADOPTED' ? 'Adoptado' : 'Activo';
        return p;
      }
      throw new Error('Mascota no encontrada');
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

  // Búsqueda Visual por Imagen (Found -> Lost o URL -> Lost)
  async visualSearch(param: number | { foundPetId?: number; imageUrl?: string; species?: string }) {
    const payload = typeof param === 'number' 
      ? { found_pet_id: param } 
      : { found_pet_id: param.foundPetId, image_url: param.imageUrl, species: param.species };

    try {
      const res = await fetch(`${API_BASE_URL}/ai/matches/visual-search/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Error al ejecutar búsqueda visual');
      return await res.json();
    } catch (err) {
      console.warn('[VisualSearch Fallback]', err);
      // Fallback con datos de ejemplo
      return {
        found_pet_id: typeof param === 'number' ? param : param.foundPetId,
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

