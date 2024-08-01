import React from 'react';
import Image from 'next/image';
import gglogo from '../public/img/gourmetGrottoLogo.png'; // Correct import for Next.js

export default function Home() {
  return (
    <div>
      <section id="intro" className="h-screen w-screen bg-[#FFF8EF] flex items-center justify-center">
        <div className="flex flex-col space-y-8 items-center"> 
          <div className="font-custom text-6xl text-[#550A1F] m-3"> welcome to your inventory! </div>
          <Image src={gglogo} alt="Gourmet Grotto Logo" width={500} height={500} />
          <div className="font-custom text-9xl text-[#550A1F]">your gourmet grotto</div>
        </div>
      </section>
    </div>
  );
}
