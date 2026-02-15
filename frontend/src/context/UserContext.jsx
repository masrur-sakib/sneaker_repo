/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';

const UserContext = createContext(null);

const getInitialUser = () => {
  try {
    const savedUser = localStorage.getItem('sneaker_user');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('sneaker_user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('sneaker_user');
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
