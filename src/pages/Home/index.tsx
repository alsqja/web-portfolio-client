import styled from "styled-components";
import { Layout } from "../../components/Layout";
import { IPortfolio } from "./data";
import {
  useDeletePortfolio,
  useGetUserPortfolio,
  useUploadPortfolio,
} from "../../hooks/portfolioApi";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [getReq, getRes] = useGetUserPortfolio();
  const [portfolioData, setPortfolioData] = useState<IPortfolio[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [postReq, postRes] = useUploadPortfolio();
  const [deleteReq, deleteRes] = useDeletePortfolio();
  const navigate = useNavigate();

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

  const handleDelete = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteReq(id);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      postReq(file);
    }
  };

  useEffect(() => {
    if (postRes.data && postRes.called) {
      alert("업로드 완료");
      window.location.reload();
    } else if (postRes.error && postRes.called) {
      alert(postRes.error);
    }
  }, [postRes.called, postRes.data, postRes.error]);

  useEffect(() => {
    if (deleteRes.called && !deleteRes.error) {
      alert("삭제되었습니다.");
      window.location.reload();
    } else if (deleteRes.error) {
      alert(deleteRes.error);
    }
  }, [deleteRes.called, deleteRes.error]);

  return (
    <Layout>
      <Container>
        <Title>내 포트폴리오</Title>
        <PortfolioGrid>
          <UploadCard onClick={() => fileInputRef.current?.click()}>
            + 포트폴리오 업로드
            <HiddenInput
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </UploadCard>
          {portfolioData.map((portfolio: IPortfolio) => (
            <PortfolioCard
              key={portfolio.id}
              onClick={() => navigate(`/portfolio/${portfolio.id}`)}
            >
              <DeleteButton onClick={(e) => handleDelete(portfolio.id, e)}>
                ×
              </DeleteButton>
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
  position: relative;
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

const UploadCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f0f0;
  color: #007bff;
  font-size: 18px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  height: 120px;
  position: relative;
  transition: background 0.2s;

  &:hover {
    background: #e0e0e0;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const FileName = styled.p`
  font-weight: bold;
  color: #333;
`;

const UploadDate = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  color: #dc3545;
  border: none;
  font-size: 20px;
  cursor: pointer;

  &:hover {
    color: #c82333;
  }
`;
