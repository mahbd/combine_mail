import { useQuery } from "@tanstack/react-query";
import http from "./http";

const useModels = <T>(
  url: string,
  key: string,
  stale?: number,
  pagination?: boolean
) => {
  if (pagination) {
    const { data, isLoading, error } = useQuery<
      { results: T; count: number },
      Error
    >({
      queryKey: [key],
      queryFn: () => http.get(url).then((res) => res.data),
      staleTime: stale || 1000 * 60 * 5, // defined or 5 minutes
    });
    return { data: data?.results, isLoading, error, count: data?.count };
  } else {
    const { data, isLoading, error } = useQuery<T, Error>({
      queryKey: [key],
      queryFn: () => http.get<T>(url).then((res) => res.data),
      staleTime: stale || 1000 * 60 * 5, // defined or 5 minutes
    });
    return { data, isLoading, error, count: undefined };
  }
};
export default useModels;
