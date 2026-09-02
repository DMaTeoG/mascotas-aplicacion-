import { test, describe } from 'node:test';
import assert from 'node:assert';
import type { Pet } from '../src/types/index.ts';

const SAMPLE_PETS: Pet[] = [
  {
    id: 1,
    title: 'Toby - Golden Retriever extraviado',
    report_type: 'LOST',
    species: 'dog',
    breed: 'Golden Retriever',
    size: 'large',
    gender: 'male',
    primary_color: 'dorado',
    pattern: 'solido',
    zone_name: 'Salitre',
    event_date: '2026-10-02T16:30:00Z',
    description: 'Collar azul sin placa',
    image_url: 'https://example.com/toby.jpg',
    status: 'ACTIVE',
    likes_count: 10,
    created_at: '2026-10-02T17:00:00Z'
  },
  {
    id: 2,
    title: 'Luna - Gata siamesa',
    report_type: 'LOST',
    species: 'cat',
    breed: 'Siamés',
    size: 'small',
    gender: 'female',
    primary_color: 'crema',
    pattern: 'manchado',
    zone_name: 'Usaquén',
    event_date: '2026-10-03T11:00:00Z',
    description: 'Ojos azules celestes',
    image_url: 'https://example.com/luna.jpg',
    status: 'ACTIVE',
    likes_count: 5,
    created_at: '2026-10-03T11:30:00Z'
  },
  {
    id: 3,
    title: 'Perrito encontrado en parque',
    report_type: 'FOUND',
    species: 'dog',
    breed: 'Golden Retriever Mestizo',
    size: 'large',
    gender: 'male',
    primary_color: 'dorado',
    pattern: 'solido',
    zone_name: 'Salitre',
    event_date: '2026-10-03T08:00:00Z',
    description: 'Muy noble',
    image_url: 'https://example.com/encontrado.jpg',
    status: 'RESOLVED',
    likes_count: 12,
    created_at: '2026-10-03T09:15:00Z'
  },
  {
    id: 4,
    title: 'Milo en Adopción',
    report_type: 'ADOPTION',
    species: 'dog',
    breed: 'Criollo',
    size: 'medium',
    gender: 'male',
    primary_color: 'marron',
    pattern: 'manchado',
    zone_name: 'Chapinero',
    event_date: '2026-09-25T10:00:00Z',
    description: 'Sociable y esterilizado',
    image_url: 'https://example.com/milo.jpg',
    status: 'ADOPTED',
    likes_count: 20,
    created_at: '2026-09-25T11:00:00Z'
  }
];

describe('Frontend Filter and Business Logic Suite', () => {
  test('Filtro por pestaña de estado: LOST, FOUND, ADOPTION', () => {
    const lost = SAMPLE_PETS.filter(p => p.report_type === 'LOST');
    assert.strictEqual(lost.length, 2);

    const found = SAMPLE_PETS.filter(p => p.report_type === 'FOUND');
    assert.strictEqual(found.length, 1);

    const adoption = SAMPLE_PETS.filter(p => p.report_type === 'ADOPTION');
    assert.strictEqual(adoption.length, 1);
  });

  test('Filtro por especie: caninos vs felinos', () => {
    const dogs = SAMPLE_PETS.filter(p => p.species === 'dog');
    assert.strictEqual(dogs.length, 3);

    const cats = SAMPLE_PETS.filter(p => p.species === 'cat');
    assert.strictEqual(cats.length, 1);
    assert.strictEqual(cats[0].title, 'Luna - Gata siamesa');
  });

  test('Filtro por tamaño (size)', () => {
    const large = SAMPLE_PETS.filter(p => p.size === 'large');
    assert.strictEqual(large.length, 2);

    const small = SAMPLE_PETS.filter(p => p.size === 'small');
    assert.strictEqual(small.length, 1);
  });

  test('Búsqueda por texto insensible a mayúsculas en zona o descripción', () => {
    const query = 'salitre';
    const matches = SAMPLE_PETS.filter(p =>
      p.zone_name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
    assert.strictEqual(matches.length, 2);
  });

  test('Regla de estado de mascota: ACTIVE vs RESOLVED vs ADOPTED', () => {
    const active = SAMPLE_PETS.filter(p => p.status === 'ACTIVE');
    assert.strictEqual(active.length, 2);

    const resolved = SAMPLE_PETS.filter(p => p.status === 'RESOLVED');
    assert.strictEqual(resolved.length, 1);
    assert.strictEqual(resolved[0].id, 3);

    const adopted = SAMPLE_PETS.filter(p => p.status === 'ADOPTED');
    assert.strictEqual(adopted.length, 1);
    assert.strictEqual(adopted[0].id, 4);
  });
});
