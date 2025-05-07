import styled from "styled-components";
import { useEffect, useState } from "react";
import { ActivityLog } from "./data";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
} from "recharts";

interface IProps {
  logs: ActivityLog[];
}

export const ActivityChart = ({ logs }: IProps) => {
  const [chartData, setChartData] = useState<
    { page: number; averageDuration: number }[]
  >([]);

  useEffect(() => {
    const pageMap = new Map<number, number[]>();

    logs.forEach((log) => {
      log.pageLogs.forEach(({ page, durationMs }) => {
        if (!pageMap.has(page)) {
          pageMap.set(page, []);
        }
        pageMap.get(page)?.push(durationMs);
      });
    });

    const avgData = Array.from(pageMap.entries()).map(([page, durations]) => ({
      page,
      averageDuration:
        durations.reduce((sum, dur) => sum + dur, 0) / durations.length,
    }));

    // 페이지 순으로 정렬
    avgData.sort((a, b) => a.page - b.page);

    setChartData(avgData);
  }, [logs]);

  return (
    <ChartContainer>
      <ChartTitle>페이지별 평균 체류 시간</ChartTitle>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="page"
            label={{ value: "Page", position: "insideBottom", offset: -5 }}
          />
          <YAxis label={{ value: "ms", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="averageDuration"
            fill="#007bff"
            name="평균 체류 시간 (ms)"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
`;

const ChartTitle = styled.h3`
  margin-bottom: 10px;
  text-align: center;
  font-weight: 600;
`;
