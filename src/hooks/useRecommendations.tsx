import { useState, useEffect } from "react";
import { Game } from "./useGames";
import { useFavorites } from "./useFavorites";
import apiClient from "../services/api-client";

interface UseRecommendationsResult {
  recommendations: Game[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useRecommendations = (): UseRecommendationsResult => {
  const [recommendations, setRecommendations] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { favorites } = useFavorites();

  const fetchRecommendations = async () => {
    if (favorites.length === 0) {
      setRecommendations([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Extract genres from favorite games (we'll use a simple approach)
      // In a real app, you'd have genre data from the games
      const favoriteGameNames = favorites.map((game) => game.name).join(",");

      // Get games similar to favorites by searching for popular games
      // This is a simplified recommendation - in production you'd use more sophisticated algorithms
      const response = await apiClient.get("/games", {
        params: {
          page_size: 12,
          ordering: "-rating", // Get highly rated games
          search: favorites[0]?.name.split(" ")[0] || "", // Use first word of favorite game
        },
      });

      // Filter out games that are already in favorites
      const filteredGames = response.data.results.filter(
        (game: Game) => !favorites.some((fav) => fav.id === game.id)
      );

      setRecommendations(filteredGames.slice(0, 6)); // Show top 6 recommendations
    } catch (err) {
      setError("Failed to fetch recommendations");
      console.error("Error fetching recommendations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchRecommendations();
  };

  useEffect(() => {
    if (favorites.length > 0) {
      fetchRecommendations();
    } else {
      setRecommendations([]);
    }
  }, [favorites]);

  return {
    recommendations,
    isLoading,
    error,
    refetch,
  };
};
