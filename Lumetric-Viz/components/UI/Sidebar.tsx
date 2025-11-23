
import React, { useState, useCallback } from 'react';
import { ChartData, ViewMode, HistoryItem } from '../../types';
import { Upload, PieChart, BarChart3, Circle, Activity, Eye, EyeOff, TrendingUp, FileSpreadsheet, Loader2, AlertCircle, X, MapPin, Mountain, Trash2, RefreshCcw, Clock, RotateCcw } from 'lucide-react';
import { parseExcelFile } from '../../utils/parsing';

interface SidebarProps {
  data: ChartData;
  setData: (data: ChartData) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isRotating: boolean;
  setIsRotating: (v: boolean) => void;
  opacity: number;
  setOpacity: (v: number) => void;
  // Responsive Props
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  onDeleteSeries: (id: string) => void;
  onUploadSuccess: (data: ChartData, fileName: string) => void;
  // History Props
  history: HistoryItem[];
  onLoadHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    data, setData, viewMode, setViewMode, isRotating, setIsRotating, opacity, setOpacity,
    isOpen, onClose, isMobile, onDeleteSeries, onUploadSuccess,
    history, onLoadHistory, onClearHistory
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setErrorMsg(null);
    setIsProcessing(true);
    setFileName(file.name);
    
    setTimeout(async () => {
        try {
            console.log("Starting processing for:", file.name);
            const newData = await parseExcelFile(file);
            onUploadSuccess(newData, file.name);
            setIsDragging(false);
            setErrorMsg(null);
            
            // Auto reset the upload box after 2 seconds so it's ready for the next file
            setTimeout(() => {
                setFileName(null);
            }, 2000);

            // Auto close on mobile after successful upload to show results
            if (isMobile) onClose();
        } catch (error: any) {
            const msg = error.message || "Unknown error";
            setErrorMsg(msg);
            console.error("Upload failed:", error);
            setFileName(null);
            alert(`Failed to load file:\n${msg}\n\nRequired Format:\nA1: [Category Name], B1: [Series Name]...\nA2: [Row Name], B2: [Value]...`);
        } finally {
            setIsProcessing(false);
        }
    }, 100);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
        return;
    }
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.match(/\.(xlsx|xls|csv)$/i)) {
          processFile(file);
      } else {
          alert("Invalid file type. Please upload an Excel (.xlsx, .xls) or CSV file.");
      }
    }
  }, []);

  const toggleSeries = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedSeries = data.series.map(s => 
        s.id === id ? { ...s, visible: !s.visible } : s
    );
    setData({ ...data, series: updatedSeries });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation();
      onDeleteSeries(id);
  };

  const handleClearAll = () => {
      if (window.confirm("Are you sure you want to remove all datasets?")) {
          setData({ ...data, series: [] });
      }
  }

  // Determine CSS classes for slide transition
  const sidebarClasses = `
    fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 p-6 
    overflow-y-auto text-sm z-30 shadow-2xl flex flex-col
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <div className={sidebarClasses}>
      <div className="mb-8 flex items-center justify-between">
         <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">
                Lumetric
            </h1>
         </div>
         <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
         >
            <X className="w-5 h-5" />
         </button>
      </div>

      {/* View Modes */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Visualization Type</h3>
        <div className="grid grid-cols-2 gap-2">
            {[
                { mode: ViewMode.RADIAL, icon: PieChart, label: "Radial" },
                { mode: ViewMode.BARS, icon: BarChart3, label: "Bars" },
                { mode: ViewMode.BUBBLES, icon: Circle, label: "Bubbles" },
                { mode: ViewMode.TRENDS, icon: TrendingUp, label: "Trends" },
                { mode: ViewMode.LOLLIPOP, icon: MapPin, label: "Lollipop" },
                { mode: ViewMode.SURFACE, icon: Mountain, label: "Surface" },
            ].map((item) => (
                <button
                    key={item.mode}
                    type="button"
                    onClick={() => {
                        setViewMode(item.mode);
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                        viewMode === item.mode 
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' 
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                >
                    <item.icon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">{item.label}</span>
                </button>
            ))}
        </div>
      </div>

      {/* Configuration */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Controls</h3>
        
        <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Auto Rotate</span>
                <button 
                    type="button"
                    onClick={() => setIsRotating(!isRotating)}
                    className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${isRotating ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 shadow-sm ${isRotating ? 'translate-x-5' : ''}`} />
                </button>
            </div>

            <div>
                <div className="flex justify-between mb-1">
                    <span className="text-gray-700 font-medium">Data Opacity</span>
                    <span className="text-gray-500">{Math.round(opacity * 100)}%</span>
                </div>
                <input 
                    type="range" 
                    min="0.1" 
                    max="1" 
                    step="0.1" 
                    value={opacity} 
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
            </div>
        </div>
      </div>

      {/* Data Source */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">New Upload</h3>
        
        <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload-input')?.click()}
            className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 group relative overflow-hidden ${
                isDragging 
                ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
                : errorMsg ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50'
            }`}
        >
            <input 
                id="file-upload-input"
                type="file" 
                accept=".xlsx, .xls, .csv" 
                onChange={handleFileUpload} 
                className="hidden" 
            />
            
            <div className="flex flex-col items-center text-gray-500 group-hover:text-blue-600 z-10 pointer-events-none">
                {isProcessing ? (
                     <>
                        <Loader2 className="w-8 h-8 mb-2 text-blue-600 animate-spin" />
                        <span className="text-xs font-medium text-gray-900">Processing...</span>
                     </>
                ) : fileName ? (
                    <>
                        <FileSpreadsheet className="w-8 h-8 mb-2 text-green-600" />
                        <span className="text-xs font-medium text-gray-900 line-clamp-1 break-all px-2 text-center">{fileName}</span>
                        <span className="text-[10px] text-green-600 mt-1 font-semibold">Loaded Successfully</span>
                    </>
                ) : (
                    <>
                        {errorMsg ? (
                            <AlertCircle className="w-8 h-8 mb-2 text-red-500" />
                        ) : (
                            <Upload className={`w-6 h-6 mb-2 transition-transform duration-300 ${isDragging ? 'scale-110 -translate-y-1' : ''}`} />
                        )}
                        <span className={`text-xs font-medium ${errorMsg ? 'text-red-600' : ''}`}>
                            {errorMsg ? 'Import Failed' : (isDragging ? 'Drop file here' : 'Click to Upload')}
                        </span>
                        <span className="text-[10px] text-gray-400 mt-1">{errorMsg ? 'Click to retry' : 'Excel or CSV'}</span>
                    </>
                )}
            </div>
        </div>
      </div>

      {/* History Section */}
      {history.length > 0 && (
          <div className="mb-6">
               <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Recent History
                    </h3>
                    <button 
                        onClick={onClearHistory}
                        className="text-[10px] text-gray-400 hover:text-red-500 transition-colors"
                        title="Clear History"
                    >
                        Clear
                    </button>
               </div>
               <div className="space-y-2">
                   {history.map(item => (
                       <button
                         key={item.id}
                         onClick={() => onLoadHistory(item)}
                         className="w-full text-left p-2.5 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-lg transition-all group flex items-start space-x-2"
                       >
                           <RotateCcw className="w-4 h-4 text-gray-400 group-hover:text-blue-500 mt-0.5" />
                           <div className="flex-1 min-w-0">
                               <p className="text-xs font-medium text-gray-700 group-hover:text-blue-700 truncate">
                                   {item.name}
                               </p>
                               <p className="text-[10px] text-gray-400 mt-0.5">
                                   {new Date(item.timestamp).toLocaleTimeString()} · {new Date(item.timestamp).toLocaleDateString()}
                               </p>
                           </div>
                       </button>
                   ))}
               </div>
          </div>
      )}

      {/* Active Series */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Datasets</h3>
            {data.series.length > 0 && (
                <button 
                    type="button"
                    onClick={handleClearAll}
                    className="text-[10px] text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
                >
                    <RefreshCcw className="w-3 h-3" /> Reset View
                </button>
            )}
        </div>
        
        {data.series.length === 0 ? (
            <div className="text-gray-400 text-xs text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                No active data series
            </div>
        ) : (
            <div className="space-y-2 pb-4">
                {data.series.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 shadow-sm transition-colors group">
                        <div className="flex items-center space-x-3 overflow-hidden">
                            <div className="w-3 h-3 shrink-0 rounded-full ring-2 ring-offset-1 ring-gray-100" style={{ backgroundColor: s.color }} />
                            <span className="text-gray-700 font-medium truncate text-xs" title={s.name}>{s.name}</span>
                        </div>
                        <div className="flex items-center">
                            <button 
                                type="button"
                                onClick={(e) => toggleSeries(e, s.id)} 
                                className="text-gray-400 hover:text-gray-800 transition-colors shrink-0 ml-2 p-1"
                            >
                                {s.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            <button 
                                type="button"
                                onClick={(e) => handleDelete(e, s.id)} 
                                className="text-gray-300 hover:text-red-500 transition-colors shrink-0 ml-1 p-1 hover:bg-red-50 rounded" 
                                title="Delete Dataset"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-400">
        <p>Lumetric 3D Engine v1.8</p>
      </div>
    </div>
  );
};

export default Sidebar;
