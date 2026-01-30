CREATE TABLE IF NOT EXISTS portals (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  pass_salt TEXT,
  pass_hash TEXT,
  pass_iterations INTEGER,
  pass_digest TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
