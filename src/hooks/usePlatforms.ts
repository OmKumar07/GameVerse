import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/api-client";
import { Platform } from "./useGames";

interface PlatformsResponse {
  count: number;
  results: Platform[];
}

const usePlatforms = () => {
  return useQuery<PlatformsResponse, Error>({
    queryKey: ["platforms"],
    queryFn: () =>
      apiClient
        .get<PlatformsResponse>("/platforms/lists/parents")
        .then((res) => res.data),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export default usePlatforms;
