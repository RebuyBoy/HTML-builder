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
//TODO SIGINT
stdin.on('data', data => {
  if (data.toString().trim().toLowerCase() === 'exit') {
    stdout.write('чао какао\n');
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
//TODO несколько подписок

process.on('SIGINT', () => {
  stdout.write('\nчао какао');
  // process.exit();
});