const user = document.getElementById("user");

fetch("http://localhost:3000")
  .then((res) => res.text())
  .then((data) => {
    console.log(data);
    user.textContent = data;
  });
