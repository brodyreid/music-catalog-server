const express = require('express');
const cors = require('cors');
const query = require('./db');

const app = express();
app.use(express.json()).use(cors({ origin: 'http://localhost:5173' }));

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Routes
app.get('/', (_req, res) => {
  res.send('Hello world!');
});

app.get('/projects', async (_req, res) => {
  try {
    const result = await query(`SELECT * FROM projects;`);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.get('/projects/collaborators', async (_req, res) => {
  try {
    const result = await query(`
      SELECT *
      FROM projects p
      JOIN project_collaborators pc ON pc.project_id = p.project_id
      JOIN people p2 ON p2.person_id = pc.person_id
      `
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});
