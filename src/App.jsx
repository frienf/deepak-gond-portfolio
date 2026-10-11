import { useCallback, useRef, useState } from 'react';
import { SiteHeader } from './components/SiteHeader.jsx';
import { Hero } from './components/Hero.jsx';
import { Impact } from './components/Impact.jsx';
import { Workflow } from './components/Workflow.jsx';
import { Experience } from './components/Experience.jsx';
import { Projects } from './components/Projects.jsx';
import { SystemDiagrams } from './components/SystemDiagrams.jsx';
import { Skills } from './components/Skills.jsx';
import { About } from './components/About.jsx';
import { Contact } from './components/Contact.jsx';
import { SiteFooter } from './components/SiteFooter.jsx';
import { useScrollAnimations } from './hooks/useScrollAnimations.js';
import { useTheme } from './hooks/useTheme.js';

export default function App() {
  const mainRef = useRef(null);
  const [pipeline, setPipeline] = useState(null);
  const { theme, toggle } = useTheme();

  // Stable identity: HeroCanvas runs an effect keyed on this callback.
  const handleSceneReady = useCallback((scene) => setPipeline(scene), []);

  useScrollAnimations(mainRef, pipeline);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader theme={theme} onToggleTheme={toggle} />

      <main id="main" ref={mainRef}>
        <Hero onSceneReady={handleSceneReady} theme={theme} />
        <Impact />
        <Workflow />
        <Experience />
        <Projects />
        <SystemDiagrams />
        <Skills />
        <About />
        <Contact />
      </main>

      <SiteFooter />
    </>
  );
}
