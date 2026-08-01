import { createContext, useContext, useEffect, useState } from "react";
import request, { setCsrfToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request("/session")
      .then((data) => {
        setUser(data.user);
        setCsrfToken(data.csrf_token);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function signIn(email, password) {
    const data = await request("/session", {
      method: "POST",
      body: { user: { email, password } },
    });

    setCsrfToken(data.csrf_token);
    setUser(data.user);
  }

  async function signOut() {
    await request("/session", { method: "DELETE" });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
