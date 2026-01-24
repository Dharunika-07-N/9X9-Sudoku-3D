import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ParallaxCamera } from './ParallaxCamera';
import { NeoTokyo } from './worlds/NeoTokyo';
import { Rain } from './effects/Rain';
import { SudokuBoard3D } from './ui/SudokuBoard3D';
import { GamePostProcessing } from './effects/PostProcessing';
import ParticleSystem from './effects/ParticleSystem';
import { Environment } from '@react-three/drei';

export function Experience({ board, initialBoard, onCellClick, selectedCell }) {
    const particleRef = useRef();

    const handleCellInteract = (r, c) => {
        onCellClick(r, c);
        // Trigger burst at cell location
        // Grid is centered, logic in SudokuBoard3D is [c - 4, 4 - r, 0]
        if (particleRef.current) {
            particleRef.current.burst([c - 4, 4 - r, 0], '#00ffff', 20);
        }
    };

    return (
        <Canvas
            gl={{ antialias: false, pixelRatio: window.devicePixelRatio, stencil: false, depth: true }}
            style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 0 }}
            camera={{ position: [0, 0, 10], fov: 60 }}
        >
            <color attach="background" args={['#050005']} />

            <ParallaxCamera />

            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#ff00ff" />
            <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={1} color="#00ffff" />

            <group position={[0, 0, -2]}>
                <SudokuBoard3D
                    board={board}
                    initialBoard={initialBoard}
                    onCellClick={handleCellInteract}
                    selectedCell={selectedCell}
                />
            </group>

            <ParticleSystem ref={particleRef} />

            <NeoTokyo />
            <Rain />

            <GamePostProcessing />

            <Environment preset="night" />
        </Canvas>
    );
}
