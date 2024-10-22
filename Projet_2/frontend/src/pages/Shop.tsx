import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import CollectionAbi from '../abis/Collection.json';  // 引入你的合约ABI
import styles from './Shop.module.css';

interface Card {
  tokenId: number;
  uri: string;
  price: string;
}

interface ShopProps {
  onPurchaseSuccess: () => void;
}

export const Shop: React.FC<ShopProps> = ({ onPurchaseSuccess }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 获取可供出售的卡牌
  const fetchForSaleCards = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask 未安装');
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const collectionContractAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'; // 替换为你的合约地址
      const collectionContract = new ethers.Contract(collectionContractAddress, CollectionAbi, signer);
  
      const forSaleCards = await collectionContract.getForSaleCards();
      console.log("Fetched cards: ", forSaleCards); // 调试输出卡牌信息
      setCards(forSaleCards);
    } catch (error: any) {
      console.error('获取卡牌失败:', error);
      setErrorMessage('获取卡牌失败，请重试');
    }
  };
  

  // 购买卡牌
  const buyCard = async (tokenId: number, price: string) => {
    try {
      if (!window.ethereum) throw new Error('MetaMask 未安装');

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const collectionContractAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'; // 替换为你的合约地址
      const collectionContract = new ethers.Contract(collectionContractAddress, CollectionAbi, signer);

      const tx = await collectionContract.buyCard(tokenId, {
        value: ethers.utils.parseEther(price),  // 支付相应的价格
      });
      await tx.wait();

      setPurchaseSuccess(true);
      onPurchaseSuccess();  // 触发父组件的回调，更新状态
    } catch (error: any) {
      console.error('购买失败:', error);
      setErrorMessage('购买失败，请重试');
    }
  };

  useEffect(() => {
    fetchForSaleCards();  // 加载可供购买的卡牌
  }, []);

  return (
    <div className={styles.container}>
      <h2>商店</h2>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      {purchaseSuccess && <p>购买成功！</p>}
      {cards.length > 0 ? (
        <div className={styles.cardsGrid}>
          {cards.map((card, index) => (
            <div key={index} className={styles.card}>
              <img src={card.uri} alt={`Card ${card.tokenId}`} className={styles.cardImage} />
              <div className={styles.cardContent}>
                <h3>卡牌 {card.tokenId}</h3>
                <p>价格: {ethers.utils.formatEther(card.price)} ETH</p>
                <button onClick={() => buyCard(card.tokenId, card.price)}>购买</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>没有可供出售的卡牌。</p>
      )}
    </div>
  );
};
