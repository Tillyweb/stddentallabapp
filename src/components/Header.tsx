import { ActivePage } from '../types';

interface HeaderProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
}

export default function Header({ activePage, onNavigate }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-xl border border-purple-100 rounded-3xl p-5 mb-8 shadow-xl shadow-purple-100/30 sticky top-4 z-50 transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Branding & Status Indicator */}
        <div className="text-center md:text-left flex flex-col sm:flex-row items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner border border-purple-100 transition-transform duration-300 hover:scale-105">
            <img src="/logo.jpg" alt="S.T.D. DENTAL LAB Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-purple-950 tracking-tight flex items-center justify-center sm:justify-start gap-1">
              S.T.D. DENTAL LAB
            </h1>
            <p className="text-purple-600/85 font-medium text-xs sm:text-sm mt-1 sm:mt-0 text-center sm:text-left">
              ห้างหุ้นส่วนจำกัด เอส.ที.ดี.เด็นตอล แลป จ.เชียงใหม่
            </p>
          </div>
        </div>

        {/* Action / Navigation Buttons */}
        <div className="flex flex-row justify-center items-center gap-6 sm:gap-8 w-full md:w-auto mt-2 md:mt-0 px-2">
          <button
            id="nav-btn-home"
            onClick={() => onNavigate('cover')}
            className={`relative pb-2 flex flex-col items-center justify-center text-3xl transition-all duration-300 cursor-pointer hover:scale-115 active:scale-90 ${
              activePage === 'cover'
                ? 'scale-115 filter drop-shadow-[0_2px_8px_rgba(147,51,234,0.3)]'
                : 'opacity-50 hover:opacity-90'
            }`}
            title="หน้าแรก (Home)"
          >
            <span>🏠</span>
            {activePage === 'cover' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-purple-600 rounded-full shadow-[0_0_8px_rgba(147,51,234,0.6)] animate-pulse" />
            )}
          </button>
          
          <button
            id="nav-btn-register"
            onClick={() => onNavigate('register')}
            className={`relative pb-2 flex flex-col items-center justify-center text-3xl transition-all duration-300 cursor-pointer hover:scale-115 active:scale-90 ${
              activePage === 'register'
                ? 'scale-115 filter drop-shadow-[0_2px_8px_rgba(147,51,234,0.3)]'
                : 'opacity-50 hover:opacity-90'
            }`}
            title="ลงทะเบียนคลินิก"
          >
            <span>✍️</span>
            {activePage === 'register' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-purple-600 rounded-full shadow-[0_0_8px_rgba(147,51,234,0.6)] animate-pulse" />
            )}
          </button>

          <button
            id="nav-btn-dashboard"
            onClick={() => onNavigate('dashboard')}
            className={`relative pb-2 flex flex-col items-center justify-center text-3xl transition-all duration-300 cursor-pointer hover:scale-115 active:scale-90 ${
              activePage === 'dashboard'
                ? 'scale-115 filter drop-shadow-[0_2px_8px_rgba(147,51,234,0.3)]'
                : 'opacity-50 hover:opacity-90'
            }`}
            title="แดชบอร์ดพาร์ทเนอร์"
          >
            <span>📊</span>
            {activePage === 'dashboard' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-purple-600 rounded-full shadow-[0_0_8px_rgba(147,51,234,0.6)] animate-pulse" />
            )}
          </button>

          <button
            id="nav-btn-catalog"
            onClick={() => onNavigate('catalog')}
            className={`relative pb-2 flex flex-col items-center justify-center text-3xl transition-all duration-300 cursor-pointer hover:scale-115 active:scale-90 ${
              activePage === 'catalog'
                ? 'scale-115 filter drop-shadow-[0_2px_8px_rgba(147,51,234,0.3)]'
                : 'opacity-50 hover:opacity-90'
            }`}
            title="สินค้า/ผลิตภัณฑ์ (Catalog)"
          >
            <span>📦</span>
            {activePage === 'catalog' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-purple-600 rounded-full shadow-[0_0_8px_rgba(147,51,234,0.6)] animate-pulse" />
            )}
          </button>

          <button
            onClick={() => window.open('https://lin.ee/pS4MUIo', '_blank')}
            className="relative pb-2 flex flex-col items-center justify-center text-3xl transition-all duration-300 hover:scale-115 active:scale-90 cursor-pointer opacity-50 hover:opacity-100 filter hover:drop-shadow-[0_2px_8px_rgba(34,197,94,0.35)]"
            title="LINE ติดต่อแลป"
          >
            <span>💚</span>
          </button>
        </div>
      </div>
    </header>
  );
}
