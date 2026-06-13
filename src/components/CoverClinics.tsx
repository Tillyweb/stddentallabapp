import React, { useState, useMemo } from 'react';
import { RefreshCw, Star, MapPin, Phone, Globe, ExternalLink } from 'lucide-react';
import { Clinic } from '../types';

interface CoverClinicsProps {
  clinics: Clinic[];
  onRefresh: () => void;
  isLoading: boolean;
}

export default function CoverClinics({ clinics, onRefresh, isLoading }: CoverClinicsProps) {
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedReview, setSelectedReview] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique provinces
  const provinces = useMemo(() => {
    const list = clinics.map((c) => c.province).filter(Boolean);
    return ['all', ...Array.from(new Set(list)).sort()];
  }, [clinics]);

  // Filter clinics
  const filteredClinics = useMemo(() => {
    return clinics.filter((c) => {
      // Province filter
      if (selectedProvince !== 'all' && c.province !== selectedProvince) {
        return false;
      }
      
      // Star rating filter
      if (selectedReview !== 'all') {
        const minStars = parseInt(selectedReview, 10);
        const reviewText = String(c.review || '0');
        const count = parseFloat(reviewText.replace(/[^0-9.]/g, '')) || 0;
        if (count < minStars) return false;
      }

      // Live search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(query);
        const matchesProvince = c.province.toLowerCase().includes(query);
        const matchesPhone = c.phone.toLowerCase().includes(query);
        return matchesName || matchesProvince || matchesPhone;
      }

      return true;
    });
  }, [clinics, selectedProvince, selectedReview, searchQuery]);

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-purple-100 rounded-3xl p-6 shadow-xl shadow-purple-100/10 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-class text-purple-950 flex items-center justify-center gap-2">
          🏥 คลินิกทันตกรรมพันธมิตรระดับเกียรติยศ (Prestigious Partner Clinics)
        </h2>
        <p className="text-purple-650 text-sm mt-1.5 font-light">
          คลินิกทันตกรรมชั้นนำที่ผสานความร่วมมือกับ เอส.ที.ดี. เด็นตอล แลป ร่วมรังสรรค์รอยยิ้มระดับสากลด้วยฝีมือช่างระดับสูง (Refined Craftsmanship)
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-purple-50/50 border border-purple-100/70 p-5 rounded-2xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Province Filter */}
          <div>
            <label className="block text-xs font-bold text-purple-800 mb-1.5 tracking-wide">
              📍 กรองจังหวัด :
            </label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full text-sm p-3 rounded-xl bg-white border border-purple-200 text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 cursor-pointer"
            >
              <option value="all">-- ทุกจังหวัด --</option>
              {provinces.filter(p => p !== 'all').map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>

          {/* Star Rating Filter */}
          <div>
            <label className="block text-xs font-bold text-purple-800 mb-1.5 tracking-wide">
              ⭐ กรองรีวิวระดับพึงพอใจ :
            </label>
            <select
              value={selectedReview}
              onChange={(e) => setSelectedReview(e.target.value)}
              className="w-full text-sm p-3 rounded-xl bg-white border border-purple-200 text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 cursor-pointer"
            >
              <option value="all">ทั้งหมด</option>
              <option value="5">5 ⭐️ ขึ้นไป</option>
              <option value="4">4 ⭐️ ขึ้นไป</option>
              <option value="3">3 ⭐️ ขึ้นไป</option>
            </select>
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-xs font-bold text-purple-800 mb-1.5 tracking-wide">
              🔍 ค้นหาคลินิก :
            </label>
            <input
              type="text"
              placeholder="เช่น รักฟัน, เชียงใหม่ ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm p-3 rounded-xl bg-white border border-purple-200 text-purple-950 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
            />
          </div>

          {/* Refresh Button */}
          <div>
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-500/10 cursor-pointer hover:scale-102 active:scale-98 transition-all duration-200"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'กำลังรีเฟรช...' : '🔄 As of Current'}
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-purple-650 text-xs font-bold mt-4 animate-pulse">กำลังประมวลผลรายชื่อพันธมิตรระดับเกียรติยศ...</p>
        </div>
      ) : filteredClinics.length === 0 ? (
        <div className="text-center py-16 bg-purple-50/10 rounded-2xl border border-dashed border-purple-100 text-purple-400">
          <MapPin className="w-10 h-10 mx-auto mb-3 text-purple-200 animate-bounce" />
          <p className="font-semibold text-purple-900 text-base">ไม่พบคลินิกที่ตรงกับตัวกรอง</p>
          <p className="text-xs text-purple-400 mt-1">ลองล้างค่าค้นหาหรือเลือกทุกจังหวัดเพื่อดูคลินิกทั้งหมด</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-purple-100/50 shadow-inner bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              {/* Table Head */}
              <thead className="bg-linear-to-r from-purple-100/50 to-purple-200/20 border-b border-purple-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">
                    จังหวัด
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">
                    ชื่อคลินิก / โลโก้
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">
                    คะแนนรีวิว
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">
                    เบอร์โทรติดต่อ
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-purple-100/40">
                {filteredClinics.map((clinic, index) => (
                  <tr key={index} className="hover:bg-purple-50/40 transition-colors group">
                    {/* Province Badge */}
                    <td className="px-6 py-5 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center gap-1 bg-purple-50 border border-purple-200 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                        <MapPin className="w-3 h-3 text-purple-500" />
                        {clinic.province || 'ไม่ระบุ'}
                      </span>
                    </td>

                    {/* Logo & Name */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-purple-200/80 bg-purple-100 flex items-center justify-center text-lg flex-shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105">
                          {clinic.logo ? (
                            <img
                              src={clinic.logo}
                              alt={clinic.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://placehold.co/100x100/f3e8ff/9333ea?text=🏥`;
                              }}
                            />
                          ) : (
                            <span className="text-xl">🏥</span>
                          )}
                        </div>
                        <div>
                          <p className="text-purple-950 font-semibold text-sm group-hover:text-purple-700 transition-colors">
                            {clinic.name}
                          </p>
                          {clinic.pageLink && (
                            <a
                              href={clinic.pageLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-500 hover:text-purple-800 text-xs font-semibold mt-1 inline-flex items-center gap-1 cursor-pointer"
                            >
                              เยี่ยมชมเพจคลินิก
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Review Rating */}
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4.5 h-4.5 text-amber-500 fill-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                        <span className="text-amber-800 font-bold text-sm">
                          {clinic.review || '5⭐️'}
                        </span>
                      </div>
                    </td>

                    {/* Phone Column */}
                    <td className="px-6 py-5 whitespace-nowrap text-sm">
                      <a
                        href={`tel:${clinic.phone}`}
                        className="text-purple-700 hover:text-purple-950 font-semibold flex items-center gap-1.5 w-max hover:underline cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 text-purple-600" />
                        {clinic.phone || '-'}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
