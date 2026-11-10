import React from 'react';
import { Spinner } from 'react-bootstrap';

const styles = {
  spinnerContainerStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
};

/**
 * Displays a centred loading spinner while page data
 * or lazy-loaded components are being loaded.
 *
 * @returns {React.ReactElement} Loading indicator.
 */
function FallbackSpinner() {
  return (
    <div style={styles.spinnerContainerStyle}>
      <Spinner animation="grow" />
    </div>
  );
}

export default FallbackSpinner;
