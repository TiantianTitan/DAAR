import React, { useState, useEffect } from 'react';
import styles from './Mint-styles.module.css';

export const Mint = () => {

    const [cards, setCards] = useState<any[]>([]);
    const [userAddress, setUserAddress] = useState('');

    useEffect(() => {
        const getUserAddress = async () => {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    setUserAddress(accounts[0]);
                }
            }
        };

        getUserAddress();
    }, []);

    useEffect(() => {
        console.log('User Address:', userAddress);
    }, [userAddress]);

    useEffect(() => {
        if (userAddress) {
            fetch(`http://localhost:5000/api/user-cards?address=${userAddress}`)
                .then(response => response.json())
                .then(data => {
                    setCards(data);
                })
                .catch(error => {
                    console.error('Error fetching user cards:', error);
                });
        }
    }, [userAddress]);

    const [selectedPage, setSelectedPage] = useState(1);
    const cardsPerPage = 15;
    const [currentPage, setCurrentPage] = useState(1); // 分页当前页

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
    <div>
        <div className={styles.container}>
            <div className={styles.cardsGrid}>
                {cards.length > 0 ? (
                    currentCards.map((card) => (
                        <div key={card.tokenId} className={styles.card}>
                            <img src={card.tokenURI} alt={`Card ${card.tokenId}` } className={styles.cardImage}/>

                        </div>
                    ))
                ) : (
                    <p>你没有卡牌...</p>
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
                        {Array.from({length: totalPages}, (_, index) => (
                            <option key={index + 1} value={index + 1}>{index + 1}</option>
                        ))}
                    </select>
                    <button className={styles.jumpButton} onClick={handleJumpPage}>Jump</button>
                </div>

                <button className={styles.arrowButton} onClick={handleNextPage}>▼</button>
            </div>


        </div>
    </div>
    );
};
