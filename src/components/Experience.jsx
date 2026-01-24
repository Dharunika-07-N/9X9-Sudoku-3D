import { Canvas } from '@react-three/fiber';
import { ParallaxCamera } from './ParallaxCamera';
import { NeoTokyo } from './worlds/NeoTokyo';
import { Rain } from './effects/Rain';
import { SudokuBoard3D } from './ui/SudokuBoard3D';
import { Environment } from '@react-three/drei';

export function Experience({ board, initialBoard, onCellClick, selectedCell }) {
    return (
        <Canvas
            gl={{ antialias: true, pixelRatio: window.devicePixelRatio }}
            style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 0 }}
            camera={{ position: [0, 0, 10], fov: 60 }} // Explicit initial camera
        >
            <color attach="background" args={['#050005']} />

            <ParallaxCamera />

            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#ff00ff" />
            <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={1} color="#00ffff" />

            <group position={[0, 0, -2]}> {/* Push board back slightly or keep at 0 */}
                <SudokuBoard3D
                    board={board}
                    initialBoard={initialBoard}
                    onCellClick={onCellClick}
                    selectedCell={selectedCell}
                />
            </group>

            <NeoTokyo />
            <Rain />

            <Environment preset="night" />
        </Canvas>
    );
}
