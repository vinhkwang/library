import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PageContainer from "../components/PageContainer";

export default function AccountPage() {
  const { changePassword, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  function cancelDelete() {
    setShowDeleteConfirm(false);
    setDeletePassword("");
    setDeleteError(null);
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordErrors({});
    setPasswordSuccess(false);
    setPasswordSubmitting(true);

    try {
      await changePassword({
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      });
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
      setPasswordSuccess(true);
    } catch (err) {
      setPasswordErrors(err.data?.errors ?? {});
    } finally {
      setPasswordSubmitting(false);
    }
  }

  async function handleDelete(e) {
    e.preventDefault();
    setDeleteError(null);
    setDeleteSubmitting(true);

    try {
      await deleteAccount(deletePassword);
      navigate("/login");
    } catch (err) {
      setDeleteError(err.message);
      setDeleteSubmitting(false);
    }
  }

  return (
    <PageContainer title="Account">
      <div className="mx-auto max-w-md">
        <section>
          <h2 className="mb-4 text-lg font-semibold">Change password</h2>

          <form
            onSubmit={handlePasswordSubmit}
            className="rounded border border-gray-200 bg-white p-6"
          >
            {passwordSuccess && (
              <p className="mb-4 rounded bg-green-50 px-3 py-2 text-sm text-green-700">
                Password updated.
              </p>
            )}

            <label className="mb-3 block text-sm">
              Current password
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-1.5"
                required
              />
              {passwordErrors.current_password && (
                <p className="mt-1 text-sm text-red-700">
                  {passwordErrors.current_password.join(", ")}
                </p>
              )}
            </label>

            <label className="mb-3 block text-sm">
              New password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-1.5"
                required
              />
              {passwordErrors.password && (
                <p className="mt-1 text-sm text-red-700">{passwordErrors.password.join(", ")}</p>
              )}
            </label>

            <label className="mb-4 block text-sm">
              Confirm new password
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-1.5"
                required
              />
              {passwordErrors.password_confirmation && (
                <p className="mt-1 text-sm text-red-700">
                  {passwordErrors.password_confirmation.join(", ")}
                </p>
              )}
            </label>

            <button
              type="submit"
              disabled={passwordSubmitting}
              className="w-full rounded bg-gray-900 px-3 py-2 text-sm text-white disabled:opacity-50"
            >
              {passwordSubmitting ? "Saving..." : "Save password"}
            </button>
          </form>
        </section>

        <hr className="my-12 border-gray-200" />

        <section>
          <h2 className="mb-2 text-lg font-semibold">Delete account</h2>

          <p className="mb-4 text-sm text-gray-600">
            This deletes your account and every file you uploaded. This cannot be undone.
          </p>

          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100"
            >
              Delete account
            </button>
          ) : (
            <form onSubmit={handleDelete}>
              {deleteError && (
                <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
                  {deleteError}
                </p>
              )}

              <label className="mb-4 block text-sm">
                Confirm your password
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-1.5"
                  required
                />
              </label>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={deleteSubmitting}
                  className="rounded bg-red-700 px-3 py-2 text-sm text-white disabled:opacity-50"
                >
                  {deleteSubmitting ? "Deleting..." : "Delete my account"}
                </button>
                <button
                  type="button"
                  onClick={cancelDelete}
                  className="rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </PageContainer>
  );
}
