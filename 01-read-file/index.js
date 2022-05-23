const { createReadStream } = require('fs');
const path = require('path');

const readStream = createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
readStream.on('data', (data) => console.log(data));
readStream.on('err', (err) => console.log(err));

