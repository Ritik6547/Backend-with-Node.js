const deleteButtons = document.querySelectorAll("#deleteBtn");

deleteButtons.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    const id = btn.dataset.id;

    const res = await fetch(`http://localhost:4000/todos/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    console.log(data);

    window.location.reload();
  });
});
