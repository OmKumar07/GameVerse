import useGames from "@/hooks/useGames";
import React, { useState, useEffect } from "react";

const GameGrid = () => {
  const { games, error } = useGames();

  return (
    <>
      {error && <p>Error: {error}</p>}
      <ul>
        {games.map((game) => (
          <li key={game.id}>{game.name}</li>
        ))}
      </ul>
    </>
  );
};

export default GameGrid;
