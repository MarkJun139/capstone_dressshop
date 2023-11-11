import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchSession = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/session', {
        method: 'POST',
        credentials: 'include',
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.session && data.session.is_logined) {
          const newUser = {
            nickname: data.session.nickname
          };
          setUser(newUser);
        }
      } else {
        throw new Error('HTTP 요청 실패');
      }
    } catch (error) {
      console.error(error);
    }
  };  

  useEffect(() => {
    fetchSession();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3001/logout', {
        method: 'POST',
        credentials: 'include',
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'Logged out') {
          setUser(null);
        }
      } else {
        throw new Error('HTTP 요청 실패');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const contextValue = {
    user: user,
    logout: handleLogout,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};
