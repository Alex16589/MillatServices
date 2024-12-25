/*
  # Add complaint field to service requests

  1. Changes
    - Add complaint column to service_requests table
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'service_requests' AND column_name = 'complaint'
  ) THEN
    ALTER TABLE service_requests ADD COLUMN complaint text NOT NULL;
  END IF;
END $$;