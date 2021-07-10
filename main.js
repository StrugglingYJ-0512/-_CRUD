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

  response.end(queryData.id);


});
app.listen(3000);