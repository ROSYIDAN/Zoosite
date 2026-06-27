-- Enable UUID extension (run this manually in your PostgreSQL database first)
-- Connect to your database and run:

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- OR if using gen_random_uuid (PostgreSQL 13+):
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Verify it works:
SELECT gen_random_uuid();