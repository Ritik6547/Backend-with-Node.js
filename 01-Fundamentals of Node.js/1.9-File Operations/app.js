import { watch } from "node:fs";
import {
  rename,
  copyFile,
  cp,
  unlink,
  rmdir,
  rm,
  writeFile,
  mkdir,
  stat,
} from "node:fs/promises";

// await rename("./test.txt", "./hello.txt");

// await copyFile("./hello.txt", "./hii.txt");

// await cp("./src", "C:\\Users\\ALPHA\\Desktop\\src", { recursive: true });

// await unlink("./hii.txt");

// await rmdir("./abc");

// rm("./a.txt");
// rm("./def", { recursive: true });

// writeFile("style.css", "");

// mkdir("test");

// const stats = await stat("app.js");
// console.log(stats);

watch("hello.txt", (eventType, fileName) => {
  console.log(eventType, fileName);
});
