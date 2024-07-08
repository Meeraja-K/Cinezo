import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifyCertificate } from '../helpers/authHelpers';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isPaid, setIsPaid] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [authStatus, setAuthStatus] = useState(false);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const { username, isPaid } = JSON.parse(storedUser);
      setUsername(username);
      setIsPaid(isPaid);
      setIsLoggedIn(true);
    }
    setIsAuthenticating(false);
  }, []);

  useEffect(() => {
    if (isLoggedIn && isPaid) {
      const authenticate = async () => {
        const result = await verifyCertificate(username);
        setAuthStatus(result);
        if (result) {
          alert('Certificate verified successfully');
        } else {
          alert('Certificate verification failed');
        }
      };
      authenticate();
    }
  }, [isLoggedIn, isPaid, username]);

  const login = (username, isPaid) => {
    setIsPaid(isPaid); // Reset payment status
    setUsername(username);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify({ username, isPaid }));
  };

  const logout = () => {
    setIsPaid(false);
    setUsername("");
    setIsLoggedIn(false);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ isPaid, username, isLoggedIn, isAuthenticating, authStatus, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
