import express from 'express';
import { query } from './db';

const app = express();
app.use(express.json());

const PORT = process.env.SERVER_PORT || 3000;
export const BASE_URL = `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Routes
app.get('/', (_req, res) => {
  res.send('Hello world!');
});

app.get('/projects', async (_req, res) => {
  try {
    const result = await query(`
      SELECT *
      FROM
      projects;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
