import { useRef, useState } from 'react';
import { Text } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';

export function Cell3D({ value, fixed, onClick, position, isSelected, isLightMode }) {
    const [hovered, setHover] = useState(false);

    // Theme Variables
    const colors = {
        selected: isLightMode ? '#0066cc' : '#ff00ff',
        hover: isLightMode ? '#00ccff' : '#00ffff',
        fixed: isLightMode ? '#eeeeee' : '#333333',
        empty: isLightMode ? '#ffffff' : '#111111',
        text: isLightMode ? '#1a1a2e' : '#ffffff',
        textOutline: isLightMode ? '#e0e0e0' : 'black',
        glow: isLightMode ? '#0066cc' : '#ff00ff'
    };

    const { scale, color, emissive } = useSpring({
        scale: hovered || isSelected ? 1.1 : 1,
        color: isSelected ? colors.selected : hovered ? colors.hover : fixed ? colors.fixed : colors.empty,
        emissive: isSelected ? colors.glow : hovered ? colors.hover : '#000000',
        config: { tension: 300, friction: 10 }
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
            <animated.mesh>
                <boxGeometry args={[0.9, 0.9, 0.1]} />
                <animated.meshStandardMaterial
                    color={color}
                    emissive={emissive}
                    emissiveIntensity={isSelected || hovered ? 0.8 : 0}
                    roughness={0.2}
                    metalness={0.5}
                />
            </animated.mesh>

            {(isSelected || hovered) && (
                <mesh position={[0, 0, -0.06]}>
                    <planeGeometry args={[1.1, 1.1]} />
                    <meshBasicMaterial color={isSelected ? colors.selected : colors.hover} transparent opacity={0.5} />
                </mesh>
            )}

            {value !== 0 && (
                <Text
                    position={[0, 0, 0.06]}
                    fontSize={0.6}
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
