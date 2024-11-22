const getVersionsData = require('../src/getVersionsData.js');
const pool = require('../src/pool.js');

async function insertVersions() {
  const baseDir = '/Users/brodyreid/Music/Ableton/Projects/BB Productions/2024';
  const client = await pool.connect();

  try {
    const versionsData = await getVersionsData(baseDir);

    for (const { id, name, project_id } of versionsData) {
      try {
        await client.query(`
          INSERT INTO versions (id, name, project_id)
          VALUES ($1, $2, $3)
          ON CONFLICT (id) DO NOTHING;
          `,
          [id, name, project_id]
        );
      } catch (error) {
        console.error('Error inserting version: ', error);
      }
    }
  } catch (error) {
    console.error('Error inserting versions: ', error);
  } finally {
    client.release();
  }
}

insertVersions().finally(() => {
  console.info('Script finished!');
});