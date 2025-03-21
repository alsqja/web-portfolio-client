import { useCallback } from "react";
import { useAxios } from "./axios";

export const useGetUserPortfolio = () => {
  const [request, response] = useAxios();

  const run = useCallback(() => {
    return request({
      url: `users/my/portfolios`,
      method: "GET",
    });
  }, [request]);

  return [run, response] as [typeof run, typeof response];
};
