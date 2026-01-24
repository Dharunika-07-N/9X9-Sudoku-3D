import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

export function GamePostProcessing() {
    return (
        <EffectComposer disableNormalPass>
            <Bloom
                luminanceThreshold={0.2}
                mipmapBlur
                intensity={1.5}
                radius={0.4}
            />
            <ChromaticAberration
                offset={[0.002, 0.002]} // Subtle defaults
                radialModulation={false}
                modulationOffset={0}
            />
            <Noise
                premultiply
                blendFunction={BlendFunction.OVERLAY}
                opacity={0.03}
            />
            <Vignette
                eskil={false}
                offset={0.5}
                darkness={0.5}
            />
        </EffectComposer>
    );
}
