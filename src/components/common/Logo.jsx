'use client';

import React, { useState } from 'react';

export function Logo({ className = '', height = 48, variant = 'full', lightText = false }) {
  const [imgError, setImgError] = useState(false);

  if (variant === 'icon') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <img
          src="/logo.png"
          alt="Jodhpur Voyage Logo"
          className="h-9 w-auto object-contain"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      {!imgError ? (
        <img
          src="/logo.png"
          alt="Jodhpur Voyage - Tour Opérateur en Inde et Népal"
          style={{ maxHeight: height }}
          className="w-auto object-contain drop-shadow-xs"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-10 h-6 bg-amber-500 rounded-t-full flex items-center justify-center text-[10px] font-bold text-black">
            JV
          </div>
          <span className="font-black text-amber-500 tracking-[0.16em] text-sm uppercase">
            JODHPUR VOYAGE
          </span>
          <span className={`text-[8px] font-semibold tracking-wider uppercase ${lightText ? 'text-slate-300' : 'text-slate-800'}`}>
            Tour Opérateur en Inde et Népal
          </span>
        </div>
      )}
    </div>
  );
}

export default Logo;

