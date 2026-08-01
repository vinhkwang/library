import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import request from "../api/client";
import formatBytes from "../utils/formatBytes";

export default function UserLibraryPage() {
  const { id } = useParams();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedIds, setCopiedIds] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setDocuments([]);
    setCopiedIds([]);
    request(`/documents?user_id=${id}`)
      .then(setDocuments)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleCopy(documentId) {
    setError(null);

    try {
      await request(`/documents/${documentId}/copy`, { method: "POST" });
      setCopiedIds((ids) => [...ids, documentId]);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold">Their library</h2>

      {error && <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {documents.length === 0 ? (
        <p className="text-sm text-gray-500">This user has no visible files.</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Size</th>
              <th className="py-2 pr-4 font-medium">Uploaded</th>
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
                <td className="py-2">
                  <a
                    href={doc.download_url}
                    className="mr-3 text-gray-900 underline hover:no-underline"
                  >
                    Download
                  </a>
                  {copiedIds.includes(doc.id) ? (
                    <span className="text-gray-500">Copied</span>
                  ) : (
                    <button
                      onClick={() => handleCopy(doc.id)}
                      className="text-gray-900 underline hover:no-underline"
                    >
                      Copy to my library
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
