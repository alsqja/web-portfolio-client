import styled from "styled-components";
import { useEffect, useState } from "react";

interface PageLog {
  page: number;
  durationMs: number;
}

interface ActivityLog {
  visitId: string;
  portfolioId: string;
  pageLogs: PageLog[];
}

interface Props {
  logs: ActivityLog[];
}

export const ActivityLogTable = ({ logs }: Props) => {
  const [columns, setColumns] = useState<number[]>([]);

  useEffect(() => {
    const pageSet = new Set<number>();
    logs.forEach((log) => {
      log.pageLogs.forEach((p) => pageSet.add(p.page));
    });
    setColumns(Array.from(pageSet).sort((a, b) => a - b));
  }, [logs]);

  return (
    <TableContainer>
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
          {logs.map((log) => (
            <tr key={log.visitId}>
              <td>{log.visitId}</td>
              {columns.map((page) => {
                const pageLog = log.pageLogs.find((p) => p.page === page);
                return (
                  <td key={page}>
                    {pageLog ? pageLog.durationMs + " ms" : "-"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </StyledTable>
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
