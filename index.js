var http = require ("http");
var fs = require('fs');
var server = http.createServer(function (req,res){//创建服务器，访问成功则设置响应头部信息，向用户发送“user Agent...”，并关闭本次会话
	var reqUrl = req.url;
	console.log(reqUrl);
//	if (reqUrl.indexOf(".css")>-1) {
//  	res.writeHead(200,{'Content-Type':'text/css'});
//	} else {
//  	res.writeHead(200,{'Content-Type':'text/html'});
//	}
    fs.readFile('.'+reqUrl,(err,data)=>{
    	res.end(data);
    })
    
}).listen(3000);//listen用于启动服务器监听3000的端口是否有用户访问
