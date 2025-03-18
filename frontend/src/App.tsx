    import { ThemeProvider, CssBaseline } from '@mui/material';
    import { createTheme } from '@mui/material/styles';
    import AuthComponent from './components/LoginPage';
    import HomePage from './components/HomePage';
    import { useState, useEffect } from 'react';


    const theme = createTheme();

    function App() {
        const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
        useEffect(() => {
            // Check if access token exists in localStorage
            const token = localStorage.getItem('accessToken');
            setIsAuthenticated(!!token);
        }, []);

        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {isAuthenticated ? (
                <HomePage />
            ) : (
                <AuthComponent setIsAuthenticated={setIsAuthenticated} />
            )}
            </ThemeProvider>
        );
    }

    export default App; 