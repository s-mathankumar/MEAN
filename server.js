const http = require("http");
const app = require("./Backend/app");

// const server = http.createServer((req, res) => {
//     res.end("First Server on Node.js");
// });"
const port = process.env.PORT || 3000;
app.set('port',port);
const server = http.createServer(app);

server.listen(port);