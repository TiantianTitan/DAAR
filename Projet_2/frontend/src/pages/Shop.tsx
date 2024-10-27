import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import CollectionAbi from '../abis/Collection.json';
import styles from './Shop-styles.module.css';

import boosterImg from '../Img_src/Booster.png'

import BoosterAbi from '../abis/Booster.json';

// 替换为你的 Collection 合约地址
const collectionContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const boosterContractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

export const Shop = () => {
    const [cards, setCards] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // 分页当前页
    const [displayType, setDisplayType] = useState<'cards' | 'booster'>('cards'); // 新增状态

    const [selectedPage, setSelectedPage] = useState(1);
    const cardsPerPage = 10;

    useEffect(() => {
        // 从你的服务器获取卡片数据
        fetch('http://localhost:5000/api/cards')
            .then(response => response.json())
            .then(data => {
                // Ensure that the ID is correctly handled even if not a number
                const cards = data.data.map((card: any, index: number) => ({
                    ...card,
                    id: index, // Use the index as a fallback if the card.id is not valid
                }));
                setCards(cards);  // 设置卡片数据
            })
            .catch(error => {
                console.error('Error fetching cards:', error);
                setErrorMessage('加载卡片失败');
            });
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

    // 连接 MetaMask
    const connectMetaMask = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts.length > 0) {
                    return accounts[0]; // 返回第一个账户地址
                } else {
                    throw new Error('No account found.');
                }
            } catch (error) {
                throw new Error('Error connecting to MetaMask.');
            }
        } else {
            throw new Error('MetaMask is not installed.');
        }
    };

    useEffect(() => {
        connectMetaMask();
    }, []);

    const buyCard = async (tokenURI: string) => {
        if (!window.ethereum) {
            setErrorMessage('请安装MetaMask');
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const collectionContract = new ethers.Contract(collectionContractAddress, CollectionAbi, signer);

            // 发送购买卡片的交易
            const tx = await collectionContract.buyCard(tokenURI, {
                value: ethers.utils.parseEther('0.05'),  // 支付的价格为 0.05 ETH
                gasLimit: ethers.utils.hexlify(300000)  // 设置 gas 限制
            });

            await tx.wait();  // 等待交易被确认

            console.log(`Card purchased successfully!`);
            setPurchaseSuccess(true);
        } catch (error) {
            console.error('购买卡牌失败:', error);
            setErrorMessage('购买卡牌失败，请重试');
        }
    };


    const buyBooster = async () => {
        if (!window.ethereum) {
            setErrorMessage('请安装MetaMask');
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const boosterContract = new ethers.Contract(boosterContractAddress, BoosterAbi, signer);

            // 获取 Booster 价格
            const boosterPrice = await boosterContract.boosterPrice();

            // 发送购买 Booster 的交易
            const tx = await boosterContract.buyBooster({
                value: boosterPrice,
                gasLimit: ethers.utils.hexlify(300000)
            });

            await tx.wait();

            console.log('Booster purchased successfully!');
            setPurchaseSuccess(true);
        } catch (error) {
            console.error('购买Booster失败:', error);
            setErrorMessage('购买Booster失败，请重试');
        }
    };


    return (
        <div className={styles.container}>
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}

            {displayType === 'cards' ? (
                <div className={styles.cardsGrid}>
                    {currentCards.length > 0 ? (
                        currentCards.map((card) => (
                            <div key={card.id} className={styles.card}>
                                <img src={card.images.small} alt={card.name} className={styles.cardImage}/>
                                <div className={styles.cardContent}>
                                    <button onClick={() => buyCard(card.images.small)}>
                                        购买此卡牌
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>加载卡片中...</p>
                    )}
                </div>
            ) : (
                <div className={styles.booster}>
                    <img src={boosterImg} alt="Booster" className={styles.boosterImage}/>
                    <button onClick={() => buyBooster()}>购买Booster</button>
                </div>
            )}

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

            {purchaseSuccess && <p>购买成功！请刷新查看最新的卡片信息。</p>}

            <div className={styles.switchButtons}>
                <button onClick={() => setDisplayType('cards')}>Card</button>
                <button onClick={() => setDisplayType('booster')}>Booster</button>
            </div>
        </div>
    );
};
