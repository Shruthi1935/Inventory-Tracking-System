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
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');


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
    setSuccessMessage(`Successfully added to inventory.`);
    setTimeout(() => setSuccessMessage(''), 2000);
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

  // Delete Items
  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity > 0) {
        await deleteDoc(docRef);
      }
    }
    await updateInventory();
    setDeleteMessage(`Successfullt deleted from inventory.`);
    setTimeout(() => setDeleteMessage(''), 2000);
  };

  // Search items
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setItemName(query);
    const results = inventory.filter(item =>
      item.name.toLowerCase().includes(query)
    );
    setSearchResults(results);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  return (
    <div>
    <section id="inventory" className="h-screen w-screen bg-[#300A15] fade-in"> 

      <div className="py-10 px-24">
        <div className="absolute top-0 left-0 right-0 mt-5"> 
          {/* Confirmation message */}
          {successMessage && (
            <div className="fade-in fade-out-two font-custom text-[#e1e1e1db] text-center mb-4">
              {successMessage}
            </div>
          )}
        </div>
        <div className="absolute top-0 left-0 right-0 mt-5"> 
          {/* Confirmation message */}
          {deleteMessage && (
            <div className="fade-in fade-out-two font-custom text-[#e1e1e1db] text-center mb-4">
              {deleteMessage}
            </div>
          )}
        </div>

      <div className="flex flex-col space-y-12 font-custom text-md"> 
        <div className="font-custom text-8xl text-[#e1e1e1db]"> INVENTORY </div>

        <div className="flex flex-row space-x-12"> 
          <div className="flex flex-col bg-[#7c445566] p-10 rounded-md overflow-hidden overflow-y-auto max-h-[600px] w-full"> 
            <div className="flex flex-row p-2 mb-5">
              <h1 className="text-[#e1e1e1db] w-3/4 text-2xl font-bold">Item</h1>
              <h1 className="text-[#e1e1e1db] w-1/4 text-2xl font-bold text-center">Quantity</h1>
            </div>
            {inventory.map(item => (
              <div className="flex flex-row justify-between border-b border-[#9e8f933d] p-2">
                <div className="text-[#e1e1e1db] flex-shrink-0 w-3/4"> {item.name} </div>
                <div className="flex flex-row items-center justify-between space-x-8 w-1/4">
                  <button 
                    onClick={() => removeItem(item.name)}
                    className="text-[#e1e1e1db]"> <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <div className="text-[#e1e1e1db]"> {item.quantity} </div>
                  <button 
                    onClick={() => addItem(item.name)}
                    className="text-[#e1e1e1db]"> <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col space-y-8 w-full"> 
            <div className="flex flex-row space-x-4">
              <input 
                type="text" 
                value={itemName}
                onChange={handleSearch}
                placeholder="search / add inventory ..." 
                className="font-custom text-lg text-center text-[#e1e1e1db] bg-[#7C4455] rounded-full py-2 px-28 w-full" 
              />
              <button 
                onClick={() => addItem(itemName)}
                className="text-md text-[#e1e1e1db] border border-[#e1e1e1db] rounded-full py-1 px-6 hover:-translate-y-1 duration-200"> Add
              </button>
            </div>

            <div className="flex-col bg-[#7c445566] p-10 rounded-md overflow-hidden overflow-y-auto h-[525px] max-h-[525px] w-full"> 
              {searchResults.map(item => (
                <div className="flex flex-row items-center justify-between border-b border-[#9e8f933d] p-2">
                  <div className="text-[#e1e1e1db] flex-shrink-0 w-3/4"> {item.name} </div>
                  <div className="flex flex-row items-center justify-between space-x-8 w-1/4">
                    <div className="text-[#e1e1e1db]"> {item.quantity} </div>
                    <button 
                      onClick={() => deleteItem(item.name)}
                      className="text-sm text-[#e1e1e1db] border border-[#e1e1e1db] rounded-full py-1 px-3 hover:-translate-y-1 duration-200"> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

  </section>
  </div>
  );
}
