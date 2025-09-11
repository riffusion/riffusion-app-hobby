import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import '../styles/globals.css';

console.log('🚀 [RIFFUSION] React + Types working! Environment:', process.env.REACT_APP_RIFFUSION_USE_BASETEN);

const root = document.getElementById('root');
if (root) {
    console.log('✅ Found root element, mounting Riffusion app');
    
    // Clear existing content completely to avoid React hydration conflicts
    root.innerHTML = '';
    
    // Mount the Riffusion app
    ReactDOM.render(<App />, root);
    
    console.log('✨ [RIFFUSION] App mounted successfully!');
} else {
    console.error('❌ Root element not found');
}