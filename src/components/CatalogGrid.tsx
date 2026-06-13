import React, { useState, useMemo } from 'react';
import { Layers, ArrowLeft, RefreshCw, Search, ExternalLink, Sparkles } from 'lucide-react';
import { CatalogItem } from '../types';

interface CatalogGridProps {
  items: CatalogItem[];
  onRefresh: () => void;
  isLoading: boolean;
  onBack: () => void;
}

export default function CatalogGrid({ items, onRefresh, isLoading, onBack }: CatalogGridProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (!searchQuery.trim()) return true;
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [items, searchQuery]);

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-purple-100 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-200/40">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <button
          onClick={onBack}
          className="mr-auto sm:mr-0 group bg-purple-50 hover:bg-purple-100/80 text-purple-800 font-bold py-2.5 px-5 rounded-full text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          ย้อนกลับหน้าแรก
        </button>
        <h2 className="text-xl sm:text-2xl font-extrabold text-purple-950 text-center flex-1">
          📦 ผลิตภัณฑ์และงานแลปทั้งหมด (Laboratory Products Catalog)
        </h2>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="ml-auto sm:ml-0 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-2.5 px-5 rounded-full text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-purple-500/15 cursor-pointer hover:scale-103 transition-all duration-200"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'กำลังรีเฟรช...' : '🔄 รีเฟรชสินค้า'}
        </button>
      </div>

      {/* Filter and Description */}
      <div className="bg-purple-50/40 p-4 border border-purple-150 rounded-2xl mb-8 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full relative">
          <Search className="w-4.5 h-4.5 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อโมเดล, รีเทนเนอร์, ชนิดงานผลิต..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm pl-11 pr-4 py-3 rounded-xl bg-white border border-purple-200 text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-500/35 transition-all duration-200"
          />
        </div>
        <p className="text-xs text-purple-600 font-semibold tracking-tight shrink-0 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
          แสดงผลลัพธ์ทั้งหมด {filteredItems.length} รายการ
        </p>
      </div>

      {/* Main Grid display */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-purple-650 text-xs font-bold mt-4 animate-pulse">กำลังดาวน์โหลดข้อมูลสินค้าจากแบล็กบอกซ์แลป...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-purple-50/10 rounded-2xl border border-dashed border-purple-100 text-purple-400">
          <Layers className="w-10 h-10 mx-auto mb-3 text-purple-200" />
          <p className="font-semibold text-purple-950">ไม่พบคู่มือสินค้าที่ตรงกับคำค้นหาของคุณ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl overflow-hidden border border-purple-100 shadow-lg shadow-purple-100/5 hover:shadow-xl hover:shadow-purple-200/20 hover:border-purple-300 transform hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Product Thumbnail picture */}
              <div className="relative aspect-[16/11] bg-purple-950 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-108"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1598256989476-8ff56a29dcdc?w=600&h=400&fit=crop&auto=format';
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-purple-950/40 to-transparent"></div>
              </div>

              {/* Product description content info */}
              <div className="p-4 flex flex-col justify-between min-h-[110px]">
                <div>
                  <span className="text-[10px] bg-purple-50 border border-purple-100/80 text-purple-700 font-bold px-2.5 py-0.5 rounded-full tracking-wider">
                    DENTAL APPARATUS
                  </span>
                  <h3 className="font-bold text-sm text-purple-950 mt-1.5 line-clamp-2 leading-tight group-hover:text-purple-700 transition-colors">
                    {item.name}
                  </h3>
                </div>
                
                <div className="pt-3 border-t border-purple-50/80 mt-3 flex justify-between items-center">
                  <span className="text-[11px] text-purple-500/80 font-semibold flex items-center gap-1">
                    🟢 งานฝีมือปราณีต
                  </span>
                  <a
                    href={item.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-900 font-extrabold text-xs inline-flex items-center gap-1 cursor-pointer"
                  >
                    ดูภาพใหญ่
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
