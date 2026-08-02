import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import request from "../api/client";
import PageContainer from "../components/PageContainer";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request("/users")
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageContainer title="Browse">
      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-gray-500">No other users yet.</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="py-2 pr-4 font-medium">Email</th>
              <th className="py-2 pr-4 font-medium">Documents</th>
              <th className="py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100">
                <td className="py-2 pr-4">{user.email}</td>
                <td className="py-2 pr-4">{user.document_count}</td>
                <td className="py-2">
                  <Link
                    to={`/users/${user.id}`}
                    className="text-gray-900 underline hover:no-underline"
                  >
                    View library
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </PageContainer>
  );
}
