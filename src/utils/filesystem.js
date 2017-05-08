const fs = require('fs');

const rmdir = (dirPath) => {
  let files;
  try {
    files = fs.readdirSync(dirPath);
  } catch (e) { return; }
  if (files.length > 0) {
    for (let i = 0; i < files.length; i += 1) {
      const filePath = `${dirPath}/${files[i]}`;
      if (fs.statSync(filePath).isFile()) fs.unlinkSync(filePath);
      else rmdir(filePath);
    }
  }
  fs.rmdirSync(dirPath);
};

const countFiles = (dirPath) => {
  const files = fs.readdirSync(dirPath);
  return files.length;
};

module.exports = {
  rmdir,
  countFiles,
};
