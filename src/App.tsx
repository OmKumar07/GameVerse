import { Box, Grid, GridItem, useColorModeValue } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import GameGrid from "./components/GameGrid";
import GenreList from "./components/GenreList";
import { Platform } from "./hooks/useGames";
import { Genre } from "./hooks/useGenres";
import { AuthProvider } from "./hooks/useAuth";
import { FavoritesProvider } from "./hooks/useFavorites";
import { PlayedGamesProvider } from "./hooks/usePlayedGames";
import useKeepServerAlive from "./hooks/useKeepServerAlive";
import DashboardPage from "./pages/DashboardPage";
import UserSearchPage from "./pages/UserSearchPage";
import PublicProfilePage from "./pages/PublicProfilePage";
import HeroPage from "./pages/HeroPage";

function App() {
  const [selectedGenre, setSelectedGenre] = useState<Genre>();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>();
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname);

  // Keep server alive to prevent cold starts
  useKeepServerAlive();

  // All useColorModeValue hooks must be called at the top level
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const sidebarBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Function to navigate to main app
  const handleEnterApp = () => {
    setCurrentRoute("/app");
    window.history.pushState({}, "", "/app");
  };

  // Simple routing handler
  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentRoute(window.location.pathname);
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  // Update document title dynamically based on current filters
  useEffect(() => {
    let title = "GameVerse";

    if (currentRoute === "/dashboard") {
      title = "Dashboard - GameVerse";
    } else if (currentRoute === "/users") {
      title = "Discover Users - GameVerse";
    } else if (currentRoute.startsWith("/user/")) {
      const username = currentRoute.split("/user/")[1];
      title = `${username} - GameVerse`;
    } else if (currentRoute === "/app") {
      if (searchText) {
        title = `"${searchText}" - GameVerse`;
      } else if (selectedGenre) {
        title = `${selectedGenre.name} Games - GameVerse`;
      } else if (selectedPlatform && selectedPlatform.name) {
        title = `${selectedPlatform.name} Games - GameVerse`;
      } else {
        title = "Discover Amazing Games - GameVerse";
      }
    } else {
      title = "GameVerse - Your Ultimate Gaming Companion";
    }

    document.title = title;
  }, [searchText, selectedGenre, selectedPlatform, currentRoute]);

  // Render hero page for root route
  if (currentRoute === "/" || currentRoute === "") {
    return (
      <AuthProvider>
        <HeroPage onEnterApp={handleEnterApp} />
      </AuthProvider>
    );
  }

  // Render dashboard page if on dashboard route
  if (currentRoute === "/dashboard") {
    return (
      <AuthProvider>
        <FavoritesProvider>
          <PlayedGamesProvider>
            <Box minH="100vh" bg={bgColor}>
              <NavBar
                onSearch={setSearchText}
                selectedGenre={selectedGenre}
                onSelectGenre={setSelectedGenre}
              />
              <DashboardPage />
            </Box>
          </PlayedGamesProvider>
        </FavoritesProvider>
      </AuthProvider>
    );
  }

  // Render user search page
  if (currentRoute === "/users") {
    return (
      <AuthProvider>
        <FavoritesProvider>
          <PlayedGamesProvider>
            <Box minH="100vh" bg={bgColor}>
              <NavBar
                onSearch={setSearchText}
                selectedGenre={selectedGenre}
                onSelectGenre={setSelectedGenre}
              />
              <UserSearchPage />
            </Box>
          </PlayedGamesProvider>
        </FavoritesProvider>
      </AuthProvider>
    );
  }

  // Render public profile page
  if (currentRoute.startsWith("/user/")) {
    return (
      <AuthProvider>
        <FavoritesProvider>
          <PlayedGamesProvider>
            <Box minH="100vh" bg={bgColor}>
              <NavBar
                onSearch={setSearchText}
                selectedGenre={selectedGenre}
                onSelectGenre={setSelectedGenre}
              />
              <PublicProfilePage />
            </Box>
          </PlayedGamesProvider>
        </FavoritesProvider>
      </AuthProvider>
    );
  }

  // Render main app (games grid) for /app route
  if (currentRoute === "/app") {
    return (
      <AuthProvider>
        <FavoritesProvider>
          <PlayedGamesProvider>
            <Box minH="100vh" bg={bgColor}>
              <Grid
                templateAreas={{
                  base: `"nav" "main"`,
                  lg: `"nav nav" "aside main"`,
                }}
                templateColumns={{
                  base: "1fr",
                  lg: "260px 1fr",
                  xl: "280px 1fr",
                }}
                templateRows="auto 1fr"
                minH="100vh"
              >
                <GridItem area="nav">
                  <NavBar
                    onSearch={setSearchText}
                    selectedGenre={selectedGenre}
                    onSelectGenre={setSelectedGenre}
                  />
                </GridItem>

                <GridItem
                  area="aside"
                  display={{ base: "none", lg: "block" }}
                  bg={sidebarBg}
                  borderRight="1px"
                  borderColor={borderColor}
                  overflowY="auto"
                  maxH="calc(100vh - 56px)"
                  position="sticky"
                  top="56px"
                >
                  <Box p={{ base: 3, md: 4, lg: 5 }}>
                    <GenreList
                      selectedGenre={selectedGenre}
                      onSelectGenre={(genre) => setSelectedGenre(genre)}
                    />
                  </Box>
                </GridItem>

                <GridItem area="main">
                  <GameGrid
                    selectedGenre={selectedGenre}
                    selectedPlatform={selectedPlatform}
                    searchText={searchText}
                    sortOrder={sortOrder}
                    onSelectPlatform={setSelectedPlatform}
                    onSortSelect={setSortOrder}
                  />
                </GridItem>
              </Grid>
            </Box>
          </PlayedGamesProvider>
        </FavoritesProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <HeroPage onEnterApp={handleEnterApp} />
    </AuthProvider>
  );
}

export default App;
