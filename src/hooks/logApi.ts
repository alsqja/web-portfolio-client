import { useCallback } from "react";
import { useAxios } from "./axios";

export const useGetPortfolioLogs = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (id: string) => {
      return request({
        url: `/activity-logs/portfolios/${id}`,
        method: "GET",
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};
