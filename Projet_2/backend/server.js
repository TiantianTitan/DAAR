require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { ethers } = require('ethers');

const app = express();
const PORT = 5000;
const API_KEY = 'd2a9d839-2e57-405d-b696-8028cf1bc752'; // Replace with your actual API key

app.use(cors());
app.use(express.json());

// Setup provider and contract instance
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545'); // Correct provider
const collectionContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Replace with your actual contract address
const contractABI = require('../contracts/artifacts/src/Collection.sol/Collection.json').abi;
const contract = new ethers.Contract(collectionContractAddress, contractABI, provider);

// Used to store purchase records
let purchaseRecords = [];

// Function to fetch past CardPurchased events
const fetchPurchaseRecords = async () => {
  try {
    console.log('Fetching CardPurchased events...');

    // Create a filter for CardPurchased events
    const filter = contract.filters.CardPurchased();
    const fromBlock = 0n; // Start from block 0

    // Query past events (toBlock is optional and defaults to latest)
    const events = await contract.queryFilter(filter, fromBlock);

    console.log(`Found ${events.length} CardPurchased events`);

    // Map events to purchase records
    purchaseRecords = await Promise.all(events.map(async (event) => {
      const { buyer, tokenId, tokenURI } = event.args;
      const block = await provider.getBlock(event.blockNumber);
      return {
        buyer,
        tokenId: tokenId.toString(),
        tokenURI,
        transactionHash: event.transactionHash,
        timestamp: new Date(Number(block.timestamp) * 1000), // Convert UNIX timestamp to Date
      };
    }));
  } catch (error) {
    console.error('Error fetching CardPurchased events:', error);
  }
};

// Initialize by fetching purchase records
(async () => {
  await fetchPurchaseRecords();
})();

// Periodically update purchase records (optional)
setInterval(fetchPurchaseRecords, 3000); // Update every 5 seconds

// API endpoint - Get card data
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

// API endpoint - Get user's purchased cards
app.get('/api/user-cards', async (req, res) => {
  const address = req.query.address;

  if (!address) {
    return res.status(400).json({ error: 'Address query parameter is required' });
  }

  const userAddress = address.toLowerCase();

  // Find purchase records for the specified user
  const userCards = purchaseRecords.filter(record => record.buyer.toLowerCase() === userAddress);

  res.json(userCards);
});


const boosterContractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const boosterABI = require('../contracts/artifacts/src/Booster.sol/Booster.json').abi;
const boosterContract = new ethers.Contract(boosterContractAddress, boosterABI, provider);

// 用于存储 Booster 购买记录
let boosterPurchaseRecords = [];

// 获取 Booster 购买记录的函数
const fetchBoosterPurchaseRecords = async () => {
  try {
    console.log('Fetching BoosterPurchased events...');

    const filter = boosterContract.filters.BoosterPurchased();
    const fromBlock = 0n;

    const events = await boosterContract.queryFilter(filter, fromBlock);

    console.log(`Found ${events.length} BoosterPurchased events`);

    boosterPurchaseRecords = events.map(event => {
      const { buyer, boosterId } = event.args;
      return {
        buyer,
        boosterId: boosterId.toString(),
        transactionHash: event.transactionHash,
      };
    });
  } catch (error) {
    console.error('Error fetching BoosterPurchased events:', error);
  }
};

// 初始化时获取 Booster 购买记录
(async () => {
  await fetchBoosterPurchaseRecords();
})();


// 定期更新 Booster 购买记录
setInterval(fetchBoosterPurchaseRecords, 3000);

// API 端点 - 获取用户的 Booster
app.get('/api/user-boosters', async (req, res) => {
  const address = req.query.address;

  if (!address) {
    return res.status(400).json({ error: 'Address query parameter is required' });
  }

  const userAddress = address.toLowerCase();

  // 查找指定用户的 Booster
  const userBoosters = boosterPurchaseRecords.filter(record => record.buyer.toLowerCase() === userAddress);

  res.json(userBoosters);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
