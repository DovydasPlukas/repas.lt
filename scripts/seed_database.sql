-- Seed script to populate database with sample data
-- Run this script to add initial data to your database

-- Insert Services
INSERT INTO "Service" (id, name, "displayName", description, enabled, "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'skalbimas', 'Skalbimas', 'Profesionalus skalbimo servisas', true, NOW(), NOW()),
  (gen_random_uuid(), 'kostiumu_valymas', 'Kostiumų valymas', 'Specialus kostiumų valymas', true, NOW(), NOW()),
  (gen_random_uuid(), 'lyginimas', 'Lyginimas', 'Profesionalus drabužių lyginimas', true, NOW(), NOW()),
  (gen_random_uuid(), 'patalines_valymas', 'Patalynės valymas', 'Patalynės valymo paslauga', true, NOW(), NOW()),
  (gen_random_uuid(), 'skalbimo_masiniu_tvarkymas', 'Skalbimo mašinų tvarkymas', 'Skalbimo mašinų remontas ir priežiūra', true, NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- Insert Service Addons for Skalbimas
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

-- Insert Service Addons for Kostiumų valymas
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

-- Insert Service Addons for Lyginimas
INSERT INTO "ServiceAddon" (id, "serviceId", name, type, price, enabled, "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Garinis lyginimas', 'PAPILDOMA_PASLAUGA', 4.00, true, NOW(), NOW()
FROM "Service" WHERE name = 'lyginimas'
ON CONFLICT DO NOTHING;

INSERT INTO "ServiceAddon" (id, "serviceId", name, type, price, enabled, "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Suskleidimas', 'PRIEDAI', 1.00, true, NOW(), NOW()
FROM "Service" WHERE name = 'lyginimas'
ON CONFLICT DO NOTHING;

-- Insert Orders
INSERT INTO "Order" (id, "orderNumber", customer, email, phone, address, "serviceType", "totalAmount", status, "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'ORD-2024-001', 'Jonas Jonaitis', 'jonas@example.com', '+37060000001', 'Vilnius, Gedimino pr. 1', 'skalbimas', 25.50, 'COMPLETED', NOW() - INTERVAL '5 days', NOW()),
  (gen_random_uuid(), 'ORD-2024-002', 'Petras Petraitis', 'petras@example.com', '+37060000002', 'Kaunas, Laisvės al. 10', 'kostiumu_valymas', 45.00, 'COMPLETED', NOW() - INTERVAL '3 days', NOW()),
  (gen_random_uuid(), 'ORD-2024-003', 'Ona Onaitė', 'ona@example.com', '+37060000003', 'Klaipėda, Manto g. 5', 'lyginimas', 15.00, 'NEW', NOW() - INTERVAL '1 hour', NOW()),
  (gen_random_uuid(), 'ORD-2024-004', 'Antanas Antanaitis', 'antanas@example.com', '+37060000004', 'Šiauliai, Vilniaus g. 20', 'patalines_valymas', 30.00, 'PENDING', NOW() - INTERVAL '2 hours', NOW()),
  (gen_random_uuid(), 'ORD-2024-005', 'Jurgis Jurgaitis', 'jurgis@example.com', '+37060000005', 'Panevėžys, Respublikos g. 15', 'skalbimo_masiniu_tvarkymas', 120.00, 'NEW', NOW() - INTERVAL '30 minutes', NOW());

-- Add order items for each order
INSERT INTO "OrderItem" (id, "orderId", name, quantity, price, "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Pagrindinis servisas', 1, "totalAmount", NOW(), NOW()
FROM "Order";