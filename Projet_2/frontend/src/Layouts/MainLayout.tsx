// layouts/MainLayout.tsx
import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import styles from '../styles.module.css';
import logo from '../Img_src/Logo.png';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const [isFullyVisible, setIsFullyVisible] = useState(false);


    useEffect(() => {
        const fadeInTimer = setTimeout(() => {
            setIsFullyVisible(true);
        }, 100);

        return () => clearTimeout(fadeInTimer);
    }, []);

    useEffect(() => {
        const iframe = document.getElementById('youtubeVideo') as HTMLIFrameElement;
        if (iframe) {
            const message = JSON.stringify({
                event: 'command',
                func: 'playVideo',
                args: [],
            });
            iframe.contentWindow?.postMessage(message, '*');
        }
    }, []);


    return (
        <div className={styles.body}>
            <Navbar />

            <img
                src={logo}
                alt="Logo"
                className={`${styles.logo} ${isFullyVisible ? '' : styles.stopFlipping}`}
                style={{ opacity: isFullyVisible ? 1 : 0 }}
            />

            <div className={styles.videoWrapper}>
                <iframe
                    id="youtubeVideo"
                    src="https://www.youtube.com/embed/GmE3uICi9oo"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>

            {children}
        </div>
    );
};
