import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import AOS from 'aos';
import 'aos/dist/aos.css';
import App from './App';
import './index.css';

const RootApp: React.FC = () => {
    useEffect(() => {
        AOS.init({
            duration: 700,
            once: true,
            offset: 20,
            easing: 'ease-out-cubic',
        });
    }, []);

    return <App />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RootApp />
    </React.StrictMode>
);