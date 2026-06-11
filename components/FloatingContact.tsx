"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export default function FloatingContact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (copied) return;
    
    navigator.clipboard.writeText("dhrutinandan.dev@gmail.com");
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div id="global-contact" className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-100 flex justify-end items-end h-16">
      <button 
        onClick={handleCopy}
        className={`bg-black flex items-center justify-center overflow-hidden shadow-2xl rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          copied 
            ? "w-[160px] lg:w-[180px] h-14 lg:h-16 cursor-default px-4" 
            : "w-14 h-14 lg:w-16 lg:h-16 hover:scale-110 cursor-pointer px-0"
        }`}
      >
        <Mail size={22} strokeWidth={2.5} className="text-background shrink-0" />
        {copied && (
          <span className="text-background font-faktum font-bold text-[10px] lg:text-xs tracking-widest uppercase whitespace-nowrap animate-in fade-in duration-300 ml-2 lg:ml-3">
            Email Copied
          </span>
        )}
      </button>
    </div>
  );
}
