import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { ChartData } from '../../types';
import { getValueColor } from '../../utils/colors';

interface BarChartProps {
  data: ChartData;
  opacity: number;
}

const BarChart3D: React.FC<BarChartProps> = ({ data, opacity }) => {
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
                    position={[0, 0, visibleSeries.length * spacingZ + 0.5 + (catIndex % 2) * 0.8]} 
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
                    
                    // Normalize height: max height 8 units
                    const maxVisualHeight = 8;
                    // Avoid divide by zero
                    const heightRatio = max === min ? 0.5 : (value - min) / (max - min); 
                    // Base min height 0.1 so it doesn't disappear
                    const height = 0.1 + (value / (max || 1)) * maxVisualHeight;
                    
                    const barColor = getValueColor(value, min, max, series.color);

                    return (
                        <AnimatedBar 
                            key={series.id}
                            position={[0, 0, seriesIndex * spacingZ]} // X, Z relative to group. Y handled in component
                            width={0.8}
                            height={height}
                            depth={0.8}
                            color={barColor}
                            opacity={opacity}
                            value={value}
                        />
                    );
                })}
            </group>
        ))}

        {/* Legend / Series Labels */}
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

const AnimatedBar = ({ position, width, height, depth, color, opacity, value }: any) => {
    const { scaleY } = useSpring({
        from: { scaleY: 0 },
        to: { scaleY: 1 },
        config: { mass: 1, tension: 170, friction: 26 }
    });

    return (
        <group position={position}>
            {/* 
               We scale the mesh from 0 to 1 on Y axis.
               To make it grow from bottom, we shift position Y up by half of the current height.
               Current Height = height * scaleY
               Center Y = Current Height / 2
            */}
            <animated.mesh 
                position-y={scaleY.to(s => (height * s) / 2)} 
                scale-y={scaleY}
            >
                <boxGeometry args={[width, height, depth]} />
                <meshStandardMaterial color={color} transparent opacity={opacity} />
            </animated.mesh>
             {/* Value Label on top */}
             <animated.group position-y={scaleY.to(s => height * s + 0.3)}>
                <Text fontSize={0.25} color="#374151">
                    {Math.round(value)}
                </Text>
             </animated.group>
        </group>
    );
};

export default BarChart3D;