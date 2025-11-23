import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text, Line } from '@react-three/drei';
import { ChartData, Series } from '../../types';

interface RadialChartProps {
  data: ChartData;
  opacity: number;
}

const RadialChart3D: React.FC<RadialChartProps> = ({ data, opacity }) => {
  const groupRef = useRef<THREE.Group>(null);
  const radius = 6; // Max radius of the chart
  const maxValue = 100; // Normalization base

  const angleStep = (Math.PI * 2) / data.categories.length;

  // Helper to get coordinates
  const getCoordinates = (value: number, index: number, offsetY: number = 0) => {
    const angle = index * angleStep;
    const r = (value / maxValue) * radius;
    return new THREE.Vector3(Math.cos(angle) * r, offsetY, Math.sin(angle) * r);
  };

  // Grid Lines (Concentric polygons)
  const GridLines = () => {
    const rings = [0.25, 0.5, 0.75, 1.0];
    return (
      <group>
        {rings.map((r, ringIdx) => {
          const points = data.categories.map((_, i) => {
            const angle = i * angleStep;
            const dist = r * radius;
            return new THREE.Vector3(Math.cos(angle) * dist, -0.1, Math.sin(angle) * dist);
          });
          // Close the loop
          points.push(points[0]);

          return (
            <Line
              key={`grid-${ringIdx}`}
              points={points}
              color="#d1d5db" // Lighter gray for white bg
              lineWidth={1}
              transparent
              opacity={0.5}
            />
          );
        })}
        {/* Spokes */}
        {data.categories.map((_, i) => {
           const angle = i * angleStep;
           const end = new THREE.Vector3(Math.cos(angle) * radius, -0.1, Math.sin(angle) * radius);
           return (
             <Line
              key={`spoke-${i}`}
              points={[new THREE.Vector3(0, -0.1, 0), end]}
              color="#d1d5db"
              lineWidth={1}
              transparent
              opacity={0.5}
             />
           );
        })}
      </group>
    );
  };

  // Category Labels
  const Labels = () => {
    return (
      <group>
        {data.categories.map((cat, i) => {
          const angle = i * angleStep;
          const labelRadius = radius + 1.2;
          const x = Math.cos(angle) * labelRadius;
          const z = Math.sin(angle) * labelRadius;
          return (
            <group key={`label-${i}`} position={[x, 0, z]}>
              <Text
                fontSize={0.35}
                color="#111827" // Dark text
                anchorX="center"
                anchorY="middle"
              >
                {cat.length > 14 ? cat.substring(0, 14) + '...' : cat}
              </Text>
            </group>
          );
        })}
      </group>
    );
  };

  return (
    <group ref={groupRef}>
      <GridLines />
      <Labels />
      {data.series.filter(s => s.visible).map((s, seriesIndex) => (
        <SeriesMesh 
          key={s.id} 
          series={s} 
          totalSeries={data.series.length} 
          index={seriesIndex} 
          categories={data.categories}
          getCoordinates={getCoordinates}
          globalOpacity={opacity}
        />
      ))}
    </group>
  );
};

const SeriesMesh = ({ series, totalSeries, index, categories, getCoordinates, globalOpacity }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Generate Geometry for the polygon
  const geometry = useMemo(() => {
    const pts = series.data.map((d: any, i: number) => getCoordinates(d.value, i));
    
    // Create a shape from points
    const shape = new THREE.Shape();
    shape.moveTo(pts[0].x, pts[0].z);
    for (let i = 1; i < pts.length; i++) {
      shape.lineTo(pts[i].x, pts[i].z);
    }
    shape.closePath();

    return new THREE.ShapeGeometry(shape);
  }, [series.data, getCoordinates]);

  // Animated Entrance or Hover effect could go here
  useFrame((state) => {
    if (meshRef.current) {
        // Subtle floating effect based on index to separate layers visually
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, index * 0.05, 0.1);
    }
  });

  return (
    <group>
      {/* The filled polygon */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, index * 0.05, 0]}>
        <primitive object={geometry} />
        <meshStandardMaterial 
            color={series.color} 
            transparent 
            opacity={globalOpacity * 0.6} 
            side={THREE.DoubleSide} 
            depthWrite={false} // Prevents z-fighting glitches
        />
      </mesh>

      {/* The outline line */}
      <Line
        points={[...series.data.map((d: any, i: number) => getCoordinates(d.value, i, index * 0.05 + 0.02)), getCoordinates(series.data[0].value, 0, index * 0.05 + 0.02)]}
        color={series.color}
        lineWidth={3}
        transparent
        opacity={globalOpacity + 0.2}
      />

      {/* Vertex Points */}
      {series.data.map((d: any, i: number) => {
          const pos = getCoordinates(d.value, i, index * 0.05 + 0.02);
          return (
              <mesh key={`p-${i}`} position={pos}>
                  <sphereGeometry args={[0.08, 16, 16]} />
                  <meshStandardMaterial color={series.color} emissive={series.color} emissiveIntensity={0.2} />
              </mesh>
          )
      })}
    </group>
  );
};

export default RadialChart3D;