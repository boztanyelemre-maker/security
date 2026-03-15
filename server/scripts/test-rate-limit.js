const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const BASE = process.env.API_BASE_URL || 'http://localhost:3000';

async function request(method, path, body, token) {
  const url = path.startsWith('http') ? path : `${BASE}${path}`;
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  };
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, opts);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  return { status: res.status, data };
}

async function main() {
  // Token'ı login limitini doldurmadan önce al (sonra 429 gelir)
  console.log('0) Provider token alınıyor (offers testi için)');
  const loginRes = await request('POST', '/auth/login', {
    email: 'admin-test-provider@test.com',
    password: 'Test1234!',
  });
  const providerToken = loginRes.data?.data?.token ?? loginRes.data?.token;

  console.log('\n1) Rate limit /auth/login (max 10/60s)');
  let last;
  for (let i = 1; i <= 12; i++) {
    last = await request('POST', '/auth/login', {
      email: 'nonexistent@test.com',
      password: 'wrong',
    });
    console.log(`   try ${i}:`, last.status, last.data?.code);
  }
  if (last.status !== 429 || last.data?.code !== 'RATE_LIMITED') {
    console.error('Expected 429 RATE_LIMITED after 10+ /auth/login attempts, got', last.status, last.data);
    process.exit(1);
  }
  console.log('   => 429 RATE_LIMITED OK');

  console.log('\n2) Rate limit /auth/register/buyer (max 5/60s)');
  let regLast;
  for (let i = 1; i <= 7; i++) {
    regLast = await request('POST', '/auth/register/buyer', {
      email: `spam${i}@ratetest.com`,
      password: 'Test1234!',
      full_name: 'Spam',
      legal_name: 'Spam Ltd',
      tax_id: `7777777${i}`,
      hq_city_id: 34,
    });
    console.log(`   try ${i}:`, regLast.status, regLast.data?.code);
  }
  if (regLast.status !== 429 || regLast.data?.code !== 'RATE_LIMITED') {
    console.error('Expected 429 RATE_LIMITED after 5+ /auth/register/buyer attempts, got', regLast.status, regLast.data);
    process.exit(1);
  }
  console.log('   => 429 RATE_LIMITED OK');

  console.log('\n3) Rate limit POST /provider/requests/:id/offers (max 20/60s)');
  if (!providerToken) {
    console.log('   (Provider token yok, adım atlanıyor)');
  } else {
    const offerUuid = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    let offerLast;
    for (let i = 1; i <= 22; i++) {
      offerLast = await request('POST', `/provider/requests/${offerUuid}/offers`, {
        total_price_try: 50000 + i,
        notes: 'Rate limit test',
      }, providerToken);
      if (i <= 3 || i >= 20) console.log(`   try ${i}:`, offerLast.status, offerLast.data?.code);
    }
    if (offerLast.status !== 429 || offerLast.data?.code !== 'RATE_LIMITED') {
      console.error('Expected 429 RATE_LIMITED after 20+ offer attempts, got', offerLast.status, offerLast.data);
      process.exit(1);
    }
    console.log('   => 429 RATE_LIMITED OK');
  }

  console.log('\nTüm rate limit testleri geçti.');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

