-- Ensure RLS is enabled
ALTER TABLE manual_models ENABLE ROW LEVEL SECURITY;

-- Allow public SELECT (read-only)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'manual_models'
      AND policyname = 'manual_models_select_all'
  ) THEN
    CREATE POLICY manual_models_select_all
      ON manual_models
      FOR SELECT
      USING (true);
  END IF;
END
$$;

-- Allow INSERT for authenticated users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'manual_models'
      AND policyname = 'manual_models_insert_authenticated'
  ) THEN
    CREATE POLICY manual_models_insert_authenticated
      ON manual_models
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END
$$;

-- Optional: allow DELETE for authenticated users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'manual_models'
      AND policyname = 'manual_models_delete_authenticated'
  ) THEN
    CREATE POLICY manual_models_delete_authenticated
      ON manual_models
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END
$$;
