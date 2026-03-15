/**
 * POST /provider/requests/:id/offers akışını test eder.
 * Kullanım: server klasöründen: node scripts/test-offer-post.js
 * Gereksinim: .env DATABASE_URL, API http://localhost:3000 çalışıyor olmalı.
 * Migration 003b ve seed 002_cities çalıştırılmış olmalı (en az bir city).
 */

require('dotenv').config();
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

async function main() {
  console.log('1) Provider kaydı...');
  const regProvider = await request('POST', '/auth/register/provider', {
    email: 'provider-offer-test@test.com',
    password: 'Test1234!',
    full_name: 'Test Provider',
    legal_name: 'Test Güvenlik A.Ş.',
    tax_id: '1111111111',
    hq_city_id: 34,
    pays_salary_sgk_tax_on_time: true,
  });
  if (regProvider.status !== 201 && regProvider.status !== 409) {
    console.error('Provider register:', regProvider.status, regProvider.data);
    process.exit(1);
  }

  console.log('2) Provider login...');
  const loginProvider = await request('POST', '/auth/login', {
    email: 'provider-offer-test@test.com',
    password: 'Test1234!',
  });
  if (loginProvider.status !== 200) {
    console.error('Provider login:', loginProvider.status, loginProvider.data);
    process.exit(1);
  }
  const resData = loginProvider.data?.data ?? loginProvider.data;
  const providerToken = resData?.token ?? loginProvider.data?.token;
  let providerOrgId = resData?.user?.org_id ?? loginProvider.data?.user?.org_id ?? resData?.organizationId;
  if (!providerOrgId) {
    const me = await request('GET', '/auth/me', null, providerToken);
    const d = me.data?.data ?? me.data;
    providerOrgId = d?.org?.id ?? d?.organization_id;
  }
  if (!providerOrgId) {
    console.error('Provider org_id yok. Login yanıtı:', JSON.stringify(loginProvider.data, null, 2));
    process.exit(1);
  }
  console.log('   Provider org_id:', providerOrgId);

  console.log('3) Buyer kaydı...');
  const regBuyer = await request('POST', '/auth/register/buyer', {
    email: 'buyer-offer-test@test.com',
    password: 'Test1234!',
    full_name: 'Test Buyer',
    legal_name: 'Test Alıcı Ltd.',
    tax_id: '2222222222',
    hq_city_id: 34,
  });
  if (regBuyer.status !== 201 && regBuyer.status !== 409) {
    console.error('Buyer register:', regBuyer.status, regBuyer.data);
    process.exit(1);
  }

  console.log('4) Buyer login...');
  const loginBuyer = await request('POST', '/auth/login', {
    email: 'buyer-offer-test@test.com',
    password: 'Test1234!',
  });
  if (loginBuyer.status !== 200) {
    console.error('Buyer login:', loginBuyer.status, loginBuyer.data);
    process.exit(1);
  }
  const buyerResData = loginBuyer.data?.data ?? loginBuyer.data;
  const buyerToken = buyerResData?.token ?? loginBuyer.data?.token;

  console.log('5) Talep oluşturma (DRAFT)...');
  const createReq = await request('POST', '/buyer/requests', {
    service_type: 'SILAHLI',
    city_id: 34,
    address_text: 'Test Mah. Test Sok. No:1',
    site_type: 'Ofis',
    personnel_count: 5,
    shift_type: '12',
    start_date: '2025-04-01',
    contract_months: 12,
    budget_min_try: 300000,
    budget_max_try: 500000,
    subcontract_allowed: false,
  }, buyerToken);
  if (createReq.status !== 201) {
    console.error('Create request:', createReq.status, createReq.data);
    process.exit(1);
  }
  const requestId = createReq.data?.data?.request_id;
  if (!requestId) {
    console.error('request_id dönmedi');
    process.exit(1);
  }
  console.log('   request_id:', requestId);

  console.log('6) Talebi yayınlama (PUBLISH)...');
  const publishReq = await request('POST', `/buyer/requests/${requestId}/publish`, null, buyerToken);
  if (publishReq.status !== 200) {
    console.error('Publish:', publishReq.status, publishReq.data);
    process.exit(1);
  }

  console.log('7) request_matches kaydı (test için manuel eşleşme)...');
  const matchScore = 70;
  const budgetBand = 'IN';
  try {
    await pool.query(
      `INSERT INTO request_matches (request_id, provider_org_id, match_status, overall_fit_score, budget_fit_band)
       VALUES ($1, $2, 'VISIBLE', $3, $4)`,
      [requestId, providerOrgId, matchScore, budgetBand]
    );
  } catch (e) {
    if (e.code === '42703') {
      await pool.query(
        `INSERT INTO request_matches (request_id, provider_org_id, match_score, budget_band)
         VALUES ($1, $2, $3, $4)`,
        [requestId, providerOrgId, matchScore, budgetBand]
      );
      console.log('   (Eski şema: match_score, budget_band)');
    } else throw e;
  }

  console.log('8) GET /provider/matches...');
  const matches = await request('GET', '/provider/matches', null, providerToken);
  if (matches.status !== 200) {
    console.error('Matches:', matches.status, matches.data);
    process.exit(1);
  }
  const items = matches.data?.data || [];
  const found = items.find((m) => m.request_id === requestId);
  if (!found) {
    console.error('Match listede görünmedi. Muhtemelen request_matches sütunları (match_status, budget_fit_band) migration 003b ile eklenmeli.');
    process.exit(1);
  }
  console.log('   Eşleşme bulundu, request_id:', requestId);

  console.log('9) POST /provider/requests/:id/offers...');
  const offerBody = {
    total_price_try: 410000,
    price_breakdown: {
      personnel: 320000,
      sgk: 50000,
      meal_transport: 20000,
      service_fee: 20000,
    },
    notes: 'Aylık raporlama + QR devriye dahil.',
  };
  const postOffer = await request('POST', `/provider/requests/${requestId}/offers`, offerBody, providerToken);
  if (postOffer.status !== 201) {
    console.error('POST offer:', postOffer.status, postOffer.data);
    process.exit(1);
  }
  console.log('   201 OK');
  console.log('   data:', JSON.stringify(postOffer.data?.data, null, 2));

  console.log('9b) POST /provider/requests/:id/offers with total_price_try <= 0...');
  const badOfferZero = await request('POST', `/provider/requests/${requestId}/offers`, {
    total_price_try: 0,
  }, providerToken);
  if (badOfferZero.status !== 400) {
    console.error('Expected 400 for total_price_try <= 0, got', badOfferZero.status, badOfferZero.data);
    process.exit(1);
  }
  console.log('   400 OK (validation), code:', badOfferZero.data.code, 'message:', badOfferZero.data.message);

  console.log('10) Aynı talebe ikinci teklif (eski WITHDRAWN, yeni SUBMITTED)...');
  const postOffer2 = await request('POST', `/provider/requests/${requestId}/offers`, {
    total_price_try: 420000,
    price_breakdown: { personnel: 330000, sgk: 50000, meal_transport: 20000, service_fee: 20000 },
    notes: 'Güncel fiyat.',
  }, providerToken);
  if (postOffer2.status !== 201) {
    console.error('POST offer 2:', postOffer2.status, postOffer2.data);
    process.exit(1);
  }
  console.log('   201 OK, yeni teklif:', postOffer2.data?.data?.offer_id);

  console.log('11) GET /provider/offers...');
  const listOffers = await request('GET', '/provider/offers', null, providerToken);
  if (listOffers.status !== 200) {
    console.error('GET offers:', listOffers.status, listOffers.data);
    process.exit(1);
  }
  const offerList = listOffers.data?.data ?? [];
  const meta = listOffers.data?.meta ?? {};
  console.log('   200 OK, toplam:', meta.total ?? offerList.length, 'teklif');

  console.log('12) GET /provider/offers?status=SUBMITTED...');
  const listSubmitted = await request('GET', '/provider/offers?status=SUBMITTED', null, providerToken);
  if (listSubmitted.status !== 200) {
    console.error('GET offers?status=SUBMITTED:', listSubmitted.status, listSubmitted.data);
    process.exit(1);
  }
  const subItems = listSubmitted.data?.data ?? [];
  console.log('   200 OK, SUBMITTED sayısı:', subItems.length);

  console.log('13) GET /provider/offers?limit=1&offset=0 (pagination)...');
  const listPage = await request('GET', '/provider/offers?limit=1&offset=0', null, providerToken);
  if (listPage.status !== 200) {
    console.error('GET offers?limit=1&offset=0:', listPage.status, listPage.data);
    process.exit(1);
  }
  const pageMeta = listPage.data?.meta ?? {};
  const pageArr = listPage.data?.data ?? [];
  if (pageMeta.limit !== 1 || pageArr.length > 1) {
    console.error('Pagination beklenmedi: limit=', pageMeta.limit, 'items=', pageArr.length);
    process.exit(1);
  }
  console.log('   200 OK, meta.limit=1, items.length=', pageArr.length);

  console.log('14) GET /buyer/requests/:id/offers (buyer view)...');
  const buyerOffers = await request('GET', `/buyer/requests/${requestId}/offers`, null, buyerToken);
  if (buyerOffers.status !== 200) {
    console.error('GET /buyer/requests/:id/offers:', buyerOffers.status, buyerOffers.data);
    process.exit(1);
  }
  const buyerOffersItems = buyerOffers.data?.data ?? [];
  if (!Array.isArray(buyerOffersItems) || buyerOffersItems.length === 0) {
    console.error('Buyer offers listesi boş veya array değil:', buyerOffers.data);
    process.exit(1);
  }
  const firstOffer = buyerOffersItems[0];
  if (!firstOffer.provider_legal_name) {
    console.error('provider_legal_name alanı yok:', firstOffer);
    process.exit(1);
  }
   if (!firstOffer.risk_band || !['NORMAL', 'WATCH', 'CRITICAL'].includes(firstOffer.risk_band)) {
    console.error('risk_band alanı beklenen formatta değil:', firstOffer);
    process.exit(1);
  }
  if (!firstOffer.budget_band || !['IN', 'EDGE', 'OUT'].includes(firstOffer.budget_band)) {
    console.error('budget_band alanı beklenen formatta değil:', firstOffer);
    process.exit(1);
  }
  console.log('   200 OK, buyer offers count:', buyerOffersItems.length, 'provider_legal_name:', firstOffer.provider_legal_name, 'risk_band:', firstOffer.risk_band, 'budget_band:', firstOffer.budget_band);

  console.log('15) Buyer shortlist endpoint...');
  const shortlistRes = await request('POST', `/buyer/requests/${requestId}/offers/${firstOffer.offer_id}/shortlist`, null, buyerToken);
  if (shortlistRes.status !== 200) {
    console.error('Buyer shortlist:', shortlistRes.status, shortlistRes.data);
    process.exit(1);
  }
  const buyerOffersAfter = await request('GET', `/buyer/requests/${requestId}/offers`, null, buyerToken);
  const itemsAfter = buyerOffersAfter.data?.data ?? [];
  const shortlisted = itemsAfter.find((o) => o.offer_id === firstOffer.offer_id);
  if (!shortlisted || shortlisted.status !== 'SHORTLISTED') {
    console.error('SHORTLISTED bekleniyordu, bulunan:', shortlisted);
    process.exit(1);
  }
  console.log('   200 OK, offer status SHORTLISTED');

  console.log('16) Buyer reject endpoint...');
  const rejectRes = await request('POST', `/buyer/requests/${requestId}/offers/${firstOffer.offer_id}/reject`, null, buyerToken);
  if (rejectRes.status !== 200) {
    console.error('Buyer reject:', rejectRes.status, rejectRes.data);
    process.exit(1);
  }
  const buyerOffersAfterReject = await request('GET', `/buyer/requests/${requestId}/offers`, null, buyerToken);
  const itemsAfterReject = buyerOffersAfterReject.data?.data ?? [];
  const rejected = itemsAfterReject.find((o) => o.offer_id === firstOffer.offer_id);
  if (!rejected || rejected.status !== 'REJECTED') {
    console.error('REJECTED bekleniyordu, bulunan:', rejected);
    process.exit(1);
  }
  console.log('   200 OK, offer status REJECTED');

  console.log('17) Aşırı düşük teklif (risk_flags TOO_LOW_OFFER)...');
  const lowReq = await request('POST', '/buyer/requests', {
    service_type: 'SILAHSIZ',
    city_id: 34,
    address_text: 'Risk Test Mah.',
    site_type: 'Depo',
    personnel_count: 3,
    shift_type: '8',
    start_date: '2025-05-01',
    contract_months: 6,
    budget_min_try: 400000,
    budget_max_try: 600000,
    subcontract_allowed: false,
  }, buyerToken);
  if (lowReq.status !== 201) {
    console.error('Low-budget request:', lowReq.status, lowReq.data);
    process.exit(1);
  }
  const lowRequestId = lowReq.data?.data?.request_id;
  if (!lowRequestId) {
    console.error('lowRequestId yok');
    process.exit(1);
  }
  await request('POST', `/buyer/requests/${lowRequestId}/publish`, null, buyerToken);
  try {
    await pool.query(
      `INSERT INTO request_matches (request_id, provider_org_id, match_status, overall_fit_score, budget_fit_band)
       VALUES ($1, $2, 'VISIBLE', 60, 'IN')`,
      [lowRequestId, providerOrgId]
    );
  } catch (e) {
    if (e.code === '42703') {
      await pool.query(
        `INSERT INTO request_matches (request_id, provider_org_id, match_score, budget_band) VALUES ($1, $2, 60, 'IN')`,
        [lowRequestId, providerOrgId]
      );
    } else throw e;
  }
  const lowOfferRes = await request('POST', `/provider/requests/${lowRequestId}/offers`, {
    total_price_try: 200000,
    notes: 'Aşırı düşük test (200k < 400k*0.7)',
  }, providerToken);
  if (lowOfferRes.status !== 201) {
    console.error('Low offer POST:', lowOfferRes.status, lowOfferRes.data);
    process.exit(1);
  }
  const lowOfferId = lowOfferRes.data?.data?.offer_id ?? lowOfferRes.data?.offer_id;
  console.log('   201 OK, low offer_id:', lowOfferId);

  console.log('18) risk_flags TOO_LOW_OFFER kontrolü...');
  const flagCheck = await pool.query(
    `SELECT id, entity_type, entity_id, flag_type, severity, status
       FROM risk_flags
      WHERE entity_type = 'OFFER' AND entity_id = $1 AND flag_type = 'TOO_LOW_OFFER'`,
    [lowOfferId]
  );
  if (flagCheck.rowCount === 0) {
    console.error('risk_flags tablosu yok veya TOO_LOW_OFFER insert atlandı. Migration 005 çalıştırıldı mı?');
    process.exit(1);
  }
  const flag = flagCheck.rows[0];
  if (flag.severity !== 'CRITICAL') {
    console.error('Beklenen severity CRITICAL (200k < 280k), bulunan:', flag.severity);
    process.exit(1);
  }
  console.log('   TOO_LOW_OFFER CRITICAL kaydı var, id:', flag.id);

  console.log('\nTüm testler geçti.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
