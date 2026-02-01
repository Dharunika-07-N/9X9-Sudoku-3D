import React from 'react';
import './SudokuBoard.css';

export function SudokuBoard({ board, initialBoard, onCellClick, selectedCell }) {
    if (!board) return null;

    const isSelected = (row, col) => {
        return selectedCell && selectedCell.row === row && selectedCell.col === col;
    };

    const isRelated = (row, col) => {
        if (!selectedCell) return false;
        const sameRow = selectedCell.row === row;
        const sameCol = selectedCell.col === col;
        // same 3x3 box
        const startRow = Math.floor(selectedCell.row / 3) * 3;
        const startCol = Math.floor(selectedCell.col / 3) * 3;
        const sameBox = row >= startRow && row < startRow + 3 && col >= startCol && col < startCol + 3;

        return !isSelected(row, col) && (sameRow || sameCol || sameBox);
    };

    return (
        <div className="sudoku-board-container">
            <div className="sudoku-board">
                {board.map((rowArray, row) => (
                    rowArray.map((cellValue, col) => {
                        const isInitial = initialBoard && initialBoard[row][col] !== 0; // Assuming 0 or BLANK
                        // You might need to check if BLANK is 0 or '-' or something. 
                        // In Sudoku logic often 0 is blank. Let's assume non-zero is value.

                        const cellClasses = [
                            'sudoku-cell',
                            isSelected(row, col) ? 'selected' : '',
                            isRelated(row, col) ? 'related' : '',
                            isInitial ? 'initial' : '',
                            (col + 1) % 3 === 0 && col < 8 ? 'border-right-bold' : '',
                            (row + 1) % 3 === 0 && row < 8 ? 'border-bottom-bold' : ''
                        ].filter(Boolean).join(' ');

                        return (
                            <div
                                key={`${row}-${col}`}
                                className={cellClasses}
                                onClick={() => onCellClick(row, col)}
                            >
                                {cellValue !== 0 && cellValue !== '-' ? cellValue : ''}
                            </div>
                        );
                    })
                ))}
            </div>
        </div>
    );
}
