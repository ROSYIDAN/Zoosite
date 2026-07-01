"use client";

import { useState, KeyboardEvent } from "react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
}

export default function TagInput({ value = [], onChange, placeholder, label }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "," || e.key === ";") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text");
    const tags = pasteData
      .split(/[,;\n]/)
      .map((t) => t.trim())
      .filter((t) => t);
    
    if (tags.length > 1) {
      e.preventDefault();
      const newTags = [...value];
      tags.forEach((tag) => {
        if (!newTags.includes(tag)) {
          newTags.push(tag);
        }
      });
      onChange(newTags);
      setInputValue("");
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-[10px] font-semibold text-[#1a1c19]/50 mb-1 font-['Manrope'] uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="w-full px-3 py-2 rounded-lg border border-[#1a1c19]/10 focus-within:border-primary-container focus-within:ring-1 focus-within:ring-primary-container transition-all bg-white">
        <div className="flex flex-wrap gap-1.5 mb-1">
          {value.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary-container/10 text-primary-container text-[11px] font-medium font-['Manrope']"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="hover:text-red-500 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={() => {
            if (inputValue.trim()) {
              addTag(inputValue);
            }
          }}
          placeholder={value.length === 0 ? placeholder : ""}
          className="w-full outline-none text-xs font-['Manrope'] bg-transparent"
        />
      </div>
      <p className="text-[10px] text-[#1a1c19]/40 mt-1 font-['Manrope']">
        Press Enter, comma, or semicolon to add. Paste multiple values separated by commas or newlines.
      </p>
    </div>
  );
}