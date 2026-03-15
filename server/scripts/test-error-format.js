const path = require('path');
// .env her zaman server klasöründen yüklensin (proje kökünden çalıştırılsa bile)
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { pool } = require('../src/db/pool');

const BASE = process.env.API_BASE_URL || 'http://localhost:3000';

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

function assertErrorShape(where, res) {
  if (!res.data || typeof res.data.code !== 'string' || typeof res.data.message !== 'string') {
    console.error(where, 'error format invalid:', res.status, res.data);
    process.exit(1);
  }
  console.log(where, '=>', res.status, res.data.code, '-', res.data.message);
}

async function main() {
  // Sunucu ayakta mı kontrol et
  try {
    await fetch(BASE, { method: 'GET', signal: AbortSignal.timeout(3000) });
  } catch (e) {
    const code = e.cause?.code ?? e.code ?? e.cause?.errors?.[0]?.code;
    const isConnectionError = code === 'ECONNREFUSED' || e.message === 'fetch failed';
    if (isConnectionError) {
      console.error('Hata: API sunucusu çalışmıyor (bağlantı reddedildi).');
      console.error('Önce başka bir terminalde: npm run dev');
      console.error('Ardından bu testi tekrar çalıştırın: node scripts/test-error-format.js');
      process.exit(1);
    }
    throw e;
  }

  // Veritabanı erişilebilir mi kontrol et (register/login 500 dönmesin)
  if (!pool) {
    console.error('Hata: Veritabanı bağlantısı yok (DATABASE_URL tanımlı değil veya .env yüklenemedi).');
    console.error('server/.env dosyasında DATABASE_URL olduğundan emin olun.');
    process.exit(1);
  }
  try {
    await pool.query('SELECT 1');
  } catch (e) {
    const code = e.code ?? e.cause?.code;
    if (code === 'ECONNREFUSED' || (e.message && e.message.includes('ECONNREFUSED'))) {
      console.error('Hata: PostgreSQL çalışmıyor veya erişilemiyor.');
      console.error('Önce veritabanını başlatın (örn. Docker: docker compose up -d).');
      console.error('.env içinde DATABASE_URL doğru mu kontrol edin.');
      process.exit(1);
    }
    console.error('Veritabanı kontrolü başarısız:', e.message);
    process.exit(1);
  }

  console.log('0) register – invalid email format');
  const regBadEmail = await request('POST', '/auth/register/buyer', {
    email: 'not-an-email',
    password: 'Test1234!',
    full_name: 'Bad Email',
    legal_name: 'Bad Email Ltd.',
    tax_id: '7777777777',
    hq_city_id: 34,
  });
  if (regBadEmail.status !== 400) {
    console.error('Expected 400 for invalid email format, got', regBadEmail.status, regBadEmail.data);
    process.exit(1);
  }
  assertErrorShape('register (invalid email format)', regBadEmail);

  console.log('1) register – EMAIL_EXISTS');
  await request('POST', '/auth/register/buyer', {
    email: 'err-test@test.com',
    password: 'Test1234!',
    full_name: 'Err Test',
    legal_name: 'Err Test Ltd.',
    tax_id: '9999999999',
    hq_city_id: 34,
  });
  const regDup = await request('POST', '/auth/register/buyer', {
    email: 'err-test@test.com',
    password: 'Test1234!',
    full_name: 'Err Test',
    legal_name: 'Err Test Ltd.',
    tax_id: '9999999999',
    hq_city_id: 34,
  });
  assertErrorShape('register (EMAIL_EXISTS)', regDup);

  console.log('2) login – INVALID_CREDENTIALS');
  const badLogin = await request('POST', '/auth/login', {
    email: 'err-test@test.com',
    password: 'WrongPass!',
  });
  assertErrorShape('login (INVALID_CREDENTIALS)', badLogin);

  console.log('3) buyer requests – VALIDATION_ERROR');
  const buyerLogin = await request('POST', '/auth/login', {
    email: 'err-test@test.com',
    password: 'Test1234!',
  });
  const buyerToken = (buyerLogin.data?.data ?? buyerLogin.data).token;
  const badReq = await request('POST', '/buyer/requests', {
    city_id: 34,
  }, buyerToken);
  assertErrorShape('buyer requests (VALIDATION_ERROR)', badReq);

  console.log('4) publish – NOT_FOUND/VALIDATION_ERROR');
  const badPublish = await request('POST', '/buyer/requests/not-a-uuid/publish', null, buyerToken);
  assertErrorShape('publish (NOT_FOUND/VALIDATION_ERROR)', badPublish);

  console.log('5) offers – UNAUTHORIZED');
  const badOffer = await request('POST', '/provider/requests/not-a-uuid/offers', {
    total_price_try: 1,
  }, null);
  assertErrorShape('offers (UNAUTHORIZED)', badOffer);

  console.log('5b) offers – total_price_try <= 0 (with provider token)');
  const provLoginForPrice = await request('POST', '/auth/login', {
    email: 'admin-test-provider@test.com',
    password: 'Test1234!',
  });
  const provToken2 = (provLoginForPrice.data?.data ?? provLoginForPrice.data).token;
  // Geçerli UUID v4 kullan ki body validasyonu çalışsın (400 VALIDATION_ERROR)
  const validUuid = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  const badPrice = await request(
    'POST',
    `/provider/requests/${validUuid}/offers`,
    { total_price_try: 0 },
    provToken2,
  );
  if (badPrice.status !== 400) {
    console.error('Expected 400 for total_price_try <= 0, got', badPrice.status, badPrice.data);
    process.exit(1);
  }
  if (badPrice.data?.code !== 'VALIDATION_ERROR') {
    console.error('Expected VALIDATION_ERROR for total_price_try <= 0, got', badPrice.data?.code);
    process.exit(1);
  }
  assertErrorShape('offers (total_price_try <= 0)', badPrice);

  console.log('6) shortlist – NOT_FOUND/VALIDATION_ERROR');
  const shortBad = await request(
    'POST',
    '/buyer/requests/not-a-uuid/offers/not-a-uuid/shortlist',
    null,
    buyerToken,
  );
  assertErrorShape('shortlist (NOT_FOUND/VALIDATION_ERROR)', shortBad);

  console.log('7) reject – NOT_FOUND/VALIDATION_ERROR');
  const rejBad = await request(
    'POST',
    '/buyer/requests/not-a-uuid/offers/not-a-uuid/reject',
    null,
    buyerToken,
  );
  assertErrorShape('reject (NOT_FOUND/VALIDATION_ERROR)', rejBad);

  console.log('8) admin/requests – FORBIDDEN (buyer token)');
  const adminReqBad = await request('GET', '/admin/requests', null, buyerToken);
  assertErrorShape('admin/requests (FORBIDDEN)', adminReqBad);

  console.log('9) payment-report – NOT_FOUND/VALIDATION_ERROR');
  const provLogin = await request('POST', '/auth/login', {
    email: 'admin-test-provider@test.com',
    password: 'Test1234!',
  });
  const providerToken = (provLogin.data?.data ?? provLogin.data).token;
  const payBad = await request('POST', '/provider/requests/not-a-uuid/payment-report', {
    status: 'LATE',
    note: 'Test',
  }, providerToken);
  assertErrorShape('payment-report (NOT_FOUND/VALIDATION_ERROR)', payBad);

  // --- Validation sertleştirme: bozuk body → 400
  console.log('10) register – password min length');
  const regShortPw = await request('POST', '/auth/register/buyer', {
    email: 'shortpw@test.com',
    password: 'short',
    full_name: 'Short',
    legal_name: 'Short Ltd.',
    tax_id: '8888888888',
    hq_city_id: 34,
  });
  if (regShortPw.status !== 400) {
    console.error('Expected 400 for short password, got', regShortPw.status, regShortPw.data);
    process.exit(1);
  }
  assertErrorShape('register (password min length)', regShortPw);

  console.log('11) register – tax_id boş');
  const regNoTax = await request('POST', '/auth/register/buyer', {
    email: 'notax@test.com',
    password: 'Test1234!',
    full_name: 'No Tax',
    legal_name: 'No Tax Ltd.',
    tax_id: '',
    hq_city_id: 34,
  });
  if (regNoTax.status !== 400) {
    console.error('Expected 400 for empty tax_id, got', regNoTax.status, regNoTax.data);
    process.exit(1);
  }
  assertErrorShape('register (tax_id empty)', regNoTax);

  console.log('12) buyer requests – personnel_count <= 0');
  const badPersonnel = await request('POST', '/buyer/requests', {
    service_type: 'SILAHLI',
    city_id: 34,
    address_text: 'Adres',
    site_type: 'Ofis',
    personnel_count: 0,
    shift_type: '8',
    start_date: '2025-06-01',
    contract_months: 12,
    budget_min_try: 100000,
    budget_max_try: 200000,
  }, buyerToken);
  if (badPersonnel.status !== 400) {
    console.error('Expected 400 for personnel_count <= 0, got', badPersonnel.status, badPersonnel.data);
    process.exit(1);
  }
  assertErrorShape('buyer requests (personnel_count)', badPersonnel);

  console.log('13) buyer requests – budget_min_try > budget_max_try');
  const badBudget = await request('POST', '/buyer/requests', {
    service_type: 'SILAHLI',
    city_id: 34,
    address_text: 'Adres',
    site_type: 'Ofis',
    personnel_count: 5,
    shift_type: '8',
    start_date: '2025-06-01',
    contract_months: 12,
    budget_min_try: 300000,
    budget_max_try: 200000,
  }, buyerToken);
  if (badBudget.status !== 400) {
    console.error('Expected 400 for budget_min > budget_max, got', badBudget.status, badBudget.data);
    process.exit(1);
  }
  assertErrorShape('buyer requests (budget_min <= budget_max)', badBudget);

  console.log('14) payment-report – invalid status enum');
  const payInvalidStatus = await request('POST', '/provider/requests/' + validUuid + '/payment-report', {
    status: 'INVALID_STATUS',
    note: 'Test',
  }, providerToken);
  if (payInvalidStatus.status !== 400) {
    console.error('Expected 400 for invalid payment status, got', payInvalidStatus.status, payInvalidStatus.data);
    process.exit(1);
  }
  assertErrorShape('payment-report (invalid status)', payInvalidStatus);

  console.log('\nTüm error format ve validation testleri geçti.');
  await pool.end().catch(() => {});
  process.exit(0);
}

main().catch(async (err) => {
  console.error(err);
  await pool.end().catch(() => {});
  process.exit(1);
});

