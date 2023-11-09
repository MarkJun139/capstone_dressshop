import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Flex,
  Image,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import Main from './Main';
import { UserProvider } from './UserContext';
import UserMenu from './UserMenu';
import './App.css';

function App() {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showMain, setShowMain] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const usernameFromSession = sessionStorage.getItem('username');
    if (usernameFromSession) {
      fetchData(usernameFromSession);
    } else {
      setShowMain(false);
      setShowLoginForm(true);
      setShowSignupForm(false);
    }
  }, []);

  const fetchData = async (username) => {
    try {
      const response = await fetch(`http://3.35.206.24:3001/api/select?username=${username}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        const foundUser = data.find((user) => user.username === username);
        if (foundUser) {
          const newUser = {
            id: foundUser.id,
            nickname: foundUser.nickname,
            username: foundUser.username,
          };
          setUser(newUser);
          setShowMain(true);
          setShowLoginForm(false);
          setShowSignupForm(false);
        } else {
          handleLogout();
        }
      } else {
        throw new Error('HTTP 요청 실패');
      }
    } catch (error) {
      console.error(error);
      handleLogout();
    }
  };

  const handleLoginClick = () => {
    setShowLoginForm(true);
    setShowSignupForm(false);
    setShowMain(false);
  };

  const handleSignupClick = () => {
    setShowLoginForm(false);
    setShowSignupForm(true);
    setShowMain(false);
  };

  const handleLogoClick = () => {
    setShowLoginForm(false);
    setShowSignupForm(false);
    setShowMain(true);
  };

  const handleLogin = async (id, password) => {
    try {
      const response = await fetch('http://localhost:3001/login', {
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
          setShowMain(true);
          setShowLoginForm(false);
          setShowSignupForm(false);
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
    setShowLogoutModal(false);
    setShowMain(false);
    setShowLoginForm(true);
  };

  const handleLogoutModalOpen = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutModalClose = () => {
    setShowLogoutModal(false);
  };

  return (
    <UserProvider>
      <ChakraProvider>
        <div style={{ minHeight: '100vh' }}>
          <Flex align="center" justify="space-between" p={5} className="menuBar">
            <Image
              src="/logo.png"
              alt="로고"
              boxSize="25px"
              onClick={handleLogoClick}
              style={{ cursor: 'pointer' }}
            />

            <Box>
              {user && <UserMenu onLogout={handleLogoutModalOpen} />}
              {!user && (
                <Button
                  colorScheme="white"
                  variant="outline"
                  size="sm"
                  onClick={handleLoginClick}
                  _focus={{ boxShadow: 'none' }}
                  _active={{ bg: 'gray.300' }}
                >
                  로그인
                </Button>
              )}
            </Box>
          </Flex>

          {showLoginForm && (
            <Box className="boxStyle">
              <LoginForm onSignupClick={handleSignupClick} onLogin={handleLogin} />
            </Box>
          )}

          {showSignupForm && (
            <Box className="boxStyle">
              <SignupForm onClose={handleLoginClick} onSignup={() => {}} />
            </Box>
          )}

          {showMain && <Main />}

          <Modal isOpen={showLogoutModal} onClose={handleLogoutModalClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>로그아웃</ModalHeader>
              <ModalCloseButton />
              <ModalBody className="modalBody">로그아웃 하시겠습니까?</ModalBody>
              <ModalFooter>
                <Button colorScheme="red" mr={3} onClick={handleLogout}>
                  확인
                </Button>
                <Button variant="ghost" onClick={handleLogoutModalClose}>
                  취소
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      </ChakraProvider>
    </UserProvider>
  );
}

export default App;
