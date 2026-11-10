import { Navbar, Nav, Container } from 'react-bootstrap';
import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import styled, { ThemeContext } from 'styled-components';
import endpoints from '../constants/endpoints';
import ThemeToggler from './ThemeToggler';
import useFetch from '../hooks/useFetch';

const ExternalNavLink = styled.a`
  color: ${(props) => props.theme.navbarTheme.linkColor};

  &:hover {
    color: ${(props) => props.theme.navbarTheme.linkHoverColor};
  }

  &::after {
    background-color: ${(props) => props.theme.accentColor};
  }
`;

const InternalNavLink = styled(NavLink)`
  color: ${(props) => props.theme.navbarTheme.linkColor};

  &:hover {
    color: ${(props) => props.theme.navbarTheme.linkHoverColor};
  }

  &::after {
    background-color: ${(props) => props.theme.accentColor};
  }

  &.active {
    color: ${(props) => props.theme.navbarTheme.linkActiveColor};
  }
`;

/**
 * Loads navigation links through the shared fetch hook and displays
 * a fixed, themed navbar with internal routes, external links
 * and a theme toggle. Closes the mobile menu when a link is selected.
 *
 * @returns {React.ReactElement} Navigation bar.
 */
function NavBar() {
  const theme = useContext(ThemeContext);
  const { data, loading, error } = useFetch(endpoints.navbar);
  const [expanded, setExpanded] = useState(false);

  const sections = !loading && !error && Array.isArray(data?.sections)
    ? data.sections
    : [];

  return (
    <Navbar
      fixed="top"
      expand="md"
      variant={theme.bsPrimaryVariant}
      className="navbar-custom"
      expanded={expanded}
    >
      <Container>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => setExpanded(!expanded)}
        />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto" />

          <Nav>
            {sections.map((section, index) => (
              section?.type === 'link' ? (
                <ExternalNavLink
                  key={section.title}
                  href={section.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setExpanded(false)}
                  className="navbar__link"
                  theme={theme}
                >
                  {section.title}
                </ExternalNavLink>
              ) : (
                <InternalNavLink
                  key={section.title}
                  onClick={() => setExpanded(false)}
                  end={index === 0}
                  className="navbar__link"
                  to={section.href}
                  theme={theme}
                >
                  {section.title}
                </InternalNavLink>
              )
            ))}
          </Nav>

          <ThemeToggler
            onClick={() => setExpanded(false)}
          />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
