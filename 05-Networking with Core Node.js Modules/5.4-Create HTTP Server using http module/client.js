import http from "node:http";

const clientRequest = http.request({
  host: "10.58.24.171",
  port: 4000,
  method: "POST",
});

clientRequest.end("Hii I am Client");

clientRequest.on("response", (response) => {
  response.on("data", (chunk) => {
    console.log(chunk.toString());
  });
});
