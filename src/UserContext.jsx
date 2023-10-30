import React, { createContext, useState } from 'react';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const username = sessionStorage.getItem('username');

  const handleLogin = (id, password) => {
    // 로그인 처리 로직
    if (id === '1111' && password === '1234') {
      const newUser = {
        id: 1111,
        nickname: '체리붓세',
        username: '이정무'
      };
      setUser(newUser);
      sessionStorage.setItem('username', newUser.username);
    }
  };

  const handleLogout = () => {
    // 로그아웃 처리 로직
    setUser(null);
    sessionStorage.removeItem('username');
  };

  const contextValue = {
    user: user || (username ? { id: 1111, nickname: '체리붓세', username: username } : null),
    login: handleLogin,
    logout: handleLogout,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};
