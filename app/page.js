import React from 'react';
import Image from 'next/image';
import gglogo from '../public/img/gourmetGrottoLogo.png'; // Correct import for Next.js

export default function Home() {
  return (
    <div>
      <section id="intro" className="h-screen w-screen bg-[#FFF8EF] flex items-center justify-center">
        <div className="flex flex-col space-y-8 items-center justify-center"> 
          <div className="font-custom text-6xl text-[#550A1F] text-center m-3"> welcome to your inventory! </div>
          <Image src={gglogo} alt="Gourmet Grotto Logo" width={500} height={500} />
          <div className="font-custom text-9xl text-[#550A1F] text-center">your gourmet grotto</div>
        </div>
      </section>

      <section id="inventorySystem" className="h-screen w-screen bg-[#300A15]"> 
          <div className="flex flex-col space-y-6"> 
            <div className="font-custom text-8xl text-[#FFF8EF] text-left"> inventory </div>
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
