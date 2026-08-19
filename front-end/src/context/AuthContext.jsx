import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('edumanage_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Demo accounts
    if (email === 'admin@school.com' && password === 'password') {
      const userData = { email, name: 'Admin', role: 'Admin' };
      localStorage.setItem('edumanage_user', JSON.stringify(userData));
      setUser(userData);
      return true;
    }

    if (email === 'teacher@school.com' && password === 'password') {
      const userData = { email, name: 'Teacher', role: 'Teacher' };
      localStorage.setItem('edumanage_user', JSON.stringify(userData));
      setUser(userData);
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem('edumanage_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);