-- Seed Orders and OrderItems with new sample data

-- Insert Orders
INSERT INTO "Order" (id, "orderNumber", customer, email, phone, address, "serviceType", "totalAmount", status, "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), '7', 'Laura Lauraitė', 'laura@example.com', '+37060000101', 'Vilnius, Naugarduko g. 12', 'skalbimas', 18.00, 'NEW', NOW() - INTERVAL '2 hours', NOW()),
  (gen_random_uuid(), '77', 'Darius Dariūnas', 'darius@example.com', '+37060000102', 'Kaunas, Pramonės g. 25', 'kostiumu_valymas', 55.00, 'PENDING', NOW() - INTERVAL '1 day', NOW()),
  (gen_random_uuid(), '777', 'Eglė Eglytė', 'egle@example.com', '+37060000103', 'Klaipėda, H. Manto g. 8', 'lyginimas', 20.00, 'COMPLETED', NOW() - INTERVAL '3 days', NOW()),
  (gen_random_uuid(), '7777', 'Tomas Tomaitis', 'tomas@example.com', '+37060000104', 'Šiauliai, Tilžės g. 30', 'patalines_valymas', 40.00, 'NEW', NOW() - INTERVAL '4 hours', NOW()),
  (gen_random_uuid(), '77777', 'Aistė Aistaitė', 'aiste@example.com', '+37060000105', 'Panevėžys, Respublikos g. 5', 'skalbimo_masiniu_tvarkymas', 90.00, 'PENDING', NOW() - INTERVAL '1 hour', NOW());

-- Insert OrderItems
INSERT INTO "OrderItem" (id, "orderId", name, quantity, price, "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 
  CASE "serviceType"
    WHEN 'skalbimas' THEN 'Skalbimo paslauga'
    WHEN 'kostiumu_valymas' THEN 'Kostiumo valymas'
    WHEN 'lyginimas' THEN 'Drabužių lyginimas'
    WHEN 'patalines_valymas' THEN 'Patalynės valymas'
    WHEN 'skalbimo_masiniu_tvarkymas' THEN 'Skalbimo mašinos aptarnavimas'
    ELSE 'Pagrindinis servisas'
  END,
  1,
  "totalAmount",
  NOW(),
  NOW()
FROM "Order";
