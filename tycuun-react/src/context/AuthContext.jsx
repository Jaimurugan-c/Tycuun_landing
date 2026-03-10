import { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getProfile()
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = async (email, password) => {
    const res = await api.login({ email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const signupUser = async (name, email, password) => {
    const res = await api.signup({ name, email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const refreshUser = async () => {
    const res = await api.getProfile();
    setUser(res.data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, signupUser, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
