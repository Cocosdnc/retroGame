import Game from '@/components/Game';
import React from 'react';

const Game1: React.FC = () => {
  const greenBoxImageUrls = [
    '/money.png',
    '/alcool.png',
  ];
  const preloadImagesAsync = (imageUrls: string[]) => {
    if (typeof window === "undefined") return Promise.resolve(); // Skip preloading on the server

    return Promise.all(
        imageUrls.map(
            (url) =>
                new Promise((resolve, reject) => {
                    const img = new window.Image(); // Use `window.Image` explicitly
                    img.src = url;
                    img.onload = resolve;
                    img.onerror = reject;
                })
        )
    );
};


  const allImages = [
    "/money.png",
    "/alcool.png",
    "/police.png",
    "/JacquesLalie",
    ...greenBoxImageUrls,
  ];

  preloadImagesAsync(allImages)
    .then(() => console.log("All images preloaded"))
    .catch((err) => console.warn("Error preloading images", err));


  return <Game greenBoxImageUrls={greenBoxImageUrls} />;
};

export default Game1;
