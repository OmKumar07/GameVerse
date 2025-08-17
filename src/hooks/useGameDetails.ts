import { useState } from "react";
import apiClient from "../services/api-client";

interface GameDetails {
  id: number;
  name: string;
  description_raw: string;
  background_image: string;
  background_image_additional?: string;
  released: string;
  rating: number;
  rating_top: number;
  ratings_count: number;
  metacritic: number;
  playtime: number;
  genres: Array<{ id: number; name: string }>;
  platforms: Array<{ platform: { id: number; name: string } }>;
  developers: Array<{ id: number; name: string }>;
  publishers: Array<{ id: number; name: string }>;
  esrb_rating?: { id: number; name: string };
  website: string;
  reddit_url?: string;
  metacritic_url?: string;
  tags: Array<{ id: number; name: string; games_count: number }>;
  screenshots_count: number;
  parent_platforms: Array<{ platform: { id: number; name: string; slug: string } }>;
}

interface Screenshot {
  id: number;
  image: string;
}

export const useGameDetails = () => {
  const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [screenshotsLoading, setScreenshotsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGameDetails = async (gameId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get(`/games/${gameId}`);
      setGameDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch game details:", error);
      setError("Failed to load game details");
      setGameDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchScreenshots = async (gameId: number) => {
    try {
      setScreenshotsLoading(true);
      const response = await apiClient.get(`/games/${gameId}/screenshots`);
      setScreenshots(response.data.results?.slice(0, 6) || []);
    } catch (error) {
      console.error("Failed to fetch screenshots:", error);
      setScreenshots([]);
    } finally {
      setScreenshotsLoading(false);
    }
  };

  const clearGameDetails = () => {
    setGameDetails(null);
    setScreenshots([]);
    setError(null);
  };

  return {
    gameDetails,
    screenshots,
    isLoading,
    screenshotsLoading,
    error,
    fetchGameDetails,
    fetchScreenshots,
    clearGameDetails,
  };
};
