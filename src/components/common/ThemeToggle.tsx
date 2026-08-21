import React, { useEffect, useState } from 'react';
import { Moon, SunMedium } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        if (typeof window === 'undefined') {
            return 'dark';
        }

        const savedTheme = localStorage.getItem('mule-theme');
        if (savedTheme === 'dark' || savedTheme === 'light') {
            return savedTheme;
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('mule-theme', theme);
    }, [theme]);

    return (
        <button
            type="button"
            aria-label="Toggle color theme"
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            className="theme-toggle-button inline-flex h-10 w-10 items-center justify-center rounded-xl border transition"
        >
            {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
    );
};
