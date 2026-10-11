import { useEffect, useRef } from 'react';
import { usePipelineScene } from '../hooks/usePipelineScene.js';

/**
 * The hero's WebGL layer. Renders the CSS understudy underneath, and only
 * hides it once the Three.js scene is confirmed running - if WebGL is
 * missing the fallback simply stays on screen.
 *
 * @param {(pipeline: object|null) => void} onReady  hands the scene handles up
 */
export function HeroCanvas({ onReady }) {
  const canvasRef = useRef(null);
  const { pipeline, ready } = usePipelineScene(canvasRef);

  useEffect(() => {
    document.documentElement.classList.toggle('webgl-ready', ready);
    onReady?.(pipeline);
  }, [ready, pipeline, onReady]);

  return (
    <div className="hero__canvas-wrap" aria-hidden="true">
      <div className="hero__fallback" />
      <canvas className="hero__canvas" id="pipeline-canvas" ref={canvasRef} />
    </div>
  );
}
