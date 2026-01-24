import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function NeoTokyo() {
    const meshRef = useRef();
    const count = 200;

    const dummy = useMemo(() => new THREE.Object3D(), []);

    const buildings = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 50;
            const z = (Math.random() - 0.5) * 50 - 20; // Push back a bit
            const y = Math.random() * 5 + 2; // Height
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

    return (
        <group>
            {/* City Instances */}
            <instancedMesh ref={meshRef} args={[null, null, count]}>
                <boxGeometry />
                <meshStandardMaterial color="#220022" emissive="#330033" emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
            </instancedMesh>

            {/* Grid Floor */}
            <gridHelper args={[100, 50, 0xff00ff, 0x00ffff]} position={[0, -10, 0]} />

            {/* Fog for depth */}
            <fog attach="fog" args={['#000000', 10, 50]} />
        </group>
    );
}
