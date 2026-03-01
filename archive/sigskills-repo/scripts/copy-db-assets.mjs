import { mkdirSync, copyFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const root = fileURLToPath(new URL('..', import.meta.url));
const srcDb = join(root, 'src', 'db');
const distDb = join(root, 'dist', 'db');
const srcMigrations = join(srcDb, 'migrations');
const distMigrations = join(distDb, 'migrations');

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function copyIfExists(from, to) {
  if (!existsSync(from)) {
    return;
  }
  ensureDir(join(to, '..'));
  copyFileSync(from, to);
}

ensureDir(distDb);
copyIfExists(join(srcDb, 'schema.sql'), join(distDb, 'schema.sql'));

if (existsSync(srcMigrations)) {
  ensureDir(distMigrations);
  for (const file of readdirSync(srcMigrations)) {
    if (!file.endsWith('.sql')) {
      continue;
    }
    copyIfExists(join(srcMigrations, file), join(distMigrations, file));
  }
}
