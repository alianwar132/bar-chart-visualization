import React, { useState, useEffect } from 'react';
import { BarChart, BarChartIcon, Play, Pause, RefreshCw } from 'lucide-react';
import BarChartComponent from './components/BarChartComponent';
import { generateRandomData, sortData } from './utils/dataUtils';

function App() {
  const [data, setData] = useState<{ label: string; value: number }[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sortType, setSortType] = useState<'none' | 'ascending' | 'descending'>('none');
  const [animationSpeed, setAnimationSpeed] = useState(500);

  // Generate initial random data
  useEffect(() => {
    generateNewData();
  }, []);

  // Animation effect
  useEffect(() => {
    let animationTimer: number | null = null;
    
    if (isAnimating) {
      animationTimer = window.setInterval(() => {
        setData(prevData => {
          const newData = [...prevData];
          // Randomly increase or decrease values
          return newData.map(item => ({
            ...item,
            value: Math.max(5, Math.min(100, item.value + (Math.random() > 0.5 ? 5 : -5) * Math.random()))
          }));
        });
      }, animationSpeed);
    }

    return () => {
      if (animationTimer !== null) {
        clearInterval(animationTimer);
      }
    };
  }, [isAnimating, animationSpeed]);

  // Sort effect
  useEffect(() => {
    if (sortType !== 'none') {
      setData(prevData => sortData([...prevData], sortType));
    }
  }, [sortType]);

  const generateNewData = () => {
    setData(generateRandomData(10));
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(e.target.value as 'none' | 'ascending' | 'descending');
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnimationSpeed(1000 - parseInt(e.target.value, 10));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <BarChart className="w-10 h-10 mr-2 text-blue-400" />
            <h1 className="text-4xl font-bold">Bar Chart Visualizer</h1>
          </div>
          <p className="text-gray-300">Create and animate dynamic bar charts based on input data</p>
          <p className="text-gray-300">Developed by Anwar Ansari with ❤️</p>
        </header>

        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 mb-6 justify-between items-center">
            <div className="flex gap-2">
              <button 
                onClick={toggleAnimation} 
                className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                  isAnimating 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isAnimating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isAnimating ? 'Pause' : 'Play'} Animation
              </button>
              
              <button 
                onClick={generateNewData} 
                className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate New Data
              </button>
            </div>

            <div className="flex gap-4 items-center">
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-sm">Sort:</label>
                <select 
                  id="sort" 
                  value={sortType} 
                  onChange={handleSortChange}
                  className="bg-gray-700 text-white rounded-md px-3 py-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">None</option>
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <label htmlFor="speed" className="mr-2 text-sm">Speed:</label>
                <input 
                  id="speed" 
                  type="range" 
                  min="100" 
                  max="900" 
                  value={1000 - animationSpeed} 
                  onChange={handleSpeedChange}
                  className="w-32"
                />
              </div>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <BarChartComponent data={data} />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <BarChartIcon className="w-5 h-5 mr-2 text-blue-400" />
            Data Table
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 py-2 rounded-tl-md">Label</th>
                  <th className="px-4 py-2 rounded-tr-md">Value</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-700/50' : 'bg-gray-700/30'}>
                    <td className="px-4 py-2">{item.label}</td>
                    <td className="px-4 py-2">{item.value.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;