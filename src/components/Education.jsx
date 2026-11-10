import React from 'react';
import { Fade } from 'react-awesome-reveal';
import PropTypes from 'prop-types';
import endpoints from '../constants/endpoints';
import Header from './Header';
import FallbackSpinner from './FallbackSpinner';
import useFetch from '../hooks/useFetch';
import '../css/timeline.css';

/**
 * Loads education data through the shared fetch hook and displays
 * a timeline with dates, qualifications, institutions and optional details.
 * Handles loading and request errors before fading in the content.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.header - Page heading.
 * @returns {React.ReactElement} Education page.
 */
function Education({ header }) {
  const { data, loading, error } = useFetch(endpoints.education);

  let content;

  if (loading) {
    content = <FallbackSpinner />;
  } else if (error || !Array.isArray(data?.education)) {
    content = (
      <p role="alert">
        Unable to load education. Please refresh the page to try again.
      </p>
    );
  } else {
    content = (
      <Fade triggerOnce>
        <div className="tl tl--education">
          {data.education.map((item) => (
            <div className="tl-item" key={item.cardTitle + item.title}>
              <div className="tl-node--icon">
                {item.icon && (
                  <img src={item.icon.src} alt={item.icon.alt} />
                )}
              </div>

              <div className="tl-card">
                <div className="tl-date">{item.title}</div>
                <h3 className="tl-title">{item.cardTitle}</h3>

                <div className="tl-subtitle">
                  <span className="accent">{item.cardSubtitle}</span>
                </div>

                {item.cardDetailedText && (
                  <div className="tl-detail">
                    {item.cardDetailedText}
                  </div>
                )}
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

Education.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Education;
