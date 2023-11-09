import React, { createContext, useState } from 'react';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const handleLogin = async (id, password) => {
    try {
      const response = await fetch('http://3.35.206.24:3001/login', { // 서버 주소로 변경
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, pw: password }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isLogin === 'True') {
          const newUser = {
            id: data.id,
            nickname: data.nickname,
            username: data.username,
          };
          setUser(newUser);
          sessionStorage.setItem('username', newUser.username);
        } else if (data.isLogin === '아이디 정보가 일치하지 않습니다.') {
          alert('해당 아이디가 없습니다.');
        } else {
          alert('비밀번호가 틀렸습니다.');
        }
      } else {
        throw new Error('HTTP 요청 실패');
      }
    } catch (error) {
      console.error(error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('username');
  };

  const contextValue = {
    user: user,
    login: handleLogin,
    logout: handleLogout,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};
