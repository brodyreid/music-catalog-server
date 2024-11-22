const getProjectsData = require('../src/getProjectsData.js');
const pool = require('../src/pool.js');

async function insertProjects() {
  const baseDir = '/Users/brodyreid/Music/Ableton/Projects/BB Productions/2024';
  const client = await pool.connect();

  try {
    const projectsData = await getProjectsData(baseDir);

    for (const { id, title, folder_path } of projectsData) {
      try {
        await client.query(`
          INSERT INTO projects (id, title, folder_path)
          VALUES ($1, $2, $3)
          ON CONFLICT (id)
          DO UPDATE SET folder_path = EXCLUDED.folder_path;
          `,
          [id, title, folder_path]
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

insertProjects().finally(() => {
  console.info('Script finished!');
});