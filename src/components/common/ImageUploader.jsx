'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, Check, RefreshCw } from 'lucide-react';

export function ImageUploader({
  value,
  onChange,
  label = 'Cover Image',
  required = false,
  helperText = 'Upload image file from device (PNG, JPG, WEBP)',
}) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, GIF)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target?.result || '');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5 text-xs">
      <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="hidden"
      />

      {/* Image Preview Box if image exists */}
      {value ? (
        <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 group">
          <div className="relative h-40 w-full bg-slate-900/5 flex items-center justify-center">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-bold shadow-md hover:bg-slate-100 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                <span>Replace Image</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
          <div className="p-2.5 bg-white flex items-center justify-between border-t border-slate-100 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 font-medium text-emerald-700 truncate max-w-xs">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              Image loaded
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-amber-700 hover:text-amber-800 font-bold hover:underline cursor-pointer"
              >
                Change
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={handleClear}
                className="text-rose-600 hover:text-rose-800 font-bold hover:underline cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Drag & Drop File Box */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-amber-500 bg-amber-50/50'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/80 hover:bg-slate-50'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto text-amber-600 mb-2 shadow-2xs">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="font-bold text-slate-800 text-xs">
            Click to upload image <span className="font-normal text-slate-500">or drag & drop</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-1">{helperText}</p>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
