import dgram from "node:dgram"; // UDP

const socket = dgram.createSocket("udp4");

socket.on("message", (msg, remoteAddress) => {
  console.log("Message : ", msg.toString());
  console.log("RemoteAddress : ", remoteAddress);

  socket.send(
    "Message Recieved Successfully on Server",
    remoteAddress.port,
    remoteAddress.address
  );
});

socket.bind({ port: 4000 }, () => {
  const address = socket.address();
  console.log(address);
  console.log(`Listening on port ${address.port}`);
});
