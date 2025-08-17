import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Game } from "./useGames";
import { useAuth } from "./useAuth";
import apiClient from "../services/auth-api-client";

interface PlayedGame extends Game {
  status: "playing" | "completed" | "dropped" | "plan-to-play";
  addedAt: string;
  rating?: number;
  hoursPlayed?: number;
}

interface PlayedGamesContextType {
  playedGames: PlayedGame[];
  isPlayed: (gameId: number) => boolean;
  getGameStatus: (gameId: number) => string | null;
  addToPlayed: (game: Game, status?: string) => Promise<void>;
  removeFromPlayed: (gameId: number) => Promise<void>;
  updateGameStatus: (gameId: number, status: string) => Promise<void>;
  isLoading: boolean;
}

const PlayedGamesContext = createContext<PlayedGamesContextType | null>(null);

export const usePlayedGames = () => {
  const context = useContext(PlayedGamesContext);
  if (!context) {
    throw new Error("usePlayedGames must be used within a PlayedGamesProvider");
  }
  return context;
};

interface PlayedGamesProviderProps {
  children: ReactNode;
}

export const PlayedGamesProvider: React.FC<PlayedGamesProviderProps> = ({
  children,
}) => {
  const [playedGames, setPlayedGames] = useState<PlayedGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Load played games when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadPlayedGames();
    } else {
      setPlayedGames([]);
    }
  }, [isAuthenticated, user]);

  const loadPlayedGames = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await apiClient.get("/users/played-games", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Convert backend format to frontend format
      const played =
        response.data.playedGames?.map((playedGame: any) => ({
          id: playedGame.gameId,
          name: playedGame.gameName,
          background_image: playedGame.gameImage,
          parent_platforms: [],
          metacritic: null,
          status: playedGame.status,
          addedAt: playedGame.addedAt,
          rating: playedGame.rating,
          hoursPlayed: playedGame.hoursPlayed,
        })) || [];

      setPlayedGames(played);
    } catch (error) {
      console.error("Failed to load played games:", error);
      setPlayedGames([]);
    } finally {
      setIsLoading(false);
    }
  };

  const isPlayed = (gameId: number): boolean => {
    return playedGames.some((game) => game.id === gameId);
  };

  const getGameStatus = (gameId: number): string | null => {
    const game = playedGames.find((game) => game.id === gameId);
    return game?.status || null;
  };

  const addToPlayed = async (game: Game, status: string = "completed") => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      await apiClient.post(
        "/users/played-games",
        {
          gameId: game.id,
          gameName: game.name,
          gameImage: game.background_image || "",
          status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newPlayedGame: PlayedGame = {
        ...game,
        status: status as any,
        addedAt: new Date().toISOString(),
      };

      setPlayedGames((prev) => [
        ...prev.filter((g) => g.id !== game.id),
        newPlayedGame,
      ]);
    } catch (error) {
      console.error("Failed to add to played games:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromPlayed = async (gameId: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      await apiClient.delete(`/users/played-games/${gameId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPlayedGames((prev) => prev.filter((game) => game.id !== gameId));
    } catch (error) {
      console.error("Failed to remove from played games:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateGameStatus = async (gameId: number, status: string) => {
    try {
      setIsLoading(true);
      const game = playedGames.find((g) => g.id === gameId);
      if (!game) throw new Error("Game not found in played list");

      const token = localStorage.getItem("authToken");
      await apiClient.post(
        "/users/played-games",
        {
          gameId: game.id,
          gameName: game.name,
          gameImage: game.background_image || "",
          status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPlayedGames((prev) =>
        prev.map((g) => (g.id === gameId ? { ...g, status: status as any } : g))
      );
    } catch (error) {
      console.error("Failed to update game status:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: PlayedGamesContextType = {
    playedGames,
    isPlayed,
    getGameStatus,
    addToPlayed,
    removeFromPlayed,
    updateGameStatus,
    isLoading,
  };

  return (
    <PlayedGamesContext.Provider value={value}>
      {children}
    </PlayedGamesContext.Provider>
  );
};
