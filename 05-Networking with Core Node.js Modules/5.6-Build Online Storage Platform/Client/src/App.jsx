import { useEffect, useState } from "react";

const App = () => {
  const [directoryItems, setDirectoryItems] = useState([]);

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
