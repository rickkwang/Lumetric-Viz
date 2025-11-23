
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Text, Billboard } from '@react-three/drei';
import { ChartData } from '../../types';

interface SurfaceChartProps {
  data: ChartData;
  opacity: number;
}

const SurfaceChart3D: React.FC<SurfaceChartProps> = ({ data, opacity }) => {
  const visibleSeries = data.series.filter(s => s.visible);
  
  // Configuration for Radial Surface
  // Set innerRadius to 0 to eliminate the hole in the center
  const innerRadius = 0; 
  const outerRadius = 9;   // Max edge
  const heightScale = 0.1;

  // Generate the custom terrain geometry using Polar Coordinates
  const { geometry, colors } = useMemo(() => {
    if (visibleSeries.length < 1 || data.categories.length < 2) {
        return { geometry: new THREE.BufferGeometry(), colors: new Float32Array() };
    }

    const numRings = visibleSeries.length;
    // We add 1 to columns to close the loop (connect last category back to first)
    const numSpokes = data.categories.length; 
    const numSpokesExtended = numSpokes + 1; 
    
    const vertices = [];
    const indices = [];
    const colorBuffer = [];

    // 1. Generate Vertices and Colors
    for (let r = 0; r < numRings; r++) {
        // Calculate Radius for this Series
        const rNorm = numRings > 1 ? r / (numRings - 1) : 0.5;
        // If innerRadius is 0, the first series (r=0) is at the center (radius=0)
        const radius = innerRadius + rNorm * (outerRadius - innerRadius);

        for (let s = 0; s < numSpokesExtended; s++) {
            // Logic to wrap around: index modulo length
            const dataIndex = s % numSpokes;
            
            // Angle: 0 to 2PI
            const angle = (s / numSpokes) * Math.PI * 2;
            
            // Height
            const value = visibleSeries[r].data[dataIndex]?.value || 0;
            const y = value * heightScale;

            // Polar to Cartesian
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            vertices.push(x, y, z);

            // Color based on series color
            const c = new THREE.Color(visibleSeries[r].color);
            // Slight gradient based on height for definition
            c.offsetHSL(0, 0, (value / 100) * 0.1); 
            colorBuffer.push(c.r, c.g, c.b);
        }
    }

    // 2. Generate Indices (Triangulation)
    for (let r = 0; r < numRings - 1; r++) {
        for (let s = 0; s < numSpokesExtended - 1; s++) {
            // Grid indices
            const currentRow = r * numSpokesExtended;
            const nextRow = (r + 1) * numSpokesExtended;

            const a = currentRow + s;
            const b = currentRow + (s + 1);
            const c = nextRow + s;
            const d = nextRow + (s + 1);

            // Triangle 1
            indices.push(a, c, b);
            // Triangle 2
            indices.push(b, c, d);
        }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colorBuffer, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    return { geometry: geo, colors: colorBuffer };

  }, [visibleSeries, data.categories, heightScale]);

  return (
    <group>
      {/* Floor Grid (Circular) */}
      <polarGridHelper args={[outerRadius + 1, 16, 8, 64, 0xdddddd, 0xeeeeee]} position={[0, -0.1, 0]} />

      {/* The Surface Mesh */}
      {visibleSeries.length > 0 && (
        <group>
            {/* Solid Mesh with Vertex Colors */}
            <mesh geometry={geometry}>
                <meshStandardMaterial 
                    vertexColors 
                    side={THREE.DoubleSide} 
                    transparent 
                    opacity={opacity} 
                    roughness={0.4}
                    metalness={0.2}
                />
            </mesh>
            {/* Wireframe Overlay for structure */}
            <mesh geometry={geometry}>
                <meshBasicMaterial 
                    color="white" 
                    wireframe 
                    transparent 
                    opacity={0.15} 
                />
            </mesh>
        </group>
      )}

      {/* Category Labels (Spokes) */}
      {data.categories.map((cat, i) => {
          const angle = (i / data.categories.length) * Math.PI * 2;
          const labelRadius = outerRadius + 1.2;
          const x = Math.cos(angle) * labelRadius;
          const z = Math.sin(angle) * labelRadius;
          
          return (
            <group key={`cat-${i}`} position={[x, 0, z]}>
                <Text 
                    color="#4b5563" 
                    fontSize={0.35} 
                    anchorX="center" 
                    anchorY="middle"
                    // Rotate label to be readable but aligned nicely
                    rotation={[-Math.PI / 2, 0, angle + Math.PI / 2]} 
                >
                     {cat.length > 12 ? cat.substring(0, 12) + '...' : cat}
                </Text>
            </group>
          );
      })}

      {/* Series Labels (Placed radially) */}
      {visibleSeries.map((s, i) => {
          const rNorm = visibleSeries.length > 1 ? i / (visibleSeries.length - 1) : 0.5;
          const r = innerRadius + rNorm * (outerRadius - innerRadius);
          
          // If r is 0 (center), lift it up significantly so it floats above the peak
          // Also apply a slight offset to avoid Z-fighting if multiple labels are at center
          const isCenter = r < 0.1;
          const yPos = isCenter ? 3 + (i * 0.2) : 0.5; 
          const zOffset = isCenter ? 0 : 0.2;

          return (
             <group key={`label-${s.id}`} position={[r, yPos, 0]}>
                <Billboard>
                    <Text
                        fontSize={0.28}
                        color={s.color}
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.02}
                        outlineColor="#ffffff"
                    >
                        {s.name}
                    </Text>
                </Billboard>
             </group>
          )
      })}

      {visibleSeries.length < 2 && (
          <Billboard position={[0, 5, 0]}>
             <Text fontSize={0.4} color="#ef4444" anchorX="center" outlineWidth={0.02} outlineColor="white">
                 Add more series for full 3D terrain effect
             </Text>
          </Billboard>
      )}
    </group>
  );
};

export default SurfaceChart3D;
