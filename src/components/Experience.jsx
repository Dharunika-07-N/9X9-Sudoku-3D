import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ParallaxCamera } from './ParallaxCamera';
import { NeoTokyo } from './worlds/NeoTokyo';
import { Rain } from './effects/Rain';
import { SudokuBoard3D } from './ui/SudokuBoard3D';
import { GamePostProcessing } from './effects/PostProcessing';
import ParticleSystem from './effects/ParticleSystem';
import { Environment } from '@react-three/drei';
import { usePerformance } from '../hooks/usePerformance';

function SceneContent({ board, initialBoard, onCellClick, selectedCell, isLightMode }) {
    const particleRef = useRef();
    const tier = usePerformance();

    const handleCellInteract = (r, c) => {
        onCellClick(r, c);
        if (particleRef.current && tier > 0) {
            const burstColor = isLightMode ? '#0066cc' : '#00ffff';
            particleRef.current.burst([c - 4, 4 - r, 0], burstColor, tier === 0 ? 5 : 20);
        }
    };

    return (
        <>
            <color attach="background" args={[isLightMode ? '#f0f8ff' : '#050005']} />
            <ParallaxCamera />

            <ambientLight intensity={isLightMode ? 0.8 : 0.2} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color={isLightMode ? "#ffffff" : "#ff00ff"} />
            <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={1} color={isLightMode ? "#0066cc" : "#00ffff"} />

            <group position={[0, 0, -2]}>
                <SudokuBoard3D
                    board={board}
                    initialBoard={initialBoard}
                    onCellClick={handleCellInteract}
                    selectedCell={selectedCell}
                    isLightMode={isLightMode}
                />
            </group>

            {/* <ParticleSystem ref={particleRef} isLightMode={isLightMode} /> */}

            <NeoTokyo isLightMode={isLightMode} />
            {/* {tier > 0 && !isLightMode && <Rain />} */}

            {tier > 1 && <GamePostProcessing />}

            <Environment preset={isLightMode ? "sunset" : "night"} />
        </>
    );
}

export function Experience(props) {
    return (
        <Canvas
            gl={{ antialias: false, pixelRatio: window.devicePixelRatio, stencil: false, depth: true }}
            style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 0 }}
            camera={{ position: [0, 0, 10], fov: 60 }}
        >
            <SceneContent {...props} />
        </Canvas>
    );
}
