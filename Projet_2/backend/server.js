// npm install express cors axios dotenv
// npm install ethers



require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.POKEMONTCG_API_KEY; // 从 .env 文件中读取 API Key

app.use(cors());

app.get('/api/cards', async (req, res) => {
  try {
    // 调用 REST API 获取卡片数据
    const response = await axios.get('https://api.pokemontcg.io/v2/cards', {
      headers: {
        'X-Api-Key': API_KEY,  // 使用 API Key
      },
    });
    res.json(response.data);  // 返回 API 响应的数据
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch cards' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
