const fs = require('fs');
const path = require('path');

function readDirectories(dirPath) {
  fs.readdir(dirPath, { withFileTypes: true }, (error, files) => {
    if (error) throw error;
    for (let file of files) {
      if (file.isFile()) {
        const filePath = path.join(dirPath, file.name);
        const fileExt = path.extname(filePath);
        const nameWithOutExt = path.basename(filePath, fileExt);
        const fileSize = fs.statSync(filePath).size;
        console.log(`${nameWithOutExt} - ${fileExt.slice(1)} - ${fileSize / 1000}kb`);
      }
    }
  });
}
readDirectories(path.join(__dirname, 'secret-folder'));