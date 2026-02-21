-- M09a — risk_flags: Aynı (entity_type, entity_id, flag_type) için tek OPEN (idempotent)
-- Bağımlılık: M09 (risk_flags)
-- Opsiyonel: TOO_LOW_OFFER vb. tekrarsız üretmek için.

BEGIN;

CREATE UNIQUE INDEX IF NOT EXISTS idx_risk_flags_entity_type_id_flag_open
ON risk_flags (entity_type, entity_id, flag_type)
WHERE status = 'OPEN';

COMMIT;
