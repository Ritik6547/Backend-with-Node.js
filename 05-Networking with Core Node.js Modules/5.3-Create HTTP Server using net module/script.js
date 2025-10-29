const response = await fetch("http://10.58.24.171:4000");

// console.log(response.body);

response.headers.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

// for await (const chunk of response.body) {
//   console.log(chunk);
// }
