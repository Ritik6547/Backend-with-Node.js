import dgram from "node:dgram"; // UDP

const socket = dgram.createSocket("udp4");

socket.on("message", (msg, remoteAddress) => {
  console.log("Message : ", msg.toString());
  console.log("RemoteAddress : ", remoteAddress);
  socket.close();
});

socket.send("Hello from client", 4000, "10.58.24.171");
