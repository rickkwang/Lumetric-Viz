import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { ChartData } from '../../types';

interface BubbleChartProps {
  data: ChartData;
  opacity: number;
}

const BubbleChart3D: React.FC<BubbleChartProps> = ({ data, opacity }) => {
  const visibleSeries = data.series.filter(s => s.visible);
  
  // Random scattering logic seeded by index to be deterministic but chaotic
  const getPosition = (catIdx: number, seriesIdx: number, value: number) => {
      // Use category for X, Series for Z, Value for Y
      const x = (catIdx - data.categories.length / 2) * 2;
      const z = (seriesIdx - visibleSeries.length / 2) * 2;
      const y = (value / 100) * 5; 
      return [x, y, z];
  };

  return (
    <group>
        {/* Axis Lines */}
        <line>
            <bufferGeometry attach="geometry" onUpdate={self => {
                const pts = [new THREE.Vector3(-10, 0, 0), new THREE.Vector3(10, 0, 0)];
                self.setFromPoints(pts);
            }}/>
            <lineBasicMaterial color="#ccc" />
        </line>

      {visibleSeries.map((series, sIdx) => (
        <group key={series.id}>
          {series.data.map((point, cIdx) => {
             const [x, y, z] = getPosition(cIdx, sIdx, point.value);
             const size = (point.value / 100) * 0.8; // Bubble size based on value

             return (
               <Float key={`${series.id}-${point.category}`} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                 <group position={[x, y, z]}>
                    <mesh>
                        <sphereGeometry args={[size, 32, 32]} />
                        <meshPhysicalMaterial 
                            color={series.color} 
                            transmission={0.4} 
                            thickness={1.5}
                            roughness={0.1}
                            clearcoat={1}
                            transparent 
                            opacity={opacity} 
                        />
                    </mesh>
                    <Text position={[0, size + 0.3, 0]} fontSize={0.25} color="#111827">
                        {point.category.length > 10 ? point.category.substring(0, 10) + '...' : point.category}
                    </Text>
                    <Text position={[0, size + 0.6, 0]} fontSize={0.2} color={series.color}>
                         {Math.round(point.value)}
                    </Text>
                 </group>
               </Float>
             );
          })}
        </group>
      ))}
    </group>
  );
};

export default BubbleChart3D;