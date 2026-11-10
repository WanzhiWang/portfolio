import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import useDarkMode from './hooks/useDarkMode';
import AppContext from './AppContext';
import MainApp from './MainApp';
import GlobalStyles from './theme/GlobalStyles';
import { lightTheme, darkTheme } from './theme/themes';

/**
 * Initialises the application with shared theme state, themed global
 * styles and hash-based routing for static hosting.
 * Defaults to light mode when no saved theme preference exists.
 *
 * @returns {React.ReactElement} Root application component.
 */
function App() {
  const darkMode = useDarkMode(false);

  return (
    <AppContext.Provider value={{ darkMode }}>
      <ThemeProvider theme={darkMode.value ? darkTheme : lightTheme}>
        <GlobalStyles />
        <div className="App">
          <HashRouter>
            <MainApp />
          </HashRouter>
        </div>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;
