import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <GoogleOAuthProvider clientId='565843043657-dr6rtrbiv8flfpfbc26e35nm4rv67n5l.apps.googleusercontent.com'>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </GoogleOAuthProvider>
); 