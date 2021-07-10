var http = require('http');
var fs = require('fs');
var url = require('url'); // url 모듈을 사용 할 것이다. 


var app = http.createServer(function (request, response) {
  var _url = request.url; // url 에 언더바를 붙인 이유 ; 위의 url 모듈의 변수명이 url이어서 걍 바꿈.
  var queryData = url.parse(_url, true).query;
  console.log(queryData.id);
  if (_url == '/') {
    _url = '/index.html';
  }
  if (_url == '/favicon.ico') {
    response.writeHead(404);
    response.end();
    return;
  }
  response.writeHead(200);
  // console.log(__dirname + _url);
  //출력 : C:\Users\82107\Documents\GitHub\CRUD/index.html
  //__dirname(폴더경로) ; C:\Users\82107\Documents\GitHub\CRUD 
  // _url : index.html  
  response.end(queryData.id);
  // 사용자에게 전송하는 데이터 ; fs.readFileSync(__dirname + url)
  // response.end('YJ' + url);

});
app.listen(3000);