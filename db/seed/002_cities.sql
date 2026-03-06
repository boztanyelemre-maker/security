-- Test için en az bir şehir (talep oluşturmada city_id gerekli)
INSERT INTO cities (id, name) VALUES (34, 'İstanbul') ON CONFLICT (id) DO NOTHING;
