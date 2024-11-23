const getProjectsData = require('../src/getProjectsData.js');
const pool = require('../src/pool.js');

const baseDir = process.argv[2];
if (!baseDir) {
  console.error('Please provide a base directory path');
  process.exit(1);
}

async function insertProjects() {
  const client = await pool.connect();

  try {
    const projectsData = await getProjectsData(baseDir);

    for (const { id, title, folder_path, date_created } of projectsData) {
      try {
        await client.query(`
          INSERT INTO projects (id, title, folder_path, date_created)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (id)
          DO UPDATE SET folder_path = EXCLUDED.folder_path, date_created = EXCLUDED.date_created;
          `,
          [id, title, folder_path, date_created]
        );
      } catch (error) {
        console.error('Error inserting project: ', error);
      }
    }
  } catch (error) {
    console.error('Error inserting projects: ', error);
  } finally {
    client.release();
  }
}

insertProjects().finally(() => console.info('Script finished!'));