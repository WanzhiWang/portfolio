import React from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import { Fade } from 'react-awesome-reveal';
import Header from './Header';
import endpoints from '../constants/endpoints';
import FallbackSpinner from './FallbackSpinner';
import useFetch from '../hooks/useFetch';
import '../css/skills.css';

/**
 * Loads skills through the shared fetch hook and displays an optional
 * Markdown introduction and category cards with skill icons and names.
 * Handles loading and request errors before fading in the content.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.header - Page heading.
 * @returns {React.ReactElement} Skills page.
 */
function Skills({ header }) {
  const { data, loading, error } = useFetch(endpoints.skills);

  let content;

  if (loading) {
    content = <FallbackSpinner />;
  } else if (error || !Array.isArray(data?.skills)) {
    content = (
      <p role="alert">
        Unable to load skills. Please refresh the page to try again.
      </p>
    );
  } else {
    content = (
      <Fade triggerOnce>
        <div className="bento">
          {data.intro && (
            <div className="tile skills-intro-tile span-6">
              <ReactMarkdown>{data.intro}</ReactMarkdown>
            </div>
          )}

          {data.skills.map((category) => (
            <div
              key={category.title}
              className="tile tile--interactive skill-category-tile span-2"
            >
              <h3 className="skill-category-title">{category.title}</h3>

              <div className="skill-grid">
                {category.items.map((item) => (
                  <div key={item.title} className="skill-item">
                    <img src={item.icon} alt={item.title} />
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Fade>
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

Skills.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Skills;
