var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  console.log(url.parse(_url, true));
  // console.log(url.parse(_url, true) 을 콘솔에 찍어보자. 
  // 찍어보면, 그 안에 pathname 이 존재한다. 의미하는 바는 path는 queryString까지 모두 포함이고,
  // pathname은 queryString을 제외한 값만 있음을 확인할 수 있다!!

  var title = queryData.id;

  if (pathname === '/') {
    fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
      var template = `
        <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>                                     
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          <ul>
            <li><a href="/?id=HTML">HTML</a></li>
            <li><a href="/?id=CSS">CSS</a></li>
            <li><a href="/?id=JavaScript">JavaScript</a></li>
          </ul>
          <h2>${title}</h2>
          <p>${description}</p>
        </body>
        </html>
        `;
      response.writeHead(200);
      response.end(template);
    })
  } else {
    response.writeHead(404);
    response.end('Not Found');

  }




});
app.listen(3000);