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
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showMain, setShowMain] = useState(true);
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/session', {
          method: 'POST',
          credentials: 'include', // 쿠키 정보를 보내기 위해 필요합니다.
        });

        if (response.ok) {
          const data = await response.json();
          if (data.session && data.session.is_logined) {
            const newUser = {
              nickname: data.session.nickname
            };
            setUser(newUser);
            setShowMain(true);
            setShowLoginForm(false);
            setShowSignupForm(false);
          }
        } else {
          throw new Error('HTTP 요청 실패');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSession(); // useEffect에서 fetchSession 함수를 호출합니다.
  }, []);

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

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: username, pw: password }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.isLogin === 'True') {
          const newUser = {
            nickname: data.session.nickname
          };
          setUser(newUser);
          window.location.reload();
        } else if (data.isLogin === '아이디 정보가 일치하지 않습니다.') {
          alert('해당 아이디가 없습니다.');
        } else if (data.isLogin === '로그인 정보가 일치하지 않습니다.') {
          alert('비밀번호가 틀렸습니다.');
        } else {
          alert(data.isLogin);
        }
      } else {
        throw new Error('HTTP 요청 실패');
      }
    } catch (error) {
      console.error(error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (user) {
      setShowMain(true);
      setShowLoginForm(false);
      setShowSignupForm(false);
    }
  }, [user]);

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
          setShowLogoutModal(false);
          setShowMain(false);
          setShowLoginForm(true);
        } else {
          throw new Error('로그아웃 실패');
        }
      } else {
        throw new Error('HTTP 요청 실패');
      }
    } catch (error) {
      console.error(error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };
  

  const handleLogoutModalOpen = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutModalClose = () => {
    setShowLogoutModal(false);
  };

  return (
    <UserProvider value={{ user, logout: handleLogout }}>
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
