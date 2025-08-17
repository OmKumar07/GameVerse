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

interface FavoritesContextType {
  favorites: Game[];
  isFavorite: (gameId: number) => boolean;
  addToFavorites: (game: Game) => Promise<void>;
  removeFromFavorites: (gameId: number) => Promise<void>;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Load favorites when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated, user]);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await apiClient.get("/users/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(response.data.favorites || []);
    } catch (error) {
      console.error("Failed to load favorites:", error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorite = (gameId: number): boolean => {
    return favorites.some((game) => game.id === gameId);
  };

  const addToFavorites = async (game: Game) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      await apiClient.post(
        "/users/favorites",
        { game },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFavorites((prev) => [...prev, game]);
    } catch (error) {
      console.error("Failed to add to favorites:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromFavorites = async (gameId: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      await apiClient.delete(`/users/favorites/${gameId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavorites((prev) => prev.filter((game) => game.id !== gameId));
    } catch (error) {
      console.error("Failed to remove from favorites:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: FavoritesContextType = {
    favorites,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    isLoading,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
