import React, { useEffect, useRef } from 'react';
import './LevelMap.css';

export function LevelMap({ currentLevel, onSelectLevel, isLightMode }) {
    const mapRef = useRef(null);
    const levels = Array.from({ length: 50 }, (_, i) => i + 1);

    useEffect(() => {
        // Delay scroll slightly to ensure content is rendered
        setTimeout(() => {
            const currentNode = document.querySelector('.level-node.current');
            if (currentNode) {
                currentNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }, []);

    return (
        <div className={`level-map-container ${!isLightMode ? 'dark-mode' : ''}`} ref={mapRef}>
            <div className="map-header">
                <h1>SUDOKU JOURNEY</h1>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ff00ff' }}>
                    LEVEL {currentLevel}
                </div>
                <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)' }}>
                    <button
                        onClick={() => onSelectLevel(currentLevel)}
                        className="play-again-btn"
                        style={{ padding: '0.5rem 1.5rem', fontSize: '1rem', background: 'linear-gradient(90deg, #00d2ff, #3a7bd5)' }}
                    >
                        RESUME
                    </button>
                </div>
            </div>

            <div className="map-content">
                <div className="path-background"></div>

                {/* Decorative Elements */}
                <div className="decor candy" style={{ top: '200px', left: '50px' }}>🍭</div>
                <div className="decor candy" style={{ top: '800px', right: '40px' }}>🍬</div>
                <div className="decor candy" style={{ top: '1500px', left: '30px' }}>🍩</div>
                <div className="decor candy" style={{ top: '2200px', right: '60px' }}>🍦</div>
                <div className="decor cloud" style={{ top: '500px', right: '-20px' }}></div>
                <div className="decor cloud" style={{ top: '1200px', left: '-30px' }}></div>
                <div className="decor cloud" style={{ top: '1900px', right: '20px' }}></div>

                <div className="levels-list">
                    {levels.map((lvl) => {
                        const isLocked = lvl > currentLevel;
                        const isCompleted = lvl < currentLevel;
                        const isCurrent = lvl === currentLevel;

                        let statusClass = '';
                        if (isCurrent) statusClass = 'current';
                        else if (isCompleted) statusClass = 'completed';
                        else if (isLocked) statusClass = 'locked';

                        return (
                            <div key={lvl} className="level-node-wrapper">
                                <div
                                    className={`level-node ${statusClass}`}
                                    onClick={() => !isLocked && onSelectLevel(lvl)}
                                >
                                    <span className="level-number">{lvl}</span>
                                    {isCompleted && (
                                        <div className="star-rating">
                                            <span className="star">★</span>
                                            <span className="star">★</span>
                                            <span className="star">★</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
