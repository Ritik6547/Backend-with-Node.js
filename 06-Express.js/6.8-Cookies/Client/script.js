const res = await fetch("http://localhost:4000", {
  credentials: "include",
});

const data = await res.json();

console.log(data);
