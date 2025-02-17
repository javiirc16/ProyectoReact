import React, { createContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export const ThemeContext = createContext();

const ThemeContextProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? 'dark' : 'light',
                    primary: {
                        main: darkMode ? '#bb86fc' : '#1976d2',
                    },
                    background: {
                        default: darkMode ? '#121212' : '#ffffff',
                    },
                },
            }),
        [darkMode]
    );

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    return (
        <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeContextProvider;