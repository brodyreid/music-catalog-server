const express = require('express');
const cors = require('cors');
const pool = require('./pool');
// const googleDrive = require('./googleDrive');

const app = express();
app.use(express.json()).use(cors({ origin: 'http://localhost:5173' }));

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Routes
app.get('/projects', async (_req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM projects;`);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.get('/projects/versions/contributors', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.title, p.folder_path, p.notes, p.date_created, ARRAY_AGG(DISTINCT c."name") as contributors, ARRAY_AGG(DISTINCT v."name") as versions
      FROM projects p
      LEFT JOIN project_contributors pc ON pc.project_id = p.id
      LEFT JOIN contributors c ON c.id = pc.contributor_id
      LEFT JOIN versions v on v.project_id = p.id
      GROUP BY p.id
      ORDER BY p.id;
      `
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// app.get('/list-drive-files', async (_req, res) => {
//   try {
//     const result = await googleDrive.listFiles();
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error listing files from Google Drive' });
//   }
// });
