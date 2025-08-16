import { Box, Grid, GridItem, useColorModeValue } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import GameGrid from "./components/GameGrid";
import GenreList from "./components/GenreList";
import { Platform } from "./hooks/useGames";
import { Genre } from "./hooks/useGenres";
import { AuthProvider } from "./hooks/useAuth";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const [selectedGenre, setSelectedGenre] = useState<Genre>();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>();
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const sidebarBg = useColorModeValue("white", "gray.800");

  // Simple routing handler
  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentRoute(window.location.pathname);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Update document title dynamically based on current filters
  useEffect(() => {
    let title = "GameVerse";

    if (currentRoute === '/dashboard') {
      title = "Dashboard - GameVerse";
    } else if (searchText) {
      title = `"${searchText}" - GameVerse`;
    } else if (selectedGenre) {
      title = `${selectedGenre.name} Games - GameVerse`;
    } else if (selectedPlatform && selectedPlatform.name) {
      title = `${selectedPlatform.name} Games - GameVerse`;
    } else {
      title = "Discover Amazing Games - GameVerse";
    }

    document.title = title;
  }, [searchText, selectedGenre, selectedPlatform, currentRoute]);

  // Render dashboard page if on dashboard route
  if (currentRoute === '/dashboard') {
    return (
      <AuthProvider>
        <Box minH="100vh" bg={bgColor}>
          <NavBar onSearch={setSearchText} />
          <DashboardPage />
        </Box>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <Box minH="100vh" bg={bgColor}>
        <Grid
          templateAreas={{
            base: `"nav" "main"`,
            lg: `"nav nav" "aside main"`,
          }}
          templateColumns={{
            base: "1fr",
            lg: "280px 1fr",
          }}
          templateRows={{
            base: "auto 1fr",
            lg: "auto 1fr",
          }}
        >
          <GridItem area="nav">
            <NavBar onSearch={setSearchText} />
          </GridItem>

          <GridItem
            area="aside"
            display={{ base: "none", lg: "block" }}
            bg={sidebarBg}
            borderRight="1px"
            borderColor={useColorModeValue("gray.200", "gray.700")}
            overflowY="auto"
            maxH="calc(100vh - 82px)"
            position="sticky"
            top="82px"
          >
            <Box p={6}>
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
    </AuthProvider>
  );
}

export default App;
