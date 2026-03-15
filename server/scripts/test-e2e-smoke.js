/**
 * 6️⃣ End-to-end smoke test
 * Tam akış: buyer register → provider register → login → request create → publish
 * → provider matches → offer submit → buyer offers list → shortlist → payment report
 * → admin requests / offers / payment-reports
 *
 * Gereksinim: API çalışıyor (npm run dev), DB + migrations + en az city 34.
 * Kullanım: node server/scripts/test-e2e-smoke.js  (proje kökünden)
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { pool } = require('../src/db/pool');
const bcrypt = require('bcrypt');

const BASE = process.env.API_BASE_URL || 'http://localhost:3000';
const ts = Date.now();
const buyerEmail = `e2e-buyer-${ts}@test.com`;
const providerEmail = `e2e-provider-${ts}@test.com`;

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

function getToken(res) {
  const d = res.data?.data ?? res.data;
  return d?.token ?? res.data?.token;
}

function getOrgId(res) {
  const d = res.data?.data ?? res.data;
  return d?.user?.org_id ?? d?.user?.organizationId ?? d?.organization?.id;
}

async function ensureAdminUser() {
  if (!pool) throw new Error('Database not configured');
  const email = 'admin@test.com';
  const password = 'Admin1234!';
  const roleRow = await pool.query("SELECT id FROM roles WHERE code = $1", ['ADMIN']);
  if (roleRow.rowCount === 0) throw new Error('ADMIN role not found');
  const roleId = roleRow.rows[0].id;
  const userRow = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  let userId;
  if (userRow.rowCount === 0) {
    const hash = await bcrypt.hash(password, 10);
    const ins = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, TRUE, NOW(), NOW()) RETURNING id`,
      [email, hash, 'Admin User']
    );
    userId = ins.rows[0].id;
  } else {
    userId = userRow.rows[0].id;
  }
  const ur = await pool.query('SELECT 1 FROM user_roles WHERE user_id = $1 AND role_id = $2', [userId, roleId]);
  if (ur.rowCount === 0) {
    await pool.query('INSERT INTO user_roles (user_id, role_id, created_at) VALUES ($1, $2, NOW())', [userId, roleId]);
  }
  return { email, password };
}

async function main() {
  console.log('E2E Smoke Test – MVP zinciri\n');

  if (!pool) {
    console.error('DATABASE_URL yok veya pool yok.');
    process.exit(1);
  }

  try {
    await pool.query('SELECT 1');
  } catch (e) {
    console.error('DB bağlantı hatası:', e.message);
    process.exit(1);
  }

  try {
    await request('GET', BASE, null, null);
  } catch (e) {
    console.error('API yanıt vermiyor. npm run dev ile başlatın.');
    process.exit(1);
  }

  // 1) Buyer register
  console.log('1) Buyer register');
  const regBuyer = await request('POST', '/auth/register/buyer', {
    email: buyerEmail,
    password: 'Test1234!',
    full_name: 'E2E Buyer',
    legal_name: 'E2E Buyer Ltd.',
    tax_id: `5${String(ts).slice(-9)}`,
    hq_city_id: 34,
  });
  if (regBuyer.status !== 201) {
    console.error('   FAIL', regBuyer.status, regBuyer.data);
    process.exit(1);
  }
  console.log('   201 OK');

  // 2) Provider register
  console.log('2) Provider register');
  const regProvider = await request('POST', '/auth/register/provider', {
    email: providerEmail,
    password: 'Test1234!',
    full_name: 'E2E Provider',
    legal_name: 'E2E Güvenlik A.Ş.',
    tax_id: `6${String(ts).slice(-9)}`,
    hq_city_id: 34,
    pays_salary_sgk_tax_on_time: true,
  });
  if (regProvider.status !== 201) {
    console.error('   FAIL', regProvider.status, regProvider.data);
    process.exit(1);
  }
  console.log('   201 OK');

  // 3) Login (buyer + provider)
  console.log('3) Login (buyer + provider)');
  const loginBuyer = await request('POST', '/auth/login', { email: buyerEmail, password: 'Test1234!' });
  const loginProvider = await request('POST', '/auth/login', { email: providerEmail, password: 'Test1234!' });
  if (loginBuyer.status !== 200 || loginProvider.status !== 200) {
    console.error('   Login FAIL', loginBuyer.status, loginProvider.status);
    process.exit(1);
  }
  const buyerToken = getToken(loginBuyer);
  const providerToken = getToken(loginProvider);
  let providerOrgId = getOrgId(loginProvider);
  if (!providerOrgId) {
    const me = await request('GET', '/auth/me', null, providerToken);
    providerOrgId = (me.data?.data ?? me.data)?.org?.id ?? (me.data?.data ?? me.data)?.organization_id;
  }
  if (!providerOrgId) {
    console.error('   Provider org_id alınamadı');
    process.exit(1);
  }
  console.log('   200 OK');

  // 4) Buyer request create
  console.log('4) Buyer request create');
  const createReq = await request('POST', '/buyer/requests', {
    service_type: 'SILAHLI',
    city_id: 34,
    address_text: 'E2E Test Mah. No:1',
    site_type: 'Ofis',
    personnel_count: 5,
    shift_type: '12',
    start_date: '2025-06-01',
    contract_months: 12,
    budget_min_try: 300000,
    budget_max_try: 500000,
    subcontract_allowed: false,
  }, buyerToken);
  if (createReq.status !== 201) {
    console.error('   FAIL', createReq.status, createReq.data);
    process.exit(1);
  }
  const requestId = (createReq.data?.data ?? createReq.data)?.request_id;
  if (!requestId) {
    console.error('   request_id dönmedi');
    process.exit(1);
  }
  console.log('   201 OK, request_id:', requestId);

  // 5) Buyer publish
  console.log('5) Buyer publish');
  const publishRes = await request('POST', `/buyer/requests/${requestId}/publish`, null, buyerToken);
  if (publishRes.status !== 200) {
    console.error('   FAIL', publishRes.status, publishRes.data);
    process.exit(1);
  }
  console.log('   200 OK');

  // 6) request_matches: provider'ı bu talebe eşleştir (test için manuel)
  console.log('6) request_matches (manuel eşleşme)');
  try {
    await pool.query(
      `INSERT INTO request_matches (request_id, provider_org_id, match_status, overall_fit_score, budget_fit_band)
       VALUES ($1, $2, 'VISIBLE', 75, 'IN')`,
      [requestId, providerOrgId]
    );
  } catch (e) {
    if (e.code === '42703') {
      await pool.query(
        `INSERT INTO request_matches (request_id, provider_org_id, match_score, budget_band)
         VALUES ($1, $2, 75, 'IN')`,
        [requestId, providerOrgId]
      );
    } else throw e;
  }
  console.log('   OK');

  // 7) Provider matches list
  console.log('7) Provider matches list');
  const matchesRes = await request('GET', '/provider/matches', null, providerToken);
  if (matchesRes.status !== 200) {
    console.error('   FAIL', matchesRes.status, matchesRes.data);
    process.exit(1);
  }
  const items = matchesRes.data?.data ?? [];
  const found = items.find((m) => m.request_id === requestId);
  if (!found) {
    console.error('   Eşleşme listede yok');
    process.exit(1);
  }
  console.log('   200 OK');

  // 8) Provider offer submit
  console.log('8) Provider offer submit');
  const offerRes = await request('POST', `/provider/requests/${requestId}/offers`, {
    total_price_try: 400000,
    price_breakdown: { personnel: 320000, sgk: 50000, meal_transport: 20000, service_fee: 10000 },
    notes: 'E2E smoke test teklifi',
  }, providerToken);
  if (offerRes.status !== 201) {
    console.error('   FAIL', offerRes.status, offerRes.data);
    process.exit(1);
  }
  const offerId = (offerRes.data?.data ?? offerRes.data)?.offer_id ?? (offerRes.data?.data ?? offerRes.data)?.id;
  console.log('   201 OK, offer_id:', offerId);

  // 9) Buyer offers list
  console.log('9) Buyer offers list');
  const buyerOffersRes = await request('GET', `/buyer/requests/${requestId}/offers`, null, buyerToken);
  if (buyerOffersRes.status !== 200) {
    console.error('   FAIL', buyerOffersRes.status, buyerOffersRes.data);
    process.exit(1);
  }
  const offersList = buyerOffersRes.data?.data ?? [];
  if (offersList.length === 0) {
    console.error('   Teklif listesi boş');
    process.exit(1);
  }
  const firstOfferId = offersList[0].offer_id ?? offersList[0].id;
  console.log('   200 OK, offers:', offersList.length);

  // 10) Buyer shortlist
  console.log('10) Buyer shortlist');
  const shortlistRes = await request(
    'POST',
    `/buyer/requests/${requestId}/offers/${firstOfferId}/shortlist`,
    null,
    buyerToken
  );
  if (shortlistRes.status !== 200) {
    console.error('   FAIL', shortlistRes.status, shortlistRes.data);
    process.exit(1);
  }
  console.log('   200 OK');

  // 11) Provider payment report
  console.log('11) Provider payment report');
  const payReportRes = await request('POST', `/provider/requests/${requestId}/payment-report`, {
    status: 'ON_TIME',
    note: 'E2E smoke test ödeme raporu',
  }, providerToken);
  if (payReportRes.status !== 201) {
    console.error('   FAIL', payReportRes.status, payReportRes.data);
    process.exit(1);
  }
  console.log('   201 OK');

  // 12) Admin requests / offers / payment-reports
  console.log('12) Admin requests, offers, payment-reports');
  const { email: adminEmail, password: adminPassword } = await ensureAdminUser();
  const adminLogin = await request('POST', '/auth/login', { email: adminEmail, password: adminPassword });
  if (adminLogin.status !== 200) {
    console.error('   Admin login FAIL', adminLogin.status, adminLogin.data);
    process.exit(1);
  }
  const adminToken = getToken(adminLogin);

  const adminRequests = await request('GET', '/admin/requests', null, adminToken);
  const adminOffers = await request('GET', '/admin/offers', null, adminToken);
  const adminPayments = await request('GET', '/admin/payment-reports', null, adminToken);
  if (adminRequests.status !== 200 || adminOffers.status !== 200 || adminPayments.status !== 200) {
    console.error('   Admin FAIL', adminRequests.status, adminOffers.status, adminPayments.status);
    process.exit(1);
  }
  console.log('   /admin/requests: 200, /admin/offers: 200, /admin/payment-reports: 200');

  await pool.end().catch(() => {});
  console.log('\n✅ E2E smoke test tamamlandı – MVP zinciri kırılmadan çalıştı.');
  process.exit(0);
}

main().catch(async (err) => {
  console.error(err);
  await pool.end().catch(() => {});
  process.exit(1);
});
