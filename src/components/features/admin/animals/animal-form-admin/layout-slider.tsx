"use client";

interface LayoutSliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}

export default function LayoutSlider({
  label,
  value,
  onChange,
  disabled = false,
}: LayoutSliderProps) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5 font-['Manrope']">
        <span className="font-semibold text-[#72796e]">{label}</span>
        <span className="text-[#2d5a27] font-bold">{value}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full accent-[#2d5a27] cursor-pointer"
        disabled={disabled}
      />
    </div>
  );
}