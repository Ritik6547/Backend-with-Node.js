import { useEffect, useState } from "react";

const App = () => {
  const [directoryItems, setDirectoryItems] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isUploadStart, setIsUploadStart] = useState(false);
  const [newFilename, setNewFilename] = useState("");

  const handleRename = (oldFilename) => {
    setNewFilename(oldFilename);
  };
  const handleSave = async (oldFilename) => {
    console.log({ oldFilename, newFilename });

    const response = await fetch("http://10.134.244.171:4000/", {
      method: "PATCH",
      body: JSON.stringify({ oldFilename, newFilename }),
    });
    const data = await response.json();
    console.log(data);
    setNewFilename("");
  };

  const handleDelete = async (filename) => {
    const response = await fetch("http://10.134.244.171:4000/", {
      method: "DELETE",
      body: filename,
    });
    const data = await response.json();
    console.log(data);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setIsUploadStart(true);

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
      <br />
      <input
        type="text"
        value={newFilename}
        onChange={(e) => setNewFilename(e.target.value)}
      />
      {isUploadStart && <p>{`File uploaded : ${progress}%`}</p>}
      {directoryItems.map((item, i) => {
        return (
          <div key={i}>
            <span>{item} </span>
            <a href={`http://10.134.244.171:4000/${item}?action=open`}>Open </a>
            <a href={`http://10.134.244.171:4000/${item}?action=download`}>
              Download{" "}
            </a>
            <button onClick={() => handleRename(item)}>Rename</button>
            <button onClick={() => handleSave(item)}>Save</button>
            <button onClick={() => handleDelete(item)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
};

export default App;
