const fetchData = async () => {
  const res = await fetch("http://10.134.244.171:3000/api", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  console.log(data);
};

fetchData();
