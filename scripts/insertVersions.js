const getVersionsData = require('../src/getVersionsData.js');
const pool = require('../src/pool.js');

const baseDir = process.argv[2];
if (!baseDir) {
  console.error('Please provide a base directory path');
  process.exit(1);
}

async function insertVersions() {
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

insertVersions().finally(() => console.info('Script finished.'));