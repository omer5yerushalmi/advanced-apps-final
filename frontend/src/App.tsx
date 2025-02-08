import { ThemeProvider, CssBaseline } from '@mui/material';
import UserProfile from './components/UserProfile';
import { mockUser } from './mockData/userData';

function App() {
    return (
        <ThemeProvider>
            <CssBaseline />
            <UserProfile user={mockUser} />
        </ThemeProvider>
    );
}

export default App; 