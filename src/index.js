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
    const result = await pool.query(`
      SELECT
        p.id, 
        p.title,
        p.release_name,
        p.folder_path, 
        p.notes, 
        p.date_created, 
        JSONB_AGG(DISTINCT jsonb_build_object('id', c.id, 'name', c."name")) AS contributors,
        JSONB_AGG(DISTINCT jsonb_build_object('id', v.id, 'name', v."name")) AS versions
      FROM
        projects p
      LEFT JOIN project_contributors pc ON
        pc.project_id = p.id
      LEFT JOIN contributors c ON
        c.id = pc.contributor_id
      LEFT JOIN versions v ON
        v.project_id = p.id
      GROUP BY
        p.id
      ORDER BY
        p.id;
      `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/project/:id/release_name', async (req, res) => {
  const { id } = req.params;
  const { release_name } = req.body;

  if (!release_name || !id) {
    return res.status(400).send('No release name or no id.');
  }

  try {
    const result = await pool.query(`
      UPDATE
        projects
      SET
        release_name = $1
      WHERE 
        id = $2
      RETURNING
        *;
      `, [release_name, id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/project/:id/notes', async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;

  if (!notes || !id) {
    return res.status(400).send('No note body or no id.');
  }

  try {
    const result = await pool.query(`
      UPDATE
        projects
      SET
        notes = $1
      WHERE 
        id = $2
      RETURNING
        *;
      `, [notes, id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
})

// app.get('/list-drive-files', async (_req, res) => {
//   try {
//     const result = await googleDrive.listFiles();
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error listing files from Google Drive' });
//   }
// });
