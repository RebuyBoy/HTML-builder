const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const pathToFile = path.join(__dirname, 'text.txt');

fs.writeFile(
  pathToFile,
  '',
  'utf8',
  (err) => {
    if (err) throw err;
  }
);

stdout.write('Введите данные для записи в файл\n');

stdin.on('data', data => {
  if (data.toString().trim().toLowerCase() === 'exit') {
    process.exit();
  }
  fs.appendFile(
    pathToFile,
    data.toString(),
    (err) => {
      if (err) throw err;
    }
  );
});

process.on('exit', () => {
  stdout.write('чао какао\n');
});