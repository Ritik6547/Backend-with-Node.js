import http from "node:http";

const uint8ArrayView = new Uint8Array(11);

uint8ArrayView[0] = 0x52;
uint8ArrayView[1] = 0x69;
uint8ArrayView[2] = 0x74;
uint8ArrayView[3] = 0x69;
uint8ArrayView[4] = 0x6b;
uint8ArrayView[5] = 0x20;
uint8ArrayView[6] = 0x4b;
uint8ArrayView[7] = 0x75;
uint8ArrayView[8] = 0x6d;
uint8ArrayView[9] = 0x61;
uint8ArrayView[10] = 0x72;

startServer(uint8ArrayView);

function startServer(responseData) {
  const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "text/txt; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.url === "/favicon.ico") {
      res.end();
      return;
    }
    res.end(Buffer.from(responseData.buffer));
  });

  server.listen(3000, () => {
    console.log("Listening on http://localhost:3000");
  });
}
