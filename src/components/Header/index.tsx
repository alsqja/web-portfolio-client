import styled from "styled-components";

export const Header = () => {
  return (
    <HeaderContainer>
      <Title>Web Portfolio</Title>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  height: 60px;
  background: #007bff;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-size: 20px;
  font-weight: bold;
  position: fixed;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 1.5rem;
`;
