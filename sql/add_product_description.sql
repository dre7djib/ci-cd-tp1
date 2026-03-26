-- Exécuter dans Supabase (SQL Editor) avant de déployer l’API avec le champ description.
ALTER TABLE product ADD COLUMN IF NOT EXISTS description text;
