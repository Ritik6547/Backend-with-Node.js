import http from "node:http";

const server = http.createServer((request, response) => {
  console.log("Got the request");

  console.log(request.url);
  console.log(request.method);
  console.log(request.headers);
  request.on("data", (chunk) => {
    console.log(chunk.toString());
  });

  response.statusCode = 200;
  response.setHeader("Content-Length", "22");
  response.write("Hello from http server");
  response.end();
});

server.listen(4000, "0.0.0.0", () => {
  console.log("Server started");
});
