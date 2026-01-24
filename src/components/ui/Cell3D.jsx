import { useRef, useState } from 'react';
import { Text, RoundedBox } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';

export function Cell3D({ value, fixed, onClick, position, isSelected }) {
    const [hovered, setHover] = useState(false);

    const { scale, color, emissive } = useSpring({
        scale: hovered || isSelected ? 1.15 : 1,
        color: isSelected ? '#ff00ff' : hovered ? '#00ffff' : fixed ? '#1a1a1a' : '#0a0a0a',
        emissive: isSelected ? '#ff00ff' : hovered ? '#00ffff' : '#000000',
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
            {/* Glassy Cube Base */}
            <RoundBox args={[0.92, 0.92, 0.1]} radius={0.05} smoothness={4}>
                <animated.meshPhysicalMaterial
                    color={color}
                    emissive={emissive}
                    emissiveIntensity={isSelected || hovered ? 0.8 : 0}
                    metalness={0.9}
                    roughness={0.1}
                    transparent
                    opacity={0.8}
                    transmission={0.5}
                    thickness={1}
                />
            </RoundBox>

            {/* Border Glow (Ring) */}
            {(isSelected || hovered) && (
                <mesh position={[0, 0, -0.05]}>
                    <planeGeometry args={[1.1, 1.1]} />
                    <meshBasicMaterial color={isSelected ? "#ff00ff" : "#00ffff"} transparent opacity={0.3} />
                </mesh>
            )}

            {value !== 0 && (
                <Text
                    position={[0, -0.05, 0.06]}
                    fontSize={0.6}
                    font="https://fonts.gstatic.com/s/orbitron/v25/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nygy6Bm-7Z.woff" // Direct font URL for example or local
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor={fixed ? "#000000" : "#ff00ff"}
                >
                    {value}
                </Text>
            )}
        </animated.group>
    );
}

// Helper wrapper since RoundedBox is from drei but we used animated.mesh before
function RoundBox({ args, radius, smoothness, children }) {
    return (
        <RoundedBox args={args} radius={radius} smoothness={smoothness}>
            {children}
        </RoundedBox>
    )
}
