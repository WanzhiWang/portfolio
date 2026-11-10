import React from 'react';
import PropTypes from 'prop-types';
import '../App.css';

/**
 * Displays a shared section heading using the header CSS styles.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.title - Heading text.
 * @returns {React.ReactElement} Section heading.
 */
function Header(props) {
  const { title } = props;
  return <div className="header">{title}</div>;
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
