'use client';
import { useState, useEffect, useCallback } from 'react';
import ScratchCard from './ScratchCard';

const ScratchCardGrid = () => {
  const [cards, setCards] = useState([]);
  const [luckyCardIndex, setLuckyCardIndex] = useState(-1);
  const [revealed, setRevealed] = useState(false);
  const totalCards = 10;

  const generateDiscount = useCallback((isLucky) => {
    return isLucky 
      ? `${Math.floor(Math.random() * 41) + 50}% OFF`
      : `${Math.floor(Math.random() * 50)}% OFF`;
  }, []);

  useEffect(() => {
    const newLuckyIndex = Math.floor(Math.random() * totalCards);
    setLuckyCardIndex(newLuckyIndex);
    
    const newCards = Array.from({ length: totalCards }).map((_, i) => ({
      id: i,
      discount: generateDiscount(i === newLuckyIndex),
      isRevealed: false,
      isLucky: i === newLuckyIndex,
    }));
    
    setCards(newCards);
  }, [generateDiscount]);

  const revealAll = useCallback(() => {
    setRevealed(true);
    setCards(prev => prev.map(card => ({ ...card, isRevealed: true })));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <h1 className="text-2xl font-bold mb-4">Scratch to Win!</h1>
      <div className="grid grid-cols-5 gap-4">
        {cards.map((card) => (
          <ScratchCard
            key={card.id}
            discount={card.discount}
            isLucky={card.isLucky}
            isRevealed={card.isRevealed || revealed}
            onScratchComplete={revealAll}
          />
        ))}
      </div>
    </div>
  );
};

export default ScratchCardGrid;