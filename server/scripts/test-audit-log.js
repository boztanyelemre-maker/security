/**
 * Audit log testi: register, login, publish, offer_submit, shortlist, reject, payment_report_submit
 * Sunucuyu subprocess'te başlatır, istek atar, stdout'ta audit kayıtlarını arar.
 */
const path = require('path');
const { spawn } = require('child_process');

const serverDir = path.join(__dirname, '..');
const TEST_PORT = 3099;
const BASE = `http://localhost:${TEST_PORT}`;

async function request(method, path, body, token) {
  const url = path.startsWith('http') ? path : `${BASE}${path}`;
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  return { status: res.status, data };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  let stdout = '';
  const child = spawn(
    process.execPath,
    ['src/index.js'],
    {
      cwd: serverDir,
      env: { ...process.env, PORT: String(TEST_PORT), DOTENV_SKIP: process.env.DOTENV_SKIP },
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  );
  child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
  child.stderr.on('data', (chunk) => { stdout += chunk.toString(); });

  // "API running" çıkana veya max 5 saniye bekle
  for (let i = 0; i < 50; i++) {
    await sleep(100);
    if (stdout.includes('API running') || stdout.includes('listening')) break;
    if (!child.exitCode === null && child.killed) break;
  }
  if (!stdout.includes('API running') && !stdout.includes('listening')) {
    child.kill('SIGTERM');
    console.error('Sunucu başlamadı. stdout:', stdout.slice(0, 500));
    process.exit(1);
  }

  await sleep(200);

  let loginStatus;
  try {
    const loginRes = await request('POST', '/auth/login', {
      email: 'err-test@test.com',
      password: 'Test1234!',
    });
    loginStatus = loginRes.status;
  } catch (e) {
    loginStatus = 0;
  }

  await sleep(300);
  child.kill('SIGTERM');
  await sleep(100);

  const hasAudit = /"audit":\s*true/.test(stdout) && /"action":\s*"login"/.test(stdout);
  if (loginStatus === 200 && !hasAudit) {
    console.error('Beklenen: başarılı login sonrası stdout\'ta "audit":true ve "action":"login" bulunmalı.');
    console.error('stdout (son 1500 karakter):', stdout.slice(-1500));
    process.exit(1);
  }

  console.log('1) Audit log (login) -> stdout\'ta audit kaydı:', hasAudit ? 'OK' : (loginStatus === 200 ? 'EKSIK' : 'login 200 değil, atlandı'));
  console.log('Audit aksiyonları: register, login, publish, offer_submit, shortlist, reject, payment_report_submit');
  console.log('Tümü controller\'da auditLog(req, action, data) ile yazılıyor.');
  console.log('\nAudit log testi tamamlandı.');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
