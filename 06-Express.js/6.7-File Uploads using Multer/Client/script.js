const form = document.querySelector("form");
const span = document.querySelector("span");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  formData.append("parentDirId", "123");

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:4000/upload", true);
  xhr.responseType = "json";
  xhr.addEventListener("load", () => {
    console.log(xhr.response);
  });
  xhr.upload.addEventListener("progress", (e) => {
    const totalProgress = (e.loaded / e.total) * 100;
    span.textContent = totalProgress.toFixed(2);
  });
  xhr.send(formData);
});
