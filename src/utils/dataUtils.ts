// Generate random data for the bar chart
export const generateRandomData = (count: number): { label: string; value: number }[] => {
  const categories = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    label: categories[i],
    value: Math.floor(Math.random() * 95) + 5 // Random value between 5 and 100
  }));
};

// Sort data based on sort type
export const sortData = (
  data: { label: string; value: number }[], 
  sortType: 'ascending' | 'descending' | 'none'
): { label: string; value: number }[] => {
  if (sortType === 'none') return data;
  
  return [...data].sort((a, b) => {
    if (sortType === 'ascending') {
      return a.value - b.value;
    } else {
      return b.value - a.value;
    }
  });
};