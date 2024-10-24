import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import CollectionAbi from '../abis/Collection.json';
import styles from './Shop.module.css';

// 替换为你的 Collection 合约地址
const collectionContractAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';

export const Shop = () => {
    const [cards, setCards] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // 分页当前页
    const cardsPerPage = 18; // 每页显示的卡片数量

    useEffect(() => {
        // 从你的服务器获取卡片数据
        fetch('http://localhost:5000/api/cards')
            .then(response => response.json())
            .then(data => {
                setCards(data.data);  // 设置卡片数据
            })
            .catch(error => {
                console.error('Error fetching cards:', error);
                setErrorMessage('加载卡片失败');
            });
    }, []);

    // 计算当前页要显示的卡片
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);

    // 处理页码点击
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(cards.length / cardsPerPage);

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

    // 购买卡片函数
    const buyCard = async (tokenId: string, price: string) => {
        if (!window.ethereum) {
            setErrorMessage('请安装MetaMask');
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const collectionContract = new ethers.Contract(collectionContractAddress, CollectionAbi, signer);

            // 发送购买卡片的交易
            const tx = await collectionContract.buyCard(tokenId, {
                value: ethers.utils.parseEther(price),  // 支付的价格
                gasLimit: ethers.utils.hexlify(300000)  // 设置 gas 限制
            });

            await tx.wait();  // 等待交易被确认

            console.log(`Card ${tokenId} purchased successfully!`);
            setPurchaseSuccess(true);
        } catch (error) {
            console.error('购买卡牌失败:', error);
            setErrorMessage('购买卡牌失败，请重试');
        }
    };

    return (
        <div className={styles.container}>
            <h2>卡牌商店</h2>
            <p>在这里购买卡片包或单独的卡片。</p>

            {/* 单张卡片购买部分 */}
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
            <div className={styles.cardsGrid}>
                {currentCards.length > 0 ? (
                    currentCards.map((card) => (
                        <div key={card.id} className={styles.card}>
                            <img src={card.images.small} alt={card.name} className={styles.cardImage} />
                            <div className={styles.cardContent}>
                                <h4>{card.name}</h4>
                                <p>Token ID: {card.id}</p>
                                <p>Price: 0.05 ETH</p> {/* 假设每张卡的价格为 0.05 ETH */}
                                <button onClick={() => buyCard(card.id, '0.05')}>
                                    购买此卡片
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>加载卡片中...</p>
                )}
            </div>

            {/* 页码 */}
            <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={currentPage === index + 1 ? styles.activePage : ''}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {purchaseSuccess && <p>购买成功！请刷新查看最新的卡片信息。</p>}
        </div>
    );
};
