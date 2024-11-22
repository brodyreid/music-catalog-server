const getProjectsData = require('./getProjectsData.js');
const pool = require('./pool.js');

async function insertProjects() {
  const baseDir = '/Users/brodyreid/Music/Ableton/Projects/BB Productions/2024';
  const client = await pool.connect();

  try {
    const projectsData = await getProjectsData(baseDir);
    const { id, title, folder_path } = projectsData[0];

    await client.query(`
      INSERT INTO projects (id, title, folder_path)
      VALUES ($1, $2, $3)
      ON CONFLICT (id)
      DO UPDATE SET title = EXCLUDED.title, folder_path = EXCLUDED.folder_path
      `,
      [id, title, folder_path]
    );

    // for (const { id, title, folder_path } of projectsData) {
    //   try {
    //     await pool.query(`
    //       INSERT INTO projects (id, title, folder_path)
    //       VALUES ($1, $2, $3)
    //       ON CONFLICT (id)
    //       DO UPDATE SET title = EXCLUDED.title, folder_path = EXCLUDED.folder_path
    //       `,
    //       [id, title, folder_path]
    //     );
    //   } catch (error) {
    //     console.error('Error inserting project: ', error);
    //   }
    // }
  } catch (error) {
    console.error('Error inserting projects: ', error);
  } finally {
    client.release();
  }
}

insertProjects().finally(() => {
  console.log('Script finished!');
});