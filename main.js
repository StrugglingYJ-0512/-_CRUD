var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

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
      <form action="http://localhost:3000/create_process" method="post">
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
  } else if (pathname === '/create_process') {
    // 이 단락은 위에서 post를 했고, post를 한 url 페이지를 띄우는 페이지
    /* else if 생성 후에, 제대로 동작하는지 확인차 넣어봄
    response.writeHead(200);
    response.end('SUCCESS'); 
    */
    // 검색 : nodejs post date (post data를 가져오는 방법을 알고싶다.)
    var body = '';

    // request : 클라이언트가 서버한테 요청할 때 정보를 담는 인자
    // web이 post 방식으로 많은 데이터 전송시, 컴퓨터가 꺼지는 등 부하가 걸릴 수 있다. 
    // 'data'는 많은 양의 데이터를 조각조각 잘라 데이터를 서버가 수신할 떄마다 서버는 콜백함수를 호출한다. 
    // 데이터를 인자로 받아, 수신하는 정보를 받는다. 
    request.on('data', (data) => {
      body += data; //body데이터에다가 콜백이 실행 될 때마다, 데이터를 추가한다. 
    });
    request.on('end', () => {
      var post = qs.parse(body); // parse함수를 이용해서 정보를 객체(post)할 수 있따. 
      console.log(post);
      var title = post.title;
      var description = post.description;
      console.log(post.tile);
    });
    // 'data', 'end' 를 이벤트라고 한다 : 
    response.writeHead(200);
    response.end('SUCCESS');

  } else {
    response.writeHead(404);
    response.end('Not Found');

  }




});
app.listen(3000);