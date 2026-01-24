import { useRef, useState } from 'react';
import { Text } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';

export function Cell3D({ value, fixed, onClick, position, isSelected }) {
    const [hovered, setHover] = useState(false);

    const { scale, color } = useSpring({
        scale: hovered || isSelected ? 1.1 : 1,
        color: isSelected ? '#ff00ff' : hovered ? '#00ffff' : fixed ? '#444444' : '#222222',
        config: { tension: 300, friction: 10 }
    });

    return (
        <animated.mesh
            position={position}
            scale={scale}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <boxGeometry args={[0.9, 0.9, 0.2]} />
            <animated.meshStandardMaterial color={color} transparent opacity={0.9} />

            {value !== 0 && (
                <Text
                    position={[0, 0, 0.11]} // Slightly inside/above
                    fontSize={0.5}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    {value}
                </Text>
            )}
        </animated.mesh>
    );
}
