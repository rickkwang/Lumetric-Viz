
import React, { useState, useEffect } from 'react';
import Scene from './components/Scene';
import Sidebar from './components/UI/Sidebar';
import { ChartData, ViewMode, HistoryItem } from './types';
import { DEFAULT_DATA } from './constants';
import * as XLSX from 'xlsx';
import { Menu, UploadCloud } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<ChartData>(DEFAULT_DATA);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.RADIAL);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [opacity, setOpacity] = useState<number>(0.8);
  
  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Responsive State
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Detect screen size on mount and resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    
    // Initial check
    if (window.innerWidth < 768) {
      setIsMobile(true);
      setIsSidebarOpen(false);
    } else {
      setIsMobile(false);
      setIsSidebarOpen(true);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize XLSX and Load History
  useEffect(() => {
    // @ts-ignore
    if (!window.XLSX) {
      // @ts-ignore
      window.XLSX = XLSX;
    }

    // Load history from local storage
    try {
        const saved = localStorage.getItem('lumetric_history');
        if (saved) {
            setHistory(JSON.parse(saved));
        }
    } catch (e) {
        console.error("Failed to load history", e);
    }
  }, []);

  const saveToHistory = (name: string, newData: ChartData) => {
      const newItem: HistoryItem = {
          id: Date.now().toString(),
          name: name,
          timestamp: Date.now(),
          data: newData
      };
      
      // Keep last 5 items to avoid storage limits
      const updatedHistory = [newItem, ...history].slice(0, 5);
      setHistory(updatedHistory);
      localStorage.setItem('lumetric_history', JSON.stringify(updatedHistory));
  };

  const handleDeleteSeries = (id: string) => {
      setData(prev => ({
          ...prev,
          series: prev.series.filter(s => s.id !== id)
      }));
  };

  const handleUploadSuccess = (newData: ChartData, fileName: string) => {
      setData(newData);
      saveToHistory(fileName, newData);
  };

  const handleLoadHistory = (item: HistoryItem) => {
      setData(item.data);
  };

  const clearHistory = () => {
      setHistory([]);
      localStorage.removeItem('lumetric_history');
  }

  const hasData = data.series.length > 0;

  return (
    <div className="relative w-full h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Mobile Overlay Backdrop */}
      {isMobile && isSidebarOpen && (
        <div 
          className="absolute inset-0 bg-black/30 z-20 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        data={data} 
        setData={setData}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isRotating={isRotating}
        setIsRotating={setIsRotating}
        opacity={opacity}
        setOpacity={setOpacity}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isMobile={isMobile}
        onDeleteSeries={handleDeleteSeries}
        onUploadSuccess={handleUploadSuccess}
        history={history}
        onLoadHistory={handleLoadHistory}
        onClearHistory={clearHistory}
      />
      
      {/* Floating Menu Button (Visible when sidebar is closed or on mobile) */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className={`absolute top-4 left-4 z-30 p-2 bg-white/80 backdrop-blur border border-gray-200 rounded-lg shadow-sm text-gray-700 hover:bg-white hover:text-blue-600 transition-all duration-300 ${isSidebarOpen ? 'opacity-0 pointer-events-none -translate-x-4' : 'opacity-100 translate-x-0'}`}
        aria-label="Open Menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Main Content Area */}
      <main 
        className={`absolute top-0 left-0 w-full h-full transition-all duration-300 ease-in-out
          ${!isMobile && isSidebarOpen ? 'pl-80' : 'pl-0'}
        `}
      >
         {/* Empty State Overlay */}
         {!hasData && (
             <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-50 text-center p-6">
                 <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6 ring-1 ring-gray-100">
                     <UploadCloud className="w-10 h-10 text-blue-500" />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-800 mb-3">Ready to Visualize</h2>
                 <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
                     No data is currently displayed. Upload an Excel/CSV file or select a recent item from the sidebar history.
                 </p>
                 <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-xl shadow-blue-600/20 hover:scale-105 active:scale-95 flex items-center gap-2"
                 >
                     <Menu className="w-4 h-4" />
                     Open Menu
                 </button>
             </div>
         )}

         {/* Top right floating Badge */}
        <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur border border-gray-200 shadow-sm rounded-full px-3 py-1.5 text-xs text-gray-600 flex items-center space-x-2 pointer-events-none select-none">
            <div className={`w-2 h-2 rounded-full animate-pulse ${hasData ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="font-medium">Lumetric Engine</span>
        </div>

        {/* Only render Scene if we have data to avoid visual conflicts with empty state */}
        {hasData && (
            <Scene 
                data={data} 
                viewMode={viewMode} 
                isRotating={isRotating} 
                opacity={opacity}
            />
        )}
      </main>
    </div>
  );
};

export default App;
