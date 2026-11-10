import React from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import { Fade } from 'react-awesome-reveal';
import Header from './Header';
import endpoints from '../constants/endpoints';
import FallbackSpinner from './FallbackSpinner';
import useFetch from '../hooks/useFetch';
import '../css/about.css';

/**
 * Loads biography data through the shared fetch hook and displays
 * Markdown content, a Chinese name and an optional profile image.
 * Handles loading and request errors before rendering the content.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.header - Page heading.
 * @returns {React.ReactElement} About page.
 */
function About({ header }) {
  const { data, loading, error } = useFetch(endpoints.about);

  let content;

  if (loading) {
    content = <FallbackSpinner />;
  } else if (error || !data) {
    content = (
      <p role="alert">
        Unable to load biography. Please refresh the page to try again.
      </p>
    );
  } else {
    content = (
      <Fade triggerOnce>
        <div className="bento">
          <div className="tile about-bio-tile span-4 rspan-2">
            <ReactMarkdown>{data.about}</ReactMarkdown>
            <div className="about-chinese-text">{data.chineseName}</div>
          </div>

          {data.imageSource && (
            <div className="tile about-image-tile span-2 rspan-2">
              <img src={data.imageSource} alt="profile" />
            </div>
          )}
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

About.propTypes = {
  header: PropTypes.string.isRequired,
};

export default About;
