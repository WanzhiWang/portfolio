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
 * Displays projects with title search, tag filtering and GSAP animations.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.header - Page heading.
 * @returns {React.ReactElement} Projects page.
 */
function Projects({ header }) {
  const [data, setData] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
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

  const projects = data?.projects ?? [];

  const tags = [...new Set(
    projects.flatMap((project) => project.tags ?? []),
  )].sort();

  const searchTerm = search.trim().toLowerCase();

  const filteredProjects = projects.filter((project) => {
    const searchableText = [
      project.title,
      project.bodyText,
      ...(project.tags ?? []),
    ].join(' ').toLowerCase();

    const matchesSearch = searchableText.includes(searchTerm);
    const matchesTag = !selectedTag
      || (project.tags ?? []).includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const numberOfItems = showMore ? filteredProjects.length : 6;
  const visibleProjects = filteredProjects.slice(0, numberOfItems);

  /**
   * Animates cards after loading, searching, filtering or expanding.
   * Skips animation when the user prefers reduced motion.
   */
  useGSAP(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (!data || reduceMotion) return;

    gsap.from('.project-card', {
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power2.out',
      clearProps: 'opacity',
    });
  }, {
    scope: projectsRef,
    dependencies: [data, showMore, search, selectedTag],
    revertOnUpdate: true,
  });

  /**
   * Clears search and tag filters and resets the displayed item limit.
   *
   * @returns {void}
   */
  function clearFilters() {
    setSearch('');
    setSelectedTag('');
    setShowMore(false);
  }

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
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label htmlFor="project-search" className="form-label">
              Search projects
            </label>
            <input
              id="project-search"
              type="search"
              className="form-control"
              placeholder="Search by title..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setShowMore(false);
              }}
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="project-tag" className="form-label">
              Filter by technology
            </label>
            <select
              id="project-tag"
              className="form-select"
              value={selectedTag}
              onChange={(event) => {
                setSelectedTag(event.target.value);
                setShowMore(false);
              }}
            >
              <option value="">All technologies</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button
              type="button"
              className="btn-pill btn-ghost w-100"
              onClick={clearFilters}
              disabled={!search && !selectedTag}
            >
              Clear
            </button>
          </div>
        </div>

        <p role="status">
          {filteredProjects.length}
          {' '}
          project
          {filteredProjects.length === 1 ? '' : 's'}
          {' '}
          found
        </p>

        <div className="bento" ref={projectsRef}>
          {visibleProjects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              featured={index === 0}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <p>No matching projects. Try another title or technology.</p>
        )}

        {!showMore && filteredProjects.length > numberOfItems && (
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
      <div className="section-content-container projects-section">
        {content}
      </div>
    </>
  );
}

Projects.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Projects;