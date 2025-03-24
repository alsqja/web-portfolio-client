import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import axios from "axios";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

export const PortfolioView = () => {
  const { id } = useParams();
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const portfolio = {
    id: "b354c6c4-2148-4342-9d39-1d5eef0b6ba1",
    fileName:
      "7dd089e5-aa92-4582-9f1d-5d53867819c5_김민범-포트폴리오.pdf",
    fileUrl:
      "https://web-portfolio-files.s3.ap-northeast-2.amazonaws.com/19ee42ca-f2a9-4789-a00b-fd6ce79daddc_7dd089e5-aa92-4582-9f1d-5d53867819c5_%E1%84%80%E1%85%B5%E1%86%B7%E1%84%86%E1%85%B5%E1%86%AB%E1%84%87%E1%85%A5%E1%86%B7-%E1%84%91%E1%85%A9%E1%84%90%E1%85%B3%E1%84%91%E1%85%A9%E1%86%AF%E1%84%85%E1%85%B5%E1%84%8B%E1%85%A9+(1).pdf",
    createdAt: "2025-03-21T10:01:11.824676",
    updatedAt: "2025-03-21T10:01:11.824676",
  };

  useEffect(() => {
    axios
      .get(portfolio.fileUrl, { responseType: "blob" })
      .then((res) => setPdfBlob(res.data))
      .catch((err) => console.error("❌ PDF fetch 실패", err));
  }, [portfolio.fileUrl]);

  useEffect(() => {
    console.log(`현재 페이지: ${currentPage}`);
  }, [currentPage]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const pageHeight = e.currentTarget.scrollHeight / numPages;
    const page = Math.floor(scrollTop / pageHeight) + 1;
    if (page !== currentPage) setCurrentPage(page);
  };

  return (
    <FullScreenContainer onScroll={handleScroll}>
      {pdfBlob ? (
        <StyledDocument
          file={pdfBlob}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<p>PDF 로딩 중...</p>}
        >
          {Array.from(new Array(numPages), (_, index) => {
            const pageNumber = index + 1;
            if (Math.abs(pageNumber - currentPage) <= 2) {
              return (
                <Page
                  key={pageNumber}
                  pageNumber={pageNumber}
                  width={window.innerWidth - 40}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  canvasRef={(canvas) => {
                    if (canvas) {
                      const ctx = canvas.getContext("2d", {
                        willReadFrequently: true,
                      });
                    }
                  }}
                />
              );
            } else {
              return <div key={pageNumber} style={{ height: "1200px" }}></div>; // lazy spacing
            }
          })}
        </StyledDocument>
      ) : (
        <p>PDF 파일 불러오는 중...</p>
      )}
    </FullScreenContainer>
  );
};

const FullScreenContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
  padding: 20px;
  box-sizing: border-box;
  background: #f5f5f5;
`;

const StyledDocument = styled(Document)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
