const { mkdir, readdir, readFile, open, rm, copyFile } = require('fs/promises');
const path = require('path');

const bundlePath = path.join(__dirname, 'project-dist');
const componentsPath = path.join(__dirname, 'components');
const templatePath = path.join(__dirname, 'template.html');
const bundleHtmlPath = path.join(bundlePath, 'index.html');
const cssDirPath = path.join(__dirname, 'styles');
const assetsDirPath = path.join(__dirname, 'assets');
const bundleAssetsDirPath = path.join(bundlePath, 'assets');


async function createBundle(bundlePath) {
  try {
    await mkdir(bundlePath, { recursive: true });
    bundleCss(bundlePath, cssDirPath);
    bundleHtml();
    copyAssets(bundleAssetsDirPath, assetsDirPath);
  } catch (err) {
    console.error(err);
  }
}
async function bundleHtml() {
  const indexHtmlStream = await open(bundleHtmlPath, 'w+');
  const components = await readComponents(componentsPath);
  const template = await readFile(templatePath, { encoding: 'utf-8' });
  const processedTemplate = handleTemplate(template, components);
  indexHtmlStream.writeFile(processedTemplate);
  indexHtmlStream.close();
}

async function readComponents(componentsPath) {
  const files = await readdir(componentsPath, { withFileTypes: true });
  const result = new Map();
  for (let file of files) {
    const ext = path.extname(file.name);
    if (file.isFile() && ext === '.html') {
      const name = path.basename(file.name, ext);
      const data = await readFile(path.join(componentsPath, file.name), { encoding: 'utf-8' });
      result.set(name, data);
    }
  }
  return result;
}

function handleTemplate(template, components) {
  let result = template;
  for (let componentName of components.keys()) {
    result = result.replace(`{{${componentName}}}`, components.get(componentName));
  }
  return result;
}

async function bundleCss(bundleDir, sourceDir) {
  const files = await readdir(sourceDir, { withFileTypes: true });
  const bundlePath = path.join(bundleDir, 'style.css');
  const streamFile = await open(bundlePath, 'w');
  for (let file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const data = await readFile(path.join(sourceDir, file.name), { encoding: 'utf8' });
      streamFile.appendFile(data);
    }
  }
  streamFile.close(bundlePath);
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
