import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  user: process.env.PGUSER || 'reserva_user',
  password: process.env.PGPASSWORD || 'reserva_password',
  database: process.env.PGDATABASE || 'reserva_db',
});

export const query = (text, params) => pool.query(text, params);

export const testDbConnection = async () => {
  const result = await pool.query('SELECT NOW()');
  console.log('Database connected');
  return result.rows[0];
};

export const initDb = async () => {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
  await pool.query(schemaSql);
};
