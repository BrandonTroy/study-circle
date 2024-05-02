import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/index.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import SignIn from './components/SignIn';
import { theme, globalStyles } from './styles/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { GlobalStyles } from '@mui/system';
import { getCurrentUser } from './api/accountApi';
import { register } from './sw.js';


const Main = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    register();
    try {
      Notification.requestPermission();
    } catch {
      console.log('Notifications not supported');
    }
    
    getCurrentUser(false).then(user => {
      setIsSignedIn(user !== null);
    });
  }, []);
  
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={globalStyles} />
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/app"/>} />
            <Route path="/app" element={isSignedIn ? <App /> : <Navigate to="/login" />} />
            <Route path="/login" element={isSignedIn ? <Navigate to="/app" /> : <SignIn setIsSignedIn={setIsSignedIn} />} />
            <Route path="/signup" element={isSignedIn ? <Navigate to="/app" /> : <SignIn returningUser={false} setIsSignedIn={setIsSignedIn} />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </React.StrictMode>
  );
}

ReactDOM.render(<Main />, document.getElementById('root'));
