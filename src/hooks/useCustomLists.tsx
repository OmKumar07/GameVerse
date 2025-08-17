import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { useToast } from "@chakra-ui/react";

export interface CustomList {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  games: ListGame[];
  createdAt: string;
  updatedAt: string;
}

export interface ListGame {
  gameId: number;
  gameName: string;
  gameImage?: string;
  addedAt: string;
}

export interface CreateListData {
  name: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdateListData {
  name?: string;
  description?: string;
  isPublic?: boolean;
}

export const useCustomLists = () => {
  const [lists, setLists] = useState<CustomList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5001/api";

  // Get token from localStorage
  const getToken = () => localStorage.getItem("authToken");

  // Fetch all custom lists
  const fetchLists = async () => {
    const token = getToken();
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/lists`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch lists");
      }

      const data = await response.json();
      setLists(data.data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch lists";
      setError(errorMessage);
      console.error("Error fetching lists:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new custom list
  const createList = async (
    listData: CreateListData
  ): Promise<CustomList | null> => {
    const token = getToken();
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to create lists",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/lists`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create list");
      }

      const data = await response.json();
      const newList = data.data;

      setLists((prev) => [newList, ...prev]);

      toast({
        title: "List created",
        description: `"${newList.name}" has been created successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      return newList;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create list";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update a custom list
  const updateList = async (
    listId: string,
    updateData: UpdateListData
  ): Promise<boolean> => {
    const token = getToken();
    if (!token) return false;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/lists/${listId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update list");
      }

      const data = await response.json();
      const updatedList = data.data;

      setLists((prev) =>
        prev.map((list) => (list.id === listId ? updatedList : list))
      );

      toast({
        title: "List updated",
        description: "Your list has been updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update list";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a custom list
  const deleteList = async (listId: string): Promise<boolean> => {
    const token = getToken();
    if (!token) return false;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/lists/${listId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete list");
      }

      setLists((prev) => prev.filter((list) => list.id !== listId));

      toast({
        title: "List deleted",
        description: "Your list has been deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete list";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Add a game to a list
  const addGameToList = async (
    listId: string,
    gameData: Omit<ListGame, "addedAt">
  ): Promise<boolean> => {
    const token = getToken();
    if (!token) return false;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/lists/${listId}/games`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add game to list");
      }

      const data = await response.json();
      const updatedList = data.data;

      setLists((prev) =>
        prev.map((list) => (list.id === listId ? updatedList : list))
      );

      toast({
        title: "Game added",
        description: `"${gameData.gameName}" has been added to the list`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add game to list";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove a game from a list
  const removeGameFromList = async (
    listId: string,
    gameId: number
  ): Promise<boolean> => {
    const token = getToken();
    if (!token) return false;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/lists/${listId}/games/${gameId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove game from list");
      }

      const data = await response.json();
      const updatedList = data.data;

      setLists((prev) =>
        prev.map((list) => (list.id === listId ? updatedList : list))
      );

      toast({
        title: "Game removed",
        description: "Game has been removed from the list",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove game from list";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a game is in any list
  const isGameInList = (gameId: number, listId?: string): boolean => {
    if (listId) {
      const list = lists.find((l) => l.id === listId);
      return list ? list.games.some((game) => game.gameId === gameId) : false;
    }

    return lists.some((list) =>
      list.games.some((game) => game.gameId === gameId)
    );
  };

  // Get lists containing a specific game
  const getListsContainingGame = (gameId: number): CustomList[] => {
    return lists.filter((list) =>
      list.games.some((game) => game.gameId === gameId)
    );
  };

  // Get a specific list by ID
  const getListById = (listId: string): CustomList | undefined => {
    return lists.find((list) => list.id === listId);
  };

  // Fetch lists on mount and when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchLists();
    } else {
      setLists([]);
    }
  }, [isAuthenticated]);

  return {
    lists,
    isLoading,
    error,
    fetchLists,
    createList,
    updateList,
    deleteList,
    addGameToList,
    removeGameFromList,
    isGameInList,
    getListsContainingGame,
    getListById,
  };
};
