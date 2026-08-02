import { useRef, useState } from "react";
import request from "../api/client";
import formatBytes from "../utils/formatBytes";

export default function DropZone({ onUploaded }) {
  const [pending, setPending] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileErrors, setFileErrors] = useState({});
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  function addFiles(fileList) {
    setPending((prev) => [...prev, ...Array.from(fileList)]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setDragging(false);
  }

  function handleInputChange(e) {
    addFiles(e.target.files);
    e.target.value = "";
  }

  function removeFile(index) {
    setPending((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleUpload() {
    if (pending.length === 0) return;

    setUploading(true);
    setError(null);
    setFileErrors({});

    const formData = new FormData();
    pending.forEach((file) => formData.append("files[]", file));

    try {
      const uploaded = await request("/documents", { method: "POST", body: formData });
      onUploaded(uploaded);
      setPending([]);
    } catch (err) {
      const errors = err.data?.errors;
      if (errors && typeof errors === "object") {
        const { base, ...rest } = errors;
        setFileErrors(rest);
        if (base) setError(base.join(", "));
      } else {
        setError(err.message);
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded border-2 border-dashed p-6 text-center text-sm transition-colors ${
          dragging ? "border-gray-900 bg-gray-50" : "border-gray-300"
        }`}
      >
        <p className="text-gray-500">
          Drag files here, or{" "}
          <label className="cursor-pointer text-gray-900 underline hover:no-underline">
            browse
            <input
              ref={inputRef}
              type="file"
              multiple
              onChange={handleInputChange}
              className="hidden"
            />
          </label>
        </p>
      </div>

      {pending.length > 0 && (
        <ul className="mt-4 divide-y divide-gray-100 text-sm">
          {pending.map((file, i) => (
            <li key={`${file.name}-${i}`} className="flex items-center justify-between py-2">
              <div>
                <span>{file.name}</span>
                <span className="ml-2 text-gray-500">{formatBytes(file.size)}</span>
                {fileErrors[file.name] && (
                  <p className="text-red-700">{fileErrors[file.name].join(", ")}</p>
                )}
              </div>
              <button
                onClick={() => removeFile(i)}
                className="text-red-700 underline hover:no-underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}

      {pending.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-4 rounded bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-800"
        >
          {uploading ? "Uploading..." : `Upload ${pending.length} file${pending.length > 1 ? "s" : ""}`}
        </button>
      )}
    </div>
  );
}
