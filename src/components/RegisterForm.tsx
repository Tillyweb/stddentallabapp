import React, { useState, useRef } from 'react';
import { 
  Plus, 
  MapPin, 
  Phone, 
  Globe, 
  User, 
  ShoppingBag, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  ArrowLeft,
  CheckCircle,
  Building2
} from 'lucide-react';
import { PROVINCES_LIST } from '../constants';
import Swal from 'sweetalert2';

interface RegisterFormProps {
  onBack: () => void;
  onSubmit: (data: any) => Promise<boolean>;
}

export default function RegisterForm({ onBack, onSubmit }: RegisterFormProps) {
  const [province, setProvince] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [clinicPage, setClinicPage] = useState('');
  const [dentistName, setDentistName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [additional, setAdditional] = useState('ขอชุด catalog retaianer และใบสั่งผลิตแลป');

  // Logo and Cover Base64 Files
  const [logoBase64, setLogoBase64] = useState('');
  const [logoName, setLogoName] = useState('');
  const [coverBase64, setCoverBase64] = useState('');
  const [coverName, setCoverName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // File to Base64 Reader Helper
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setBase64: (val: string) => void,
    setName: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'ไฟล์ขนาดใหญ่เกินไป',
        text: 'กรุณาอัปโหลดรูปภาพที่มีขนาดไม่เกิน 2MB เพื่อความรวดเร็วในการส่งข้อมูล',
        confirmButtonColor: '#9333ea'
      });
      return;
    }

    setName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setBase64(evt.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({ icon: 'error', title: 'ไฟล์ใหญ่เกินไป', text: 'จำกัดขนาด 2MB ครับ', confirmButtonColor: '#9333ea' });
        return;
      }
      setLogoName(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) setLogoBase64(evt.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({ icon: 'error', title: 'ไฟล์ใหญ่เกินไป', text: 'จำกัดขนาด 2MB ครับ', confirmButtonColor: '#9333ea' });
        return;
      }
      setCoverName(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) setCoverBase64(evt.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!province) {
      Swal.fire({ icon: 'error', title: 'กรุณากรอกข้อมูล', text: 'กรุณาเลือกจังหวัดของคลินิก', confirmButtonColor: '#9333ea' });
      return;
    }

    setIsSubmitting(true);
    
    // Package Form Parameters
    const payload = {
      province,
      clinicName,
      clinicPage,
      dentistName,
      contactNumber,
      additional,
      logoUrl: logoBase64, // Base64 matches logoUrl inside Apps Script POST handler
      coverUrl: coverBase64, // Base64 matches coverUrl inside Apps Script POST handler
    };

    const success = await onSubmit(payload);
    setIsSubmitting(false);

    if (success) {
      // Reset Form State
      setProvince('');
      setClinicName('');
      setClinicPage('');
      setDentistName('');
      setContactNumber('');
      setAdditional('ขอชุด catalog retaianer และใบสั่งผลิตแลป');
      setLogoBase64('');
      setLogoName('');
      setCoverBase64('');
      setCoverName('');
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-purple-100 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-200/40 max-w-3xl mx-auto">
      {/* Top Controls */}
      <button
        onClick={onBack}
        className="group bg-purple-50 hover:bg-purple-100/85 text-purple-800 font-bold py-2.5 px-5 rounded-full text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all duration-300 mb-6"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        ย้อนกลับหน้าแรก
      </button>

      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-purple-950 flex items-center justify-center gap-2">
          ✍️ ลงทะเบียนพาร์ทเนอร์คลินิก (Partner Registration)
        </h2>
        <p className="text-purple-650 text-sm mt-1.5 font-light">
          กรอกแบบฟอร์มเพื่อเข้าสู่เครือข่ายพาร์ทเนอร์ทันตกรรมชั้นนำกับ เอส.ที.ดี. เด็นตอล แลป
        </p>
      </div>

      <form onSubmit={triggerSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Province Input */}
          <div>
            <label className="block text-purple-900 text-xs font-bold mb-1.5 tracking-wide flex items-center gap-1.5">
              <MapPin className="w-4.5 h-4.5 text-purple-600" />
              จังหวัด *
            </label>
            <select
              required
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-white border border-purple-200 text-purple-950 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 cursor-pointer"
            >
              <option value="" disabled>--- เลือกจังหวัดที่ตั้งคลินิก ---</option>
              {PROVINCES_LIST.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>

          {/* Clinic Name Input */}
          <div>
            <label className="block text-purple-900 text-xs font-bold mb-1.5 tracking-wide flex items-center gap-1.5">
              <Building2 className="w-4.5 h-4.5 text-purple-600" />
              ชื่อคลินิกทันตกรรม *
            </label>
            <input
              type="text"
              required
              placeholder="เช่น คลินิกทันตกรรมรักฟัน เชียงใหม่"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-white border border-purple-200 text-purple-900 text-sm placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
            />
          </div>

          {/* Clinic Page URL */}
          <div>
            <label className="block text-purple-900 text-xs font-bold mb-1.5 tracking-wide flex items-center gap-1.5">
              <Globe className="w-4.5 h-4.5 text-purple-600" />
              ลิงก์เพจคลินิก (URL)
            </label>
            <input
              type="url"
              placeholder="https://www.facebook.com/yourclinic"
              value={clinicPage}
              onChange={(e) => setClinicPage(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-white border border-purple-200 text-purple-900 text-sm placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
            />
          </div>

          {/* Attending Doctor Name */}
          <div>
            <label className="block text-purple-900 text-xs font-bold mb-1.5 tracking-wide flex items-center gap-1.5">
              <User className="w-4.5 h-4.5 text-purple-600" />
              ทันตแพทย์ผู้ดูแลประจำคลินิก
            </label>
            <input
              type="text"
              placeholder="ทพ. สมศักดิ์ รักดี"
              value={dentistName}
              onChange={(e) => setDentistName(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-white border border-purple-200 text-purple-900 text-sm placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-purple-900 text-xs font-bold mb-1.5 tracking-wide flex items-center gap-1.5">
              <Phone className="w-4.5 h-4.5 text-purple-600" />
              เบอร์โทรติดต่อกลับ *
            </label>
            <input
              type="tel"
              required
              placeholder="08X-XXX-XXXX หรือ 053-XXX-XXX"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-white border border-purple-200 text-purple-900 text-sm placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
            />
          </div>

          {/* Additional Requests dropdown */}
          <div>
            <label className="block text-purple-900 text-xs font-bold mb-1.5 tracking-wide flex items-center gap-1.5">
              <ShoppingBag className="w-4.5 h-4.5 text-purple-600" />
              การรับบริการและรายละเอียดเพิ่มเติม
            </label>
            <select
              value={additional}
              onChange={(e) => setAdditional(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-white border border-purple-200 text-purple-950 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 cursor-pointer"
            >
              <option value="ขอชุด catalog retaianer และใบสั่งผลิตแลป">
                ขอชุด Catalog พิมพ์สี และใบสั่งผลิตแลป
              </option>
              <option value="สั่งทำงานตัวอย่าง(ราคา50%ของค่าแลป)">
                สั่งผลิตงานตัวอย่างโมเดลแรกเข้า (ลดราคา 50%)
              </option>
            </select>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
          {/* Logo File Selector and Drag & Drop */}
          <div>
            <label className="block text-purple-950 text-xs font-bold mb-2 tracking-wide flex items-center gap-1">
              📸 อัปโหลดรูปภาพ LOGO คลินิก
            </label>
            {logoBase64 ? (
              <div className="relative border border-purple-200 rounded-xl p-3 bg-purple-50/20 flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-purple-100 flex-shrink-0 bg-white">
                  <img src={logoBase64} alt="Clinic Logo" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-purple-950 font-semibold truncate">{logoName}</p>
                  <p className="text-[10px] text-purple-400">แปลงรูปคลาวด์สำเร็จ</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setLogoBase64(''); setLogoName(''); }}
                  className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleLogoDrop}
                onClick={() => logoInputRef.current?.click()}
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-purple-200 hover:border-purple-500 rounded-2xl cursor-pointer bg-white/50 hover:bg-purple-50/20 transition-all duration-300"
              >
                <Upload className="w-6 h-6 text-purple-400 select-none" />
                <p className="text-xs text-purple-700 font-semibold mt-1 select-none">เลือกไฟล์รูปภาพโลโก้</p>
                <p className="text-[10px] text-gray-400 select-none mt-0.5">ลากไฟล์ลงที่นี่ หรือคลิกเพื่อค้นหาภาพ (สูงสุด 2MB)</p>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setLogoBase64, setLogoName)}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Cover Image Selector and Drag & Drop */}
          <div>
            <label className="block text-purple-950 text-xs font-bold mb-2 tracking-wide flex items-center gap-1">
              🖼️ อัปโหลดรูปภาพปกคลินิก (Cover Photo)
            </label>
            {coverBase64 ? (
              <div className="relative border border-purple-200 rounded-xl p-3 bg-purple-50/20 flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-purple-200 flex-shrink-0 bg-white">
                  <img src={coverBase64} alt="Clinic Cover" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-purple-950 font-semibold truncate">{coverName}</p>
                  <p className="text-[10px] text-purple-400 font-light">แปลงรูปปกคลาวด์สำเร็จ</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setCoverBase64(''); setCoverName(''); }}
                  className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleCoverDrop}
                onClick={() => coverInputRef.current?.click()}
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-purple-200 hover:border-purple-500 rounded-2xl cursor-pointer bg-white/50 hover:bg-purple-50/20 transition-all duration-300"
              >
                <ImageIcon className="w-6 h-6 text-purple-400 select-none" />
                <p className="text-xs text-purple-700 font-semibold mt-1 select-none">เลือกไฟล์รูปภาพหน้าปก</p>
                <p className="text-[10px] text-gray-400 select-none mt-0.5">ลากไฟล์ลงที่นี่ หรือคลิกเพื่อค้นหาภาพ (สูงสุด 2MB)</p>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setCoverBase64, setCoverName)}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-6 text-center border-t border-purple-100/50">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-64 bg-linear-to-r from-purple-600 to-purple-800 disabled:from-purple-400 disabled:to-purple-500 text-white font-extrabold py-3 px-10 rounded-full text-base shadow-lg shadow-purple-500/20 hover:scale-103 active:scale-97 cursor-pointer transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                กำลังบันทึกและส่งงาน...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                ลงทะเบียนคลินิกเดี๋ยวนี้
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
