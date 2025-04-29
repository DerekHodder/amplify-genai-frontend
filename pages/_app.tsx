import {Toaster} from 'react-hot-toast';
import {QueryClient, QueryClientProvider} from 'react-query';
import { SessionProvider } from "next-auth/react"
import {appWithTranslation} from 'next-i18next';
import type {AppProps} from 'next/app';
import {Inter} from 'next/font/google';
import HelpButton from '@/components/HelpButton';
import { useEffect, useState } from 'react';

import '@/styles/globals.css';

const inter = Inter({subsets: ['latin']});

function App({ Component, pageProps }: AppProps) {
    const queryClient = new QueryClient();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check system preference
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(darkModeMediaQuery.matches);

        // Listen for changes
        const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
        darkModeMediaQuery.addEventListener('change', handler);
        return () => darkModeMediaQuery.removeEventListener('change', handler);
    }, []);

    return (
        <SessionProvider
            refetchInterval={60}
            refetchOnWindowFocus={true}
            refetchWhenOffline={false}
        >
            <div className={`${inter.className} ${isDarkMode ? 'dark' : ''}`}>
                <Toaster/>
                <QueryClientProvider client={queryClient}>
                    <Component {...pageProps} />
                    <HelpButton />
                </QueryClientProvider>
            </div>
        </SessionProvider>
    );
}

export default appWithTranslation(App);
