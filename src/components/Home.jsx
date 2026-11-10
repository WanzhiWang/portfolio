import React from 'react';
import Typewriter from 'typewriter-effect';
import { Fade } from 'react-awesome-reveal';
import { Link } from 'react-router-dom';
import endpoints from '../constants/endpoints';
import Social from './Social';
import FallbackSpinner from './FallbackSpinner';
import useFetch from '../hooks/useFetch';
import '../css/home.css';

/**
 * Extracts uppercase initials from the first two non-empty name parts.
 *
 * @param {string} name - Name used to generate the initials.
 * @returns {string} Initials, or an empty string when no name is provided.
 */
function initialsOf(name) {
  if (!name) return '';

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

/**
 * Loads homepage data through the shared fetch hook and displays
 * animated roles, navigation links, a name monogram and social links.
 * Handles loading and request errors before rendering the hero section.
 *
 * @returns {React.ReactElement} Home page.
 */
function Home() {
  const { data, loading, error } = useFetch(endpoints.home);

  if (loading) {
    return <FallbackSpinner />;
  }

  if (error || !data) {
    return (
      <p role="alert">
        Unable to load homepage. Please refresh the page to try again.
      </p>
    );
  }

  return (
    <Fade triggerOnce className="home-fade-container">
      <section className="hero">
        <div className="bento">
          <div className="tile hero-intro span-4 rspan-2">
            {data.status && (
              <span className="hero-eyebrow">{data.status}</span>
            )}

            <h1 className="hero-name">{data.name}</h1>

            <div className="hero-roles">
              <span>I&apos;m&nbsp;</span>
              <Typewriter
                options={{
                  loop: true,
                  autoStart: true,
                  strings: data.roles,
                }}
              />
            </div>

            {data.tagline && (
              <p className="hero-tagline">{data.tagline}</p>
            )}

            <div className="hero-cta">
              <Link className="btn-pill btn-accent" to="/projects">
                View my work
              </Link>
              <Link className="btn-pill btn-ghost" to="/about">
                About me
              </Link>
            </div>
          </div>

          <div className="tile tile--accent monogram span-2">
            <span className="monogram-mark">
              {initialsOf(data.name)}
            </span>
            <span className="monogram-label">{data.name}</span>
          </div>

          <div className="tile hero-social span-2">
            <span className="tile-label">Find me</span>
            <Social />
          </div>
        </div>
      </section>
    </Fade>
  );
}

export default Home;
