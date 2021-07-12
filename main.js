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


  if (pathname === '/') { // 이렇게만 홑if문이라면, 최상위 루트인 홈페이지는 undefined상태이다.
    if (queryData.id === undefined) {

      fs.readdir('./data', (err, filelist) => {

        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = '<ul>';
        console.log(filelist);
        for (var i = 0; i < filelist.length; i++) {
          list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</li>`
        }
        list = list + '</ul>';
        var template = `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>                                     
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
          ${list}
        <h2>${title}</h2>
        <p>${description}</p>
      </body>
      </html>
      `;
        response.writeHead(200);
        response.end(template);
      })

    } else {
      fs.readdir('./data', (err, filelist) => {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = '<ul>';

        for (var i = 0; i < filelist.length; i++) {
          list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</li>`
        }
        list = list + '</ul>';
        fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
          var title = queryData.id;
          var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>                                     
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>
          `;
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else {
    response.writeHead(404);
    response.end('Not Found');

  }




});
app.listen(3000);