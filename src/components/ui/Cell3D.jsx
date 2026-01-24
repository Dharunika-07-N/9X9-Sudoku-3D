import { useRef, useState } from 'react';
import { Text, RoundedBox } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';

export function Cell3D({ value, fixed, onClick, position, isSelected, isLightMode }) {
    const [hovered, setHover] = useState(false);

    // Theme Variables
    const colors = {
        selected: isLightMode ? '#0066cc' : '#ff00ff', // Blue vs Magenta
        hover: isLightMode ? '#00ccff' : '#00ffff',     // Cyan
        fixed: isLightMode ? '#eeeeee' : '#1a1a1a',     // Light Gray vs Dark Gray
        empty: isLightMode ? '#ffffff' : '#0a0a0a',     // White vs Black
        text: isLightMode ? '#1a1a2e' : '#ffffff',      // Navy vs White
        textOutline: isLightMode ? '#e0e0e0' : 'black',
        glow: isLightMode ? '#0066cc' : '#ff00ff'
    };

    const { scale, color, emissive } = useSpring({
        scale: hovered || isSelected ? 1.15 : 1,
        color: isSelected ? colors.selected : hovered ? colors.hover : fixed ? colors.fixed : colors.empty,
        emissive: isSelected ? colors.glow : hovered ? colors.hover : '#000000',
        config: { tension: 400, friction: 15 }
    });

    return (
        <animated.group
            position={position}
            scale={scale}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <RoundBox args={[0.92, 0.92, 0.1]} radius={0.05} smoothness={4}>
                <animated.meshPhysicalMaterial
                    color={color}
                    emissive={emissive}
                    emissiveIntensity={isSelected || hovered ? 0.5 : 0}
                    metalness={isLightMode ? 0.3 : 0.9} // Less metallic in light mode
                    roughness={0.1}
                    transparent
                    opacity={0.8}
                    transmission={0.5}
                    thickness={1}
                    clearcoat={isLightMode ? 1 : 0}
                />
            </RoundBox>

            {(isSelected || hovered) && (
                <mesh position={[0, 0, -0.05]}>
                    <planeGeometry args={[1.1, 1.1]} />
                    <meshBasicMaterial color={isSelected ? colors.selected : colors.hover} transparent opacity={0.3} />
                </mesh>
            )}

            {value !== 0 && (
                <Text
                    position={[0, -0.05, 0.06]}
                    fontSize={0.6}
                    font="https://fonts.gstatic.com/s/orbitron/v25/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nygy6Bm-7Z.woff"
                    color={colors.text}
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor={fixed ? colors.textOutline : colors.selected}
                >
                    {value}
                </Text>
            )}
        </animated.group>
    );
}

function RoundBox({ args, radius, smoothness, children }) {
    return (
        <RoundedBox args={args} radius={radius} smoothness={smoothness}>
            {children}
        </RoundedBox>
    )
}
