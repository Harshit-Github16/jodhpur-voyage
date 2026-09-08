'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, X, Image as ImageIcon, Check } from 'lucide-react';

export function ImageUploader({
  value,
  onChange,
  label = 'Cover Image',
  required = false,
  helperText = 'Upload from computer (PNG, JPG, WEBP) or paste image link',
}) {
  const [activeTab, setActiveTab] = useState(value && !value.startsWith('data:') ? 'url' : 'file');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target.result);
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

  const handleClear = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5 text-xs">
      <div className="flex items-center justify-between">
        <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px]">
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`px-2 py-0.5 rounded font-semibold transition-colors ${
              activeTab === 'file' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2 py-0.5 rounded font-semibold transition-colors ${
              activeTab === 'url' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Image Link
          </button>
        </div>
      </div>

      {/* Image Preview Box if image exists */}
      {value ? (
        <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 group">
          <div className="relative h-36 w-full">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded bg-white text-slate-900 text-xs font-bold shadow-sm hover:bg-slate-100 transition-colors"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-2.5 py-1 rounded bg-rose-600 text-white text-xs font-bold shadow-sm hover:bg-rose-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
          <div className="p-2 bg-white flex items-center justify-between border-t border-slate-100 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 truncate max-w-xs font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              Image loaded successfully
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="text-rose-600 hover:text-rose-800 font-bold shrink-0 ml-2"
            >
              Clear
            </button>
          </div>
        </div>
      ) : activeTab === 'file' ? (
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
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
          />
          <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto text-amber-600 mb-2 shadow-2xs">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="font-bold text-slate-800 text-xs">
            Click to upload <span className="font-normal text-slate-500">or drag & drop</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP, GIF up to 10MB</p>
        </div>
      ) : (
        /* URL Input Field */
        <div className="space-y-1">
          <div className="relative">
            <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="url"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full pl-8 pr-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a] font-mono text-[11px]"
            />
          </div>
          <p className="text-[10px] text-slate-400">{helperText}</p>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
