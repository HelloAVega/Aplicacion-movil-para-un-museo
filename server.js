'use strict';

const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'museo.sqlite');
const LEGACY_DB_FILE = path.join(DATA_DIR, 'db.json');

let db;

app.use(express.json({ limit: '15mb' }));
app.use(express.static(__dirname));

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function openDatabase(filePath) {
  return new Promise((resolve, reject) => {
    const instance = new sqlite3.Database(filePath, error => {
      if (error) {
        reject(error);
        return;
      }
      resolve(instance);
    });
  });
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function callback(error) {
      if (error) {
        reject(error);
        return;
      }
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(row || null);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(rows || []);
    });
  });
}

async function withTransaction(work) {
  await run('BEGIN TRANSACTION');
  try {
    await work();
    await run('COMMIT');
  } catch (error) {
    await run('ROLLBACK');
    throw error;
  }
}

async function getMeta(key) {
  const row = await get('SELECT value FROM metadata WHERE key = ?', [key]);
  return row ? row.value : null;
}

async function setMeta(key, value) {
  await run(
    'INSERT INTO metadata (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    [key, value]
  );
}

async function ensureOwnerExists(ownerId, ownerName) {
  const existing = await get('SELECT id FROM users WHERE id = ?', [ownerId]);
  if (existing) return;

  await run(
    'INSERT INTO users (id, name, age, course, created_at) VALUES (?, ?, ?, ?, ?)',
    [ownerId, ownerName || 'Usuario legado', '', '', new Date().toISOString()]
  );
}

async function migrateLegacyJsonIfNeeded() {
  const migrated = await getMeta('migrated_from_json');
  if (migrated === 'true') return;

  if (!fs.existsSync(LEGACY_DB_FILE)) {
    await setMeta('migrated_from_json', 'true');
    return;
  }

  const raw = fs.readFileSync(LEGACY_DB_FILE, 'utf8');
  let legacy;

  try {
    legacy = JSON.parse(raw);
  } catch {
    await setMeta('migrated_from_json', 'true');
    return;
  }

  const users = Array.isArray(legacy.users) ? legacy.users : [];
  const images = Array.isArray(legacy.images) ? legacy.images : [];

  await withTransaction(async () => {
    for (const user of users) {
      const id = String(user.id || randomUUID());
      const name = String(user.name || 'Usuario').trim() || 'Usuario';
      const age = String(user.age || '').trim();
      const course = String(user.course || '').trim();
      const createdAt = String(user.createdAt || new Date().toISOString());

      await run(
        'INSERT OR IGNORE INTO users (id, name, age, course, created_at) VALUES (?, ?, ?, ?, ?)',
        [id, name, age, course, createdAt]
      );
    }

    for (const [index, image] of images.entries()) {
      const id = String(image.id || randomUUID());
      const artwork = String(image.artwork || '').trim();
      const author = String(image.author || '').trim();
      const date = String(image.date || '').trim();
      const ownerId = String(image.ownerId || `legacy-owner-${index + 1}`);
      const ownerName = String(image.ownerName || 'Usuario').trim() || 'Usuario';
      const dataUrl = image.dataUrl || null;
      const rating = Math.max(1, Math.min(5, Number(image.rating) || 4));
      const createdAt = String(image.createdAt || new Date().toISOString());

      if (!artwork || !author) {
        continue;
      }

      await ensureOwnerExists(ownerId, ownerName);

      await run(
        `INSERT OR IGNORE INTO images
          (id, artwork, author, date, owner_id, owner_name, data_url, rating, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, artwork, author, date, ownerId, ownerName, dataUrl, rating, createdAt]
      );
    }

    if (legacy.seeded === true) {
      await setMeta('seeded', 'true');
    }
  });

  await setMeta('migrated_from_json', 'true');
}

async function seedDataIfNeeded() {
  const seeded = await getMeta('seeded');
  if (seeded === 'true') return;

  const sampleUsers = [
    { id: 'sample-user-1', name: 'OtroUsuario' },
    { id: 'sample-user-2', name: 'OtroUsuario2' },
  ];

  const sampleImages = [
    {
      id: '15bf87ed-5a81-4e54-ba9a-57b93428b4dd',
      artwork: 'Amanecer en el Caribe',
      author: 'Maria Gonzalez',
      date: '24/04/2026',
      ownerId: 'sample-user-1',
      ownerName: 'OtroUsuario',
      dataUrl: null,
      rating: 5,
    },
    {
      id: '0731d0f6-5ee9-4a31-8571-8e13e5aa0173',
      artwork: 'Abstraccion Urbana',
      author: 'Carlos Perez',
      date: '24/04/2026',
      ownerId: 'sample-user-1',
      ownerName: 'OtroUsuario',
      dataUrl: null,
      rating: 4,
    },
    {
      id: '79390e37-9935-4516-b3b9-270eb89df5e4',
      artwork: 'Luz y Sombra',
      author: 'Ana Martinez',
      date: '25/04/2026',
      ownerId: 'sample-user-2',
      ownerName: 'OtroUsuario2',
      dataUrl: null,
      rating: 5,
    },
  ];

  await withTransaction(async () => {
    for (const user of sampleUsers) {
      await run(
        'INSERT OR IGNORE INTO users (id, name, age, course, created_at) VALUES (?, ?, ?, ?, ?)',
        [user.id, user.name, '', '', new Date().toISOString()]
      );
    }

    for (const image of sampleImages) {
      await run(
        `INSERT OR IGNORE INTO images
          (id, artwork, author, date, owner_id, owner_name, data_url, rating, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          image.id,
          image.artwork,
          image.author,
          image.date,
          image.ownerId,
          image.ownerName,
          image.dataUrl,
          image.rating,
          new Date().toISOString(),
        ]
      );
    }
  });

  await setMeta('seeded', 'true');
}

async function initDb() {
  ensureDataDirectory();
  db = await openDatabase(DB_FILE);

  await run('PRAGMA foreign_keys = ON');
  await run(
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age TEXT,
      course TEXT,
      created_at TEXT NOT NULL
    )`
  );

  await run(
    `CREATE TABLE IF NOT EXISTS images (
      id TEXT PRIMARY KEY,
      artwork TEXT NOT NULL,
      author TEXT NOT NULL,
      date TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      owner_name TEXT NOT NULL,
      data_url TEXT,
      rating INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE
    )`
  );

  await run(
    `CREATE TABLE IF NOT EXISTS metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )`
  );

  await migrateLegacyJsonIfNeeded();
  await seedDataIfNeeded();
}

function sanitizeImage(image) {
  return {
    id: image.id,
    artwork: image.artwork,
    author: image.author,
    date: image.date,
    ownerId: image.owner_id,
    ownerName: image.owner_name,
    dataUrl: image.data_url || null,
    rating: image.rating,
  };
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, date: new Date().toISOString() });
});

app.get('/api/bootstrap', async (req, res) => {
  const userId = String(req.query.userId || '').trim();

  try {
    const user = userId
      ? await get('SELECT id, name, age, course, created_at as createdAt FROM users WHERE id = ?', [userId])
      : null;

    const images = await all(
      'SELECT id, artwork, author, date, owner_id, owner_name, data_url, rating, created_at FROM images ORDER BY created_at DESC'
    );

    res.json({
      user: user || null,
      images: images.map(sanitizeImage),
    });
  } catch {
    res.status(500).json({ error: 'No se pudo cargar la información inicial.' });
  }
});

app.post('/api/users/register', async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const age = String(req.body?.age || '').trim();
  const course = String(req.body?.course || '').trim();

  if (!name || !age) {
    return res.status(400).json({ error: 'Nombre y edad son obligatorios.' });
  }

  const id = randomUUID();
  const createdAt = new Date().toISOString();

  try {
    await run(
      'INSERT INTO users (id, name, age, course, created_at) VALUES (?, ?, ?, ?, ?)',
      [id, name, age, course, createdAt]
    );
  } catch {
    return res.status(500).json({ error: 'No se pudo registrar el usuario.' });
  }

  return res.status(201).json({
    user: {
      id,
      name,
      age,
      course,
      createdAt,
    },
  });
});

app.put('/api/users/:id', async (req, res) => {
  const id = String(req.params.id || '').trim();
  const name = String(req.body?.name || '').trim();

  if (!id) {
    return res.status(400).json({ error: 'Id de usuario no valido.' });
  }

  if (!name) {
    return res.status(400).json({ error: 'El nombre no puede estar vacio.' });
  }

  const existing = await get('SELECT id FROM users WHERE id = ?', [id]);
  if (!existing) {
    return res.status(404).json({ error: 'Usuario no encontrado.' });
  }

  try {
    await withTransaction(async () => {
      await run('UPDATE users SET name = ? WHERE id = ?', [name, id]);
      await run('UPDATE images SET owner_name = ? WHERE owner_id = ?', [name, id]);
    });

    const updated = await get('SELECT id, name, age, course, created_at as createdAt FROM users WHERE id = ?', [id]);
    return res.json({ user: updated });
  } catch {
    return res.status(500).json({ error: 'No se pudo actualizar el usuario.' });
  }
});

app.get('/api/images', async (req, res) => {
  try {
    const images = await all(
      'SELECT id, artwork, author, date, owner_id, owner_name, data_url, rating, created_at FROM images ORDER BY created_at DESC'
    );
    return res.json({ images: images.map(sanitizeImage) });
  } catch {
    return res.status(500).json({ error: 'No se pudieron listar las imágenes.' });
  }
});

app.post('/api/images', async (req, res) => {
  const ownerId = String(req.body?.ownerId || '').trim();
  const artwork = String(req.body?.artwork || '').trim();
  const author = String(req.body?.author || '').trim();
  const date = String(req.body?.date || '').trim();
  const dataUrl = req.body?.dataUrl || null;
  const rating = Number(req.body?.rating) || 4;

  if (!ownerId || !artwork || !author) {
    return res.status(400).json({ error: 'Faltan datos para registrar la imagen.' });
  }

  const user = await get('SELECT id, name FROM users WHERE id = ?', [ownerId]);
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado.' });
  }

  const imageId = randomUUID();
  const createdAt = new Date().toISOString();

  const image = {
    id: imageId,
    artwork,
    author,
    date: date || new Date().toLocaleDateString('es-CO'),
    owner_id: ownerId,
    owner_name: user.name,
    data_url: dataUrl,
    rating: Math.max(1, Math.min(5, rating)),
    created_at: createdAt,
  };

  try {
    await run(
      `INSERT INTO images
        (id, artwork, author, date, owner_id, owner_name, data_url, rating, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        image.id,
        image.artwork,
        image.author,
        image.date,
        image.owner_id,
        image.owner_name,
        image.data_url,
        image.rating,
        image.created_at,
      ]
    );
  } catch {
    return res.status(500).json({ error: 'No se pudo registrar la imagen.' });
  }

  return res.status(201).json({ image: sanitizeImage(image) });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor del museo activo en http://localhost:${PORT}`);
      console.log(`Base de datos SQLite: ${DB_FILE}`);
    });
  })
  .catch(error => {
    console.error('No se pudo iniciar la base de datos:', error.message);
    process.exit(1);
  });
