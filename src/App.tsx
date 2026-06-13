import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Stethoscope, Phone, AlertTriangle, ShieldAlert, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';

import { Clinic, CatalogItem, ActivePage } from './types';
import { SCRIPT_URL, MOCK_CLINICS, MOCK_CATALOG } from './constants';

import Header from './components/Header';
import Slideshow from './components/Slideshow';
import CoverClinics from './components/CoverClinics';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import CatalogGrid from './components/CatalogGrid';
import PremiumTimepiece from './components/PremiumTimepiece';

export default function App() {
  // Navigation State
  const [activePage, setActivePage] = useState<ActivePage>('cover');

  // Dynamic Apps Script Database URL
  const [scriptUrl, setScriptUrl] = useState<string>(() => {
    return localStorage.getItem('custom_script_url') || SCRIPT_URL;
  });

  const updateScriptUrl = (url: string) => {
    if (!url || url.trim() === '') {
      localStorage.removeItem('custom_script_url');
      setScriptUrl(SCRIPT_URL);
      Swal.fire({
        icon: 'success',
        title: 'รีเซ็ต URL สำเร็จ',
        text: 'ระบบได้รีเซ็ตไปใช้งาน SCRIPT_URL เริ่มต้นของระบบแล้ว',
        confirmButtonColor: '#9333ea'
      });
    } else {
      localStorage.setItem('custom_script_url', url.trim());
      setScriptUrl(url.trim());
      Swal.fire({
        icon: 'success',
        title: 'บันทึก URL สำเร็จ',
        text: 'ระบบได้รับการอัปเดตและจะพยายามเชื่อมต่อข้อมูลจาก Apps Script ของท่านด่วน',
        confirmButtonColor: '#9333ea'
      });
    }
  };

  // Database Synchronized States
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'demo'>('checking');
  
  // Loading indicators
  const [isClinicsLoading, setIsClinicsLoading] = useState(false);
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);

  // Keep references to prevent race condition or duplicate loading
  const clinicsFetched = useRef(false);
  const catalogFetched = useRef(false);

  // ===== SAFE FETCH/JSONP LOADERS FOR THE BACKEND WEBSERVICE =====
  
  // Safe fetch data parser that supports both normal JSON and JSONP format without creating unsafe script tags
  const fetchJsonpData = useCallback((action: 'getClinics' | 'getCatalog', callbackGlobalName: string) => {
    return new Promise<any>(async (resolve, reject) => {
      // Setup network timeout controller
      const controller = new AbortController();
      const timeoutLimit = setTimeout(() => {
        controller.abort();
      }, 7000);

      try {
        // Fetch via standard HTTP GET with cross-origin configuration
        const url = `${scriptUrl}?action=${action}&callback=${callbackGlobalName}`;
        const response = await fetch(url, {
          signal: controller.signal,
          mode: 'cors',
          credentials: 'omit'
        });

        clearTimeout(timeoutLimit);

        if (!response.ok) {
          throw new Error(`HTTP network error with status code: ${response.status}`);
        }

        const text = await response.text();
        if (!text || text.trim() === '') {
          throw new Error('Received an empty response from spreadsheet gateway');
        }

        // Parse content wrapping parenthesis if JSONP callback wrap is present
        const firstParenthesis = text.indexOf('(');
        const lastParenthesis = text.lastIndexOf(')');

        if (firstParenthesis !== -1 && lastParenthesis !== -1 && lastParenthesis > firstParenthesis) {
          const jsonStr = text.substring(firstParenthesis + 1, lastParenthesis);
          const parsed = JSON.parse(jsonStr);
          resolve(parsed);
        } else {
          // Fallback to direct JSON evaluation
          const parsed = JSON.parse(text);
          resolve(parsed);
        }
      } catch (err: any) {
        clearTimeout(timeoutLimit);
        console.warn(`Local fetch error captured for action ${action}:`, err);
        reject(err || new Error(`Failed to complete fetch for action ${action}`));
      }
    });
  }, [scriptUrl]);

  // Fetch Clinics Listing
  const syncClinics = useCallback(async (forcedSilently = false) => {
    if (!forcedSilently) setIsClinicsLoading(true);
    
    try {
      // Connect to Google Sheets Web App
      const remoteData = await fetchJsonpData('getClinics', 'handleClinicDataCallbackGlobal');
      
      if (remoteData && remoteData.length > 0) {
        setClinics(remoteData);
        setDbStatus('connected');
        localStorage.setItem('cached_clinics', JSON.stringify(remoteData));
      } else {
        throw new Error('Received empty fallback dataset');
      }
    } catch (err) {
      console.warn('API connection failed. Engaging intelligent offline cache + demo fallback: ', err);
      
      // Try Loading client-side Cache
      const cached = localStorage.getItem('cached_clinics');
      if (cached) {
        setClinics(JSON.parse(cached));
        setDbStatus('connected'); // we have actual data from previous sessions
      } else {
        // Fallback to high-fidelity mocks
        setClinics(MOCK_CLINICS);
        setDbStatus('demo');
      }
    } finally {
      setIsClinicsLoading(false);
    }
  }, [fetchJsonpData]);

  // Fetch Products Catalog
  const syncCatalog = useCallback(async (forcedSilently = false) => {
    if (!forcedSilently) setIsCatalogLoading(true);
    
    try {
      const remoteData = await fetchJsonpData('getCatalog', 'renderCatalogCallbackGlobal');
      
      if (remoteData && remoteData.length > 0) {
        setCatalogItems(remoteData);
        setDbStatus('connected');
        localStorage.setItem('cached_catalog', JSON.stringify(remoteData));
      } else {
        throw new Error('Received empty products catalog');
      }
    } catch (err) {
      console.warn('Catalog API sync details: ', err);
      const cached = localStorage.getItem('cached_catalog');
      if (cached) {
        setCatalogItems(JSON.parse(cached));
      } else {
        setCatalogItems(MOCK_CATALOG);
        setDbStatus('demo');
      }
    } finally {
      setIsCatalogLoading(false);
    }
  }, [fetchJsonpData]);

  // Unified Synchronization
  const handleFullSync = useCallback(async () => {
    setDbStatus('checking');
    await Promise.all([syncClinics(), syncCatalog()]);
  }, [syncClinics, syncCatalog]);

  // ===== INITIAL LOADERS =====
  useEffect(() => {
    if (!clinicsFetched.current) {
      clinicsFetched.current = true;
      syncClinics();
    }
    if (!catalogFetched.current) {
      catalogFetched.current = true;
      syncCatalog();
    }
  }, [syncClinics, syncCatalog]);

  // ===== SEAMLESS URL HASH ROUTING =====
  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = window.location.hash.replace('#', '') || 'cover';
      if (['cover', 'dashboard', 'register', 'catalog'].includes(currentHash)) {
        setActivePage(currentHash as ActivePage);
      } else {
        setActivePage('cover');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Bind initial hash route configuration
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleNavigation = (target: ActivePage) => {
    setActivePage(target);
    window.location.hash = target;
  };

  // ===== SUBMIT HANDLER =====
  const handleFormSubmission = async (formData: any): Promise<boolean> => {
    Swal.fire({
      title: 'กำลังตรวจสอบและส่งข้อมูลไปยังคลาวด์...',
      text: 'กรุณารอโหลดไฟล์ภาพสักครู่ ระบบกำลังป้อนลงคลัง Sheets',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // In local dev/demo sandbox mode, provide responsive simulations
    if (dbStatus === 'demo') {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Add newly registered clinic item to state directly for active session simulation
          const simulatedNewClinic: Clinic = {
            province: formData.province,
            name: formData.clinicName,
            pageLink: formData.clinicPage || 'https://www.facebook.com',
            logo: formData.logoUrl || 'https://placehold.co/100x100/f3e8ff/9333ea?text=🏥',
            cover: formData.coverUrl || 'https://placehold.co/400x200/f3e8ff/9333ea?text=Dental+Lab',
            review: '5⭐️',
            phone: formData.contactNumber,
          };
          setClinics((prev) => [simulatedNewClinic, ...prev]);

          Swal.fire({
            icon: 'success',
            title: '[โหมดจำลอง] ลงทะเบียนสำเร็จ!',
            text: 'ข้อมูลจำลองของพาร์ทเนอร์จะปรากฏใน แดชบอร์ด ทันที หากเชื่อมเว็บเซิร์ฟเวอร์หลักแล้ว ข้อมูลจะเข้าสู่อินสแตนซ์ของ Google Sheet หลักโดยอัตโนมัติ',
            confirmButtonColor: '#9333ea',
          });
          handleNavigation('cover');
          resolve(true);
        }, 1200);
      });
    }

    // Process actual POST connection to Apps Script
    try {
      const response = await fetch(scriptUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData).toString()
      });

      if (response.ok) {
        const text = await response.text();
        let result;
        try {
          result = JSON.parse(text);
        } catch (e) {
          result = { status: 'success' };
        }

        if (result.status === 'success' || result.result === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'ลงทะเบียนสำเร็จ!',
            text: 'ข้อมูลพาร์ทเนอร์คลินิกของท่านได้ถูกอัพเดทเข้าบัญชีรายชื่อเรียบร้อยแล้ว',
            confirmButtonColor: '#9333ea',
          });
          syncClinics(true); // reload silently
          handleNavigation('cover');
          return true;
        } else {
          throw new Error(result.message || 'โครงสร้างเซิร์ฟเวอร์ผิดพลาด');
        }
      } else {
        throw new Error(`เชื่อมเซิร์ฟเวอร์หลักไม่ได้ (HTTP ${response.status})`);
      }
    } catch (err) {
      console.error('Registration processing details: ', err);
      // Fallback matching original logic, notifying user it may have routed but warning of network anomalies
      Swal.fire({
        icon: 'warning',
        title: 'กำลังเชื่อมโยงเซิร์ฟเวอร์จัดเก็บ',
        text: 'ส่งคำขอเก็บข้อมูลแล้ว กรุณาตรวจสอบการบันทึกใน Google Sheets ของท่าน หากไม่พอดี กรุณาติดต่อทีมงานของแลป',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#9333ea',
      }).then(() => {
        // Optimistically put the item into local state to keep UX flawless
        const simulatedClinic: Clinic = {
          province: formData.province,
          name: formData.clinicName,
          pageLink: formData.clinicPage || 'https://www.facebook.com',
          logo: formData.logoUrl || 'https://placehold.co/100x100/f3e8ff/9333ea?text=🏥',
          cover: formData.coverUrl || 'https://placehold.co/400x200/f3e8ff/9333ea?text=Dental+Lab',
          review: '5⭐️',
          phone: formData.contactNumber,
        };
        setClinics((prev) => [simulatedClinic, ...prev]);
        handleNavigation('cover');
      });
      return true;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 min-h-screen flex flex-col justify-between">
      {/* Dynamic Rendered Canvas */}
      <div>
        {/* Navigation panel */}
        <Header activePage={activePage} onNavigate={handleNavigation} dbStatus={dbStatus} />

        {/* Dynamic Pages */}
        {activePage === 'cover' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header / Interactive Slideshow */}
            <Slideshow 
              items={catalogItems} 
              onRefresh={syncCatalog} 
              isLoading={isCatalogLoading} 
            />

            {/* Filterable partner clinics list */}
            <CoverClinics 
              clinics={clinics} 
              onRefresh={syncClinics} 
              isLoading={isClinicsLoading} 
            />

            {/* Premium Horology / Timepiece Status Center */}
            <PremiumTimepiece />
          </div>
        )}

        {activePage === 'register' && (
          <div className="animate-fade-in">
            <RegisterForm 
              onBack={() => handleNavigation('cover')} 
              onSubmit={handleFormSubmission} 
            />
          </div>
        )}

        {activePage === 'dashboard' && (
          <div className="animate-fade-in">
            <Dashboard 
              clinics={clinics} 
              onRefresh={syncClinics} 
              isLoading={isClinicsLoading} 
              onBack={() => handleNavigation('cover')} 
              scriptUrl={scriptUrl}
              onUpdateScriptUrl={updateScriptUrl}
            />
          </div>
        )}

        {activePage === 'catalog' && (
          <div className="animate-fade-in">
            <CatalogGrid 
              items={catalogItems} 
              onRefresh={syncCatalog} 
              isLoading={isCatalogLoading} 
              onBack={() => handleNavigation('cover')} 
            />
          </div>
        )}
      </div>

      {/* Decorative footer card */}
      <footer className="mt-12 bg-white/60 backdrop-blur-md border border-purple-100 rounded-2xl p-5 text-center shadow-md">
        <p className="text-purple-900 font-semibold text-sm">
          📍 ห้างหุ้นส่วนจำกัด เอส.ที.ดี. เด็นตอล แลป (S.T.D. DENTAL LAB)
        </p>
        <p className="text-purple-600/80 text-xs mt-1">
          ต.สันปูเลย อ.ดอยสะเก็ด จ.เชียงใหม่ | บริการจัดส่งและร่วมมือกับคลินิกทันตกรรมทั่วประเทศ
        </p>
        <p className="text-gray-400 text-[10px] sm:text-xs mt-2 font-mono">
          © 2026 S.T.D. Dental Lab — Premium Grade Dental Prosthetics. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

