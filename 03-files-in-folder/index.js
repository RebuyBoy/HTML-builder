const { readdir, stat } = require('fs/promises');
const path = require('path');

async function readDirectories(dirPath) {
  const entrys = await readdir(dirPath, { withFileTypes: true });
  for (let entry of entrys) {
    if (entry.isFile()) {
      const filePath = path.join(dirPath, entry.name);
      const stats = await stat(filePath);
      const fileExt = path.extname(filePath);
      const nameWithOutExt = path.basename(filePath, fileExt);
      console.log(`${nameWithOutExt} - ${fileExt.slice(1)} - ${(stats.size / 1024).toFixed(3)}kb`);
    }
  }
}
const dirPath = path.join(__dirname, 'secret-folder');
readDirectories(dirPath);
