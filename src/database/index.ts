import { Pool } from "pg";

export const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_qjXtAoZP4uv3@ep-super-math-ao72gcpk-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

// creating table in neon DB
export const initDB = async () => {
  try {
    await pool.query(
      `
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(30) NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role VARCHAR(20) DEFAULT 'contributor' NOT NULL,
                CHECK (role IN ('contributor', 'maintainer')), 

            created_at TIMESTAMP DEFAULT NOW(),
            updated_at  TIMESTAMP DEFAULT NOW()
        )
        `,
    );

    await pool.query(
      `
        CREATE TABLE IF NOT EXISTS issues (
            id SERIAL PRIMARY KEY,
            title VARCHAR(150) NOT NULL,
            description TEXT NOT NULL,
            type TEXT NOT NULL 
                CHECK (type IN ('bug', 'feature_request')),
            status TEXT NOT NULL DEFAULT 'open'
                CHECK (status IN ('open', 'in_progress', 'resolved')),
            
            reporter_id INTEGER NOT NULL,
            
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
        `,
    );

    console.log("Database connected successfully.");
  } catch (error: any) {
    if (error instanceof Error) console.log(error);
  }
};
