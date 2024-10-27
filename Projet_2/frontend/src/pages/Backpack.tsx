import React, { useState, useEffect } from 'react';
import styles from './Backpack-styles.module.css';

import { ethers } from 'ethers';
import BoosterAbi from '../abis/Booster.json';
const boosterContractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

import boosterImg from '../Img_src/Booster.png'

export const Backpack = () => {

    const [cards, setCards] = useState<any[]>([]);
    const [userAddress, setUserAddress] = useState('');
    const [boosterIds, setBoosterIds] = useState<string[]>([]);

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
            // 获取用户持有的 Booster
            const getUserBoosters = async () => {
                try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const boosterContract = new ethers.Contract(boosterContractAddress, BoosterAbi, provider);
                    const balance = await boosterContract.balanceOf(userAddress);
                    const ids = [];
                    for (let i = 0; i < balance; i++) {
                        const boosterId = await boosterContract.tokenOfOwnerByIndex(userAddress, i);
                        ids.push(boosterId.toString());
                    }
                    setBoosterIds(ids);
                } catch (error) {
                    console.error('Error fetching user boosters from contract:', error);
                }
            };
            getUserBoosters();

            // 获取用户持有的卡牌
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



    const openBooster = async (boosterId: string) => {
        if (!window.ethereum) {
            alert('请安装 MetaMask');
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const boosterContract = new ethers.Contract(boosterContractAddress, BoosterAbi, signer);

            // 模拟调用以捕获可能的错误
            try {
                await boosterContract.callStatic.openBooster(boosterId);
            } catch (error) {
                console.error('模拟调用失败:', error);

                alert('打开 Booster 失败，请检查控制台错误信息');
                return;
            }

            const tx = await boosterContract.openBooster(boosterId, {
                gasLimit: ethers.utils.hexlify(300000)
            });

            await tx.wait();

            alert('Booster 已打开，您获得了 5 张新卡牌！');

            // 更新用户的 Booster 列表
            const balance = await boosterContract.balanceOf(userAddress);
            const ids = [];
            for (let i = 0; i < balance; i++) {
                const boosterId = await boosterContract.tokenOfOwnerByIndex(userAddress, i);
                ids.push(boosterId.toString());
            }
            setBoosterIds(ids);

            // 更新用户的卡牌列表
            fetch(`http://localhost:5000/api/user-cards?address=${userAddress}`)
                .then(response => response.json())
                .then(data => {
                    setCards(data);
                })
                .catch(error => {
                    console.error('Error fetching user cards:', error);
                });
        } catch (error) {
            console.error('打开 Booster 失败:', error);

            alert('打开 Booster 失败，请重试');
        }
    };

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

            {/* 显示 Booster */}
            {boosterIds.length > 0 && (
                <div className={styles.boosterGrid}>
                    {boosterIds.map((boosterId) => (
                        <div key={boosterId} className={styles.booster}>
                            <img src={boosterImg} alt={`Booster ${boosterId}`} className={styles.boosterImage} />
                            <button onClick={() => openBooster(boosterId)}>打开 Booster</button>
                        </div>
                    ))}
                </div>
            )}

            {/* 显示卡牌 */}
            <div className={styles.container}>
                <div className={styles.cardsGrid}>
                    {cards.length > 0 ? (
                        currentCards.map((card) => (
                            <div key={card.tokenId} className={styles.card}>
                                <img src={card.tokenURI} alt={`Card ${card.tokenId}`} className={styles.cardImage} />
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
