import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion.js';

/**
 * Mounts the imperative Three.js scene onto a canvas and hands back its
 * handles. Three.js is imported lazily so the hero text paints first.
 *
 * The scene stays imperative on purpose: it owns its own render loop,
 * visibility gating and disposal, none of which benefit from going through
 * React's reconciler once per frame.
 *
 * @param {React.RefObject<HTMLCanvasElement>} canvasRef
 * @returns {{pipeline: object|null, ready: boolean}}
 */
export function usePipelineScene(canvasRef) {
  const reducedMotion = useReducedMotion();
  const [pipeline, setPipeline] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let scene = null;
    let cancelled = false;

    import('../three/pipeline.js')
      .then(({ createPipelineScene }) => {
        // StrictMode may unmount before the import resolves
        if (cancelled) return;
        scene = createPipelineScene(canvas, { reducedMotion });
        if (scene) setPipeline(scene);
      })
      .catch((error) => {
        console.warn('[hero] 3D scene skipped.', error);
      });

    return () => {
      cancelled = true;
      if (scene) scene.dispose();
      setPipeline(null);
    };
  }, [canvasRef, reducedMotion]);

  return { pipeline, ready: Boolean(pipeline) };
}
