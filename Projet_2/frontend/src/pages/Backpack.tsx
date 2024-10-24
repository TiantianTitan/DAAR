// Backpack.tsx
import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import CollectionAbi from '../abis/Collection.json'
import styles from './Backpack.module.css'

export const Backpack = ({ refreshTrigger }: { refreshTrigger: boolean }) => {
  const [cards, setCards] = useState<string[]>([])

  useEffect(() => {
    const fetchCards = async () => {
      if (!window.ethereum) return alert('请安装Metamask')

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()

      const userAddress = await signer.getAddress()

      const collectionContractAddress = 'YOUR_COLLECTION_CONTRACT_ADDRESS'
      const collectionContract = new ethers.Contract(collectionContractAddress, CollectionAbi, provider)

      try {
        const userTokens = await collectionContract.getUserTokens(userAddress)
        setCards(userTokens)
      } catch (error) {
        console.error("获取卡牌失败: ", error)
      }
    }

    fetchCards()
  }, [refreshTrigger])  // 当 refreshTrigger 改变时重新调用 useEffect

  return (

    <div className={styles.container}>
      <h2>你的背包</h2>
      {cards.length > 0 ? (
        <div className={styles.cardGrid}>
          {cards.map((tokenURI, index) => (
            <div key={index} className={styles.card}>
              <img src={tokenURI} alt={`Card ${index}`} />
            </div>
          ))}
        </div>
      ) : (
        <p>你还没有任何卡牌</p>
      )}

    </div>
  )
}
