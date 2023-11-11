import React, { useContext } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { UserContext} from './UserContext';

const UserMenu = ({ onLogout }) => {
  const { user } = useContext(UserContext);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <Flex align="center">
      <span>{user && user.nickname}님</span>
      <Button
        colorScheme="white"
        variant="outline"
        size="sm"
        ml={2}
        onClick={handleLogout}
        _focus={{ boxShadow: 'none' }}
        _active={{ bg: 'gray.300' }}
      >
        로그아웃
      </Button>
    </Flex>
  );
};

export default UserMenu;
