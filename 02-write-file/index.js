const { createWriteStream } = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const pathToFile = path.join(__dirname, 'text.txt');

const ws = createWriteStream(pathToFile);
stdout.write('Введите данные для записи в файл\n');

stdin.on('data', data => {
  if (data.toString().trim().toLowerCase() === 'exit') {
    exit();
  }
  ws.write(data, (err) => {
    if (err) throw err;
  });
});

process.on('SIGINT', () => {
  exit();
});

function exit() {
  stdout.write('\nчао какао\n');
  process.exit();
}