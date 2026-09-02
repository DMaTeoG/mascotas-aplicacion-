import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { api } from '../src/services/api.ts';

// Mock simple de localStorage para entorno Node
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, val: string) => { store[key] = String(val); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

(global as any).localStorage = localStorageMock;
(global as any).window = {};

describe('Frontend API Service Suite', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('Autenticación: almacenar, recuperar y limpiar tokens JWT', () => {
    assert.strictEqual(api.getToken(), null);

    api.setToken('mock_access_token_123', 'mock_refresh_token_456');
    assert.strictEqual(api.getToken(), 'mock_access_token_123');
    assert.strictEqual(localStorage.getItem('petmatch_refresh_token'), 'mock_refresh_token_456');

    const headers = api.getAuthHeaders();
    assert.strictEqual(headers['Authorization'], 'Bearer mock_access_token_123');

    api.clearToken();
    assert.strictEqual(api.getToken(), null);
    assert.strictEqual(api.getAuthHeaders()['Authorization'], undefined);
  });

  test('Mascotas: getPets devuelve lista con fallback y respeta filtros locales', async () => {
    const pets = await api.getPets();
    assert.ok(Array.isArray(pets));
    assert.ok(pets.length >= 4);

    const lostPets = await api.getPets({ report_type: 'LOST' });
    assert.ok(lostPets.every(p => p.report_type === 'LOST'));

    const dogs = await api.getPets({ species: 'dog' });
    assert.ok(dogs.every(p => p.species === 'dog'));

    const searchResults = await api.getPets({ search: 'Golden' });
    assert.ok(searchResults.length >= 1);
    assert.ok(searchResults.some(p => p.breed.includes('Golden') || p.title.includes('Golden')));
  });

  test('Mascotas: createPet agrega nueva publicación a la lista local con atributos válidos', async () => {
    const payload = {
      title: 'Perro rescatado de prueba',
      report_type: 'FOUND' as const,
      species: 'dog' as const,
      breed: 'Pastor Alemán',
      zone_name: 'Cedritos',
      description: 'Encontrado cerca a la 140'
    };

    const res = await api.createPet(payload);
    assert.ok(res.pet);
    assert.strictEqual(res.pet.title, payload.title);
    assert.strictEqual(res.pet.report_type, 'FOUND');
    assert.strictEqual(res.pet.status, 'ACTIVE');
    assert.ok(typeof res.pet.id === 'number');
  });

  test('IA Matching: getMatches filtra por umbral mínimo de similitud', async () => {
    const highMatches = await api.getMatches(undefined, 90.0);
    assert.ok(highMatches.length >= 1);
    assert.ok(highMatches.every(m => m.score_percent >= 90.0));

    const allMatches = await api.getMatches(undefined, 50.0);
    assert.ok(allMatches.length >= highMatches.length);
  });

  test('Búsqueda Visual: visualSearch retorna candidatos de lost_pets con score', async () => {
    const result = await api.visualSearch(3);
    assert.ok(result);
    assert.strictEqual(result.found_pet_id, 3);
    assert.ok(Array.isArray(result.results));
    assert.ok(result.results.length >= 1);
    assert.ok(result.results[0].visual_score > 0);
  });
});
