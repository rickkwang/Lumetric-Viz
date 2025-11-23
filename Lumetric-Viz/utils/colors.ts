
import * as THREE from 'three';

/**
 * Generates a color based on the value's position between min and max.
 * Interpolates the base color to create a gradient effect.
 * Optimized for Vibrant colors to prevent washing out to white.
 */
export const getValueColor = (value: number, min: number, max: number, baseColor: string): string => {
    // Avoid divide by zero
    const range = max - min || 1;
    // Normalize value 0..1
    const t = Math.max(0, Math.min(1, (value - min) / range));

    const color = new THREE.Color(baseColor);
    const hsl = { h: 0, s: 0, l: 0 };
    color.getHSL(hsl);

    // Vibrant Logic:
    // We want higher values to be brighter (Luminosity increase)
    // We want lower values to be richer/darker (Luminosity decrease)
    // We maintain Saturation to keep it "Vibrant"
    
    // Map t (0..1) to a shift in Lightness
    // Base lightness varies per color, so we apply a relative shift.
    // Range: -0.15 (darker) to +0.25 (lighter)
    let targetL = hsl.l + (t - 0.4) * 0.4;
    
    // Clamp to ensure color integrity (never pure black or pure white)
    targetL = Math.max(0.3, Math.min(0.8, targetL));

    const finalColor = new THREE.Color().setHSL(hsl.h, hsl.s, targetL);
    
    return "#" + finalColor.getHexString();
};
