import { useRef, useLayoutEffect, useImperativeHandle, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleSystem = forwardRef((props, ref) => {
    const count = 1000;
    const mesh = useRef();
    const dummy = useRef(new THREE.Object3D());

    // Store particles: { x, y, z, vx, vy, vz, life, color }
    const particles = useRef([]);

    useLayoutEffect(() => {
        // Initialize pool
        for (let i = 0; i < count; i++) {
            particles.current.push({
                life: 0,
                x: 0, y: 0, z: 0,
                vx: 0, vy: 0, vz: 0,
                color: new THREE.Color()
            });
        }
    }, []);

    useFrame((state, delta) => {
        if (!mesh.current) return;

        let activeCount = 0;

        particles.current.forEach((p, i) => {
            if (p.life > 0) {
                p.life -= delta * 2; // Decay
                p.x += p.vx * delta * 5;
                p.y += p.vy * delta * 5;
                p.z += p.vz * delta * 5;

                // Gravity
                p.vy -= delta * 2;

                dummy.current.position.set(p.x, p.y, p.z);
                const scale = Math.max(0, p.life);
                dummy.current.scale.set(scale, scale, scale);
                dummy.current.updateMatrix();

                mesh.current.setMatrixAt(i, dummy.current.matrix);
                mesh.current.setColorAt(i, p.color);

                activeCount++;
            } else {
                // Hide inactive
                dummy.current.scale.set(0, 0, 0);
                dummy.current.updateMatrix();
                mesh.current.setMatrixAt(i, dummy.current.matrix);
            }
        });

        mesh.current.instanceMatrix.needsUpdate = true;
        mesh.current.instanceColor.needsUpdate = true;
    });

    // External API
    useImperativeHandle(ref, () => ({
        burst: (position, color = '#ff00ff', count = 20) => {
            let spawned = 0;
            const threeColor = new THREE.Color(color);

            for (let p of particles.current) {
                if (p.life <= 0 && spawned < count) {
                    p.life = 1.0 + Math.random() * 0.5;
                    p.x = position[0];
                    p.y = position[1];
                    p.z = position[2];

                    // Random velocity sphere
                    const phi = Math.random() * Math.PI * 2;
                    const theta = Math.random() * Math.PI;
                    const velocity = 1 + Math.random();

                    p.vx = Math.sin(theta) * Math.cos(phi) * velocity;
                    p.vy = Math.sin(theta) * Math.sin(phi) * velocity;
                    p.vz = Math.cos(theta) * velocity;

                    p.color.copy(threeColor);

                    spawned++;
                }
            }
        }
    }));

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial toneMapped={false} />
        </instancedMesh>
    );
});

export default ParticleSystem;
