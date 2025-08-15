import { Box, Grid, GridItem, Show } from "@chakra-ui/react";
import { useState } from "react";
import NavBar from "./components/NavBar";
import GameGrid from "./components/GameGrid";
import GenreList from "./components/GenreList";
import { Platform } from "./hooks/useGames";
import { Genre } from "./hooks/useGenres";

function App() {
  const [selectedGenre, setSelectedGenre] = useState<Genre>();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>();
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav" "aside main"`,
      }}
      templateColumns={{
        base: "1fr",
        lg: "200px 1fr",
      }}
      bg="gray.800"
      color="white"
    >
      <GridItem area="nav">
        <NavBar onSearch={setSearchText} />
      </GridItem>
      <Box display={{ base: "none", lg: "block" }}>
        <GridItem area="aside" paddingX={5}>
          <GenreList
            selectedGenre={selectedGenre}
            onSelectGenre={(genre) => setSelectedGenre(genre)}
          />
        </GridItem>
      </Box>
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
  );
}

export default App;
