import path from "node:path";

export function preventPathTraversal(res, filePath) {
  const storageRoot = path.resolve("./storage");
  const requestedPath = path.resolve(storageRoot, filePath);

  // Prevent traversal
  if (!requestedPath.startsWith(storageRoot)) {
    res.status(400).json({ msg: "Invalid file path" });
    return null;
  }

  return requestedPath;
}
