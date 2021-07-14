var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, controle) { // 본문내용
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
      ${controle}
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

  if (pathname === '/') {
    if (queryData.id === undefined) {// /만 존재하는 최상위루트 홈페이지 상태.
      fs.readdir('./data', (err, filelist) => {
        console.log(filelist);
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        // 글 목록 가져옴. 
        var list = templateList(filelist);
        // 본문
        var template = templateHTML(title, list,
          `<h2>${title}</h2>${description}`,
          ` <a href="/create">create</a> `);
        response.writeHead(200);
        response.end(template);
      })

    } else { // id 값이 존재함. ( 최상위 디렉터리가 아님)
      fs.readdir('./data', (err, filelist) => {
        var list = templateList(filelist);
        // 본문
        fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
          var title = queryData.id;
          var template = templateHTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create<a/> <a href="/update?id=${title}">update</a>`);
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else if (pathname === '/create') {
    fs.readdir('./data', (err, filelist) => {
      console.log(filelist);
      var title = 'Web - create';
      // 글 목록 가져옴. 
      var list = templateList(filelist);
      // 본문
      var template = templateHTML(title, list, `
      <form action="/create_process" method="post"> 
      <p><input type="text" name="title" placeholder="title"></p>
      <p>
        <textarea placeholder="description" name="description"></textarea>
      </p>
      <p>
        <input type="submit" />
      </p>
    </form>
      `, '');
      response.writeHead(200);
      response.end(template);
    })

  } else if (pathname === '/create_process') {
    var body = '';
    request.on('data', (data) => {
      body += data;
    });
    request.on('end', () => {
      var post = qs.parse(body);
      console.log(post);
      var title = post.title;
      var description = post.description;
      console.log(post.title);
      fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
        response.writeHead(302,
          { Location: `/?id=${title}` });
        response.end();
      })
    });


    /*  update 화면 
        1. form  2.read기능 ; 수정할 data가 필요  
    */
    // 아래의 코드는 id값이 존재할때의 같은 코드이다(detail은 당근 수정!)
  } else if (pathname === '/update') {
    fs.readdir('./data', (err, filelist) => {
      console.log('update 화면')

      // 본문
      fs.readdir('./data', (err, filelist) => {
        var list = templateList(filelist);
        fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
          var title = queryData.id;
          var template = templateHTML(title, list,
            `
            <form action="/update_process" method="post"> 
            <input type="hidden" name="id" value="${title}">  
            <p><input type="text" name="title" value="${title}" placeholder="title"></p>
              <p>
              <textarea placeholder="description" name="description">${description}</textarea>
              </p>
              <p>
              <input type="submit" />
              </p>
            </form>
            `,
            `<a href="/create">create<a/> <a href="/update?id=${title}">update</a>`);
          response.writeHead(200);
          response.end(template);
        });
      });
    });
  } else {
    response.writeHead(404);
    response.end('Not Found');
  }
});

app.listen(3000);