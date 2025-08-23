-- Add vehicle column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS vehicle text;
