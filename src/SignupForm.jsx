import React, { useState, useEffect, useRef } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Checkbox,
  Box,
  Flex,
} from '@chakra-ui/react';

const SignupForm = ({ onSignup }) => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agreeEmail, setAgreeEmail] = useState(false);
  const [passwordError, setPasswordError] = useState(undefined);
  const [isIdChecked, setIsIdChecked] = useState(false);

  const formRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!isIdChecked) {
      alert('아이디 중복 체크를 진행해주세요.');
      return;
    }
    const formData = {
      name,
      id,
      password,
      nickname,
      email,
      phoneNumber,
      agreeEmail,
    };
    console.log(formData);
    onSignup(formData);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError(undefined);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setPasswordError(undefined);
  };

  const isPasswordValid =
    password.length >= 8 &&
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/.test(password);

  const handleIdCheck = () => {
    // 중복 체크 로직 추가
    setIsIdChecked(true);
  };

  return (
    <Box overflowX="hidden">
      <form onSubmit={handleSubmit} ref={formRef} style={{ display: 'flex', flexDirection: 'column' }}>
        <FormControl>
          <FormLabel>이름</FormLabel>
          <Input
            id="name-field"
            type="text"
            placeholder="이름을 입력하세요"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="lg"
            mb={4}
          />
        </FormControl>

        <FormControl>
          <FormLabel>아이디</FormLabel>
          <Flex>
            <Input
              id="id-field"
              type="text"
              placeholder="아이디를 입력하세요"
              autoComplete="off"
              value={id}
              onChange={(e) => setId(e.target.value)}
              size="lg"
              mb={4}
              mr={2}
            />
            <Button
              size="lg"
              colorScheme="white"
              onClick={handleIdCheck}
              disabled={isIdChecked}
              variant="outline"
              _focus={{ boxShadow: 'none' }}
              _active={{ bg: 'gray.300' }}
            >
              중복 체크
            </Button>
          </Flex>
        </FormControl>

        <FormControl>
          <FormLabel>비밀번호</FormLabel>
          <Input
            id="password-field"
            type="password"
            placeholder="비밀번호를 입력하세요"
            autoComplete="off"
            value={password}
            onChange={handlePasswordChange}
            size="lg"
            mb={4}
            isInvalid={!!passwordError || (password.length > 0 && !isPasswordValid)}
          />
          {passwordError && (
            <Box color="red.500" fontSize="sm" mb={2}>
              {passwordError}
            </Box>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>비밀번호 확인</FormLabel>
          <Input
            id="confirm-password-field"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            autoComplete="off"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            size="lg"
            mb={4}
            isInvalid={!!passwordError || (password.length > 0 && !isPasswordValid)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>닉네임</FormLabel>
          <Input
            id="nickname-field"
            type="text"
            placeholder="닉네임을 입력하세요"
            autoComplete="off"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            size="lg"
            mb={4}
          />
        </FormControl>

        <FormControl>
          <FormLabel>이메일</FormLabel>
          <Input
            id="email-field"
            type="email"
            placeholder="이메일을 입력하세요"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="lg"
            mb={4}
          />
          <Checkbox isChecked={agreeEmail} onChange={(e) => setAgreeEmail(e.target.checked)}>
            이메일 수신 동의
          </Checkbox>
        </FormControl>

        <FormControl>
          <FormLabel>전화번호</FormLabel>
          <Input
            id="phone-number-field"
            type="text"
            placeholder="전화번호를 입력하세요"
            autoComplete="off"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            size="lg"
            mb={4}
          />
        </FormControl>
        <Button
          type="submit"
          mt={6}
          width="full"
          colorScheme="white"
          variant="outline"
          size="sm"
          isDisabled={!isPasswordValid || !isIdChecked || !phoneNumber}
          _focus={{ boxShadow: 'none' }}
          _active={{ bg: 'gray.300' }}
        >
          가입 완료
        </Button>
      </form>
    </Box>
  );
};

export default SignupForm;
