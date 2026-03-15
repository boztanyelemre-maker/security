/**
 * Env validation testi:
 * - Production'da JWT_SECRET yoksa config throw eder.
 * - Dev'de eksik env ile config yüklenir (fallback kullanılır).
 */
const path = require('path');
const { spawnSync } = require('child_process');

const serverDir = path.join(__dirname, '..');

console.log('1) NODE_ENV=production, JWT_SECRET boş → config throw etmeli');
const r = spawnSync(
  process.execPath,
  ['-e', "require('./src/config')"],
  {
    cwd: serverDir,
    env: { ...process.env, NODE_ENV: 'production', JWT_SECRET: '', DOTENV_SKIP: '1' },
    encoding: 'utf8',
  }
);
if (r.status === 0) {
  console.error('Hata: JWT_SECRET yokken production config yüklenmemeli.');
  process.exit(1);
}
if (!r.stderr || !r.stderr.includes('JWT_SECRET')) {
  console.error('Beklenen hata: JWT_SECRET required. stderr:', r.stderr);
  process.exit(1);
}
console.log('   => Config doğru şekilde throw etti.');

console.log('2) NODE_ENV=development, JWT_SECRET boş → config yüklenmeli (fallback)');
const r2 = spawnSync(
  process.execPath,
  ['-e', "const c = require('./src/config'); if (!c.jwtSecret) process.exit(1);"],
  {
    cwd: serverDir,
    env: { ...process.env, NODE_ENV: 'development', JWT_SECRET: '', DOTENV_SKIP: '1' },
    encoding: 'utf8',
  }
);
if (r2.status !== 0) {
  console.error('Dev\'de fallback secret olmalı.');
  process.exit(1);
}
console.log('   => Dev fallback OK.');

console.log('\nEnv validation testleri geçti.');
process.exit(0);
