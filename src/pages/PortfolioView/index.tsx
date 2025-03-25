import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import axios from "axios";
import { pdfjs } from "react-pdf";
import { IPortfolio } from "../Home/data";
import { useGetPortfolio } from "../../hooks/portfolioApi";
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

export const PortfolioView = () => {
  const { id } = useParams();
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [portfolio, setPortfolio] = useState<IPortfolio | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [getReq, getRes] = useGetPortfolio();
  const [pageSizes, setPageSizes] = useState<{
    [key: number]: { width: number; height: number };
  }>({});

  useEffect(() => {
    if (!!id) {
      getReq(id);
    }
  }, [getReq, id]);

  useEffect(() => {
    if (getRes.data && getRes.called) {
      setPortfolio(getRes.data);
    }
  }, [getRes.called, getRes.data]);

  useEffect(() => {
    if (portfolio) {
      axios
        .get(portfolio.fileUrl, { responseType: "blob" })
        .then((res) => setPdfBlob(res.data))
        .catch((err) => console.error("❌ PDF fetch 실패", err));
    }
  }, [portfolio]);

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

  const onPageRenderSuccess = (page: any) => {
    setPageSizes((prev) => ({
      ...prev,
      [page.pageNumber]: {
        width: page.originalWidth,
        height: page.originalHeight,
      },
    }));
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
            const size = pageSizes[pageNumber];
            const isWide = size && size.width > window.innerWidth;
            if (Math.abs(pageNumber - currentPage) <= 2) {
              return (
                <Page
                  key={pageNumber}
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  height={window.innerHeight - 20}
                  width={isWide ? window.innerWidth - 40 : undefined}
                  onRenderSuccess={onPageRenderSuccess}
                />
              );
            } else {
              return <div key={pageNumber} style={{ height: "100vh" }}></div>;
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
