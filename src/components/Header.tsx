import { Stethoscope, Globe, Plus, Layers, ShieldCheck, HeartPulse } from 'lucide-react';
import { ActivePage } from '../types';
import Swal from 'sweetalert2';

interface HeaderProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  dbStatus: 'checking' | 'connected' | 'demo';
}

export default function Header({ activePage, onNavigate, dbStatus }: HeaderProps) {
  const showDbInfo = () => {
    Swal.fire({
      title: 'สถานะระบบหลังบ้าน (Database connection)',
      html: `
        <div class="text-left text-sm space-y-3 font-sans">
          <p class="text-gray-600">แอปพลิเคชันนี้เชื่อมโยงกับระบบจัดเก็บข้อมูลแบบกระจายคลาวด์บน <b>Google Sheets</b> ของแลปผ่าน Web App API</p>
          <div class="p-3 bg-purple-50 rounded-lg border border-purple-100">
            <p class="font-medium text-purple-800">💡 รายละเอียดโหมดจำลอง (Demo Mode):</p>
            <p class="text-xs text-purple-700 mt-1">
              เนื่องจากแอปทำงานในสภาพแวดล้อม Sandbox ของเบราว์เซอร์ หากตรวจพบข้อจำกัดทางเครือข่าย/CORS ระบบจะเปิดโหมดทัศนจรจำลองโดยอัตโนมัติ เพื่อให้ท่านทดลองกรอกฟอร์มลงทะเบียน ดูหน้าจอ แดชบอร์ด และส่วนอื่นๆ ได้อย่างราบรื่น
            </p>
          </div>
          <p class="font-semibold text-gray-700">คำแนะนำระบบผลิตจริง:</p>
          <ol class="list-decimal pl-5 text-xs text-gray-650 space-y-1">
            <li>เปิดใช้งาน Google App Script ในไฟล์ชีทหลัก</li>
            <li>Deploy Web App กำหนดสิทธิ์ให้ "Everyone (ทุกคน)"</li>
            <li>ตั้งค่า Script URL ในไฟล์ปรับแต่งเพื่อซิงก์ข้อมูลตามจริง</li>
          </ol>
        </div>
      `,
      icon: dbStatus === 'connected' ? 'success' : 'info',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#9333ea',
    });
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl border border-purple-100 rounded-3xl p-5 mb-8 shadow-xl shadow-purple-100/30 sticky top-4 z-50 transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Branding & Status Indicator */}
        <div className="text-center md:text-left flex flex-col sm:flex-row items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center shadow-inner">
            <HeartPulse className="w-8 h-8 animate-pulse text-purple-600" />
          </div>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl md:text-3xl font-extrabold text-purple-950 tracking-tight flex items-center justify-center gap-1">
                S.T.D. DENTAL LAB
              </h1>
              {/* Dynamic Status Pill */}
              <div className="flex justify-center sm:justify-start">
                <button
                  id="db-status-pill"
                  onClick={showDbInfo}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-semibold flex items-center gap-2 border transition-all duration-300 transform active:scale-95 ${
                    dbStatus === 'connected'
                      ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                      : dbStatus === 'demo'
                      ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 animate-pulse'
                      : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    dbStatus === 'connected' 
                      ? 'bg-green-500' 
                      : dbStatus === 'demo' 
                      ? 'bg-amber-500' 
                      : 'bg-yellow-500 animate-ping'
                  }`} />
                  {dbStatus === 'connected' && '🔵 เชื่อมหลังบ้านสำเร็จ'}
                  {dbStatus === 'demo' && '🟡 โหมดจำลอง (Demo Mode)'}
                  {dbStatus === 'checking' && 'กำลังเช็คการเชื่อมต่อ...'}
                </button>
              </div>
            </div>
            <p className="text-purple-600/85 font-medium text-xs sm:text-sm mt-1 sm:mt-0 text-center sm:text-left">
              ห้างหุ้นส่วนจำกัด เอส.ที.ดี.เด็นตอล แลป จ.เชียงใหม่
            </p>
          </div>
        </div>

        {/* Action / Navigation Buttons */}
        <div className="flex flex-wrap gap-2.5 justify-center items-center">
          <button
            id="nav-btn-home"
            onClick={() => onNavigate('cover')}
            className={`py-2 px-5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-350 cursor-pointer ${
              activePage === 'cover'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20 scale-105'
                : 'bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 hover:scale-103'
            }`}
          >
            🏠 หน้าแรก
          </button>
          
          <button
            id="nav-btn-register"
            onClick={() => onNavigate('register')}
            className={`py-2 px-5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-350 cursor-pointer flex items-center gap-1.5 ${
              activePage === 'register'
                ? 'bg-purple-650 text-white shadow-lg shadow-purple-500/30 scale-105'
                : 'bg-purple-50/50 text-purple-700 hover:bg-purple-100/80 hover:scale-103'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> ลงทะเบียนคลินิก
          </button>

          <button
            id="nav-btn-dashboard"
            onClick={() => onNavigate('dashboard')}
            className={`py-2 px-5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-350 cursor-pointer ${
              activePage === 'dashboard'
                ? 'bg-purple-700 text-white shadow-lg shadow-purple-500/30 scale-105'
                : 'bg-purple-50/50 text-purple-700 hover:bg-purple-100/80 hover:scale-103'
            }`}
          >
            📊 แดชบอร์ดพาร์ทเนอร์
          </button>

          <button
            id="nav-btn-catalog"
            onClick={() => onNavigate('catalog')}
            className={`py-2 px-5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-350 cursor-pointer flex items-center gap-1.5 ${
              activePage === 'catalog'
                ? 'bg-purple-800 text-white shadow-lg shadow-purple-500/30 scale-105'
                : 'bg-purple-50/50 text-purple-700 hover:bg-purple-100/80 hover:scale-103'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> สินค้า/ผลิตภัณฑ์
          </button>

          <button
            onClick={() => window.open('https://lin.ee/pS4MUIo', '_blank')}
            className="bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-green-500/20 font-bold py-2 px-5 rounded-full text-xs sm:text-sm transition-all duration-300 hover:scale-105"
          >
            💚 LINE ติดต่อแลป
          </button>
        </div>
      </div>
    </header>
  );
}
