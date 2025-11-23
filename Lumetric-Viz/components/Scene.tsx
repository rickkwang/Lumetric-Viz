import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { ChartData, ViewMode } from '../types';
import RadialChart3D from './Visualizations/RadialChart3D';
import BarChart3D from './Visualizations/BarChart3D';
import BubbleChart3D from './Visualizations/BubbleChart3D';
import TrendChart3D from './Visualizations/TrendChart3D';
import LollipopChart3D from './Visualizations/LollipopChart3D';
import SurfaceChart3D from './Visualizations/SurfaceChart3D';

interface SceneProps {
  data: ChartData;
  viewMode: ViewMode;
  isRotating: boolean;
  opacity: number;
}

const Scene: React.FC<SceneProps> = ({ data, viewMode, isRotating, opacity }) => {
  return (
    <div className="w-full h-full bg-gray-50">
      <Canvas shadows camera={{ position: [8, 8, 12], fov: 45 }}>
        {/* Lighter fog for white background */}
        <fog attach="fog" args={['#f9fafb', 5, 40]} />
        
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 20, 10]} intensity={1.5} castShadow />
        <spotLight position={[-10, 15, -10]} angle={0.3} penumbra={1} intensity={1} />
        
        {/* Environment appropriate for studio/light settings */}
        <Environment preset="studio" />

        <group position={[0, -1, 0]}>
           {viewMode === ViewMode.RADIAL && <RadialChart3D data={data} opacity={opacity} />}
           {viewMode === ViewMode.BARS && <BarChart3D data={data} opacity={opacity} />}
           {viewMode === ViewMode.BUBBLES && <BubbleChart3D data={data} opacity={opacity} />}
           {viewMode === ViewMode.TRENDS && <TrendChart3D data={data} opacity={opacity} />}
           {viewMode === ViewMode.LOLLIPOP && <LollipopChart3D data={data} opacity={opacity} />}
           {viewMode === ViewMode.SURFACE && <SurfaceChart3D data={data} opacity={opacity} />}
        </group>
        
        {/* Stronger, darker shadows for contrast on white floor */}
        <ContactShadows position={[0, -0.1, 0]} opacity={0.4} scale={30} blur={2.5} far={5} color="#000000" />

        <OrbitControls 
            autoRotate={isRotating} 
            autoRotateSpeed={0.5} 
            enablePan={true} 
            enableZoom={true} 
            maxPolarAngle={Math.PI / 2 - 0.05} // Prevent going below ground
        />
      </Canvas>
    </div>
  );
};

export default Scene;