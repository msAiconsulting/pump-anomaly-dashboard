"use client";

import Image from "next/image";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <Image 
            src="/assets/intuigence.png" 
            alt="Intuigence" 
            width={407} 
            height={104} 
            priority 
          />
        </div>
      </div>
    </header>
  );
} 