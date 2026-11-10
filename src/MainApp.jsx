import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import FallbackSpinner from './components/FallbackSpinner';
import NavBar from './components/NavBar';
import Home from './components/Home';
import endpoints from './constants/endpoints';
import useFetch from './hooks/useFetch';

// Home is loaded immediately; other sections load when visited.
// Define lazy components outside render to keep their identities stable.
const sectionComponents = {
  About: React.lazy(() => import('./components/About.jsx')),
  Skills: React.lazy(() => import('./components/Skills.jsx')),
  Education: React.lazy(() => import('./components/Education.jsx')),
  Experience: React.lazy(() => import('./components/Experience.jsx')),
  Projects: React.lazy(() => import('./components/Projects.jsx')),
  Gallery: React.lazy(() => import('./components/Gallery.jsx')),
  Contact: React.lazy(() => import('./components/Contact.jsx')),
};

/**
 * Displays the shared navigation and application routes.
 * Loads route configuration through the shared fetch hook and maps
 * sections to lazy-loaded components with a loading fallback.
 *
 * @returns {React.ReactElement} Main application layout.
 */
function MainApp() {
  const { data, loading, error } = useFetch(endpoints.routes);

  const routesValid = Array.isArray(data?.sections);
  const sections = routesValid ? data.sections : [];

  let routeContent;

  if (loading) {
    routeContent = <FallbackSpinner />;
  } else if (error || !routesValid) {
    routeContent = (
      <p role="alert">
        Unable to load page routes. Please refresh the page to try again.
      </p>
    );
  } else {
    routeContent = (
      <Routes>
        <Route path="/" element={<Home />} />

        {sections.map((route) => {
          const SectionComponent = sectionComponents[route.component];

          if (!SectionComponent) return null;

          return (
            <Route
              key={route.headerTitle}
              path={route.path}
              element={<SectionComponent header={route.headerTitle} />}
            />
          );
        })}
      </Routes>
    );
  }

  return (
    <div className="MainApp">
      <NavBar />

      <main className="main">
        <Suspense fallback={<FallbackSpinner />}>
          {routeContent}
        </Suspense>
      </main>
    </div>
  );
}

export default MainApp;
