import React from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import { Fade } from 'react-awesome-reveal';
import Header from './Header';
import endpoints from '../constants/endpoints';
import FallbackSpinner from './FallbackSpinner';
import useFetch from '../hooks/useFetch';
import '../css/timeline.css';

/**
 * Loads professional experience through the shared fetch hook and displays
 * a timeline with dates, roles, subtitles and Markdown descriptions.
 * Handles loading and request errors before fading in the content.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.header - Page heading.
 * @returns {React.ReactElement} Experience page.
 */
function Experience({ header }) {
  const { data, loading, error } = useFetch(endpoints.experiences);

  let content;

  if (loading) {
    content = <FallbackSpinner />;
  } else if (error || !Array.isArray(data?.experiences)) {
    content = (
      <p role="alert">
        Unable to load experience. Please refresh the page to try again.
      </p>
    );
  } else {
    content = (
      <Fade triggerOnce>
        <div className="tl tl--experience">
          {data.experiences.map((item) => (
            <div className="tl-item" key={item.title + item.dateText}>
              <div className="tl-node--dot" />

              <div className="tl-card">
                <div className="tl-date">{item.dateText}</div>
                <h3 className="tl-title">{item.title}</h3>

                <div className="tl-subtitle">
                  <span className="accent">{item.subtitle}</span>
                  {item.workType ? ` · ${item.workType}` : ''}
                </div>

                <ul className="tl-list">
                  {item.workDescription.map((point) => (
                    <li key={point}>
                      <ReactMarkdown components={{ p: 'span' }}>
                        {point}
                      </ReactMarkdown>
                    </li>
                  ))}
                </ul>
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

Experience.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Experience;
