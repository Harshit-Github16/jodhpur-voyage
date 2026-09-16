'use client';

import React, { useState, useRef } from 'react';
import { uploadApi } from '@/services/api/uploadApi';
import { UploadCloud, X, Check, RefreshCw, Loader2, Link, AlertCircle } from 'lucide-react';

export function ImageUploader({
  value,
  onChange,
  label = 'Cover Image',
  required = false,
  helperText = 'Upload image file (PNG, JPG, WEBP) - auto-hosted on cloud',
}) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [directUrl, setDirectUrl] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, GIF)');
      return;
    }

    setUploadError(null);
    setUploading(true);

    try {
      const res = await uploadApi.uploadSingle(file);
      if (res?.url) {
        onChange(res.url);
      } else {
        throw new Error('No URL returned from server');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      setUploadError(err?.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
    if (e) e.stopPropagation();
    onChange('');
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleApplyDirectUrl = () => {
    if (directUrl.trim()) {
      onChange(directUrl.trim());
      setDirectUrl('');
      setShowUrlInput(false);
      setUploadError(null);
    }
  };

  return (
    <div className="space-y-1.5 text-xs">
      <div className="flex items-center justify-between">
        <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Link className="w-3 h-3" />
          <span>{showUrlInput ? 'Upload File Instead' : 'Paste Image URL'}</span>
        </button>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="hidden"
      />

      {/* Direct URL Input Mode */}
      {showUrlInput && (
        <div className="flex gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
          <input
            type="url"
            value={directUrl}
            onChange={(e) => setDirectUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-1.5 bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500"
          />
          <button
            type="button"
            onClick={handleApplyDirectUrl}
            className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
          >
            Apply
          </button>
        </div>
      )}

      {/* Upload Error Alert */}
      {uploadError && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Image Preview Box or Upload Box */}
      {uploading ? (
        <div className="border-2 border-dashed border-amber-400 bg-amber-50/60 rounded-xl p-6 text-center flex flex-col items-center justify-center space-y-2">
          <Loader2 className="w-7 h-7 text-amber-600 animate-spin" />
          <p className="font-bold text-amber-900 text-xs">Uploading image to cloud...</p>
          <p className="text-[10px] text-amber-700">Sending to media storage server</p>
        </div>
      ) : value ? (
        <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 group">
          <div className="relative h-40 w-full bg-slate-900/5 flex items-center justify-center">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80';
              }}
            />
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
            <span className="flex items-center gap-1.5 font-medium text-emerald-700 truncate max-w-xs" title={value}>
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{value.startsWith('http') ? value : 'Image uploaded'}</span>
            </span>
            <div className="flex items-center gap-2 shrink-0">
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
