/*
  # Create action logs table for tracking user interactions

  1. New Tables
    - `action_logs`
      - `id` (uuid, primary key)
      - `session_id` (text) - Browser session identifier
      - `action_type` (text) - Type of user action
      - `field_value` (text, nullable) - Input field value or search term
      - `created_at` (timestamptz) - When the action occurred
  
  2. Security
    - Enable RLS on `action_logs` table
    - Add policy to allow anonymous inserts (for tracking visitors)
    - Add policy to allow reads for authorized users
*/

CREATE TABLE IF NOT EXISTS action_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  action_type text NOT NULL CHECK (action_type IN ('page_visit', 'search_execution', 'result_view', 'pdf_export', 'txt_export', 'input_focus', 'input_clear')),
  field_value text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE action_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert action logs"
  ON action_logs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read all action logs"
  ON action_logs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX idx_action_logs_session_id ON action_logs(session_id);
CREATE INDEX idx_action_logs_created_at ON action_logs(created_at);
CREATE INDEX idx_action_logs_action_type ON action_logs(action_type);