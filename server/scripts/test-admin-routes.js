require('dotenv').config();
const bcrypt = require('bcrypt');
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

async function ensureAdminUser() {
  if (!pool) throw new Error('Database not configured');

  const email = 'admin@test.com';
  const password = 'Admin1234!';

  const roleRow = await pool.query('SELECT id FROM roles WHERE code = $1', ['ADMIN']);
  if (roleRow.rowCount === 0) throw new Error('ADMIN role not found in roles table');
  const roleId = roleRow.rows[0].id;

  const userRow = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  let userId;
  if (userRow.rowCount === 0) {
    const hash = await bcrypt.hash(password, 10);
    const ins = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, TRUE, NOW(), NOW())
       RETURNING id`,
      [email, hash, 'Admin User'],
    );
    userId = ins.rows[0].id;
  } else {
    userId = userRow.rows[0].id;
  }

  const ur = await pool.query(
    'SELECT 1 FROM user_roles WHERE user_id = $1 AND role_id = $2',
    [userId, roleId],
  );
  if (ur.rowCount === 0) {
    await pool.query(
      'INSERT INTO user_roles (user_id, role_id, created_at) VALUES ($1, $2, NOW())',
      [userId, roleId],
    );
  }

  return { email, password };
}

async function main() {
  console.log('1) Buyer & Provider kayıt + login...');
  const buyerEmail = 'admin-test-buyer@test.com';
  const providerEmail = 'admin-test-provider@test.com';

  await request('POST', '/auth/register/buyer', {
    email: buyerEmail,
    password: 'Test1234!',
    full_name: 'Buyer Admin Test',
    legal_name: 'Buyer Admin Test Ltd.',
    tax_id: '3333333333',
    hq_city_id: 34,
  });
  await request('POST', '/auth/register/provider', {
    email: providerEmail,
    password: 'Test1234!',
    full_name: 'Provider Admin Test',
    legal_name: 'Provider Admin Test A.Ş.',
    tax_id: '4444444444',
    hq_city_id: 34,
    pays_salary_sgk_tax_on_time: true,
  });

  const buyerLogin = await request('POST', '/auth/login', {
    email: buyerEmail,
    password: 'Test1234!',
  });
  const providerLogin = await request('POST', '/auth/login', {
    email: providerEmail,
    password: 'Test1234!',
  });
  if (buyerLogin.status !== 200 || providerLogin.status !== 200) {
    console.error('Buyer/provider login failed', buyerLogin, providerLogin);
    process.exit(1);
  }
  const buyerToken = (buyerLogin.data?.data ?? buyerLogin.data).token;
  const providerToken = (providerLogin.data?.data ?? providerLogin.data).token;

  console.log('2) Admin user oluşturma + login...');
  const { email: adminEmail, password: adminPassword } = await ensureAdminUser();
  const adminLogin = await request('POST', '/auth/login', {
    email: adminEmail,
    password: adminPassword,
  });
  if (adminLogin.status !== 200) {
    console.error('Admin login failed:', adminLogin.status, adminLogin.data);
    process.exit(1);
  }
  const adminToken = (adminLogin.data?.data ?? adminLogin.data).token;

  const endpoints = ['/admin/requests', '/admin/offers', '/admin/risk-flags'];

  console.log('3) Buyer/provider token ile admin endpointleri (403 beklenir)...');
  for (const ep of endpoints) {
    const rBuyer = await request('GET', ep, null, buyerToken);
    const rProv = await request('GET', ep, null, providerToken);
    if (rBuyer.status !== 403 || rProv.status !== 403) {
      console.error('Expected 403 for buyer/provider on', ep, rBuyer.status, rProv.status);
      process.exit(1);
    }
    console.log(`   ${ep}: buyer=${rBuyer.status}, provider=${rProv.status}`);
  }

  console.log('4) Admin token ile admin endpointleri (200 + alan kontrolü)...');

  // 4a) /admin/requests alan kontrolü
  const rAdminReq = await request('GET', '/admin/requests', null, adminToken);
  if (rAdminReq.status !== 200) {
    console.error('Expected 200 for admin on /admin/requests', rAdminReq.status, rAdminReq.data);
    process.exit(1);
  }
  console.log('   /admin/requests: admin=200');
  const reqItems = rAdminReq.data?.data ?? [];
  if (reqItems.length > 0) {
    const r0 = reqItems[0];
    const requiredReqFields = ['request_id', 'buyer_org_id', 'status', 'city_id', 'city', 'personnel_count', 'budget_min_try', 'budget_max_try', 'created_at', 'offers_count'];
    for (const f of requiredReqFields) {
      if (!(f in r0)) {
        console.error('Missing field in /admin/requests item:', f, r0);
        process.exit(1);
      }
    }
  }

  // 4b) /admin/offers alan kontrolü
  const rAdminOff = await request('GET', '/admin/offers', null, adminToken);
  if (rAdminOff.status !== 200) {
    console.error('Expected 200 for admin on /admin/offers', rAdminOff.status, rAdminOff.data);
    process.exit(1);
  }
  console.log('   /admin/offers: admin=200');
  const offItems = rAdminOff.data?.data ?? [];
  if (offItems.length > 0) {
    const o0 = offItems[0];
    const requiredOffFields = ['offer_id', 'request_id', 'provider_org_id', 'total_price_try', 'risk_band', 'budget_band', 'status', 'created_at'];
    for (const f of requiredOffFields) {
      if (!(f in o0)) {
        console.error('Missing field in /admin/offers item:', f, o0);
        process.exit(1);
      }
    }
  }

  // 4c) /admin/risk-flags alan kontrolü
  const rAdminRisk = await request('GET', '/admin/risk-flags', null, adminToken);
  if (rAdminRisk.status !== 200) {
    console.error('Expected 200 for admin on /admin/risk-flags', rAdminRisk.status, rAdminRisk.data);
    process.exit(1);
  }
  console.log('   /admin/risk-flags: admin=200');
  const riskItems = rAdminRisk.data?.data ?? [];
  if (riskItems.length > 0) {
    const f0 = riskItems[0];
    const requiredRiskFields = ['risk_flag_id', 'entity_type', 'entity_id', 'reason', 'severity', 'created_at'];
    for (const f of requiredRiskFields) {
      if (!(f in f0)) {
        console.error('Missing field in /admin/risk-flags item:', f, f0);
        process.exit(1);
      }
    }
  }

  console.log('\nAdmin route koruması + /admin/requests & /admin/offers & /admin/risk-flags alan testleri geçti.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

