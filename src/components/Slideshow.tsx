import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Sparkles, Layers } from 'lucide-react';
import { CatalogItem } from '../types';

interface SlideshowProps {
  items: CatalogItem[];
  onRefresh: () => void;
  isLoading: boolean;
}

export default function Slideshow({ items, onRefresh, isLoading }: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    if (items.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items]);

  const handlePrev = () => {
    if (items.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Auto Scroll
  useEffect(() => {
    if (items.length === 0 || isLoading) return;
    const timer = setInterval(handleNext, 4500);
    return () => clearInterval(timer);
  }, [items, isLoading, handleNext]);

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-purple-100 rounded-3xl p-6 shadow-xl shadow-purple-100/10 mb-8 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-purple-950 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
          📦 แคตตาล็อกและโมเดลสินค้า (Catalog & Models)
        </h2>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-2 px-4.5 rounded-full text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-purple-500/15 cursor-pointer hover:scale-103 transition-all duration-200"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'กำลังโหลด...' : '🔄 รีเฟรชสินค้าแบล็กบอกซ์'}
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-purple-50/20 rounded-2xl border border-purple-50">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-purple-655 text-xs font-semibold mt-4">กำลังโหลดแคตตาล็อกโมเดลทันตกรรม...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-purple-50/20 rounded-2xl border border-dashed border-purple-200 text-purple-400 font-medium">
          <Layers className="w-10 h-10 mx-auto mb-3 text-purple-300" />
          ไม่มีรายการสินค้าในแคตตาล็อกชั่วคราว
        </div>
      ) : (
        <div className="relative max-w-4xl mx-auto group">
          {/* Main Visual Frame */}
          <div className="relative overflow-hidden aspect-[16/10] sm:aspect-[16/9] rounded-2xl border-2 border-purple-100/60 shadow-lg shadow-purple-100/20 bg-purple-950">
            {/* Slide Track */}
            <div 
              className="flex h-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {items.map((item, idx) => (
                <div key={idx} className="w-full h-full flex-shrink-0 relative">
                  <a href={item.imageUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover select-none transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-950/90 via-purple-950/30 to-transparent flex items-end p-5 md:p-8">
                      <div className="text-left w-full">
                        <span className="bg-purple-600 text-white text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shadow">
                          Restorations & Retainers
                        </span>
                        <h3 className="text-white font-bold text-base sm:text-xl md:text-2xl mt-2 drop-shadow-md tracking-tight">
                          {item.name}
                        </h3>
                        <p className="text-purple-200 text-xs sm:text-sm mt-1 drop-shadow font-light">
                          คุณภาพพรีเมียม ส่งมอบงานรวดเร็วทันใจ โดย S.T.D. Dental Lab
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>

            {/* Carousel Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/95 hover:bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0 shadow-md cursor-pointer hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/95 hover:bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 shadow-md cursor-pointer hover:scale-105"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Carousel Dots Indicator */}
          <div className="flex justify-center gap-2 mt-4.5">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`transition-all duration-300 focus:outline-none cursor-pointer ${
                  idx === currentIndex 
                    ? 'w-6 h-2 rounded-full bg-purple-650 shadow-sm shadow-purple-500/20' 
                    : 'w-2 h-2 rounded-full bg-purple-300 hover:bg-purple-400'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
