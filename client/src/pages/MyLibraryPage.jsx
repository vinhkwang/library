import { useEffect, useRef, useState } from "react";
import request from "../api/client";
import formatBytes from "../utils/formatBytes";

export default function MyLibraryPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    request("/documents")
      .then(setDocuments)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this file?")) return;

    await request(`/documents/${id}`, { method: "DELETE" });
    setDocuments((docs) => docs.filter((doc) => doc.id !== id));
  }

  async function handleTogglePrivate(id, nextValue) {
    const previous = documents;
    setDocuments((docs) =>
      docs.map((doc) => (doc.id === id ? { ...doc, private: nextValue } : doc))
    );

    try {
      await request(`/documents/${id}`, { method: "PATCH", body: { private: nextValue } });
    } catch (err) {
      setDocuments(previous);
      setError(err.message);
    }
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("files[]", file);

    try {
      const uploaded = await request("/documents", { method: "POST", body: formData });
      setDocuments((docs) => [...uploaded, ...docs]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">My library</h2>
        <label className="rounded bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-800">
          {uploading ? "Uploading..." : "Upload file"}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {documents.length === 0 ? (
        <p className="text-sm text-gray-500">
          No files yet. Upload one to get started.
        </p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Size</th>
              <th className="py-2 pr-4 font-medium">Uploaded</th>
              <th className="py-2 pr-4 font-medium">Private</th>
              <th className="py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b border-gray-100">
                <td className="py-2 pr-4">{doc.name}</td>
                <td className="py-2 pr-4">{formatBytes(doc.byte_size)}</td>
                <td className="py-2 pr-4">
                  {new Date(doc.created_at).toLocaleDateString()}
                </td>
                <td className="py-2 pr-4">
                  <PrivacyToggle
                    checked={doc.private}
                    onChange={(next) => handleTogglePrivate(doc.id, next)}
                  />
                </td>
                <td className="py-2">
                  <a
                    href={doc.download_url}
                    className="mr-3 text-gray-900 underline hover:no-underline"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-700 underline hover:no-underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function PrivacyToggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        checked ? "bg-gray-900" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-4" : "translate-x-1"
        }`}
      />
    </button>
  );
}
