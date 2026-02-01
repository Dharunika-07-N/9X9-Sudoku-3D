import { useState } from 'react';
import confetti from 'canvas-confetti';
import './WinModal.css';

export function WinModal({ onClose, difficulty, onPlayAgain, onNextLevel, wasAutoSolved }) {
    const [isOpened, setIsOpened] = useState(false);

    const points = {
        'easy': 1000,
        'medium': 2500,
        'hard': 5000
    }[difficulty] || 1000;

    const handleOpenGift = () => {
        setIsOpened(true);
        triggerConfetti();
    };

    const triggerConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
    };

    return (
        <div className="win-modal-overlay">
            <div className={`win-modal-content ${isOpened ? 'opened' : ''}`}>
                {!isOpened ? (
                    <div className="gift-box" onClick={handleOpenGift}>
                        <div className="gift-lid"></div>
                        <div className="gift-body">
                            <span className="click-hint">Click to Open!</span>
                        </div>
                    </div>
                ) : (
                    <div className="congratulations">
                        <h2>{wasAutoSolved ? 'AI SOLVE COMPLETE' : 'CONGRATULATIONS!'}</h2>
                        {!wasAutoSolved && (
                            <div className="score-display">
                                <span className="label">SCORE</span>
                                <span className="value">{points}</span>
                            </div>
                        )}
                        <p className="message">{wasAutoSolved ? 'Solution provided by Mission Control AI' : 'Puzzle Complete!'}</p>
                        <div className="action-buttons">
                            <button className="play-again-btn" onClick={onPlayAgain}>
                                Replay Level
                            </button>
                            {onNextLevel && (
                                <button className="next-level-btn" onClick={onNextLevel}>
                                    Next Level &rarr;
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
