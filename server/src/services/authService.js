const bcrypt = require('bcrypt');
const { pool } = require('../db/pool');
const config = require('../config');
const jwtConfig = require('../config/jwt');

const SALT_ROUNDS = 10;
const BUYER_ROLE_CODE = 'BUYER_USER';
const PROVIDER_ROLE_CODE = 'PROVIDER_USER';

function validateBuyerRegister(body) {
  const { email, password, full_name, legal_name, tax_id, hq_city_id } = body;
  const missing = [];
  if (!email || typeof email !== 'string' || !email.trim()) missing.push('email');
  if (!password || typeof password !== 'string') missing.push('password');
  if (!full_name || typeof full_name !== 'string' || !full_name.trim()) missing.push('full_name');
  if (!legal_name || typeof legal_name !== 'string' || !legal_name.trim()) missing.push('legal_name');
  if (!tax_id || typeof tax_id !== 'string' || !tax_id.trim()) missing.push('tax_id');
  if (hq_city_id == null || (typeof hq_city_id !== 'number' && isNaN(parseInt(hq_city_id, 10)))) missing.push('hq_city_id');
  if (missing.length) {
    const err = new Error('Missing or invalid fields: ' + missing.join(', '));
    err.statusCode = 400;
    err.code = 'VALIDATION_ERROR';
    err.details = { missing };
    throw err;
  }
  if (password.length < 8) {
    const err = new Error('Password must be at least 8 characters');
    err.statusCode = 400;
    err.code = 'VALIDATION_ERROR';
    err.details = { field: 'password' };
    throw err;
  }
  const emailNorm = email.trim().toLowerCase();
  const companyType = body.company_type && ['AS', 'LTD', 'OTHER'].includes(body.company_type) ? body.company_type : null;
  const hqCityId = parseInt(hq_city_id, 10);
  const hqDistrictId = body.hq_district_id != null && body.hq_district_id !== '' ? parseInt(body.hq_district_id, 10) : null;
  return {
    email: emailNorm,
    password,
    full_name: full_name.trim(),
    phone: body.phone && typeof body.phone === 'string' ? body.phone.trim() || null : null,
    legal_name: legal_name.trim(),
    tax_id: tax_id.trim(),
    company_type: companyType,
    hq_city_id: hqCityId,
    hq_district_id: Number.isNaN(hqDistrictId) ? null : hqDistrictId,
    address_text: body.address_text && typeof body.address_text === 'string' ? body.address_text.trim() || null : null,
  };
}

function validateProviderRegister(body) {
  const data = validateBuyerRegister(body);
  data.pays_salary_sgk_tax_on_time = typeof body.pays_salary_sgk_tax_on_time === 'boolean'
    ? body.pays_salary_sgk_tax_on_time
    : (body.pays_salary_sgk_tax_on_time === true || body.pays_salary_sgk_tax_on_time === 'true' || body.pays_salary_sgk_tax_on_time === 1);
  return data;
}

async function registerBuyer(body) {
  if (!pool) {
    const err = new Error('Database not configured');
    err.statusCode = 503;
    err.code = 'SERVICE_UNAVAILABLE';
    throw err;
  }

  const data = validateBuyerRegister(body);

  const client = await pool.connect();
  try {
    const emailRow = await client.query('SELECT 1 FROM users WHERE email = $1', [data.email]);
    if (emailRow.rowCount > 0) {
      const err = new Error('Email already registered');
      err.statusCode = 409;
      err.code = 'EMAIL_EXISTS';
      err.details = { field: 'email' };
      throw err;
    }

    const taxRow = await client.query('SELECT 1 FROM organizations WHERE tax_id = $1', [data.tax_id]);
    if (taxRow.rowCount > 0) {
      const err = new Error('Tax ID already registered');
      err.statusCode = 409;
      err.code = 'TAX_ID_EXISTS';
      err.details = { field: 'tax_id' };
      throw err;
    }

    const roleRow = await client.query("SELECT id FROM roles WHERE code = $1", [BUYER_ROLE_CODE]);
    if (roleRow.rowCount === 0) {
      const err = new Error('BUYER_USER role not found in database');
      err.statusCode = 500;
      err.code = 'ROLE_NOT_FOUND';
      throw err;
    }
    const roleId = roleRow.rows[0].id;

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    await client.query('BEGIN');

    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, full_name, phone, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, TRUE, NOW(), NOW())
       RETURNING id, email, full_name, created_at`,
      [data.email, passwordHash, data.full_name, data.phone]
    );
    const user = userResult.rows[0];
    const userId = user.id;

    const orgResult = await client.query(
      `INSERT INTO organizations (org_type, legal_name, tax_id, company_type, hq_city_id, hq_district_id, address_text, status, created_at, updated_at)
       VALUES ('BUYER', $1, $2, $3, $4, $5, $6, 'ACTIVE', NOW(), NOW())
       RETURNING id, legal_name, tax_id, org_type`,
      [data.legal_name, data.tax_id, data.company_type, data.hq_city_id, data.hq_district_id, data.address_text]
    );
    const org = orgResult.rows[0];
    const organizationId = org.id;

    await client.query(
      `INSERT INTO organization_users (organization_id, user_id, is_primary_contact, created_at)
       VALUES ($1, $2, TRUE, NOW())
       ON CONFLICT (organization_id, user_id) DO NOTHING`,
      [organizationId, userId]
    );

    await client.query(
      `INSERT INTO user_roles (user_id, role_id, created_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id, role_id) DO NOTHING`,
      [userId, roleId]
    );

    await client.query('COMMIT');

    return {
      user: {
        id: userId,
        email: user.email,
        full_name: user.full_name,
        created_at: user.created_at,
      },
      organization: {
        id: organizationId,
        legal_name: org.legal_name,
        tax_id: org.tax_id,
        org_type: org.org_type,
      },
    };
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

async function registerProvider(body) {
  if (!pool) {
    const err = new Error('Database not configured');
    err.statusCode = 503;
    err.code = 'SERVICE_UNAVAILABLE';
    throw err;
  }

  const data = validateProviderRegister(body);

  const client = await pool.connect();
  try {
    const emailRow = await client.query('SELECT 1 FROM users WHERE email = $1', [data.email]);
    if (emailRow.rowCount > 0) {
      const err = new Error('Email already registered');
      err.statusCode = 409;
      err.code = 'EMAIL_EXISTS';
      err.details = { field: 'email' };
      throw err;
    }

    const taxRow = await client.query('SELECT 1 FROM organizations WHERE tax_id = $1', [data.tax_id]);
    if (taxRow.rowCount > 0) {
      const err = new Error('Tax ID already registered');
      err.statusCode = 409;
      err.code = 'TAX_ID_EXISTS';
      err.details = { field: 'tax_id' };
      throw err;
    }

    const roleRow = await client.query('SELECT id FROM roles WHERE code = $1', [PROVIDER_ROLE_CODE]);
    if (roleRow.rowCount === 0) {
      const err = new Error('PROVIDER_USER role not found in database');
      err.statusCode = 500;
      err.code = 'ROLE_NOT_FOUND';
      throw err;
    }
    const roleId = roleRow.rows[0].id;

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    await client.query('BEGIN');

    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, full_name, phone, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, TRUE, NOW(), NOW())
       RETURNING id, email, full_name, created_at`,
      [data.email, passwordHash, data.full_name, data.phone]
    );
    const user = userResult.rows[0];
    const userId = user.id;

    const orgResult = await client.query(
      `INSERT INTO organizations (org_type, legal_name, tax_id, company_type, hq_city_id, hq_district_id, address_text, status, created_at, updated_at)
       VALUES ('PROVIDER', $1, $2, $3, $4, $5, $6, 'ACTIVE', NOW(), NOW())
       RETURNING id, legal_name, tax_id, org_type`,
      [data.legal_name, data.tax_id, data.company_type, data.hq_city_id, data.hq_district_id, data.address_text]
    );
    const org = orgResult.rows[0];
    const organizationId = org.id;

    await client.query(
      `INSERT INTO organization_users (organization_id, user_id, is_primary_contact, created_at)
       VALUES ($1, $2, TRUE, NOW())
       ON CONFLICT (organization_id, user_id) DO NOTHING`,
      [organizationId, userId]
    );

    await client.query(
      `INSERT INTO user_roles (user_id, role_id, created_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id, role_id) DO NOTHING`,
      [userId, roleId]
    );

    await client.query(
      `INSERT INTO provider_profiles (organization_id, pays_salary_sgk_tax_on_time, updated_at)
       VALUES ($1, $2, NOW())`,
      [organizationId, data.pays_salary_sgk_tax_on_time]
    );

    await client.query('COMMIT');

    return {
      user: {
        id: userId,
        email: user.email,
        full_name: user.full_name,
        created_at: user.created_at,
      },
      organization: {
        id: organizationId,
        legal_name: org.legal_name,
        tax_id: org.tax_id,
        org_type: org.org_type,
      },
      provider_profile: {
        organization_id: organizationId,
        pays_salary_sgk_tax_on_time: data.pays_salary_sgk_tax_on_time,
      },
    };
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

async function login(body) {
  if (!pool) {
    const err = new Error('Database not configured');
    err.statusCode = 503;
    err.code = 'SERVICE_UNAVAILABLE';
    throw err;
  }

  const email = body.email && typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = body.password;

  if (!email || !password) {
    const err = new Error('Email and password required');
    err.statusCode = 400;
    err.code = 'VALIDATION_ERROR';
    err.details = { missing: !email ? ['email'] : ['password'] };
    throw err;
  }

  const userRow = await pool.query(
    'SELECT id, email, full_name, password_hash, is_active FROM users WHERE email = $1',
    [email]
  );
  if (userRow.rowCount === 0) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }

  const user = userRow.rows[0];
  if (!user.is_active) {
    const err = new Error('Account is disabled');
    err.statusCode = 403;
    err.code = 'ACCOUNT_DISABLED';
    throw err;
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }

  const rolesRow = await pool.query(
    'SELECT r.code FROM user_roles ur JOIN roles r ON r.id = ur.role_id WHERE ur.user_id = $1',
    [user.id]
  );
  const roles = rolesRow.rows.map((r) => r.code);

  const orgRow = await pool.query(
    `SELECT o.id, o.org_type
     FROM organization_users ou
     JOIN organizations o ON o.id = ou.organization_id
     WHERE ou.user_id = $1
     ORDER BY ou.is_primary_contact DESC, ou.created_at ASC
     LIMIT 1`,
    [user.id]
  );

  const organization = orgRow.rowCount > 0 ? orgRow.rows[0] : null;
  const organizationId = organization ? organization.id : null;
  const organizationType = organization ? organization.org_type : null;

  const payload = {
    id: user.id,
    email: user.email,
    roles,
    organizationId,
    organizationType,
  };
  const token = jwtConfig.sign(payload);

  return {
    token,
    expiresIn: config.jwtExpiresIn,
    user: {
      user_id: user.id,
      org_id: organizationId,
      org_type: organizationType,
      roles,
    },
  };
}

async function getMe(userId) {
  if (!pool) {
    const err = new Error('Database not configured');
    err.statusCode = 503;
    err.code = 'SERVICE_UNAVAILABLE';
    throw err;
  }

  const userRow = await pool.query(
    'SELECT id, email, full_name, is_active FROM users WHERE id = $1',
    [userId]
  );

  if (userRow.rowCount === 0) {
    const err = new Error('User not found');
    err.statusCode = 404;
    err.code = 'USER_NOT_FOUND';
    throw err;
  }

  const user = userRow.rows[0];
  if (!user.is_active) {
    const err = new Error('Account is disabled');
    err.statusCode = 403;
    err.code = 'ACCOUNT_DISABLED';
    throw err;
  }

  const rolesRow = await pool.query(
    'SELECT r.code FROM user_roles ur JOIN roles r ON r.id = ur.role_id WHERE ur.user_id = $1',
    [user.id]
  );
  const roles = rolesRow.rows.map((r) => r.code);

  const orgRow = await pool.query(
    `SELECT o.id, o.org_type, o.legal_name, o.tax_id
     FROM organization_users ou
     JOIN organizations o ON o.id = ou.organization_id
     WHERE ou.user_id = $1
     ORDER BY ou.is_primary_contact DESC, ou.created_at ASC
     LIMIT 1`,
    [user.id]
  );

  let org = null;
  if (orgRow.rowCount > 0) {
    const o = orgRow.rows[0];
    org = {
      id: o.id,
      org_type: o.org_type,
      legal_name: o.legal_name,
      tax_id: o.tax_id,
    };
  }

  return {
    user_id: user.id,
    email: user.email,
    org,
    roles,
  };
}

module.exports = { registerBuyer, registerProvider, login, getMe };
