import React, { useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import PropTypes from 'prop-types';
import Header from './Header';
import endpoints from '../constants/endpoints';
import FallbackSpinner from './FallbackSpinner';
import useFetch from '../hooks/useFetch';
import '../css/gallery.css';

/**
 * Loads gallery data through the shared fetch hook and displays
 * a fading image grid with Show more and image preview controls.
 * Handles loading, request errors and invalid gallery data.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.header - Page heading.
 * @returns {React.ReactElement} Gallery page.
 */
function Gallery({ header }) {
  const { data, loading, error } = useFetch(endpoints.gallery);
  const [showMore, setShowMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  if (loading) {
    return (
      <>
        <Header title={header} />
        <FallbackSpinner />
      </>
    );
  }

  if (error || !Array.isArray(data?.gallery)) {
    return (
      <>
        <Header title={header} />
        <p role="alert">
          Unable to load gallery. Please refresh the page to try again.
        </p>
      </>
    );
  }

  const numberOfItems = showMore ? data.gallery.length : 6;

  return (
    <>
      <Header title={header} />

      <div className="section-content-container">
        <Fade triggerOnce>
          <div className="gallery-grid">
            {data.gallery.slice(0, numberOfItems).map((item, index) => (
              <div
                className="gallery-card"
                key={index}
                onClick={() => setSelectedImage(item)}
                style={{ cursor: 'pointer' }}
              >
                <div className="image-wrapper">
                  <img src={item.image} alt={item.title} />
                </div>
                <h3 className="item-title">{item.title}</h3>
              </div>
            ))}
          </div>
        </Fade>

        {!showMore && data.gallery.length > numberOfItems && (
          <div className="gallery-more">
            <button
              type="button"
              className="btn-pill btn-ghost"
              onClick={() => setShowMore(true)}
            >
              Show more
            </button>
          </div>
        )}

        {selectedImage && (
          <div
            className="image-modal-overlay"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="image-modal-content"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="modal-close-btn"
                onClick={() => setSelectedImage(null)}
              >
                &times;
              </button>
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

Gallery.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Gallery;
