const { mkdir, readdir, readFile, open, rm, copyFile } = require('fs/promises');
const path = require('path');
const bundlePath = path.join(__dirname, 'project-dist');
const componentsPath = path.join(__dirname, 'components');
const templatePath = path.join(__dirname, 'template.html');
const bundleHtmlPath = path.join(bundlePath, 'index.html');
const cssDirPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const bundleAssetsPath = path.join(bundlePath, 'assets');

async function createBundle(destination) {
  await rm(destination, { force: true, recursive: true });
  await mkdir(destination, { recursive: true });
  bundleCss(destination, cssDirPath);
  bundleHtml();
  copyAssets(bundleAssetsPath, assetsPath);
}

async function bundleHtml() {
  try {
    const indexHtmlStream = await open(bundleHtmlPath, 'w+');
    const components = await readComponents(componentsPath);
    const template = await readFile(templatePath, { encoding: 'utf-8' });
    const processedTemplate = handleTemplate(template, components);
    indexHtmlStream.writeFile(processedTemplate);
    indexHtmlStream.close();
  } catch (err) {
    console.error(err);
  }
}

async function readComponents(source) {
  try {
    const files = await readdir(source, { withFileTypes: true });
    const result = new Map();
    for (let file of files) {
      const ext = path.extname(file.name);
      if (file.isFile() && ext === '.html') {
        const name = path.basename(file.name, ext);
        const data = await readFile(path.join(source, file.name), { encoding: 'utf-8' });
        result.set(name, data);
      }
    }
    return result;
  } catch (err) {
    console.error(err);
  }
}

function handleTemplate(template, components) {
  let result = template;
  for (let componentName of components.keys()) {
    result = result.replace(new RegExp(`{{${componentName}}}`, 'g'), components.get(componentName));
  }
  return result;
}

async function bundleCss(destination, source) {
  try {
    const files = await readdir(source, { withFileTypes: true });
    const bundlePath = path.join(destination, 'style.css');
    const streamFile = await open(bundlePath, 'w');
    for (let file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const data = await readFile(path.join(source, file.name), { encoding: 'utf8' });
        streamFile.appendFile(data + '\n\n');
      }
    }
    streamFile.close(bundlePath);
  } catch (err) {
    console.error(err);
  }
}

async function copyAssets(destination, source) {
  try {
    await rm(destination, { force: true, recursive: true });
    await mkdir(destination, { recursive: true });
    const files = await readdir(source, { withFileTypes: true });
    files.forEach(file => {
      const sourceFile = path.join(source, file.name);
      const destinationFile = path.join(destination, file.name);
      if (file.isDirectory()) {
        copyAssets(destinationFile, sourceFile);
      }
      if (file.isFile()) {
        copyFile(sourceFile, destinationFile);
      }
    });
  } catch (err) {
    console.error(err);
  }
}

createBundle(bundlePath);
