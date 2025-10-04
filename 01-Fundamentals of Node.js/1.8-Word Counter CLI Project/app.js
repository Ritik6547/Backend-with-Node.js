import fs from "node:fs/promises";

const filePath = process.argv[2];
const word = process.argv[3];

const content = await fs.readFile(filePath, "utf-8");

const wordsArr = content.split(/[\W]/).filter((w) => w);
const wordsCount = {};

wordsArr.forEach((word) => {
  if (wordsCount[word]) {
    wordsCount[word]++;
  } else {
    wordsCount[word] = 1;
  }
});

if (!word) {
  console.log(wordsCount);
} else {
  const count = wordsCount[word] || 0;
  console.log({ [word]: count });
}
