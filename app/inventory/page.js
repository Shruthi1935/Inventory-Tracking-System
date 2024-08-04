"use client"
import React from 'react';
import { useEffect, onClick, useState, onChange } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import { firestore } from "@/firebase"
import { query, collection, getDocs} from "firebase/firestore";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";


export default function Inventory() {

  // Inventory Management Helper Functions
  const [inventory, setInventory] = useState([]); // default value is empty array
  const [open, setOpen] = useState(false); // default value is false
  const [itemName, setItemName] = useState(''); // item name to find or add items
  const [searchResults, setSearchResults] = useState([]); // search to find or add items

  // fetch inventory from firestone
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
      <section id="inventory" className="h-screen w-screen bg-[#300A15] fade-in"> 
        <div className="p-12">


          <div className="flex flex-col space-y-8 font-custom text-lg"> 
            <div className="font-custom text-8xl text-[#FFF8EF]"> Inventory </div>

            <div className="flex flex-row space-x-8"> 
              {/* here i want the items added by the user to show up as well as the quantity*/}
              <div className="flex flex-col bg-[#7c445566] p-10 rounded-md overflow-hidden overflow-y-auto max-h-[600px]"> 
                {inventory.map(item => (
                  <div className="flex flex-row justify-between space-x-32 border-b border-[#9e8f933d] p-4">
                    <div className="text-[#c8c8c8a6]"> {item.name} </div>
                    <div className="flex flex-row items-center justify-between space-x-8">
                      <button 
                        onClick={() => removeItem(item.name)}
                        className="text-[#c8c8c8a6]"> <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <div className="text-[#c8c8c8a6]"> {item.quantity} </div>
                      <button 
                        onClick={() => addItem(item.name)}
                        className="text-[#c8c8c8a6]"> <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>


              <div className="flex flex-col space-y-4"> 
                <input 
                  /* here the user searches to find or add an item */
                  type="text" 
                  placeholder="search / add..." 
                  className="font-custom text-lg text-center text-[#FFF8EF] bg-[#7C4455] rounded-full py-2 px-32" 
                />

                <div className="flex bg-[#FFF8EF] p-5 rounded-sm"> 
                  {/* here i want the items searched by the user to show up */}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
