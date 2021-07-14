var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, list, body) { // 본문내용
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>                                     
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
      ${list}
      <a href="/create">create<a/>
      ${body}
  </body>
  </html>
  `;
}

function templateList(filelist) { // 글목록 가져옴
  var list = '<ul>';
  for (var i = 0; i < filelist.length; i++) {
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</li>`
  }
  list = list + '</ul>';
  return list;
}

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  console.log(url.parse(_url, true));

  if (pathname === '/') { // 이렇게만 홑if문이라면, 최상위 루트인 홈페이지는 undefined상태이다.
    if (queryData.id === undefined) {// /만 존재하는 최상위루트 홈페이지 상태.

      fs.readdir('./data', (err, filelist) => { //filelist 얻어옴. 
        console.log(filelist); // 배열로 들어옴. [ 'CSS', 'HTML', 'Javascript' ]
        // ./data 폴더에서 nodejs 파일을 추가하면, 알아서 화면에서 배열을 돌면서 목록을 뿌린다. 

        var title = 'Welcome';
        var description = 'Hello, Node.js';

        // 글 목록 가져옴. 
        var list = templateList(filelist);

        // 본문
        var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);

        response.writeHead(200);
        response.end(template);
      })

    } else {
      fs.readdir('./data', (err, filelist) => {
        // 글 목록 가져오기.
        var list = templateList(filelist);

        // 본문
        fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
          var title = queryData.id;
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);

          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else if (pathname === '/create') {
    fs.readdir('./data', (err, filelist) => { //filelist 얻어옴. 
      console.log(filelist); // 배열로 들어옴. [ 'CSS', 'HTML', 'Javascript' ]

      var title = 'Web - create';
      // 글 목록 가져옴. 
      var list = templateList(filelist);

      // 본문
      var template = templateHTML(title, list, `
      <form action="http://localhost:3000/prcess_create" method="post">
      <p><input type="text" name="title" placeholder="title"></p>
      <p>
        <textarea placeholder="description" name="description"></textarea>
      </p>
      <p>
        <input type="submit" />
      </p>
    </form>
      `);

      response.writeHead(200);
      response.end(template);
    })
  } else {
    response.writeHead(404);
    response.end('Not Found');

  }




});
app.listen(3000);