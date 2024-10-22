// components/MainLayout.tsx
import React, { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import styles from './styles.module.css';

import logo from '../Img_src/Logo.png';
import pokemonBall from '../Img_src/PokemonBall.png';

interface MainLayoutProps {
    children: React.ReactNode;
    toggleNavbar: () => void;
    isNavbarVisible: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
                                                          children,
                                                          toggleNavbar,
                                                          isNavbarVisible,
                                                      }) => {
    const [isFullyVisible, setIsFullyVisible] = useState(false);

    useEffect(() => {
        const fadeInTimer = setTimeout(() => {
            setIsFullyVisible(true);
        }, 100);

        return () => clearTimeout(fadeInTimer);
    }, []);

    useEffect(() => {
        // 在 iframe 加载完成后发送播放指令
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

            {/* 视频播放窗口 */}
            <div className={styles.videoWrapper}>
                <iframe
                    id="youtubeVideo"
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/GmE3uICi9oo"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                ></iframe>
            </div>

            {children}
        </div>
    );
};
