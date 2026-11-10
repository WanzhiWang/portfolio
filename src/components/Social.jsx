import React, { useContext } from 'react';
import { SocialIcon } from 'react-social-icons';
import { ThemeContext } from 'styled-components';
import endpoints from '../constants/endpoints';
import useFetch from '../hooks/useFetch';

const styles = {
  iconStyle: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
};

/**
 * Loads social links through the shared fetch hook and displays
 * icons styled with the current theme, opening links in a new tab.
 * Renders no icons while loading and a message if loading fails.
 *
 * @returns {React.ReactElement} Social links container.
 */
function Social() {
  const theme = useContext(ThemeContext);
  const { data, loading, error } = useFetch(endpoints.social);

  let content = null;

  if (!loading) {
    if (error || !Array.isArray(data?.social)) {
      content = (
        <p role="alert">
          Unable to load social links.
        </p>
      );
    } else {
      content = data.social.map((social) => (
        <SocialIcon
          key={social.network}
          style={styles.iconStyle}
          url={social.href}
          network={social.network}
          bgColor={theme.socialIconBgColor}
          fgColor={theme.background}
          target="_blank"
          rel="noopener"
        />
      ));
    }
  }

  return (
    <div className="social">
      {content}
    </div>
  );
}

export default Social;
