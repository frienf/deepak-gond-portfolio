import { useEffect, useRef } from 'react';
import { usePipelineScene } from '../hooks/usePipelineScene.js';

/**
 * The hero's WebGL layer. Renders the CSS understudy underneath, and only
 * hides it once the Three.js scene is confirmed running - if WebGL is
 * missing the fallback simply stays on screen.
 *
 * @param {(pipeline: object|null) => void} onReady  hands the scene handles up
 */
export function HeroCanvas({ onReady, theme }) {
  const canvasRef = useRef(null);
  const { pipeline, ready } = usePipelineScene(canvasRef, theme);

  useEffect(() => {
    document.documentElement.classList.toggle('webgl-ready', ready);
    onReady?.(pipeline);
  }, [ready, pipeline, onReady]);

  return (
    <div className="hero__canvas-wrap" aria-hidden="true">
      <div className="hero__fallback" />
      {/* Keyed on the theme so React mounts a fresh element when it flips.
          dispose() ends with forceContextLoss(), which retires that canvas's
          WebGL context for good - a rebuilt scene cannot get a new context
          from the same element, it would only ever receive the lost one. */}
      <canvas key={theme} className="hero__canvas" id="pipeline-canvas" ref={canvasRef} />
    </div>
  );
}
