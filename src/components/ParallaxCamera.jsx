import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

export function ParallaxCamera() {
    const cameraRef = useRef();

    useFrame((state) => {
        if (!cameraRef.current) return;

        // Smooth dampening is implied by "Buttery smooth", but for strict "moves with cursor":
        // Design doc: camera.position.x = mouse.x * 2;
        // We can use lerp for smoothness.

        const { pointer } = state;
        const targetX = pointer.x * 2;
        const targetY = pointer.y * 2;

        // Lerp for smoothness (0.1 factor)
        cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.1;
        cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.1;

        cameraRef.current.lookAt(0, 0, 0);
    });

    return <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 0, 10]} fov={75} />;
}
