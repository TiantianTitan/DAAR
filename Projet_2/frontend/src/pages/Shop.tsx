// Shop.tsx
import React, { useState } from 'react'
import { ethers } from 'ethers'
import CollectionAbi from '../abis/Collection.json'
import styles from './Shop.module.css'

export const Shop = ({ onPurchaseSuccess }: { onPurchaseSuccess: () => void }) => {
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)

  const buyCardPack = async () => {
    if (!window.ethereum) return alert('请安装MetaMask')

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    // 替换为你的 Collection 合约地址
    const collectionContractAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
    const collectionContract = new ethers.Contract(collectionContractAddress, CollectionAbi, signer)

    try {
      // 假设每个卡包的价格是 0.05 ETH
      const tx = await collectionContract.mintCard(await signer.getAddress(), "your-token-uri", { value: ethers.utils.parseEther("0.05") })
      await tx.wait()
      setPurchaseSuccess(true)
      onPurchaseSuccess()  // 触发背包刷新
    } catch (error) {
      console.error('购买卡牌包失败:', error)
      alert('购买卡牌包失败，请重试')
    }
  }

  return (
    <div className={styles.container}>
      <h2>购买卡牌包</h2>
      <p>每个卡牌包售价：0.05 ETH</p>
      <button onClick={buyCardPack}>购买卡牌包</button>
      {purchaseSuccess && <p>购买成功！请前往背包查看你的新卡牌。</p>}
    </div>
  )
}
