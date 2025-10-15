import fs from "node:fs";

const fd = fs.openSync("abc.txt", "w");

const buff = Buffer.from("abc");

// Write Data into a file using fd
fs.write(fd, buff, (err, bytesWritten, writtenData) => {
  console.log(bytesWritten);
  console.log(writtenData);
});
