// layouts/MainLayout.tsx
import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import styles from '../pages/Mint-styles.module.css';
import logo from '../Img_src/Logo.png';

export const MintLayout = ({ children }: { children: React.ReactNode }) => {
    const [isFullyVisible, setIsFullyVisible] = useState(false);

    useEffect(() => {
        const fadeInTimer = setTimeout(() => {
            setIsFullyVisible(true);
        }, 100);

        return () => clearTimeout(fadeInTimer);
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



            {children}
        </div>
    );
};
