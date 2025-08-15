import { Box, Select } from "@chakra-ui/react";
import { ChangeEvent } from "react";

interface Props {
  onSelectSortOrder: (sortOrder: string) => void;
  sortOrder: string;
}

interface SortOption {
  value: string;
  label: string;
}

const SortSelector = ({ onSelectSortOrder, sortOrder }: Props) => {
  const sortOrders: SortOption[] = [
    { value: "", label: "Relevance" },
    { value: "-added", label: "Date added" },
    { value: "name", label: "Name" },
    { value: "-released", label: "Release date" },
    { value: "-metacritic", label: "Popularity" },
    { value: "-rating", label: "Average rating" },
  ];

  const currentSortOrder = sortOrders.find(
    (order) => order.value === sortOrder
  );

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onSelectSortOrder(e.target.value);
  };

  return (
    <Box>
      <select
        value={sortOrder}
        onChange={handleChange}
        className="sort-selector"
        title="Sort games"
        aria-label="Sort games"
      >
        <option value="">Order by: Relevance</option>
        {sortOrders.map((order) => (
          <option key={order.value} value={order.value}>
            {order.label} 📊
          </option>
        ))}
      </select>
    </Box>
  );
};

export default SortSelector;
