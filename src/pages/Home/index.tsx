import styled from "styled-components";
import { Layout } from "../../components/Layout";
import { IPortfolio } from "./data";
import { useGetUserPortfolio } from "../../hooks/portfolioApi";
import { useEffect, useState } from "react";

export const Home = () => {
  const [getReq, getRes] = useGetUserPortfolio();
  const [portfolioData, setPortfolioData] = useState([]);

  useEffect(() => {
    getReq();
  }, []);

  useEffect(() => {
    if (getRes.data && getRes.called) {
      setPortfolioData(getRes.data);
    }
    if (getRes.error) {
      alert(getRes.error);
    }
  }, [getRes]);

  return (
    <Layout>
      <Container>
        <Title>내 포트폴리오</Title>
        <PortfolioGrid>
          {portfolioData.map((portfolio: IPortfolio) => (
            <PortfolioCard key={portfolio.id}>
              <FileName>
                {portfolio.fileName.split("_").slice(1).join("_")}
              </FileName>
              <UploadDate>
                업로드 날짜:{" "}
                {new Date(portfolio.createdAt).toLocaleDateString()}
              </UploadDate>
            </PortfolioCard>
          ))}
        </PortfolioGrid>
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const PortfolioCard = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const FileName = styled.p`
  font-weight: bold;
  color: #333;
`;

const UploadDate = styled.p`
  font-size: 14px;
  color: #666;
`;
