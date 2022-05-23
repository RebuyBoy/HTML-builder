const { readdir, open, readFile } = require('fs/promises');
const path = require('path');

async function bundleCss(dirPath) {
  const files = await readdir(dirPath, { withFileTypes: true });
  const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
  const streamFile = await open(bundlePath, 'w');
  for (let file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const data = await readFile(path.join(dirPath, file.name), { encoding: 'utf8' });
      streamFile.appendFile(data);
    }
  }
  streamFile.close(bundlePath);
}

const cssDirPath = path.join(__dirname, 'styles');

bundleCss(cssDirPath);