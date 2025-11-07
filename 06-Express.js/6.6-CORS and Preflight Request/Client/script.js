// fetch("http://10.134.244.171:3000/api")
//   .then((res) => res.json())
//   .then((data) => console.log(data));

const fetchData = async () => {
  const res = await fetch("http://10.134.244.171:3000/api", {
    method: "PUT",
  });
  const data = await res.json();
  console.log(data);
};

fetchData();
