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

export const useDeletePortfolio = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (id: string) => {
      return request({
        url: `portfolios/${id}`,
        method: "DELETE",
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useGetPortfolio = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (id: string) => {
      return request({
        url: `portfolios/${id}`,
        method: "GET",
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};
