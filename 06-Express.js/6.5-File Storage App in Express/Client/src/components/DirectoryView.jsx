import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const DirectoryView = () => {
  const BASE_URL = "http://10.134.244.171:4000";
  const [directoriesList, setDirectoriesList] = useState([]);
  const [filesList, setFilesList] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isUploadStart, setIsUploadStart] = useState(false);
  const [newFilename, setNewFilename] = useState("");
  const [newDirname, setNewDirname] = useState("");
  // const [error, setError] = useState(null);
  const { dirId } = useParams();

  const handleSave = async (id) => {
    const response = await fetch(`${BASE_URL}/file/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newFilename }),
    });
    const data = await response.json();
    console.log(data);
    getDirectoryItems();
    setNewFilename("");
  };

  const handleDelete = async (id) => {
    const response = await fetch(`${BASE_URL}/file/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log(data);
    getDirectoryItems();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setIsUploadStart(true);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE_URL}/file/${dirId || ""}`, true);
    xhr.setRequestHeader("filename", file.name);
    xhr.addEventListener("load", () => {
      console.log(xhr.response);
      getDirectoryItems();
    });
    xhr.upload.addEventListener("progress", (e) => {
      const totalProgress = (e.loaded / e.total) * 100;
      setProgress(totalProgress.toFixed(2));
      console.log(`${totalProgress.toFixed(2)}% uploaded`);
    });
    xhr.send(file);
  };

  const handleCreateDirectory = async (e) => {
    e.preventDefault();
    const response = await fetch(`${BASE_URL}/directory/${dirId || ""}`, {
      method: "POST",
      headers: {
        dirname: newDirname,
      },
    });
    const data = await response.json();
    setNewDirname("");
    console.log(data);
    getDirectoryItems();
  };

  async function getDirectoryItems() {
    // setError(null);
    const response = await fetch(`${BASE_URL}/directory/${dirId || ""}`);
    const data = await response.json();

    setDirectoriesList(data.directories);
    setFilesList(data.files);
  }

  useEffect(() => {
    getDirectoryItems();
  }, [dirId]);

  return (
    <div>
      <h1>My Files</h1>
      <input type="file" onChange={handleFileUpload} />
      <input
        type="text"
        value={newFilename}
        onChange={(e) => setNewFilename(e.target.value)}
      />
      {isUploadStart && <p>{`File uploaded : ${progress}%`}</p>}
      <br />
      <br />

      {/* {error && <h2>{error.msg}</h2>} */}

      <form onSubmit={handleCreateDirectory}>
        <input
          type="text"
          value={newDirname}
          onChange={(e) => setNewDirname(e.target.value)}
        />
        <button>Create Folder</button>
      </form>

      {directoriesList.map(({ name, id }) => {
        return (
          <div key={id}>
            <span>{name} </span>

            <Link to={`/directory/${id}`}>Open </Link>
            <button onClick={() => {}}>Rename</button>
            <button onClick={() => {}}>Save</button>
            <button onClick={() => {}}>Delete</button>
          </div>
        );
      })}

      {filesList.map(({ name, id }) => {
        return (
          <div key={id}>
            <span>{name} </span>

            <a href={`${BASE_URL}/file/${id}`}>Open </a>
            <a href={`${BASE_URL}/file/${id}?action=download`}>Download </a>
            <button onClick={() => setNewFilename(name)}>Rename</button>
            <button onClick={() => handleSave(id)}>Save</button>
            <button onClick={() => handleDelete(id)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
};

export default DirectoryView;
