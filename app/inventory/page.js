"use client"
import React from 'react';
import { useEffect, onClick, useState } from 'react';

import { firestore } from "@/firebase"
import { query, collection, getDocs} from "firebase/firestore";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";


export default function Inventory() {

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
      <section id="inventory" className="h-screen w-screen bg-[#300A15]"> 
        <div className="p-16">


          <div className="flex flex-col space-y-5"> 
            <div className="font-custom text-8xl text-[#FFF8EF]"> Inventory </div>

            <div className="flex flex-row space-x-8"> 
              <div className="grid bg-[#FFF8EF] p-8 rounded-sm "> 
                <div> hii </div> 
                <div> hii </div> 
              </div>

              <div className="flex flex-col space-y-4"> 
                <input type="text" placeholder="search / add..." className="font-custom text-lg text-center text-[#FFF8EF] bg-[#7C4455] rounded-full py-2 px-32" />
                <div className="flex bg-[#FFF8EF] p-5 rounded-sm"> results </div>
              </div>

            </div>
          </div>


        </div>
      </section>
    </div>
  );
}
