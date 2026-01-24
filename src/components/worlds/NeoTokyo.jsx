import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function NeoTokyo({ isLightMode }) {
    const meshRef = useRef();
    const count = 200;

    const dummy = useMemo(() => new THREE.Object3D(), []);

    const buildings = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 50;
            const z = (Math.random() - 0.5) * 50 - 20;
            const y = Math.random() * 5 + 2;
            temp.push({ x, z, scale: [Math.random() * 2 + 1, y * 5, Math.random() * 2 + 1] });
        }
        return temp;
    }, []);

    useFrame(() => {
        if (!meshRef.current) return;

        buildings.forEach((data, i) => {
            dummy.position.set(data.x, -10, data.z);
            dummy.scale.set(data.scale[0], data.scale[1], data.scale[2]);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    const color = isLightMode ? "#e0e0e0" : "#220022";
    const emissive = isLightMode ? "#ffffff" : "#330033";
    const fogColor = isLightMode ? "#f0f8ff" : "#000000";

    return (
        <group>
            <instancedMesh ref={meshRef} args={[null, null, count]}>
                <boxGeometry />
                <meshStandardMaterial
                    color={color}
                    emissive={emissive}
                    emissiveIntensity={isLightMode ? 0.2 : 0.5}
                    roughness={0.2}
                    metalness={0.8}
                />
            </instancedMesh>

            {/* Grid Floor */}
            <gridHelper
                args={[100, 50, isLightMode ? 0x0066cc : 0xff00ff, isLightMode ? 0xcccccc : 0x00ffff]}
                position={[0, -10, 0]}
            />

            {/* Fog for depth */}
            <fog attach="fog" args={[fogColor, 10, 50]} />
        </group>
    );
}
