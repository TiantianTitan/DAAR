import React, { useState, useEffect } from 'react';

export const Mint = () => {
  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/cards')
      .then(response => response.json())
      .then(data => {
        setCards(data.data);  // 获取 data 数组
      })
      .catch(error => {
        console.error('Error fetching cards:', error);
      });
  }, []);

  return (
    <div>
      <h2>铸造卡片</h2>
      <p>在这里使用材料铸造新的卡片。</p>
      <div>
        {cards.length > 0 ? (
          <ul>
            {cards.map((card) => (
              <li key={card.id}>
                <img src={card.images.small} alt={card.name} />
                <p>{card.name}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>加载卡片中...</p>
        )}
      </div>
    </div>
  );
};
