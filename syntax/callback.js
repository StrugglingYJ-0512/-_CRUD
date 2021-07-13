
// a라는 변수의 값으로써 함수를 전달.
//  곧, JS에서는 함수 == 값 의 뜻.
var a = function () {
  console.log('A');
}
// 익명함수를 변수명에 할당하여 실행하는 방법.
a();


function slowfunc(_callback) {
  // 이 기능(함수 slowfunc()) 실행이 끝나고 그 다음 일을 하세요.
  // 그 다음 일을 인자로 콜백을 받는다.
  // 따라서 콜백 
  //      1) 어떤 작업이 끝나고 실행할 함수
  //      2) 형식; 파라미터로 전달되는 함수
  _callback();
  // 콜백을 실행함
}

// 1. showfunc 실행
// 2. _callback이라는 파라미터는 a가 가리키는 함수를 갖게됨.
slowfunc(a);