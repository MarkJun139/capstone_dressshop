import React, { useState } from 'react';
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
              <LoginForm onSignupClick={handleSignupClick} onLogin={UserProvider} />
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
