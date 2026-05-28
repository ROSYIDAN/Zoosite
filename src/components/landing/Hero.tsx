"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const SLIDES = [
  {
    id: "01",
    label: "Lion",
    title: "The African Lion",
    slug: "african-lion",
    description: "Known as the king of beasts, these social predators represent the raw power and intricate community of the savanna ecosystem.",
    video: "https://www.youtube.com/embed/h0CC8PwxsXw?autoplay=1&mute=1&controls=0&loop=1&playlist=h0CC8PwxsXw&si=0xRzCBlY572rIbEw&clip=UgkxDQeoIYFlkWaXdgJ-_4AoeMF-yxRoV7mM&clipt=EO7fGRiKzRo&vq=hd1080",
    isYoutube: true,
    tag: "Featured Species",
    sourceUrl: "https://www.youtube.com/@RelaxationChannel",
    sourceLabel: "@RelaxationChannel"
  },
  {
    id: "02",
    label: "Elephant",
    title: "The African Elephant",
    slug: "african-elephant",
    description: "Gentle giants of the wild, showing remarkable intelligence and complex social structures that mirror our own.",
    video: "https://www.youtube.com/embed/AA0UZVXJd2o?autoplay=1&mute=1&controls=0&loop=1&playlist=AA0UZVXJd2o&si=AooaIjfA0EvnNI_U&clip=Ugkxp3k8jxzf9i1fLMQVHcpxjF3Ro1RNlUOq&clipt=EMbdBBjd0gU&vq=hd1080",
    isYoutube: true,
    tag: "Conservation Priority",
    sourceUrl: "https://www.youtube.com/@8KVIDEO-ULTRAHD-8K",
    sourceLabel: "@8KVIDEO-ULTRAHD-8K"
  },
  {
    id: "03",
    label: "Penguin",
    title: "Emperor Penguin",
    slug: "emperor-penguin",
    description: "The largest of all penguin species, these Antarctic icons are masters of the deep sea and the extreme polar cold.",
    video: "https://www.youtube.com/embed/rbzxxbuk3sk?autoplay=1&mute=1&controls=0&loop=1&playlist=rbzxxbuk3sk&si=ftlYcn5btAbZoGga&clip=UgkxO0p6Qdso0N6jUEJqfHNH-9iYjD6j_9t-&clipt=EKfiERi_1xI&vq=hd1080",
    isYoutube: true,
    tag: "Polar Icon",
    sourceUrl: "https://www.youtube.com/@8KVIDEO-ULTRAHD-8K",
    sourceLabel: "@8KVIDEO-ULTRAHD-8K"
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const slide = SLIDES[currentSlide];

  return (
    <section className="relative w-full h-[56.25vw] max-h-[1080px] min-h-[600px] overflow-hidden flex items-center">
      <div className="absolute inset-0 z-0 hero-video-container animate-fadeIn overflow-hidden" key={`video-${currentSlide}`}>
        {slide.isYoutube ? (
          <iframe
            className="absolute top-1/2 left-1/2 w-[120%] h-[120%] min-w-full min-h-full aspect-video -translate-x-1/2 -translate-y-1/2 pointer-events-none object-cover grayscale-[20%]"
            src={slide.video}
            title={slide.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        ) : (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transition-opacity duration-1000"
          >
            <source src={slide.video} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent"></div>
      </div>
      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-2xl text-left" key={`content-${currentSlide}`}>
          <span className="inline-block px-4 py-1 bg-tertiary text-on-tertiary rounded-full text-xs font-bold tracking-widest mb-6 uppercase animate-fadeInUp [animation-delay:200ms] opacity-0">
            {slide.tag}
          </span>
          <h1 className="text-7xl font-headline font-extrabold text-white tracking-tighter mb-6 leading-none animate-fadeInUp [animation-delay:400ms] opacity-0">
            {slide.title}
          </h1>
          <p className="text-lg text-surface-container-lowest/90 font-medium mb-10 max-w-xl animate-fadeInUp [animation-delay:600ms] opacity-0">
            {slide.description}
          </p>
          <div className="flex gap-4 animate-fadeInUp [animation-delay:800ms] opacity-0">
            <Link
              href={isLoggedIn ? `/animals/${slide.slug}` : "/login"}
              className="bg-surface-container-lowest text-primary px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-surface-bright transition-colors"
            >
              Explore Species{" "}
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <div className="flex gap-2">
              <button 
                onClick={prevSlide}
                className="w-14 h-14 glass-nav border border-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button 
                onClick={nextSlide}
                className="w-14 h-14 glass-nav border border-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          {slide.sourceUrl && (
            <div className="mt-8 animate-fadeInUp [animation-delay:1000ms] opacity-0">
              <a 
                href={slide.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-white/40 hover:text-white/80 transition-colors flex items-center gap-1.5 font-medium tracking-wide uppercase"
              >
                <span className="material-symbols-outlined text-[14px]">link</span>
                Source: {slide.sourceLabel}
              </a>
            </div>
          )}
        </div>
      </div>
      {/* Carousel Preview Indicators */}
      <div className="absolute bottom-12 right-8 flex gap-6 z-10">
        {SLIDES.map((item, index) => (
          <div 
            key={item.id} 
            className={`group cursor-pointer transition-opacity duration-300 ${currentSlide === index ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
            onClick={() => setCurrentSlide(index)}
          >
            <div className="w-24 h-1 bg-white/30 rounded-full mb-2 overflow-hidden">
              <div 
                className={`h-full bg-white transition-all duration-500 ${currentSlide === index ? 'w-full' : 'w-0 group-hover:w-4'}`}
              ></div>
            </div>
            <span className="text-white text-xs font-bold uppercase tracking-widest">
              {item.id} {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
