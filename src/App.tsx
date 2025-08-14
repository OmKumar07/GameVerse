import { Grid, GridItem, Show } from "@chakra-ui/react";
import NavBar from "./components/NavBar.js";
import GameGrid from "./components/GameGrid.js";

function App() {
  return (
    <Grid
      templateAreas={{
        base: `"nav""main"`,
        lg: `"nav nav"
            "aside main"`,
      }}
    >
      <GridItem area="nav">
        <NavBar />
      </GridItem>
      <GridItem area="aside" p={4} display={{ base: "none", lg: "block" }}>
        Sidebar
      </GridItem>
      <GridItem area="main">
        <GameGrid />
      </GridItem>
    </Grid>
  );
}

export default App;
