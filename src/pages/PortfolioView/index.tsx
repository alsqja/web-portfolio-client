import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import axios from "axios";
import { pdfjs } from "react-pdf";
import { useLocation } from "react-router-dom";
import { IPortfolio } from "../Home/data";
import { useGetPortfolio } from "../../hooks/portfolioApi";
import { v4 as uuidv4 } from "uuid";
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

  const visitId = useRef<string>(uuidv4());
  const pageEnterTime = useRef<number>(Date.now());
  const activityLogs = useRef<{ page: number; durationMs: number }[]>([]);
  const prevPage = useRef<number>(1);
  const location = useLocation();

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
        .catch((err) => console.error("PDF fetch 실패", err));
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

  useEffect(() => {
    const now = Date.now();
    const duration = now - pageEnterTime.current;

    if (prevPage.current !== currentPage) {
      const existingLog = activityLogs.current.find(
        (log) => log.page === prevPage.current
      );
      if (existingLog) {
        existingLog.durationMs += duration;
      } else {
        activityLogs.current.push({
          page: prevPage.current,
          durationMs: duration,
        });
      }
      prevPage.current = currentPage;
      pageEnterTime.current = now;
    }
  }, [currentPage]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const now = Date.now();
      const duration = now - pageEnterTime.current;
      const existingLog = activityLogs.current.find(
        (log) => log.page === prevPage.current
      );

      if (existingLog) {
        existingLog.durationMs += duration;
      } else {
        activityLogs.current.push({
          page: prevPage.current,
          durationMs: duration,
        });
      }

      if (portfolio) {
        const payload = {
          visitId: visitId.current,
          portfolioId: portfolio.id,
          pageLogs: activityLogs.current,
        };

        navigator.sendBeacon(
          "http://localhost:8080/activity-logs",
          new Blob([JSON.stringify(payload)], { type: "application/json" })
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [portfolio]);

  useEffect(() => {
    const handleRouteChange = () => {
      const now = Date.now();
      const duration = now - pageEnterTime.current;
      const existingLog = activityLogs.current.find(
        (log) => log.page === prevPage.current
      );

      if (existingLog) {
        existingLog.durationMs += duration;
      } else {
        activityLogs.current.push({
          page: prevPage.current,
          durationMs: duration,
        });
      }

      if (portfolio) {
        const payload = {
          visitId: visitId.current,
          portfolioId: portfolio.id,
          pageLogs: activityLogs.current,
        };

        navigator.sendBeacon(
          "http://localhost:8080/activity-logs",
          new Blob([JSON.stringify(payload)], { type: "application/json" })
        );
      }
    };

    return () => {
      handleRouteChange();
    };
  }, [location, portfolio]);

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
                  renderAnnotationLayer={true}
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
