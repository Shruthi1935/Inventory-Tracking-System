"use client"
import React from 'react';
import { useEffect, onClick, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ggDessert from '../public/img/gourmetGrottoDessert.png';
import ggLogo from '../public/img/gourmetGrottoLogo.png';

import { firestore } from "@/firebase"
import { query, collection, getDocs} from "firebase/firestore";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";


export default function Home() {

  const router = useRouter(); // Correctly use the useRouter hook
  const handleOpenGrotto = () => {
    router.push('/inventory'); // Navigate to inventory page
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      document.getElementById('welcome-screen').classList.add('hidden');
      document.getElementById('access-screen').classList.remove('hidden');
    }, 4600);
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <div>
      <section id="intro" className="h-screen w-screen bg-[#FFF8EF] flex items-center justify-center">
        <div id="welcome-screen" className="fade-in">
          <div className="absolute top-0 left-0 m-4 fade-out">
            <Image src={ggLogo} alt="Gourmet Grotto Logo" width={100} height={100} className="text-left"/>
          </div>
          <div className="flex flex-col space-y-4 items-center justify-center fade-out"> 
            <div className="font-custom text-5xl text-[#550A1F] text-center"> WELCOME TO YOUR </div>
            <Image src={ggDessert} alt="Gourmet Grotto Dessert" width={500} height={500} />
            <div className="font-custom text-9xl text-[#550A1F] text-center animate-typing overflow-hidden whitespace-nowrap"> Gourmet Grotto </div>
          </div>
        </div>

        <div id="access-screen" className="fade-in h-screen w-screen bg-[#300A15] flex items-center justify-center hidden">  
          <div className="flex flex-col items-center justify-center space-y-14"> 
            <span className="font-custom text-7xl text-[#FFF8EF] text-center animate-typing overflow-hidden whitespace-nowrap"> Access Your Inventory Here </span>
            <button 
              onClick={handleOpenGrotto}
              className="fade-in-after font-custom text-xl text-[#FFF8EF] text-center border border-[#FFF8EF] rounded-full py-2 px-5 hover:-translate-y-3 duration-500"> Open Grotto 
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
