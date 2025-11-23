import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { ChartData } from '../../types';
import { getValueColor } from '../../utils/colors';

interface LollipopChartProps {
  data: ChartData;
  opacity: number;
}

const LollipopChart3D: React.FC<LollipopChartProps> = ({ data, opacity }) => {
  const visibleSeries = data.series.filter(s => s.visible);
  
  // Calculate Min/Max for color scaling
  const { min, max } = useMemo(() => {
    let minVal = Infinity;
    let maxVal = -Infinity;
    let hasData = false;
    visibleSeries.forEach(s => {
        s.data.forEach(d => {
            hasData = true;
            if (d.value < minVal) minVal = d.value;
            if (d.value > maxVal) maxVal = d.value;
        });
    });
    return hasData ? { min: minVal, max: maxVal } : { min: 0, max: 100 };
  }, [visibleSeries]);
  
  // Layout constants
  const spacingX = 1.5;
  const spacingZ = 1.5;
  const offsetX = -((data.categories.length * spacingX) / 2);
  const offsetZ = -((visibleSeries.length * spacingZ) / 2);

  return (
    <group position={[offsetX, 0, offsetZ]}>
      {/* Floor Grid */}
      <gridHelper args={[30, 30, 0xdddddd, 0xeeeeee]} position={[-offsetX, -0.05, -offsetZ]} />

      {data.categories.map((category, catIndex) => (
        <group key={catIndex} position={[catIndex * spacingX, 0, 0]}>
            {/* Category Label with Staggering and Truncation */}
            <Text 
                position={[0, 0, visibleSeries.length * spacingZ + 0.5 + (catIndex % 2) * 1.0]} 
                rotation={[-Math.PI / 2, 0, 0]} 
                fontSize={0.35} 
                color="#1f2937" 
                anchorX="center"
            >
                {category.length > 14 ? category.substring(0, 14) + '...' : category}
            </Text>

            {visibleSeries.map((series, seriesIndex) => {
                const dataPoint = series.data.find(d => d.category === category);
                const value = dataPoint ? dataPoint.value : 0;
                // Max height 8 units
                const maxVisualHeight = 8;
                const height = 0.1 + (value / (max || 1)) * maxVisualHeight;

                const color = getValueColor(value, min, max, series.color);

                return (
                    <AnimatedLollipop 
                        key={series.id}
                        position={[0, 0, seriesIndex * spacingZ]}
                        height={height}
                        color={color}
                        opacity={opacity}
                        value={value}
                    />
                );
            })}
        </group>
      ))}

        {/* Legend */}
        {visibleSeries.map((series, i) => (
             <Text 
                key={`legend-${i}`}
                position={[-1.5, 0.1, i * spacingZ]} 
                rotation={[-Math.PI / 2, 0, 0]} 
                fontSize={0.3} 
                color={series.color}
                anchorX="right"
            >
                {series.name.length > 15 ? series.name.substring(0, 15) + '...' : series.name}
            </Text>
        ))}
    </group>
  );
};

const AnimatedLollipop = ({ position, height, color, opacity, value }: any) => {
    // Spring animation for the "growth"
    const { progress } = useSpring({
        from: { progress: 0 },
        to: { progress: 1 },
        config: { mass: 1, tension: 120, friction: 14 }
    });

    // Determine sizes
    const stickRadius = 0.05;
    const ballRadius = 0.35;
    const actualHeight = Math.max(0.1, height); // Prevent 0 height errors

    return (
        <group position={position}>
            {/* The Stem (Cylinder) */}
            <animated.mesh 
                position-y={progress.to(p => (actualHeight * p) / 2)} 
                scale-y={progress.to(p => actualHeight * p)}
            >
                <cylinderGeometry args={[stickRadius, stickRadius, 1, 8]} />
                <meshStandardMaterial color={color} transparent opacity={opacity} />
            </animated.mesh>

            {/* The Head (Sphere) */}
            <animated.mesh position-y={progress.to(p => actualHeight * p)}>
                <sphereGeometry args={[ballRadius, 32, 32]} />
                <meshStandardMaterial 
                    color={color} 
                    roughness={0.1}
                    metalness={0.1}
                    transparent 
                    opacity={opacity} 
                />
            </animated.mesh>

            {/* Value Label (Floating above ball) */}
            <animated.group position-y={progress.to(p => actualHeight * p + 0.6)}>
                 <Text fontSize={0.25} color="#374151">
                    {Math.round(value)}
                </Text>
            </animated.group>
        </group>
    );
};

export default LollipopChart3D;