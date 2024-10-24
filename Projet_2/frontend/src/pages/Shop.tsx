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

  useEffect(() => {
    // 从你的服务器获取卡片数据
    fetch('http://localhost:5000/api/cards')
      .then(response => response.json())
      .then(data => {
        setCards(data.data);  // 设置卡片数据
      })
      .catch(error => {
        console.error('Error fetching cards:', error);
      });
  }, []);

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

  // 购买卡牌包函数
  const buyCardPack = async () => {
    if (!window.ethereum) {
      setErrorMessage('请安装MetaMask');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const collectionContract = new ethers.Contract(collectionContractAddress, CollectionAbi, signer);

      // 假设卡牌包的价格是 0.5 ETH
      const tx = await collectionContract.buyCardPack({
        value: ethers.utils.parseEther('0.5'),  // 设置卡牌包价格
        gasLimit: ethers.utils.hexlify(300000)  // 设置 gas 限制
      });

      await tx.wait();  // 等待交易被确认

      console.log('Card pack purchased successfully!');
      setPurchaseSuccess(true);
    } catch (error) {
      console.error('购买卡牌包失败:', error);
      setErrorMessage('购买卡牌包失败，请重试');
    }
  };

  return (
    <div className={styles.container}>
      <h2>卡牌商店</h2>
      <p>在这里购买卡片包或单独的卡片。</p>

      {/* 卡牌包购买部分 */}
      <div className={styles.cardPackSection}>
        <h3>购买卡牌包</h3>
        <p>卡牌包售价：0.5 ETH</p>
        <button onClick={buyCardPack}>购买卡牌包</button>
      </div>

      {/* 单张卡片购买部分 */}
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      <div className={styles.cardSection}>
        <h3>购买单张卡片</h3>
        {cards.length > 0 ? (
          <div className={styles.cardsGrid}>
            {cards.map((card) => (
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
            ))}
          </div>
        ) : (
          <p>加载卡片中...</p>
        )}
      </div>

      {purchaseSuccess && <p>购买成功！请刷新查看最新的卡片信息。</p>}
    </div>
  );
};
