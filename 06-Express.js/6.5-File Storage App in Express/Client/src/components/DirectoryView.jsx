import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const DirectoryView = () => {
  const BASE_URL = "http://10.134.244.171:4000";
  const [directoryItems, setDirectoryItems] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isUploadStart, setIsUploadStart] = useState(false);
  const [newFilename, setNewFilename] = useState("");
  const [newDirname, setNewDirname] = useState("");
  const [error, setError] = useState(null);
  const { "*": dirPath } = useParams();

  const handleRename = (oldFilename) => {
    setNewFilename(oldFilename);
  };
  const handleSave = async (oldFilename) => {
    const response = await fetch(
      `${BASE_URL}/files${dirPath && "/" + dirPath}/${oldFilename}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newFilename }),
      }
    );
    const data = await response.json();
    console.log(data);
    getDirectoryItems();
    setNewFilename("");
  };

  const handleDelete = async (filename) => {
    const response = await fetch(
      `${BASE_URL}/files${dirPath && "/" + dirPath}/${filename}`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    console.log(data);
    getDirectoryItems();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setIsUploadStart(true);

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `${BASE_URL}/files${dirPath && "/" + dirPath}/${file.name}`,
      true
    );
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
    const response = await fetch(
      `${BASE_URL}/directory${dirPath && "/" + dirPath}/${newDirname}`,
      {
        method: "POST",
      }
    );
    const data = await response.json();
    setNewDirname("");
    console.log(data);
    getDirectoryItems();
  };

  async function getDirectoryItems() {
    setError(null);
    const response = await fetch(`${BASE_URL}/directory/${dirPath}`);
    const data = await response.json();
    if (data?.statusCode === "404") {
      setError(data);
    } else {
      setDirectoryItems(data.dirItems);
    }
  }

  useEffect(() => {
    getDirectoryItems();
  }, [dirPath]);

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

      {error && <h2>{error.msg}</h2>}

      {!error && (
        <form onSubmit={handleCreateDirectory}>
          <input
            type="text"
            value={newDirname}
            onChange={(e) => setNewDirname(e.target.value)}
          />
          <button>Create Folder</button>
        </form>
      )}

      {directoryItems.map(({ name, isDirectory }, i) => {
        return (
          <div key={i}>
            <span>{name} </span>
            {isDirectory && (
              <Link to={`./${dirPath && dirPath + "/"}${name}`}>Open </Link>
            )}
            {!isDirectory && (
              <>
                <a
                  href={`${BASE_URL}/files${
                    dirPath && "/" + dirPath
                  }/${name}?action=open`}>
                  Open{" "}
                </a>
                <a
                  href={`${BASE_URL}/files${
                    dirPath && "/" + dirPath
                  }/${name}?action=download`}>
                  Download{" "}
                </a>
              </>
            )}
            <button onClick={() => handleRename(name)}>Rename</button>
            <button onClick={() => handleSave(name)}>Save</button>
            <button onClick={() => handleDelete(name)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
};

export default DirectoryView;
