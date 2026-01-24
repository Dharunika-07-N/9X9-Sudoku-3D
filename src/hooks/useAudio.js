import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export function useAudio(url) {
    const sound = useRef();
    const analyser = useRef();
    const data = useRef(new Uint8Array(128));

    useEffect(() => {
        const listener = new THREE.AudioListener();
        const audioContent = new THREE.Audio(listener);

        // We would load audio here, but since we don't have an asset, 
        // we'll prepare the structure.
        // If a URL is provided:
        /*
        const loader = new THREE.AudioLoader();
        loader.load(url, (buffer) => {
            audioContent.setBuffer(buffer);
            audioContent.setLoop(true);
            audioContent.setVolume(0.5);
            audioContent.play();
        });
        */

        // For now, create a dummy silent analyser so code doesn't break
        analyser.current = new THREE.AudioAnalyser(audioContent, 256);
        sound.current = audioContent;

        return () => {
            if (sound.current && sound.current.isPlaying) sound.current.stop();
        }
    }, [url]);

    return {
        getFrequencyData: () => {
            if (analyser.current) {
                return analyser.current.getFrequencyData();
            }
            return data.current;
        }
    };
}
