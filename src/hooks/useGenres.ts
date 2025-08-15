import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/api-client";

export interface Genre {
  id: number;
  name: string;
  image_background: string;
}

interface GenresResponse {
  count: number;
  results: Genre[];
}

const useGenres = () => {
  return useQuery<GenresResponse, Error>({
    queryKey: ["genres"],
    queryFn: () =>
      apiClient.get<GenresResponse>("/genres").then((res) => res.data),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export default useGenres;
