import styled from "styled-components";
import { Header } from "../Header";
import { Sidebar } from "../Sidebar";
import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
}
export const Layout = ({ children }: IProps) => {
  return (
    <Container>
      <Header />
      <MainContent>
        <Sidebar />
        <Content>{children}</Content>
      </MainContent>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainContent = styled.div`
  margin-top: 60px;
  height: calc(100vh - 60px);
  display: flex;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
`;
