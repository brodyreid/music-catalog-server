const scanDirectory = require('./scanDirectory');
const { createDeterministicId } = require('./utils');

async function getVersionsData(baseDir) {
  try {
    const paths = await scanDirectory(baseDir);
    const versionsData = paths.map(result => {
      return result.flatMap(entry => entry.versions.map(version => ({
        id: createDeterministicId(version),
        name: version,
        project_id: entry.id
      })));
    });

    return versionsData;
  } catch (error) {
    console.error(error);
  }
}

module.exports = getVersionsData;