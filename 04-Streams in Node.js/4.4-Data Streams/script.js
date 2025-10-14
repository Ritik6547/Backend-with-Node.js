process.stdout.write("Enter Your Name : ");

process.stdin.on("data", (chunk) => {
  const name = chunk.toString().trim();

  if (!name) {
    process.stderr.write("Name Cannot be Empty\n");
  } else {
    process.stdout.write(`Hello, ${name}.\n`);
  }
  process.exit();
});
