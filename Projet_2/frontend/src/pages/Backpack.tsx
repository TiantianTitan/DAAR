import React, { useState, useEffect } from 'react';
import styles from "./Backpack-styles.module.css";
import Cookies from 'js-cookie';

export const Backpack = () => {
    const [cards, setCards] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPage, setSelectedPage] = useState(1);
    const cardsPerPage = 18; // 每页显示18张卡片（3行 * 6列）

    useEffect(() => {
        const storedCards = localStorage.getItem('cardsData'); // 先从localStorage中读取数据

        if (storedCards) {
            // 如果 localStorage 中有数据，则直接使用
            setCards(JSON.parse(storedCards));
        } else {
            // 如果不存在，则从 API 请求数据并存储到 localStorage 和 cookie
            fetch('http://localhost:5000/api/cards')
                .then(response => response.json())
                .then(data => {
                    setCards(data.data);
                    // 将数据存储到 localStorage 和 cookie
                    localStorage.setItem('cardsData', JSON.stringify(data.data));
                    Cookies.set('cardsData', JSON.stringify(data.data), { expires: 0 });
                })
                .catch(error => {
                    console.error('Error fetching cards:', error);
                });
        }
    }, []);

    const totalPages = Math.ceil(cards.length / cardsPerPage);

    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            setSelectedPage(prev => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
            setSelectedPage(prev => prev + 1);
        }
    };

    const handleJumpPage = () => {
        setCurrentPage(selectedPage);
    };

    useEffect(() => {
        setSelectedPage(currentPage);
    }, [currentPage]);

    return (
        <div className={styles.container}>
            <div className={styles.cardsGrid}>
                {currentCards.length > 0 ? (
                    currentCards.map((card) => (
                        <div className={styles.card} key={card.id}>
                            <img src={card.images.small} alt={card.name} className={styles.cardImage}/>
                        </div>
                    ))
                ) : (
                    <p>加载卡片中...</p>
                )}
            </div>

            <div className={styles.paginationSidebar}>
                <button className={styles.arrowButton} onClick={handlePreviousPage}>▲</button>
                
                <div className={styles.jumpContainer}>
                    <select
                        className={styles.jumpSelect}
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(Number(e.target.value))}
                    >
                        {Array.from({ length: totalPages }, (_, index) => (
                            <option key={index + 1} value={index + 1}>{index + 1}</option>
                        ))}
                    </select>
                    <button className={styles.jumpButton} onClick={handleJumpPage}>Jump</button>
                </div>
                
                <button className={styles.arrowButton} onClick={handleNextPage}>▼</button>
            </div>
        </div>
    );
};
