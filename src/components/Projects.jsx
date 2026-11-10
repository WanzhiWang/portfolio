import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Header from './Header';
import endpoints from '../constants/endpoints';
import ProjectCard from './projects/ProjectCard';
import FallbackSpinner from './FallbackSpinner';
import '../css/projects.css';

gsap.registerPlugin(useGSAP);

/**
 * Displays projects loaded from JSON with GSAP entrance animations.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.header - Page heading.
 * @returns {React.ReactElement} Projects page.
 */
function Projects({ header }) {
  const [data, setData] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState(false);
  const projectsRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      try {
        const response = await fetch(endpoints.projects, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to load projects.');
        }

        const result = await response.json();

        if (!Array.isArray(result.projects)) {
          throw new Error('Invalid projects data.');
        }

        setData(result);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(true);
        }
      }
    }

    loadProjects();

    return () => controller.abort();
  }, []);

  const numberOfItems = showMore && data ? data.projects.length : 6;

  /**
   * Animates visible cards after loading or expanding the list.
   * Skips animation when the user prefers reduced motion.
   */
  useGSAP(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (!data || reduceMotion) return;

    gsap.from('.project-card', {
      opacity: 0,
      y: 24,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out',
    });
  }, {
    scope: projectsRef,
    dependencies: [data, showMore],
    revertOnUpdate: true,
  });

  let content = <FallbackSpinner />;

  if (error) {
    content = (
      <p role="alert">
        Unable to load projects. Please refresh the page to try again.
      </p>
    );
  } else if (data) {
    content = (
      <>
        <div className="bento" ref={projectsRef}>
          {data.projects.slice(0, numberOfItems).map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              featured={index === 0}
            />
          ))}
        </div>

        {!showMore && data.projects.length > numberOfItems && (
          <div className="projects-more">
            <button
              type="button"
              className="btn-pill btn-ghost"
              onClick={() => setShowMore(true)}
            >
              Show more
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Header title={header} />
      <div className="section-content-container">
        {content}
      </div>
    </>
  );
}

Projects.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Projects;