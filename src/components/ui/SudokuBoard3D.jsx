import { Cell3D } from './Cell3D';

export function SudokuBoard3D({ board, initialBoard, onCellClick, selectedCell, isLightMode }) {
    if (!board || board.length === 0) return null;

    return (
        <group>
            {board.map((row, r) =>
                row.map((val, c) => (
                    <Cell3D
                        key={`${r}-${c}`}
                        position={[c - 4, 4 - r, 0]}
                        value={val}
                        fixed={initialBoard[r][c] !== 0}
                        onClick={() => onCellClick(r, c)}
                        isSelected={selectedCell && selectedCell.row === r && selectedCell.col === c}
                        isLightMode={isLightMode}
                    />
                ))
            )}

            {/* Background Plate */}
            <mesh position={[0, 0, -0.2]}>
                <planeGeometry args={[9.5, 9.5]} />
                <meshStandardMaterial
                    color={isLightMode ? "#ffffff" : "black"}
                    transparent
                    opacity={0.3}
                />
            </mesh>
        </group>
    );
}
