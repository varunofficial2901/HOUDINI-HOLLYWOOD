/**
 * src/context/AuthContext.jsx
 * ───────────────────────────
 * Provides login/logout state across the entire app.
 * Used by Navbar.jsx Sign In modal.
 *
 * SETUP: Wrap your App in <AuthProvider> — see updated App.jsx
 */
import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Restore user from localStorage on page reload
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cis_user"));
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Validate stored token on every app load
  useEffect(() => {
    const token = localStorage.getItem("cis_token");
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .me()
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("cis_user", JSON.stringify(res.data));
      })
      .catch(() => {
        // Token invalid — try refresh
        const refreshToken = localStorage.getItem("cis_refresh_token");
        if (refreshToken) {
          authApi
            .refresh(refreshToken)
            .then((r) => {
              localStorage.setItem("cis_token", r.data.access_token);
              localStorage.setItem("cis_refresh_token", r.data.refresh_token);
              localStorage.setItem("cis_user", JSON.stringify(r.data.user));
              setUser(r.data.user);
            })
            .catch(clearAuth);
        } else {
          clearAuth();
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function clearAuth() {
    localStorage.removeItem("cis_token");
    localStorage.removeItem("cis_refresh_token");
    localStorage.removeItem("cis_user");
    setUser(null);
  }

  /** Sign in with email + password */
  async function login(email, password) {
    const res = await authApi.login(email, password);
    const { access_token, refresh_token, user: u } = res.data;
    localStorage.setItem("cis_token", access_token);
    localStorage.setItem("cis_refresh_token", refresh_token);
    localStorage.setItem("cis_user", JSON.stringify(u));
    setUser(u);
    return u;
  }

  /** Sign out */
  function logout() {
    clearAuth();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
