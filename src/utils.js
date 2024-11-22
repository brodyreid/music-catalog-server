const crypto = require('crypto');

const createDeterministicId = (projectName) => {
  return crypto.createHash('sha256').update(projectName).digest('hex').slice(0, 16);
};

module.exports = { createDeterministicId };