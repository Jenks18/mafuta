-- Fix RLS policies for shell_stations to allow data import
-- Run this after creating the table

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Only authenticated users can modify shell stations" ON shell_stations;

-- Create separate policies for insert, update, delete
CREATE POLICY "Allow inserts for shell stations"
ON shell_stations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update shell stations"
ON shell_stations FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete shell stations"
ON shell_stations FOR DELETE
USING (auth.role() = 'authenticated');
