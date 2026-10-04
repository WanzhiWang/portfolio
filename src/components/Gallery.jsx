import React, { useState, useEffect } from 'react';
import { Fade } from 'react-awesome-reveal';
import PropTypes from 'prop-types';
import Header from './Header';
import endpoints from '../constants/endpoints';
import FallbackSpinner from './FallbackSpinner';
import '../css/gallery.css';

const Gallery = (props) => {
  const { header } = props;
  const [data, setData] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch(endpoints.gallery, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  const numberOfItems = showMore && data ? data.gallery.length : 6;

  return (
    <>
      <Header title={header} />
      {data ? (
        <div className="section-content-container">
          <Fade triggerOnce>
            <div className="gallery-grid">
              {data.gallery?.slice(0, numberOfItems).map((item, index) => (
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

          {!showMore && data.gallery?.length > numberOfItems && (
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
            <div className="image-modal-overlay" onClick={() => setSelectedImage(null)}>
              <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="modal-close-btn" 
                  onClick={() => setSelectedImage(null)}
                >
                  &times;
                </button>
                <img src={selectedImage.image} alt={selectedImage.title} />
              </div>
            </div>
          )}
        </div>
      ) : <FallbackSpinner />}
    </>
  );
};

Gallery.propTypes = {
  header: PropTypes.string.isRequired,
};

export default Gallery;