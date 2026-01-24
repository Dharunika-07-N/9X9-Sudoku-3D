import { Canvas } from '@react-three/fiber';
import { ParallaxCamera } from './ParallaxCamera';
import { NeoTokyo } from './worlds/NeoTokyo';
import { Rain } from './effects/Rain';
import { Environment } from '@react-three/drei';

export function Experience() {
    return (
        <Canvas
            gl={{ antialias: true, pixelRatio: window.devicePixelRatio }}
            style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: -1 }}
        >
            <color attach="background" args={['#050005']} />

            <ParallaxCamera />

            {/* Dynamic Lighting */}
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#ff00ff" />
            <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={1} color="#00ffff" />

            {/* World Content */}
            <NeoTokyo />
            <Rain />

            {/* Environment reflections */}
            <Environment preset="night" />
        </Canvas>
    );
}
