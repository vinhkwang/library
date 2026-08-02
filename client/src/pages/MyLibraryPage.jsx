import { useEffect, useState } from "react";
import request from "../api/client";
import formatBytes from "../utils/formatBytes";
import DropZone from "../components/DropZone";

export default function MyLibraryPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">My library</h2>

      <DropZone onUploaded={(uploaded) => setDocuments((docs) => [...uploaded, ...docs])} />

      {error && <p className="my-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {documents.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">
          No files yet. Upload one to get started.
        </p>
      ) : (
        <table className="mt-6 w-full border-collapse text-sm">
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
