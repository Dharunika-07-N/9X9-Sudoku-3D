import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Rain() {
    const count = 1000;
    const mesh = useRef();

    // Create random positions
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 40;     // x
            pos[i * 3 + 1] = Math.random() * 40 - 10;      // y high to low
            pos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10; // z
        }
        return pos;
    }, []);

    useFrame((state, delta) => {
        if (!mesh.current) return;
        const positions = mesh.current.geometry.attributes.position.array;

        for (let i = 0; i < count; i++) {
            // Move down
            positions[i * 3 + 1] -= 20 * delta;

            // Reset if too low
            if (positions[i * 3 + 1] < -20) {
                positions[i * 3 + 1] = 20;
            }
        }
        mesh.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#00ffff"
                size={0.1}
                transparent
                opacity={0.6}
            />
        </points>
    );
}
