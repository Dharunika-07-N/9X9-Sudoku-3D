import { Canvas } from '@react-three/fiber';
import { ParallaxCamera } from './ParallaxCamera';
import { OrbitControls } from '@react-three/drei';

export function Experience() {
    return (
        <Canvas
            gl={{ antialias: true, pixelRatio: window.devicePixelRatio }}
            style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: -1 }}
        >
            <color attach="background" args={['#000000']} />

            <ParallaxCamera />

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#ff00ff" />

            {/* Test Object for Parallax */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#00ffff" wireframe />
            </mesh>

            {/* Grid Floor Reference */}
            <gridHelper args={[20, 20, 0xff00ff, 0x222222]} rotation={[Math.PI / 2, 0, 0]} />
        </Canvas>
    );
}
