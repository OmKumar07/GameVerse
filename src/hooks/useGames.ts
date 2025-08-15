import apiClient from "@/services/api-client";
import { useInfiniteQuery } from "@tanstack/react-query";

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
  next: string | null;
  previous: string | null;
  results: Game[];
}

interface GameQuery {
  genreId?: number;
  platformId?: number;
  sortOrder?: string;
  searchText?: string;
}

const useGames = (gameQuery: GameQuery) => {
  const fetchGames = async ({ pageParam = 1 }: { pageParam?: number }) => {
    const params: any = {
      page: pageParam,
      page_size: 20,
    };

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

    const response = await apiClient.get<FetchGamesResponse>("/games", {
      params,
    });
    return response.data;
  };

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["games", gameQuery],
    queryFn: fetchGames,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.next ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const games = data?.pages.flatMap((page) => page.results) || [];

  return {
    games,
    error: error?.message || "",
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  };
};

export default useGames;
