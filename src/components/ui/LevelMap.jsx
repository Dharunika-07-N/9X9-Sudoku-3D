import React, { useEffect, useRef } from 'react';
import { FluidPaintBackground } from '../effects/FluidPaintBackground';
import './LevelMap.css';

export function LevelMap({ currentLevel, onSelectLevel, isLightMode }) {
    const mapRef = useRef(null);
    const levels = Array.from({ length: 50 }, (_, i) => i + 1);

    useEffect(() => {
        setTimeout(() => {
            const currentNode = document.querySelector('.level-node.current');
            if (currentNode) {
                currentNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 300);
    }, []);

    const handleNodeMouseMove = (e) => {
        const node = e.currentTarget;
        const rect = node.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 5;
        const rotateY = (centerX - x) / 5;

        node.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.1, 1.1, 1.1)`;
    };

    const handleNodeMouseLeave = (e) => {
        e.currentTarget.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    return (
        <div className={`level-map-container ${!isLightMode ? 'dark-mode' : ''}`} ref={mapRef}>
            {/* Interactive 3D Background */}
            <FluidPaintBackground isLightMode={isLightMode} />

            <div className="map-header">
                <h1 className="three-d-title">SUDOKU JOURNEY</h1>
                <div style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: isLightMode ? '#0066cc' : '#00ffff',
                    textShadow: isLightMode ? 'none' : '0 0 10px #00ffff',
                    fontFamily: 'Orbitron'
                }}>
                    EXPLORING SECTOR {currentLevel}
                </div>
                <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)' }}>
                    <button
                        onClick={() => onSelectLevel(currentLevel)}
                        className="play-again-btn"
                        style={{
                            padding: '0.5rem 1.5rem',
                            fontSize: '1.1rem',
                            background: isLightMode ? '#0066cc' : 'rgba(0, 255, 255, 0.2)',
                            border: isLightMode ? 'none' : '1px solid #00ffff',
                            color: '#fff',
                            boxShadow: isLightMode ? '0 4px 15px rgba(0, 102, 204, 0.3)' : 'none',
                            fontWeight: 'bold'
                        }}
                    >
                        RESUME MISSION
                    </button>
                </div>
            </div>

            <div className="map-content">
                <div className="path-background"></div>

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
                                    onMouseMove={(e) => !isLocked && handleNodeMouseMove(e)}
                                    onMouseLeave={handleNodeMouseLeave}
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
                                    {isCurrent && (
                                        <div className="current-indicator">
                                            YOU ARE HERE
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
