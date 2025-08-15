import { Box } from "@chakra-ui/react";
import { Platform } from "../hooks/useGames";
import usePlatforms from "../hooks/usePlatforms";
import { ChangeEvent } from "react";

interface Props {
  onSelectPlatform: (platform: Platform) => void;
  selectedPlatform?: Platform | null;
}

const PlatformSelector = ({ onSelectPlatform, selectedPlatform }: Props) => {
  const { data, error, isLoading } = usePlatforms();

  if (error) return null;
  if (isLoading) return <Box>Loading platforms...</Box>;

  const platforms = Array.isArray(data?.results) ? data.results : [];

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const platform = platforms.find(
      (p: Platform) => p.id === parseInt(e.target.value)
    );
    if (platform) onSelectPlatform(platform);
  };

  return (
    <Box>
      <select
        value={selectedPlatform?.id || ""}
        onChange={handleChange}
        className="platform-selector"
        title="Select platform"
        aria-label="Select gaming platform"
      >
        <option value="">Platforms 🎮</option>
        {platforms.map((platform: Platform) => (
          <option key={platform.id} value={platform.id}>
            {platform.name}
          </option>
        ))}
      </select>
    </Box>
  );
};

export default PlatformSelector;
