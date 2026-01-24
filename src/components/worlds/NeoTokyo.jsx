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
            const x = (Math.random() - 0.5) * 80;
            const z = (Math.random() - 0.5) * 50 - 40; // Push further back: -65 to -15 range
            const y = Math.random() * 5 + 2;
            temp.push({ x, z, scale: [Math.random() * 2 + 2, y * 5, Math.random() * 2 + 2] });
        }
        return temp;
    }, []);

    useFrame(() => {
        if (!meshRef.current) return;
    });

    useMemo(() => { }, []);

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

    const color = isLightMode ? "#e0e0e0" : "#1a0b2e";
    const emissive = isLightMode ? "#ffffff" : "#4b0082";
    const fogColor = isLightMode ? "#f0f8ff" : "#050005";

    return (
        <group>
            <instancedMesh ref={meshRef} args={[null, null, count]}>
                <boxGeometry />
                <meshStandardMaterial
                    color={color}
                    emissive={emissive}
                    emissiveIntensity={0.5}
                    roughness={0.2}
                    metalness={0.8}
                />
            </instancedMesh>



            <fog attach="fog" args={[fogColor, 10, 60]} />
        </group>
    );
}
