const fs = require('fs'); //filesystem모듈 장착.

fs.readFile('sample.txt', 'utf8', (err, data) => {
  console.log(data);
})