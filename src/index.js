const express = require('express');
const cors = require('cors');
const pool = require('./pool');
const { serverError } = require('./utils');
// const googleDrive = require('./googleDrive');

const app = express();
app.use(express.json()).use(cors({ origin: process.env.ORIGIN_URL }));

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
        JSONB_AGG(DISTINCT jsonb_build_object('id', c.id, 'first_name', c.first_name, 'artist_name', c.artist_name)) FILTER (WHERE c.id IS NOT NULL) AS contributors,
        JSONB_AGG(DISTINCT jsonb_build_object('id', v.id, 'name', v."name")) FILTER (WHERE v.id IS NOT NULL) AS versions
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
        p.date_created DESC;
      `);

    res.json(result.rows);
  } catch (error) {
    serverError(res, error);
  }
});

app.post('/project/:id', async (req, res) => {
  const { id } = req.params;
  const { release_name, notes } = req.body;

  if (!id) {
    return res.status(400).send('Bad id');
  }

  try {
    const result = await pool.query(`
      UPDATE
        projects
      SET
        release_name = $1,
        notes = $2
      WHERE 
        id = $3
      RETURNING
        *;
      `, [release_name, notes, id]);

    res.json(result.rows);
  } catch (error) {
    serverError(res, error);
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
    serverError(res, error);
  }
});

app.get('/contributors', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM contributors;
      `);

    res.json(result.rows);
  } catch (error) {
    serverError(res, error);
  }
});


app.post('/contributor/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, artist_name } = req.body;

  if (!id || (!first_name && !artist_name)) {
    return res.status(400).send('first_name AND artist_name cannot both be empty or no id.');
  }

  try {
    const result = await pool.query(`
      INSERT INTO contributors (id, first_name, artist_name)
      VALUES ($1, $2, $3)
      ON CONFLICT (id)
      DO UPDATE
      SET
        first_name = COALESCE(EXCLUDED.first_name, contributors.first_name),
        artist_name = COALESCE(EXCLUDED.artist_name, contributors.artist_name);
      `, [id, first_name, artist_name]);

    res.json(result.rows);
  } catch (error) {
    serverError(res, error);
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
