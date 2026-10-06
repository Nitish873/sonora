import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getMe, login, logout, register } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [busy, setBusy] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    getMe()
      .then(res => {
        if (res?.user) setUser(res.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setInitializing(false);
      });
  }, []);

  const signIn = async (body, mode = 'login') => {
    setBusy(true);
    try {
      const result = await (mode === 'login' ? login(body) : register(body));
      setUser(result.user);
      return result;
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    try {
      await logout();
    } catch (e) {
      // Ignore logout API error
    } finally {
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({ user, busy, initializing, signIn, signOut }),
    [user, busy, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
