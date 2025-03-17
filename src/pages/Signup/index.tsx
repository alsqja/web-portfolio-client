import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSignup } from "../../hooks/session";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [req, res] = useSignup();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    let newErrors = { name: "", email: "", password: "" };

    if (!name.trim()) {
      newErrors.name = "이름을 입력해주세요.";
      valid = false;
    }
    if (!email.trim() || !validateEmail(email)) {
      newErrors.email = "유효한 이메일을 입력해주세요.";
      valid = false;
    }
    if (!password.trim()) {
      newErrors.password = "비밀번호를 입력해주세요.";
      valid = false;
    }

    setErrors(newErrors);
    if (valid) {
      req(email, password, name);
    }
  };

  useEffect(() => {
    if (res.called && res.data) {
      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    }
  }, [res, navigate]);

  return (
    <Container>
      <SignupForm onSubmit={handleSubmit}>
        <Title>회원가입</Title>
        <Input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <Error>{errors.name}</Error>}

        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <Error>{errors.email}</Error>}

        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <Error>{errors.password}</Error>}

        <Button type="submit">회원가입</Button>
      </SignupForm>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
`;

const SignupForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  width: 320px;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Error = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  background: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #0056b3;
  }
`;
