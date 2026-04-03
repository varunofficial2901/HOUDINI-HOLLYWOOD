/**
 * Auth Context for the main frontend (src/context/AuthContext.jsx)
 * Handles student login/register/logout with JWT.
 */
import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hh_user")); }
    catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  // Validate stored token on mount
  useEffect(() => {
    const token = localStorage.getItem("hh_access_token");
    if (token) {
      authApi.me()
        .then(res => {
          setUser(res.data);
          localStorage.setItem("hh_user", JSON.stringify(res.data));
        })
        .catch(() => {
          // Try refresh token
          const refresh = localStorage.getItem("hh_refresh_token");
          if (refresh) {
            authApi.refresh(refresh)
              .then(r => {
                localStorage.setItem("hh_access_token", r.data.access_token);
                localStorage.setItem("hh_refresh_token", r.data.refresh_token);
                localStorage.setItem("hh_user", JSON.stringify(r.data.user));
                setUser(r.data.user);
              })
              .catch(() => clearAuth());
          } else {
            clearAuth();
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const clearAuth = () => {
    localStorage.removeItem("hh_access_token");
    localStorage.removeItem("hh_refresh_token");
    localStorage.removeItem("hh_user");
    setUser(null);
  };

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    const { access_token, refresh_token, user: u } = res.data;
    localStorage.setItem("hh_access_token", access_token);
    localStorage.setItem("hh_refresh_token", refresh_token);
    localStorage.setItem("hh_user", JSON.stringify(u));
    setUser(u);
    return u;
  };

  const register = async (data) => {
    const res = await authApi.register(data);
    const { access_token, refresh_token, user: u } = res.data;
    localStorage.setItem("hh_access_token", access_token);
    localStorage.setItem("hh_refresh_token", refresh_token);
    localStorage.setItem("hh_user", JSON.stringify(u));
    setUser(u);
    return u;
  };

  const logout = () => clearAuth();

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
