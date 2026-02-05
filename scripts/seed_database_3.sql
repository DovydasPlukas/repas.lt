-- =====================================
-- INSERT SERVICES
-- =====================================

INSERT INTO "Service" (id, name, description, enabled, "position", "createdAt", "updatedAt")
VALUES
(gen_random_uuid(), 'Skalbimas', 'Profesionalus skalbimo servisas', true, 1, NOW(), NOW()),
(gen_random_uuid(), 'Lyginimas', 'Profesionalus drabužių lyginimas', true, 2, NOW(), NOW()),
(gen_random_uuid(), 'Kostiumų valymas', 'Specialus kostiumų valymas', true, 3, NOW(), NOW()),
(gen_random_uuid(), 'Patalinės valymas', 'Patalynės valymo paslauga', true, 4, NOW(), NOW()),
(gen_random_uuid(), 'Skalbimo mašinų tvarkymas', 'Remontas ir priežiūra', true, 5, NOW(), NOW())
ON CONFLICT (name) DO NOTHING;


-- =====================================
-- ADDONS FOR SKALBIMAS
-- =====================================

INSERT INTO "ServiceAddon" (id, "serviceId", name, type, price, enabled, "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Skubus skalbimas (6–12 val.)', 'PAPILDOMA_PASLAUGA', 6.00, true, NOW(), NOW()
FROM "Service" WHERE name = 'Skalbimas'
ON CONFLICT DO NOTHING;

INSERT INTO "ServiceAddon" (id, "serviceId", name, type, price, enabled, "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Dėmių šalinimas prieš skalbimą', 'PAPILDOMA_PASLAUGA', 4.00, true, NOW(), NOW()
FROM "Service" WHERE name = 'Skalbimas'
ON CONFLICT DO NOTHING;

INSERT INTO "ServiceAddon" (id, "serviceId", name, type, price, enabled, "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Ekologiškas skalbimas', 'PAPILDOMA_PASLAUGA', 3.50, true, NOW(), NOW()
FROM "Service" WHERE name = 'Skalbimas'
ON CONFLICT DO NOTHING;

INSERT INTO "ServiceAddon" (id, "serviceId", name, type, price, enabled, "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Minkštiklis', 'PRIEDAI', 1.50, true, NOW(), NOW()
FROM "Service" WHERE name = 'Skalbimas'
ON CONFLICT DO NOTHING;

INSERT INTO "ServiceAddon" (id, "serviceId", name, type, price, enabled, "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Kvapo pasirinkimas', 'PRIEDAI', 1.50, true, NOW(), NOW()
FROM "Service" WHERE name = 'Skalbimas'
ON CONFLICT DO NOTHING;

INSERT INTO "ServiceAddon" (id, "serviceId", name, type, price, enabled, "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Sulankstymas', 'PRIEDAI', 2.00, true, NOW(), NOW()
FROM "Service" WHERE name = 'Skalbimas'
ON CONFLICT DO NOTHING;


-- =====================================
-- ADDONS FOR LYGINIMAS
-- =====================================

INSERT INTO "ServiceAddon"
SELECT gen_random_uuid(), id, 'Garinis profesionalus lyginimas', 'PAPILDOMA_PASLAUGA', 3.00, true, NOW(), NOW()
FROM "Service" WHERE name = 'Lyginimas'
ON CONFLICT DO NOTHING;

INSERT INTO "ServiceAddon"
SELECT gen_random_uuid(), id, 'Skubus lyginimas tą pačią dieną', 'PAPILDOMA_PASLAUGA', 5.00, true, NOW(), NOW()
FROM "Service" WHERE name = 'Lyginimas'
ON CONFLICT DO NOTHING;

INSERT INTO "ServiceAddon"
SELECT gen_random_uuid(), id, 'Krakmolinimas', 'PAPILDOMA_PASLAUGA', 2.50, true, NOW(), NOW()
FROM "Service" WHERE name = 'Lyginimas'
ON CONFLICT DO NOTHING;

INSERT INTO "ServiceAddon"
SELECT gen_random_uuid(), id, 'Sulankstymas', 'PRIEDAI', 1.50, true, NOW(), NOW()
FROM "Service" WHERE name = 'Lyginimas'
ON CONFLICT DO NOTHING;

INSERT INTO "ServiceAddon"
SELECT gen_random_uuid(), id, 'Pakabinimas ant pakabų', 'PRIEDAI', 1.50, true, NOW(), NOW()
FROM "Service" WHERE name = 'Lyginimas'
ON CONFLICT DO NOTHING;


-- =====================================
-- ADDONS FOR KOSTIUMŲ VALYMAS
-- =====================================

INSERT INTO "ServiceAddon"
SELECT gen_random_uuid(), id, 'Cheminis valymas', 'PAPILDOMA_PASLAUGA', 12.00, true, NOW(), NOW()
FROM "Service" WHERE name = 'Kostiumų valymas'
ON CONFLICT DO NOTHING;

INSERT INTO "ServiceAddon"
SELECT gen_random_uuid(), id, 'Ekspres valymas per 24 val.', 'PAPILDOMA_PASLAUGA', 8.00, true, NOW(), NOW()
FROM "Service" WHERE name = 'Kostiumų valymas'
ON CONFLICT DO NOTHING;

INSERT INTO "ServiceAddon"
SELECT gen_random_uuid(), id, 'Giluminis dėmių šalinimas', 'PAPILDOMA_PASLAUGA', 6.00, true, NOW(), NOW()
FROM "Service" WHERE name = 'Kostiumų valymas'
ON CONFLICT DO NOTHING;

INSERT INTO "ServiceAddon"
SELECT gen_random_uuid(), id, 'Apsauginis užvalkalas', 'PRIEDAI', 2.50, true, NOW(), NOW()
FROM "Service" WHERE name = 'Kostiumų valymas'
ON CONFLICT DO NOTHING;


-- =====================================
-- ADDONS FOR PATALINĖS VALYMAS
-- =====================================

INSERT INTO "ServiceAddon"
SELECT gen_random_uuid(), id, 'Antialerginis skalbimas 60–90°C', 'PAPILDOMA_PASLAUGA', 3.50, true, NOW(), NOW()
FROM "Service" WHERE name = 'Patalinės valymas'
ON CONFLICT DO NOTHING;

INSERT INTO "ServiceAddon"
SELECT gen_random_uuid(), id, 'Dezinfekavimas garais', 'PAPILDOMA_PASLAUGA', 4.00, true, NOW(), NOW()
FROM "Service" WHERE name = 'Patalinės valymas'
ON CONFLICT DO NOTHING;

INSERT INTO "ServiceAddon"
SELECT gen_random_uuid(), id, 'Sulankstymas pagal komplektus', 'PRIEDAI', 2.50, true, NOW(), NOW()
FROM "Service" WHERE name = 'Patalinės valymas'
ON CONFLICT DO NOTHING;


-- =====================================
-- ADDONS FOR SKALBIMO MAŠINŲ TVARKYMAS
-- =====================================

INSERT INTO "ServiceAddon"
SELECT gen_random_uuid(), id, 'Diagnostika ir gedimo nustatymas', 'PAPILDOMA_PASLAUGA', 10.00, true, NOW(), NOW()
FROM "Service" WHERE name = 'Skalbimo mašinų tvarkymas'
ON CONFLICT DO NOTHING;

INSERT INTO "ServiceAddon"
SELECT gen_random_uuid(), id, 'Kalkių šalinimas', 'PAPILDOMA_PASLAUGA', 8.00, true, NOW(), NOW()
FROM "Service" WHERE name = 'Skalbimo mašinų tvarkymas'
ON CONFLICT DO NOTHING;

INSERT INTO "ServiceAddon"
SELECT gen_random_uuid(), id, 'Skubus atvykimas tą pačią dieną', 'PRIEDAI', 12.00, true, NOW(), NOW()
FROM "Service" WHERE name = 'Skalbimo mašinų tvarkymas'
ON CONFLICT DO NOTHING;