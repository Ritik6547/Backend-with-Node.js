import net from "node:net";

const server = net.createServer((socket) => {
  console.log(socket.address());

  console.log("Client connected : ", socket.remoteAddress);
  console.log(socket.remotePort);
  console.log(socket.remoteFamily);

  socket.on("data", (chunk) => {
    console.log(chunk.toString());
    socket.write("Data recieved");
    socket.end();
  });

  socket.on("error", () => {
    console.log("Client lost");
  });

  socket.on("close", () => {
    console.log("Client disconnected : ", socket.remoteAddress);
  });
});

server.listen(4000, "0.0.0.0", () => {
  console.log("Server started on port 4000");
});
