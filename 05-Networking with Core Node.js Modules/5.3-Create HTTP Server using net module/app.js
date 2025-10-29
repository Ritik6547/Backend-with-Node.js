import { createReadStream } from "node:fs";
import { open } from "node:fs/promises";
import net from "node:net";

const server = net.createServer(async (socket) => {
  console.log(socket.address());
  console.log("Client connected");

  //   const fileHandle = await open("E:\\VIDEOS\\saiyaara.mkv");
  //   const fileHandle = await open("./nums.txt");
  const fileHandle = await open("C:\\Users\\ALPHA\\Desktop\\node.png");
  const { size } = await fileHandle.stat();
  const readStream = fileHandle.createReadStream();

  // Response Headers
  socket.write("HTTP/1.1 200 OK\n");
  socket.write("Access-Control-Allow-Origin: *\n");
  socket.write("Access-Control-Expose-Headers: *\n");
  //   socket.write("Content-Type : text/txt; charset=utf-8\n");
  //   socket.write("Content-Type : video/mp4\n");
  socket.write("Content-Type: image/png\n");
  socket.write(`Content-Length: ${size}\n`);
  socket.write("Content-Disposition: attachment; filename=node.png");
  socket.write("\n\n");

  // Response Data
  readStream.pipe(socket);
  readStream.on("end", async () => {
    await fileHandle.close();
  });

  //   readStream.on("data", (chunk) => {
  //     socket.write(chunk);
  //     readStream.pause();

  //     setTimeout(() => {
  //       readStream.resume();
  //     }, 0);
  //   });

  socket.on("data", (chunk) => {
    console.log(chunk.toString());
  });

  socket.on("error", () => {
    console.log("Client lost");
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(4000, "0.0.0.0", () => {
  console.log("Server is running on port 4000");
});
