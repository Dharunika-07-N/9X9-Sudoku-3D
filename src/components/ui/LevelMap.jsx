import React, { useEffect, useRef } from 'react';
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

    // Generate random stars
    const stars = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        speed: `${2 + Math.random() * 3}s`
    }));

    return (
        <div className={`level-map-container ${!isLightMode ? 'dark-mode' : ''}`} ref={mapRef}>
            {/* Twinkling Stars Background */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                {stars.map(star => (
                    <div
                        key={star.id}
                        className="decor small-star"
                        style={{
                            top: star.top,
                            left: star.left,
                            '--speed': star.speed
                        }}
                    />
                ))}
            </div>

            <div className="map-header">
                <h1>SUDOKU COSMOS</h1>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00ffff', textShadow: '0 0 10px #00ffff', fontFamily: 'Orbitron' }}>
                    EXPLORING SECTOR {currentLevel}
                </div>
                <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)' }}>
                    <button
                        onClick={() => onSelectLevel(currentLevel)}
                        className="play-again-btn"
                        style={{ padding: '0.5rem 1.5rem', fontSize: '1rem', background: 'rgba(0, 255, 255, 0.2)', border: '1px solid #00ffff', color: '#00ffff' }}
                    >
                        RESUME MISSION
                    </button>
                </div>
            </div>

            <div className="map-content">
                <div className="path-background"></div>

                {/* Decorative Nebulas */}
                <div className="decor nebula" style={{ top: '300px', left: '-100px', background: '#ff00ff' }}></div>
                <div className="decor nebula" style={{ top: '1200px', right: '-100px', background: '#00ffff' }}></div>
                <div className="decor nebula" style={{ top: '2500px', left: '100px', background: '#6400ff' }}></div>

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
                                    {isCurrent && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '-40px',
                                            background: '#00ffff',
                                            color: '#000',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold',
                                            whiteSpace: 'nowrap'
                                        }}>
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
