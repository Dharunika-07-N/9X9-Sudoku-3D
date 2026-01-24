import { useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';

export function usePerformance() {
    const [tier, setTier] = useState(2); // 0: Low, 1: Medium, 2: High

    useEffect(() => {
        // Basic heuristic: Mobile or low core count = low tier
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const cores = navigator.hardwareConcurrency || 4;

        if (isMobile) {
            setTier(0);
        } else if (cores < 4) {
            setTier(1);
        } else {
            setTier(2);
        }
    }, []);

    return tier;
}
