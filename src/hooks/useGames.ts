import apiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";

export interface Platform {
  id: number;
  name: string;
  slug: string;
}

export interface Game {
  id: number;
  name: string;
  background_image: string;
  parent_platforms: { platform: Platform }[];
  metacritic: number;
}

interface FetchGamesResponse {
  count: number;
  results: Game[];
}

interface GameQuery {
  genreId?: number;
  platformId?: number;
  sortOrder?: string;
  searchText?: string;
}

const useGames = (gameQuery: GameQuery) => {
  const { data, error, isLoading } = useQuery<FetchGamesResponse, Error>({
    queryKey: ["games", gameQuery],
    queryFn: () => {
      const params: any = {};

      if (gameQuery.genreId) {
        params.genres = gameQuery.genreId;
      }

      if (gameQuery.platformId) {
        params.parent_platforms = gameQuery.platformId;
      }

      if (gameQuery.sortOrder) {
        params.ordering = gameQuery.sortOrder;
      }

      if (gameQuery.searchText) {
        params.search = gameQuery.searchText;
      }

      return apiClient
        .get<FetchGamesResponse>("/games", { params })
        .then((res) => res.data);
    },
  });

  return { games: data?.results || [], error: error?.message || "", isLoading };
};

export default useGames;
