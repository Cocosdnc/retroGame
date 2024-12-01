import Game from '@/components/Game';
import React from 'react';

const Game1: React.FC = () => {
  const greenBoxImageUrls = [
    '/money.png',
    '/alcool.png',
  ];

  return <Game greenBoxImageUrls={greenBoxImageUrls} />;
};

export default Game1;
