import net from "node:net";

const socket = net.createConnection({ host: "10.58.24.171", port: 4000 });

setTimeout(() => {
  socket.write("Hii from client");
  socket.end();
}, 5000);

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("error", () => {
  console.log("Server lost");
});

socket.on("data", (chunk) => {
  console.log(chunk.toString());
});
