// layouts/Layout.tsx
import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import styles from '../styles.module.css';
import logo from '../Img_src/Logo.png';
import pokemonBall from '../Img_src/PokemonBall.png';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const [isFullyVisible, setIsFullyVisible] = useState(false);
    const [isNavbarVisible, setIsNavbarVisible] = useState(false);

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

    const toggleNavbar = () => {
        setIsNavbarVisible(prevState => !prevState);
    };

    return (
        <div className={styles.body}>
            <img
                src={pokemonBall}
                alt="PokemonBall"
                className={styles.pokemonBall}
                onClick={toggleNavbar}
            />

            {isNavbarVisible && <Navbar />}

            <img
                src={logo}
                alt="Logo"
                className={`${styles.logo} ${isFullyVisible ? '' : styles.stopFlipping}`}
                style={{ opacity: isFullyVisible ? 1 : 0 }}
            />

            <div className={styles.videoWrapper}>
                <iframe
                    id="youtubeVideo"
                    width="560"
                    height="315"
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
