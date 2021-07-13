var fs = require('fs');

// readFileSync

console.log('A');
var result = fs.readFileSync('syntax/sample.txt', 'utf-8');
console.log(result);
console.log('C');

console.log('------------------------------------------------')

// readFile
// 뒤에 sync가 붙어있지 않다; default> readFile 이다.
// 따라서, Nodejs는 비동기 실행을 선호한다.라는 뜻

console.log('A');
// readFileSync 는 return 값이 있다 ( 따라서, result 변수에 할당 가능)
// readFile 은 return 값이 없다  ==> 대신, 콜백 함수를 3번째 인자로 줘야한다.
// 파일을 읽는 작업 끝 ==> 3번째 인자인 함수를 실행하고, 
// (err, result) ; 에러가 있다면, err 인자에 실패정보를 공급 / 
//                 파일을 가져오는 작업이 성공했따면, result에 파일의 내용을 인자로써 공급
fs.readFile('syntax/sample.txt', 'utf-8', (err, result) => {
  console.log(result);

});
console.log('C');