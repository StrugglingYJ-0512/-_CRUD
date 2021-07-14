var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');


var template = {
  html: function (title, list, body, controle) { // 본문내용
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
  },
  list: function (filelist) { // 글목록 가져옴
    var list = '<ul>';
    for (var i = 0; i < filelist.length; i++) {
      list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</li>`
    }
    list = list + '</ul>';
    return list;
  }


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
        var list = template.list(filelist);
        // 본문
        var html = template.html(title, list,
          `<h2>${title}</h2>${description}`,
          ` <a href="/create">create</a> `);
        response.writeHead(200);
        response.end(html);
      })

    } else { // id 값이 존재함. ( 최상위 디렉터리가 아님)
      fs.readdir('./data', (err, filelist) => {
        var list = template.list(filelist);
        // 본문
        fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
          var title = queryData.id;
          var html = template.html(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create<a/> 
            <a href="/update?id=${title}">update</a>
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <input type="submit" name="delete">
            </form>
            `);
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  } else if (pathname === '/create') {
    fs.readdir('./data', function (error, filelist) {
      var title = 'WEB - create';
      var list = template.list(filelist);
      var html = template.html(title, list, `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `, '');
      response.writeHead(200);
      response.end(html);
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
      console.log(title);
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
        var list = template.list(filelist);
        fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
          var title = queryData.id;
          var html = template.html(title, list,
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
          response.end(html);
        });
      });
    });

    /*
     update_process 정보를 받음.
     /create_process  와 같음! (이것도 post방식으로 받은 데이터를 받는 로직이므로)
    */
  } else if (pathname === '/update_process') {
    var body = '';
    request.on('data', (data) => {
      body += data;
    });
    request.on('end', () => {
      var post = qs.parse(body);
      console.log(post);
      var id = post.id; // 기존에는 id값은 받지 않았으나, update시에는 id값을 받음(name="id")!!
      var title = post.title;
      var description = post.description;

      // 파일의 이름(title)을 변경했으니, 실제 파일명도 바꿔줘야한다. 
      // Google : nodejs file rename 
      fs.rename(`data/${id}`, `data/${title}`, (err) => {
        fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
          response.writeHead(302,
            { Location: `/?id=${title}` });
          response.end();
        })
      })

    });

    // delete 버튼 누르면, form -action속성의 값으로 데이터 전달(post)/path를 통해서 삭제하고싶다. 
    // update_process에서 로직 복사해옴.
  } else if (pathname === '/delete_process') {
    var body = '';
    request.on('data', (data) => {
      body += data;
    });
    console.log("delete01")
    request.on('end', () => {
      var post = qs.parse(body);
      var id = post.id;
      console.log("delete02")

      //Google : nodejs delete file
      fs.unlink(`data/${id}`, (err) => {
        // fs.unlink(`data/${id}`) : data/${id}파일이 삭제됨
        //콜백 :
        response.writeHead(302,
          { Location: `/` });
        response.end();

      })
    });


  } else {
    response.writeHead(404);
    response.end('Not Found');
  }
});

app.listen(3000);