"use client";

import { useState } from "react";
import PandaSprite from "@/components/animations/panda-sprite";
import CrocodileSprite from "@/components/animations/crocodile-sprite";

type SpriteSize = "sm" | "md" | "lg" | "xl";
type SpriteSpeed = "slow" | "normal" | "fast";
type Animal = "panda" | "crocodile";

const SIZES: SpriteSize[] = ["sm", "md", "lg", "xl"];
const SPEEDS: SpriteSpeed[] = ["slow", "normal", "fast"];
const ANIMALS: Animal[] = ["panda", "crocodile"];

const SIZE_LABELS: Record<SpriteSize, string> = {
  sm: "128px",
  md: "192px",
  lg: "256px",
  xl: "384px",
};

const SPEED_LABELS: Record<SpriteSpeed, string> = {
  slow: "1.6s",
  normal: "1.0s",
  fast: "0.5s",
};

export default function TestAnimationPage() {
  const [animal, setAnimal] = useState<Animal>("panda");
  const [size, setSize] = useState<SpriteSize>("lg");
  const [speed, setSpeed] = useState<SpriteSpeed>("normal");
  const [enableFloat, setEnableFloat] = useState(true);

  const renderSprite = (s: SpriteSize, sp: SpriteSpeed, f: boolean) => {
    if (animal === "panda") {
      return <PandaSprite size={s} speed={sp} enableFloat={f} />;
    }
    return <CrocodileSprite size={s} speed={sp} enableFloat={f} />;
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white p-8 font-body">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          🐾 Sprite Animation Test
        </h1>
        <p className="text-white/50 mb-8">
          Testing CSS sprite sheet animation with pixel art characters. This page is isolated from the main site.
        </p>

        {/* Controls */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 space-y-6">
          <h2 className="text-lg font-semibold text-white/80">Controls</h2>

          {/* Animal selector */}
          <div className="space-y-2">
            <label className="text-sm text-white/60 block">Animal</label>
            <div className="flex gap-2 flex-wrap">
              {ANIMALS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAnimal(a)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    animal === a
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "bg-white/10 text-white/70 hover:bg-white/15"
                  }`}
                >
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div className="space-y-2">
            <label className="text-sm text-white/60 block">Size</label>
            <div className="flex gap-2 flex-wrap">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    size === s
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                      : "bg-white/10 text-white/70 hover:bg-white/15"
                  }`}
                >
                  {s.toUpperCase()} ({SIZE_LABELS[s]})
                </button>
              ))}
            </div>
          </div>

          {/* Speed selector */}
          <div className="space-y-2">
            <label className="text-sm text-white/60 block">Speed</label>
            <div className="flex gap-2 flex-wrap">
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    speed === s
                      ? "bg-violet-500 text-white shadow-lg shadow-violet-500/25"
                      : "bg-white/10 text-white/70 hover:bg-white/15"
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)} ({SPEED_LABELS[s]})
                </button>
              ))}
            </div>
          </div>

          {/* Float toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEnableFloat(!enableFloat)}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                enableFloat ? "bg-emerald-500" : "bg-white/20"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                  enableFloat ? "left-6" : "left-0.5"
                }`}
              />
            </button>
            <span className="text-sm text-white/70">Floating motion</span>
          </div>
        </div>

        {/* Preview — Interactive */}
        <div className="space-y-6 mb-16">
          <h2 className="text-lg font-semibold text-white/80">Preview</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 flex items-center justify-center min-h-[400px]">
            {renderSprite(size, speed, enableFloat)}
          </div>
          <p className="text-xs text-white/30 text-center">
            animal={animal} · size={size} · speed={speed} · float={enableFloat ? "on" : "off"}
          </p>
        </div>

        {/* All sizes side by side */}
        <div className="space-y-6 mb-16">
          <h2 className="text-lg font-semibold text-white/80">All Sizes Comparison</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 flex items-end justify-center gap-8 flex-wrap min-h-[400px]">
            {SIZES.map((s) => (
              <div key={s} className="flex flex-col items-center gap-3">
                {renderSprite(s, "normal", true)}
                <span className="text-xs text-white/40">{s.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Static vs floating */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-white/80">Static vs Floating</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 min-h-[300px]">
              {renderSprite("lg", "normal", false)}
              <span className="text-xs text-white/40">Sprite only</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 min-h-[300px]">
              {renderSprite("lg", "normal", true)}
              <span className="text-xs text-white/40">Sprite + Float</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
