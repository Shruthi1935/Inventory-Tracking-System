"use client"
import React from 'react';
import { useEffect, onClick, useState } from 'react';

import Image from 'next/image';
import ggDessert from '../public/img/gourmetGrottoDessert.png';
import ggLogo from '../public/img/gourmetGrottoLogo.png';

import { firestore } from "@/firebase"
import { query, collection, getDocs} from "firebase/firestore";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";


export default function Home() {

  useEffect(() => {
    const timeout = setTimeout(() => {
      document.getElementById('welcome-screen').classList.add('hidden');
      document.getElementById('access-screen').classList.remove('hidden');
    }, 4600);
    return () => clearTimeout(timeout);
  }, []);

  // Inventory Management Helper Functions
  const [inventory, setInventory] = useState([]); // default value is empty array
  const [open, setOpen] = useState(false); // default value is false
  const [itemName, setItemName] = useState(''); // default value is empty string

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);



  
  return (
    <div>
      <section id="intro" className="h-screen w-screen bg-[#FFF8EF] flex items-center justify-center">
        <div id="welcome-screen" className="fade-in">
          <div className="flex flex-col space-y-8 items-center justify-center fade-out"> 
            <div className="font-custom text-5xl text-[#550A1F] text-center m-3"> WELCOME TO YOUR </div>
            <Image src={ggDessert} alt="Gourmet Grotto Logo" width={500} height={500} />
            <div className="font-custom text-9xl text-[#550A1F] text-center animate-typing overflow-hidden whitespace-nowrap"> Gourmet Grotto </div>
          </div>
        </div>

        <div id="access-screen" className="fade-in h-screen w-screen bg-[#300A15] flex items-center justify-center hidden">    
          <div className="flex flex-col items-center justify-center space-y-12"> 
            <span className="font-custom text-7xl text-[#FFF8EF] text-center animate-typing overflow-hidden whitespace-nowrap"> Access Your Inventory Here </span>
            <button className="fade-in-after font-custom text-xl text-[#300A15] text-center bg-[#FFF8EF] rounded-full py-2 px-5 hover:-translate-y-3 duration-500"> Open Grotto </button>
          </div>
        </div>
      </section>


      <section id="inventory" className="h-screen w-screen bg-[#300A15]"> 
        <div className="flex flex-col space-y-6"> 
          <div className="font-custom text-8xl text-[#FFF8EF] text-left"> Inventory </div>
          <div className="flex flex-row space-x-6">
            <div className="grid grid-col-2 gap-4 text-[#FFF8EF]">
              have to make it a grid and map it
            </div>
            <div className="flex flex-col space-y-4">
              <div>search/add</div>
              <div>display queries</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
