'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Unlink,
  Quote,
  Minus,
  RotateCcw,
  RotateCw,
  RemoveFormatting,
  Code,
  Eye,
  Palette,
  Highlighter,
} from 'lucide-react';

const COLOR_PALETTE = [
  '#0f172a', '#334155', '#64748b', '#94a3b8',
  '#dc2626', '#ea580c', '#d97706', '#ca8a04',
  '#16a34a', '#059669', '#0891b2', '#0284c7',
  '#2563eb', '#4f46e5', '#7c3aed', '#9333ea',
  '#c026d3', '#db2777', '#e11d48', '#993366',
];

const HIGHLIGHT_PALETTE = [
  'transparent', '#fef08a', '#fed7aa', '#fecaca',
  '#bbf7d0', '#a7f3d0', '#bae6fd', '#ddd6fe',
  '#f5d0fe', '#fbcfe8', '#f1f5f9', '#e2e8f0',
];

export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Write your travel article content here...',
  minHeight = '280px',
  label = 'Article Body (Rich Text Editor)',
  required = false,
}) {
  const editorRef = useRef(null);
  const [isCodeView, setIsCodeView] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [currentHtml, setCurrentHtml] = useState(value || '');
  const isInternalUpdate = useRef(false);

  // Sync external value changes when not triggered internally
  useEffect(() => {
    if (!isInternalUpdate.current) {
      setCurrentHtml(value || '');
      if (editorRef.current && editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
    isInternalUpdate.current = false;
  }, [value]);

  const handleContentChange = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    isInternalUpdate.current = true;
    setCurrentHtml(html);
    if (onChange) {
      // If content is just an empty break/tag, send empty string
      const isEmpty = html === '<p><br></p>' || html === '<br>' || html.trim() === '';
      onChange(isEmpty ? '' : html);
    }
  }, [onChange]);

  const executeCommand = (command, value = null) => {
    if (isCodeView) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    handleContentChange();
  };

  const handleHeading = (tag) => {
    if (tag === 'p') {
      executeCommand('formatBlock', '<p>');
    } else {
      executeCommand('formatBlock', `<${tag}>`);
    }
  };

  const handleLink = () => {
    if (isCodeView) return;
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString() : '';
    const url = prompt('Enter URL link (e.g. https://example.com):', 'https://');
    if (url && url.trim() !== '' && url !== 'https://') {
      executeCommand('createLink', url.trim());
    }
  };

  const handleTextColor = (color) => {
    executeCommand('foreColor', color);
    setShowColorPicker(false);
  };

  const handleHighlightColor = (color) => {
    executeCommand('hiliteColor', color);
    setShowHighlightPicker(false);
  };

  const handleCodeViewToggle = () => {
    if (isCodeView) {
      // Switching from Code to Visual
      if (editorRef.current) {
        editorRef.current.innerHTML = currentHtml;
      }
    }
    setIsCodeView(!isCodeView);
  };

  const handleCodeChange = (e) => {
    const newHtml = e.target.value;
    isInternalUpdate.current = true;
    setCurrentHtml(newHtml);
    if (onChange) {
      onChange(newHtml);
    }
  };

  return (
    <div className="space-y-1.5 font-sans">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
          <button
            type="button"
            onClick={handleCodeViewToggle}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
            title={isCodeView ? 'Switch to Visual WYSIWYG Editor' : 'Switch to Raw HTML Code Mode'}
          >
            {isCodeView ? (
              <>
                <Eye className="w-3.5 h-3.5 text-amber-600" />
                <span>Visual Editor</span>
              </>
            ) : (
              <>
                <Code className="w-3.5 h-3.5 text-blue-600" />
                <span>HTML Source Mode</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Editor Box */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs focus-within:border-[#0f172a] focus-within:ring-1 focus-within:ring-[#0f172a] transition-all">
        {/* Toolbar */}
        {!isCodeView && (
          <div className="bg-slate-50 border-b border-slate-200 p-1.5 flex flex-wrap items-center gap-1 text-slate-700">
            {/* Paragraph / Headings dropdown */}
            <select
              onChange={(e) => handleHeading(e.target.value)}
              defaultValue="p"
              className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="p">Normal Text</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="h4">Heading 4</option>
            </select>

            <div className="h-4 w-px bg-slate-300 mx-1" />

            {/* Basic Formatting */}
            <button
              type="button"
              onClick={() => executeCommand('bold')}
              title="Bold (Ctrl+B)"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700 active:bg-slate-300 transition-colors"
            >
              <Bold className="w-3.5 h-3.5 font-bold" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('italic')}
              title="Italic (Ctrl+I)"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700 active:bg-slate-300 transition-colors"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('underline')}
              title="Underline (Ctrl+U)"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700 active:bg-slate-300 transition-colors"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('strikeThrough')}
              title="Strikethrough"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700 active:bg-slate-300 transition-colors"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-300 mx-1" />

            {/* Colors */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowColorPicker(!showColorPicker);
                  setShowHighlightPicker(false);
                }}
                title="Text Color"
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700 flex items-center gap-0.5 transition-colors"
              >
                <Palette className="w-3.5 h-3.5 text-amber-600" />
              </button>
              {showColorPicker && (
                <div className="absolute left-0 top-full mt-1.5 p-2.5 bg-white border border-slate-200 rounded-lg shadow-lg z-30 grid grid-cols-5 gap-1.5 w-44">
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleTextColor(c)}
                      style={{ backgroundColor: c }}
                      className="w-6 h-6 rounded border border-slate-300 hover:scale-110 transition-transform shadow-2xs"
                      title={c}
                    />
                  ))}
                  <div className="col-span-5 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Custom:</span>
                    <input
                      type="color"
                      onChange={(e) => handleTextColor(e.target.value)}
                      className="w-5 h-5 cursor-pointer rounded border-0 p-0"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowHighlightPicker(!showHighlightPicker);
                  setShowColorPicker(false);
                }}
                title="Highlight Color"
                className="p-1.5 rounded hover:bg-slate-200 text-slate-700 flex items-center gap-0.5 transition-colors"
              >
                <Highlighter className="w-3.5 h-3.5 text-yellow-500" />
              </button>
              {showHighlightPicker && (
                <div className="absolute left-0 top-full mt-1.5 p-2.5 bg-white border border-slate-200 rounded-lg shadow-lg z-30 grid grid-cols-4 gap-1.5 w-40">
                  {HIGHLIGHT_PALETTE.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleHighlightColor(c)}
                      style={{ backgroundColor: c === 'transparent' ? '#fff' : c }}
                      className="w-6 h-6 rounded border border-slate-300 hover:scale-110 transition-transform shadow-2xs text-[9px] flex items-center justify-center font-bold text-slate-600"
                      title={c === 'transparent' ? 'No highlight' : c}
                    >
                      {c === 'transparent' ? '∅' : ''}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-slate-300 mx-1" />

            {/* Alignment */}
            <button
              type="button"
              onClick={() => executeCommand('justifyLeft')}
              title="Align Left"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('justifyCenter')}
              title="Align Center"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('justifyRight')}
              title="Align Right"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('justifyFull')}
              title="Justify"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-300 mx-1" />

            {/* Lists */}
            <button
              type="button"
              onClick={() => executeCommand('insertUnorderedList')}
              title="Bulleted List"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('insertOrderedList')}
              title="Numbered List"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>

            {/* Quotes & Separator */}
            <button
              type="button"
              onClick={() => executeCommand('formatBlock', '<blockquote>')}
              title="Quote"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('insertHorizontalRule')}
              title="Horizontal Divider"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-300 mx-1" />

            {/* Links */}
            <button
              type="button"
              onClick={handleLink}
              title="Insert Link"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('unlink')}
              title="Remove Link"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Unlink className="w-3.5 h-3.5 text-rose-500" />
            </button>

            <div className="h-4 w-px bg-slate-300 mx-1" />

            {/* Clear, Undo, Redo */}
            <button
              type="button"
              onClick={() => executeCommand('removeFormat')}
              title="Clear Formatting"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <RemoveFormatting className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('undo')}
              title="Undo (Ctrl+Z)"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('redo')}
              title="Redo (Ctrl+Y)"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Visual Content Editable Area */}
        {!isCodeView ? (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleContentChange}
            onBlur={handleContentChange}
            style={{ minHeight }}
            data-placeholder={placeholder}
            className="rich-text-editor-content p-4 text-xs text-slate-800 focus:outline-none overflow-y-auto leading-relaxed"
          />
        ) : (
          /* HTML Source Code Mode Area */
          <div className="p-2 bg-slate-900">
            <div className="text-[11px] font-mono text-slate-400 px-2 py-1 flex items-center justify-between border-b border-slate-800 mb-2">
              <span>HTML Source Code (Direct Edit)</span>
              <span className="text-amber-400">Syncs automatically</span>
            </div>
            <textarea
              value={currentHtml}
              onChange={handleCodeChange}
              style={{ minHeight }}
              placeholder="<p>Enter raw HTML content here...</p>"
              className="w-full bg-slate-950 text-amber-200 font-mono text-xs p-3 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 resize-y leading-relaxed"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span>Rich HTML Output</span>
        <span>
          {currentHtml ? `${currentHtml.replace(/<[^>]*>/g, '').length} characters` : '0 characters'}
        </span>
      </div>
    </div>
  );
}
