import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ListsContextProvider } from './Context/ListsContext';
import { AuthContextProvider } from './Context/AuthContext'
import { GoogleOAuthProvider } from '@react-oauth/google';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<React.StrictMode>
  <AuthContextProvider>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <ListsContextProvider>
        <App />
      </ListsContextProvider>
    </GoogleOAuthProvider>
  </AuthContextProvider>
</React.StrictMode>

)