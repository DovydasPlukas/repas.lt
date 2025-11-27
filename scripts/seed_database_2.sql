-- ==========================
-- INSERT SERVICES
-- ==========================
INSERT INTO "Service" (id, name, description, enabled, "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'skalbimas', 'Profesionalus skalbimo servisas', true, NOW(), NOW()),
  (gen_random_uuid(), 'kostiumu_valymas', 'Specialus kostiumų valymas', true, NOW(), NOW()),
  (gen_random_uuid(), 'lyginimas', 'Profesionalus drabužių lyginimas', true, NOW(), NOW()),
  (gen_random_uuid(), 'patalines_valymas', 'Patalynės valymo paslauga', true, NOW(), NOW()),
  (gen_random_uuid(), 'skalbimo_masiniu_tvarkymas', 'Skalbimo mašinų remontas ir priežiūra', true, NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- ==========================
-- ADDONS FOR SKALBIMAS
-- ==========================
INSERT INTO "ServiceAddon" (id, "serviceId", name, type, price, enabled, "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Greitasis skalbimas', 'PAPILDOMA_PASLAUGA', 5.00, true, NOW(), NOW()
FROM "Service" WHERE name = 'skalbimas'
ON CONFLICT DO NOTHING;

INSERT INTO "ServiceAddon" (id, "serviceId", name, type, price, enabled, "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Ekologiškas skalbimas', 'PAPILDOMA_PASLAUGA', 3.50, true, NOW(), NOW()
FROM "Service" WHERE name = 'skalbimas'
ON CONFLICT DO NOTHING;

INSERT INTO "ServiceAddon" (id, "serviceId", name, type, price, enabled, "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Minkštiklis', 'PRIEDAI', 2.00, true, NOW(), NOW()
FROM "Service" WHERE name = 'skalbimas'
ON CONFLICT DO NOTHING;

INSERT INTO "ServiceAddon" (id, "serviceId", name, type, price, enabled, "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Kvapų neutralizatorius', 'PRIEDAI', 2.50, true, NOW(), NOW()
FROM "Service" WHERE name = 'skalbimas'
ON CONFLICT DO NOTHING;

-- ==========================
-- ADDONS FOR KOSTIUMŲ VALYMAS
-- ==========================
INSERT INTO "ServiceAddon" (id, "serviceId", name, type, price, enabled, "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Sausas valymas', 'PAPILDOMA_PASLAUGA', 8.00, true, NOW(), NOW()
FROM "Service" WHERE name = 'kostiumu_valymas'
ON CONFLICT DO NOTHING;

INSERT INTO "ServiceAddon" (id, "serviceId", name, type, price, enabled, "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Specialus dėmių šalinimas', 'PAPILDOMA_PASLAUGA', 6.00, true, NOW(), NOW()
FROM "Service" WHERE name = 'kostiumu_valymas'
ON CONFLICT DO NOTHING;

INSERT INTO "ServiceAddon" (id, "serviceId", name, type, price, enabled, "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Pakabinimas ant pakabos', 'PRIEDAI', 1.50, true, NOW(), NOW()
FROM "Service" WHERE name = 'kostiumu_valymas'
ON CONFLICT DO NOTHING;

-- ==========================
-- ADDONS FOR LYGIMAS
-- ==========================
INSERT INTO "ServiceAddon" (id, "serviceId", name, type, price, enabled, "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Garinis lyginimas', 'PAPILDOMA_PASLAUGA', 4.00, true, NOW(), NOW()
FROM "Service" WHERE name = 'lyginimas'
ON CONFLICT DO NOTHING;

INSERT INTO "ServiceAddon" (id, "serviceId", name, type, price, enabled, "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Suskleidimas', 'PRIEDAI', 1.00, true, NOW(), NOW()
FROM "Service" WHERE name = 'lyginimas'
ON CONFLICT DO NOTHING;
