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

export const useUploadPortfolio = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      return request({
        url: "portfolios",
        method: "POST",
        data: formData,
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};
