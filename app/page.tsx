import React from 'react';
import Card from '@/components/Card';

const Home: React.FC = () => {

  return (
    <div className="relative h-screen bg-gray-100 overflow-hidden flex-col justify-center items-center flex" style={{ backgroundImage: "url(/bg.png)" }}>
      <h1 className="text-4xl mb-4 font-bold text-white text-center ">Choisissez <br /> Votre Champion</h1>
      <div className='flex flex-wrap gap-4'>
        <Card link="/JacquesLalie" name="Jacques Lalié" description='ex Président Province Îles' audio="burp" />
        <Card disabled link="/EmmanuelTjibaou" name="Emmanuel Tjibaou" description='Personnage pas encore disponible' audio="burp" />

      </div>

    </div>
  );
};

export default Home;
