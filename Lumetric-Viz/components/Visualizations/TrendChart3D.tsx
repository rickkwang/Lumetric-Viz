import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Text, Line } from '@react-three/drei';
import { ChartData } from '../../types';

interface TrendChartProps {
  data: ChartData;
  opacity: number;
}

const TrendChart3D: React.FC<TrendChartProps> = ({ data, opacity }) => {
  const visibleSeries = data.series.filter(s => s.visible);
  
  const width = 12; // Total width of chart
  const height = 5; // Max height
  const depth = visibleSeries.length * 1.5;

  const xStep = width / (data.categories.length - 1);
  const zStep = 1.5;

  const offsetX = -width / 2;
  const offsetZ = -depth / 2;

  return (
    <group position={[offsetX, 0, offsetZ]}>
      {/* Base Grid */}
      <gridHelper 
        args={[20, 20, 0xdddddd, 0xeeeeee]} 
        position={[width/2 + offsetX, -0.05, depth/2 + offsetZ]} 
      />

      {/* Categories (X-Axis) with Staggering */}
      {data.categories.map((cat, i) => (
        <group key={`cat-${i}`} position={[i * xStep, 0, depth + 0.5 + (i % 2) * 0.8]}>
           <Text 
              rotation={[-Math.PI / 2, 0, Math.PI / 4]} 
              fontSize={0.3} 
              color="#374151"
              anchorX="right"
           >
             {cat.length > 14 ? cat.substring(0, 14) + '...' : cat}
           </Text>
           {/* Vertical Grid Line */}
           <Line 
             points={[new THREE.Vector3(0, 0, -(depth + (i % 2) * 0.8)), new THREE.Vector3(0, height, -(depth + (i % 2) * 0.8))]}
             color="#e5e7eb"
             lineWidth={1}
           />
        </group>
      ))}

      {visibleSeries.map((series, sIdx) => {
        const points = series.data.map((d, i) => {
            const x = i * xStep;
            const y = (d.value / 100) * height;
            const z = sIdx * zStep;
            return new THREE.Vector3(x, y, z);
        });

        return (
          <group key={series.id}>
             {/* The Trend Line */}
             <Line 
                points={points} 
                color={series.color} 
                lineWidth={4} 
                opacity={opacity}
                transparent
             />

             {/* Points on the line */}
             {points.map((pt, i) => (
                <group key={`pt-${i}`} position={pt}>
                    <mesh>
                        <sphereGeometry args={[0.15, 16, 16]} />
                        <meshStandardMaterial color={series.color} />
                    </mesh>
                    {/* Value Label */}
                    <Text position={[0, 0.4, 0]} fontSize={0.25} color="#374151">
                        {Math.round(series.data[i].value)}
                    </Text>
                </group>
             ))}

             {/* Series Label at start */}
             <Text 
                position={[-1, 0.5, sIdx * zStep]} 
                fontSize={0.35} 
                color={series.color} 
                anchorX="right"
             >
                {series.name.length > 15 ? series.name.substring(0, 15) + '...' : series.name}
            </Text>
          </group>
        );
      })}
    </group>
  );
};

export default TrendChart3D;