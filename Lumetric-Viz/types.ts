
export enum ViewMode {
  RADIAL = 'Radial',
  BARS = 'Bars',
  BUBBLES = 'Bubbles',
  TRENDS = 'Trends',
  LOLLIPOP = 'Lollipop',
  SURFACE = 'Surface'
}

export interface DataPoint {
  category: string;
  value: number;
}

export interface Series {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  data: DataPoint[];
}

export interface ChartData {
  categories: string[];
  series: Series[];
}

export interface HistoryItem {
  id: string;
  name: string;
  timestamp: number;
  data: ChartData;
}

export interface AppState {
  viewMode: ViewMode;
  isRotating: boolean;
  showLabels: boolean;
  opacity: number;
}

// Augment the global JSX namespace to include React Three Fiber elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      primitive: any;
      meshStandardMaterial: any;
      sphereGeometry: any;
      bufferGeometry: any;
      lineBasicMaterial: any;
      gridHelper: any;
      boxGeometry: any;
      meshPhysicalMaterial: any;
      fog: any;
      ambientLight: any;
      pointLight: any;
      spotLight: any;
      cylinderGeometry: any; 
      planeGeometry: any;
      polarGridHelper: any;
    }
  }
}
