
const { mkdir, copyFile, readdir, rm } = require('fs/promises');
const path = require('path');

async function copyDir(dirSourcePath, dirDestPath) {
  await rm(dirDestPath, { force: true, recursive: true });
  await mkdir(dirDestPath, { recursive: true });
  const files = await readdir(dirSourcePath, { withFileTypes: true });
  files.forEach(file => {
    const filePathSrc = path.join(dirSourcePath, file.name);
    const filePathDest = path.join(dirDestPath, file.name);
    if (file.isDirectory()) {
      copyDir(filePathSrc, filePathDest);
    }
    if (file.isFile()) {
      copyFile(filePathSrc, filePathDest);
    }
  });
}

const dirSourcePath = path.join(__dirname, 'files');
const dirDestPath = dirSourcePath + '-copy';
copyDir(dirSourcePath, dirDestPath);




// let copy_r = async function (src, dest) {
//   let exists = fs.existsSync(src);
//   let stats = exists && await fsp.stat(src);
//   let isDirectory = exists && stats.isDirectory();
//   if (exists && isDirectory) {
//     await fsp.mkdir(dest);
//     for (const i of (await fsp.readdir(src)).values()) {
//       await copy_r(path.join(src, i), path.join(dest, i))
//     }
//   } else
//     await fsp.copyFile(src, dest);
// }