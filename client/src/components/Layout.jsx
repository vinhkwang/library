import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Layout({ children }) {
  const { user, signOut } = useAuth();
  const { pathname } = useLocation();
  const isAccountActive = pathname === "/account";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-semibold">Library</h1>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              My library
            </Link>
            <Link to="/users" className="text-gray-600 hover:text-gray-900">
              Browse
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/account"
            title="Account settings"
            className={`inline-block max-w-[180px] truncate rounded border px-3 py-1.5 text-sm ${
              isAccountActive
                ? "border-gray-300 bg-gray-100 text-gray-900"
                : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            {user.email}
          </Link>
          <button
            onClick={signOut}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
    </div>
  );
}
