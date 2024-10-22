require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.POKEMONTCG_API_KEY; // 从 .env 文件中读取 API Key

app.use(cors());
app.use(express.json()); // 解析 JSON 请求体

// 内存中存储用户购买的卡片信息
let userPurchasedCards = {};

// API 端点 - 存储用户购买的卡片信息
app.post('/api/store-purchased-card', (req, res) => {
  const { userAddress, cardId, tokenId, cardName, cardImage } = req.body;

  if (!userPurchasedCards[userAddress]) {
    userPurchasedCards[userAddress] = [];
  }

  userPurchasedCards[userAddress].push({
    cardId,
    tokenId,
    cardName,
    cardImage,
  });

  res.json({ message: 'Card stored successfully!' });
});

// API 端点 - 获取某个用户的卡片信息
app.get('/api/user-cards', (req, res) => {
  const userAddress = req.query.userAddress;

  if (!userPurchasedCards[userAddress]) {
    return res.status(404).json({ message: 'No cards found for this user' });
  }

  res.json(userPurchasedCards[userAddress]);
});

// API 端点 - 获取所有待出售的卡片
app.get('/api/cards/for-sale', (req, res) => {
  const forSaleCards = [];

  Object.values(userPurchasedCards).forEach(userCards => {
    userCards.forEach(card => {
      if (card.isForSale) {
        forSaleCards.push(card);
      }
    });
  });

  res.json(forSaleCards);
});

// API 端点 - 获取 Pokemon 卡牌数据
app.get('/api/cards', async (req, res) => {
  try {
    const response = await axios.get('https://api.pokemontcg.io/v2/cards', {
      headers: {
        'X-Api-Key': API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch cards' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
