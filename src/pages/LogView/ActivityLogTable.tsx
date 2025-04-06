import styled from "styled-components";
import { useEffect, useState } from "react";
import { ActivityLog } from "./data";

interface IProps {
  logs: ActivityLog[];
}

const LOGS_PER_PAGE = 10;

export const ActivityLogTable = ({ logs }: IProps) => {
  const [columns, setColumns] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(logs.length / LOGS_PER_PAGE);
  const paginatedLogs = logs.slice(
    (currentPage - 1) * LOGS_PER_PAGE,
    currentPage * LOGS_PER_PAGE
  );

  useEffect(() => {
    const pageSet = new Set<number>();
    logs.forEach((log) => {
      log.pageLogs.forEach((p) => pageSet.add(p.page));
    });
    setColumns(Array.from(pageSet).sort((a, b) => a - b));
  }, [logs]);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <TableContainer>
      <UnitInfo>(단위 : ms)</UnitInfo>
      <StyledTable>
        <thead>
          <tr>
            <th>Visit ID</th>
            {columns.map((page) => (
              <th key={page}>Page {page}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedLogs.map((log) => (
            <tr key={log.visitId}>
              <td>{log.visitId}</td>
              {columns.map((page) => {
                const pageLog = log.pageLogs.find((p) => p.page === page);
                return <td key={page}>{pageLog ? pageLog.durationMs : "-"}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </StyledTable>

      <PaginationWrapper>
        <button onClick={handlePrev} disabled={currentPage === 1}>
          이전
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button onClick={handleNext} disabled={currentPage === totalPages}>
          다음
        </button>
      </PaginationWrapper>
    </TableContainer>
  );
};

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  padding: 16px;
  box-sizing: border-box;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: center;
  }
  thead {
    background-color: #f0f0f0;
  }
  tbody tr:nth-child(even) {
    background-color: #fafafa;
  }
`;

const PaginationWrapper = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 12px;

  button {
    padding: 6px 12px;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 6px;
    cursor: pointer;

    &:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  }

  span {
    line-height: 32px;
    font-weight: bold;
  }
`;

const UnitInfo = styled.div`
  text-align: right;
  font-size: 14px;
  color: #888;
  margin-bottom: 6px;
`;
