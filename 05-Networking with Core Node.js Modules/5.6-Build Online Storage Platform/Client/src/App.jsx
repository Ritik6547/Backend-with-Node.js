import { useEffect, useState } from "react";

const App = () => {
  const [directoryItems, setDirectoryItems] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://10.134.244.171:4000/", true);
    xhr.setRequestHeader("filename", file.name);
    xhr.addEventListener("load", () => {
      console.log(xhr.response);
    });
    xhr.upload.addEventListener("progress", (e) => {
      const totalProgress = (e.loaded / e.total) * 100;
      setProgress(totalProgress.toFixed(2));
      console.log(`${totalProgress.toFixed(2)}% uploaded`);
    });
    xhr.send(file);
  };

  useEffect(() => {
    (async function getDirectoryItems() {
      const response = await fetch("http://10.134.244.171:4000/");
      const data = await response.json();
      setDirectoryItems(data);
    })();
  }, []);

  return (
    <div>
      <h1>My Files</h1>
      <input type="file" onChange={handleFileUpload} />
      <p>{`File uploaded : ${progress}%`}</p>
      {directoryItems.map((item, i) => {
        return (
          <div key={i}>
            <span>{item} </span>
            <a href={`http://10.134.244.171:4000/${item}?action=open`}>Open </a>
            <a href={`http://10.134.244.171:4000/${item}?action=download`}>
              Download{" "}
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default App;
