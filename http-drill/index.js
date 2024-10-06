const http = require("http");
const path = require("path");
const fs = require('fs');
const port = 3000
const { v4: uuidv4 } = require("uuid");

const html_path = path.join(__dirname, 'index.html');
const json_path = path.join(__dirname, 'index.json');
const httpStatusCodes = [100,200,300,400,500];

const server = http.createServer((req, res) => {
    const url = req.url.split("/");

    if(req.method === "GET"){
        switch(url[1])
        {
            case "html" :
                res.writeHead(200 , { 'Content-type' : 'text/html'})
                fs.readFile(html_path , 'utf-8' , (err , file_data) => {
                    if(err){
                        res.writeHead(500, { 'Content-type': 'text/plain' });
                        res.write('Internal Server Error');
                        return res.end();
                    }
                    res.write(file_data);
                    res.end();
                })
            break;

            case "json":
                res.writeHead(200 , { 'Content-type' : 'application/json'})
                fs.readFile(json_path , 'utf-8' , (err , file_data) => {
                    if(err){
                        res.writeHead(500, { 'Content-type': 'text/plain' });
                        res.write('Internal Server Error');
                        return res.end();
                    }
                    res.write(file_data);
                    res.end();
                })
            break;

            case "uuid":
                res.writeHead(200, { 'Content-type': 'text/plain' });
                res.write(uuidv4());
                res.end();
            break;

            case "status":
                const statusCode = parseInt(url[2]);
                if(httpStatusCodes.includes(statusCode)){
                    res.writeHead(statusCode, { 'Content-type': 'text/plain' });
                    res.write(`Response with status code: ${statusCode}`);
                    res.end();
                }
                else{
                    res.writeHead(400, { 'Content-type': 'text/plain' });
                    res.write("Invalid status code");
                    res.end();
                }
            break;

            case "delay":
                const sec = parseInt(url[2]);
                if (isNaN(sec) || sec < 0) {
                    res.writeHead(400, { 'Content-type': 'text/plain' });
                    res.write("Invalid delay time");
                    res.end();
                } else {
                    setTimeout(() => {
                        res.writeHead(200, { 'Content-type': 'text/plain' });
                        res.write(`200 OK response delayed by ${sec} seconds`);
                        res.end();
                    }, sec * 1000);
                }
            break;

            default:
                res.writeHead(404, { 'Content-type': 'text/plain' });
                res.write("Not Found");
                res.end();
            break;
        }
    }
})

server.listen(port, () => {
    console.log("Server started on port", port);
});