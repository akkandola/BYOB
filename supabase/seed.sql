-- Synthetic demo data only (PRD section 10: use synthetic data until
-- real-user controls are in place). Safe to re-run; clears existing rows first.
truncate table public.properties;

insert into public.properties (name, property_type, address, notes) values
  ('Maple Street House', 'house', '14 Maple Street, Bristol, BS1 4ST', 'Sample property — primary residence, 3 bed semi-detached.'),
  ('Harbourview Flat', 'flat', '22 Harbourview Court, Bristol, BS8 1TH', 'Sample property — rental unit, 2nd floor, 2 bed.'),
  ('Orchard Lane Bungalow', 'bungalow', null, 'Sample property — address withheld, weekend renovation project.');
