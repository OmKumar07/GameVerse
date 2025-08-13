import { Grid, GridItem, Show } from "@chakra-ui/react";
import NavBar from "./components/NavBar.js";

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
      <GridItem
        area="aside"
        bg="gold"
        p={4}
        display={{ base: "none", lg: "block" }}
      >
        Sidebar
      </GridItem>
      <GridItem area="main" bg="coral">
        Main Content
      </GridItem>
    </Grid>
  );
}

export default App;
