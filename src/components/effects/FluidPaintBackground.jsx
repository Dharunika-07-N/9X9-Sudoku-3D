import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleField = ({ isLightMode }) => {
    const { mouse, viewport } = useThree();
    const pointsRef = useRef();

    // Create 4000 particles
    const count = 4000;
    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const originalPositions = new Float32Array(count * 3);

        const color1 = new THREE.Color(isLightMode ? '#0066cc' : '#00ffff');
        const color2 = new THREE.Color(isLightMode ? '#ff9900' : '#ff00ff');

        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 12;
            const y = (Math.random() - 0.5) * 25;
            const z = (Math.random() - 0.5) * 5;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            originalPositions[i * 3] = x;
            originalPositions[i * 3 + 1] = y;
            originalPositions[i * 3 + 2] = z;

            const mixedColor = color1.clone().lerp(color2, Math.random());
            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;

            sizes[i] = Math.random() * 0.15 + 0.05;
        }

        return { positions, colors, sizes, originalPositions };
    }, [isLightMode]);

    useFrame((state) => {
        const positions = pointsRef.current.geometry.attributes.position.array;
        const colors = pointsRef.current.geometry.attributes.color.array;
        const mouseX = (mouse.x * viewport.width) / 2;
        const mouseY = (mouse.y * viewport.height) / 2;
        const time = state.clock.getElapsedTime();

        for (let i = 0; i < count; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            // Base animation (slight drift)
            positions[ix] += Math.sin(time + i) * 0.002;
            positions[iy] += Math.cos(time + i) * 0.002;

            // Interaction with mouse (Burst away like paint)
            const dx = positions[ix] - mouseX;
            const dy = positions[iy] - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 2.0) {
                const force = (2.0 - dist) * 0.15;
                positions[ix] += (dx / dist) * force;
                positions[iy] += (dy / dist) * force;

                // Color bursting - make them glow brighter when hit
                colors[ix] += 0.05;
                colors[iy] += 0.02;
                colors[iz] += 0.05;
            } else {
                // Return to original positions slowly
                positions[ix] += (particles.originalPositions[ix] - positions[ix]) * 0.02;
                positions[iy] += (particles.originalPositions[iy] - positions[iy]) * 0.02;
                positions[iz] += (particles.originalPositions[iz] - positions[iz]) * 0.02;

                // Return colors slowly
                const colorTarget = new THREE.Color(isLightMode ? '#0066cc' : '#00ffff').lerp(new THREE.Color(isLightMode ? '#ff9900' : '#ff00ff'), (i % 10) / 10);
                colors[ix] += (colorTarget.r - colors[ix]) * 0.05;
                colors[iy] += (colorTarget.g - colors[iy]) * 0.05;
                colors[iz] += (colorTarget.b - colors[iz]) * 0.05;
            }
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        pointsRef.current.geometry.attributes.color.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={particles.positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={count}
                    array={particles.colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.12}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation={true}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

export const FluidPaintBackground = ({ isLightMode }) => {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', background: 'transparent' }}>
            <Canvas camera={{ position: [0, 0, 8], fov: 75 }} dpr={[1, 2]}>
                <ambientLight intensity={0.5} />
                <ParticleField isLightMode={isLightMode} />
            </Canvas>
        </div>
    );
};
