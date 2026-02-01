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
            {/* Background Decorations */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
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
                <h1>SUDOKU JOURNEY</h1>
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

                {/* Decorative Elements */}
                <div className="decor nebula" style={{ top: '300px', left: '-100px', background: '#ff00ff' }}></div>
                <div className="decor nebula" style={{ top: '1200px', right: '-100px', background: '#00ffff' }}></div>
                <div className="decor nebula" style={{ top: '2500px', left: '100px', background: '#6400ff' }}></div>

                {/* Light Mode Clouds */}
                <div className="decor cloud" style={{ top: '150px', left: '10%' }}></div>
                <div className="decor cloud" style={{ top: '450px', right: '15%' }}></div>
                <div className="decor cloud" style={{ top: '800px', left: '20%' }}></div>
                <div className="decor cloud" style={{ top: '1100px', right: '10%' }}></div>
                <div className="decor cloud" style={{ top: '1500px', left: '15%' }}></div>
                <div className="decor cloud" style={{ top: '1900px', right: '20%' }}></div>
                <div className="decor cloud" style={{ top: '2300px', left: '10%' }}></div>

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
                                            background: isLightMode ? '#0066cc' : '#00ffff',
                                            color: isLightMode ? '#fff' : '#000',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold',
                                            whiteSpace: 'nowrap',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
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
