import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useModels = <T>(url: string, key: string, stale?: number) => {
  const { data, error, isLoading } = useQuery<T, Error>({
    queryKey: [key],
    queryFn: () => axios.get<T>(url).then((res) => res.data),
    staleTime: stale || 1000 * 60 * 5, // defined or 5 minutes
  });
  return {
    data,
    error,
    isLoading,
  };
};
export default useModels;
