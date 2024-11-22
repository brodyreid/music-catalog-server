const scanDirectory = require('./scanDirectory');

async function getProjectsData(baseDir) {
  try {
    const paths = await scanDirectory(baseDir);
    const projectsData = paths.flatMap(entry => {
      console.log(entry);
      return {
        id: entry.id,
        title: entry.projectName,
        folder_path: entry.parentDirectory
      };
    });

    return projectsData;
  } catch (error) {
    console.error(error);
  }
}

module.exports = getProjectsData;