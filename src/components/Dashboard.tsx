import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Star, 
  Users, 
  RefreshCw, 
  Search, 
  ArrowLeft,
  Image as ImageIcon,
  ExternalLink,
  Phone,
  Copy,
  Check,
  FileText,
  CloudLightning,
  Settings,
  Database
} from 'lucide-react';
import { Clinic } from '../types';
import Swal from 'sweetalert2';

interface DashboardProps {
  clinics: Clinic[];
  onRefresh: () => void;
  isLoading: boolean;
  onBack: () => void;
  scriptUrl: string;
  onUpdateScriptUrl: (url: string) => void;
}

const APPS_SCRIPT_CODE = `// -------------------------------------------------------------
// 🦷 S.T.D. DENTAL LAB - GOOGLE SHEETS CONNECTOR (Code.gs)
// วางโค้ดนี้ใน Extensions > Apps Script ของ Google Sheets เพื่อเชื่อมโยงฐานข้อมูลแบบ Real-time
// -------------------------------------------------------------

// ใส่ ID ของ Google Sheets เริ่มต้น (ใช้สำรองในกรณีไม่เรียกจากตัวแผ่นงานโดยตรง)
const SPREADSHEET_ID = "1M2h9dGWMMUNwFr1sy2WtvMBxgCsRvXbVf-BD8GD_lNA";

/**
 * ฟังก์ชันดึงแผ่นงานปัจจุบันหรือใช้ ID ในกรณีฉุกเฉิน
 */
function getSpreadsheet() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) return ss;
  } catch (err) {
    // ไม่ได้รันในแผ่นงานตรงๆ
  }
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

/**
 * ฟังก์ชันสร้างหัวตารางอัตโนมัติ หากเป็นชีตว่างเปล่าเพื่อป้องกันระบบขัดข้อง
 */
function initSheets(ss) {
  let clinicSheet = ss.getSheetByName("cilnicmember");
  if (!clinicSheet) {
    clinicSheet = ss.getSheetByName("Clinics");
  }
  if (!clinicSheet) {
    clinicSheet = ss.insertSheet("cilnicmember");
  }
  if (clinicSheet.getLastRow() === 0) {
    clinicSheet.appendRow([
      "จังหวัด",
      "ชื่อคลินิกทันตกรรม",
      "ลิ้งเพจคลินิก",
      "LOGO คลินิก",
      "รูป cover",
      "รีวิวคลินิก ⭐️ ⭐️ ⭐️",
      "เบอร์ติดต่อ"
    ]);
    clinicSheet.getRange("A1:G1").setFontWeight("bold").setBackground("#9333ea").setFontColor("#ffffff");
  }

  let catalogSheet = ss.getSheetByName("catalog");
  if (!catalogSheet) {
    catalogSheet = ss.getSheetByName("Catalog");
  }
  if (!catalogSheet) {
    catalogSheet = ss.insertSheet("catalog");
  }
  if (catalogSheet.getLastRow() === 0) {
    catalogSheet.appendRow(["Product", "Image"]);
    catalogSheet.getRange("A1:B1").setFontWeight("bold").setBackground("#4f46e5").setFontColor("#ffffff");
  }
}

/**
 * ดึงข้อมูล (GET Request) รองรับทั้ง JSONP และ HTML Fetch
 */
function doGet(e) {
  const action = e.parameter.action;
  const callback = e.parameter.callback;
  
  if (!action) {
    return createResponse({ status: "error", message: "Error: action parameter is missing" }, callback);
  }
  
  let ss;
  try {
    ss = getSpreadsheet();
    initSheets(ss);
  } catch (err) {
    return createResponse({ status: "error", message: "Spreadsheet Access Denied: " + err.toString() }, callback);
  }
  
  let result = [];
  
  try {
    if (action === "getClinics") {
      let sheet = ss.getSheetByName("cilnicmember");
      if (!sheet) {
        sheet = ss.getSheetByName("Clinics");
      }
      
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) {
        return createResponse([], callback);
      }
      
      // ตรวจสอบหัวตาราง (แถวแรก) เพื่อจับคู่คอลัมน์แบบยืดหยุ่น (ป้องกันการสลับคอลัมน์)
      const headers = data[0].map(h => String(h || "").trim());
      
      // ค้นหาดัชนีของแต่ละคอลัมน์จากชื่อหัวข้อ
      const colIndex = {
        province: headers.findIndex(h => h.includes("จังหวัด")),
        name: headers.findIndex(h => h.includes("ชื่อคลินิก")),
        pageLink: headers.findIndex(h => h.includes("ลิงก์") || h.includes("ลิ้ง")),
        logo: headers.findIndex(h => h.includes("โลโก้") || h.includes("LOGO")),
        cover: headers.findIndex(h => h.includes("ปก") || h.includes("cover") || h.includes("Cover")),
        review: headers.findIndex(h => h.includes("รีวิว") || h.includes("คะแนน")),
        phone: headers.findIndex(h => h.includes("เบอร์") || h.includes("โทร") || h.includes("ติดต่อ"))
      };
      
      // หากหาด้วยชื่อไม่เจอ ให้ใช้ดัชนีเริ่มต้นตามลำดับมาตรฐานของ cilnicmember
      // 0: จังหวัด, 1: ชื่อคลินิก, 2: ลิ้งเพจ, 3: โลโก้, 4: รูปปก, 5: รีวิว, 6: เบอร์โทร
      const getVal = (row, key, fallbackIndex) => {
        const idx = colIndex[key] !== -1 ? colIndex[key] : fallbackIndex;
        return row[idx] !== undefined ? String(row[idx]).trim() : "";
      };

      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const nameVal = getVal(row, "name", 1);
        if (!nameVal) continue; // ข้ามแถวที่ชื่อว่างเปล่า
        
        result.push({
          province: getVal(row, "province", 0),
          name: nameVal,
          pageLink: getVal(row, "pageLink", 2),
          logo: getVal(row, "logo", 3),
          cover: getVal(row, "cover", 4),
          review: getVal(row, "review", 5) || "5⭐️",
          phone: getVal(row, "phone", 6)
        });
      }
    } else if (action === "getCatalog") {
      let sheet = ss.getSheetByName("catalog");
      if (!sheet) {
        sheet = ss.getSheetByName("Catalog");
      }
      
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) {
        return createResponse([], callback);
      }
      
      // ดึงข้อมูลแถวถัดๆ ไป เพื่อเช็กว่าคอลัมน์ไหนเก็บ URL รูปภาพ (คอลัมน์ A หรือ B)
      let urlColIdx = -1;
      let nameColIdx = -1;
      
      for (let i = 1; i < data.length; i++) {
        const val0 = String(data[i][0] || "").trim();
        const val1 = String(data[i][1] || "").trim();
        if (val0.indexOf("http") === 0 || val0.indexOf("data:") === 0) {
          urlColIdx = 0;
          nameColIdx = 1;
          break;
        } else if (val1.indexOf("http") === 0 || val1.indexOf("data:") === 0) {
          urlColIdx = 1;
          nameColIdx = 0;
          break;
        }
      }
      
      // กรณีไม่เจอลักษณะ URL ให้ใช้ลำดับเริ่มต้น
      if (urlColIdx === -1) {
        urlColIdx = 0;
        nameColIdx = 1;
      }
      
      for (let i = 1; i < data.length; i++) {
        const nameVal = String(data[i][nameColIdx] || "").trim();
        const urlVal = String(data[i][urlColIdx] || "").trim();
        if (!nameVal && !urlVal) continue;
        
        result.push({
          name: nameVal,
          imageUrl: urlVal
        });
      }
    } else {
      return createResponse({ status: "error", message: "Unknown action: " + action }, callback);
    }
  } catch (err) {
    result = { status: "error", message: err.toString() };
  }
  
  return createResponse(result, callback);
}

/**
 * บันทึกข้อมูลคลินิกใหม่ (POST Request) บันทึกลงตาราง newclinic
 */
function doPost(e) {
  let ss;
  try {
    ss = getSpreadsheet();
    initSheets(ss);
  } catch (err) {
    return createResponse({ status: "error", message: "Spreadsheet Access Denied: " + err.toString() });
  }
  
  let sheet = ss.getSheetByName("newclinic");
  if (!sheet) {
    sheet = ss.getSheetByName("Clinics");
  }
  if (!sheet) {
    sheet = ss.insertSheet("newclinic");
  }
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "วันเวลา",
      "จังหวัด",
      "ชื่อคลินิกทันตกรรม",
      "ลิ้งเพจคลินิก",
      "ทพ.ประจำคลินิก",
      "LOGO คลินิก",
      "รูป cover",
      "เบอร์โทรติดต่อกลับ",
      "Option"
    ]);
    sheet.getRange("A1:I1").setFontWeight("bold").setBackground("#4f46e5").setFontColor("#ffffff");
  }
  
  try {
    let params = {};
    if (e && e.parameter) {
      params = e.parameter;
    }
    
    if (e && e.postData && e.postData.contents) {
      try {
        const jsonParsed = JSON.parse(e.postData.contents);
        for (let key in jsonParsed) {
          params[key] = jsonParsed[key];
        }
      } catch (err2) {
        try {
          const parts = e.postData.contents.split("&");
          for (let i = 0; i < parts.length; i++) {
            const pair = parts[i].split("=");
            if (pair.length === 2) {
              const k = decodeURIComponent(pair[0]);
              const v = decodeURIComponent(pair[1]);
              params[k] = v;
            }
          }
        } catch (err3) {}
      }
    }
    
    const province = params.province || "";
    const clinicName = params.clinicName || "";
    const clinicPage = params.clinicPage || "";
    const dentistName = params.dentistName || "";
    const contactNumber = params.contactNumber || "";
    const additional = params.additional || "";
    
    let logoUrl = params.logoUrl || "";
    let coverUrl = params.coverUrl || "";
    
    if (!clinicName) {
      return createResponse({ status: "error", message: "ชื่อคลินิกไม่ควรว่างเปล่า" });
    }
    
    // แปลงไฟล์ base64 และบันทึกลง Google Drive ของท่านทันที
    if (logoUrl && logoUrl.indexOf("data:image") === 0) {
      logoUrl = saveImageToDrive(logoUrl, clinicName + "_logo_" + Date.now() + ".png");
    }
    if (coverUrl && coverUrl.indexOf("data:image") === 0) {
      coverUrl = saveImageToDrive(coverUrl, clinicName + "_cover_" + Date.now() + ".png");
    }
    
    sheet.appendRow([
      new Date(),
      province,
      clinicName,
      clinicPage,
      dentistName,
      logoUrl,
      coverUrl,
      contactNumber,
      additional
    ]);
    
    return createResponse({ status: "success", result: "success" });
  } catch (err) {
    return createResponse({ status: "error", message: err.toString() });
  }
}

/**
 * ช่วยบันทึกรูป Base64 ลง Google Drive
 */
function saveImageToDrive(base64Data, filename) {
  try {
    const splitData = base64Data.split(",");
    const contentType = splitData[0].match(/:(.*?);/)[1];
    const rawData = splitData[1];
    const decoded = Utilities.base64Decode(rawData);
    const blob = Utilities.newBlob(decoded, contentType, filename);
    
    const folderName = "STD_Dental_Lab_Uploads";
    let folders = DriveApp.getFoldersByName(folderName);
    let folder;
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }
    
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
    return "https://drive.google.com/uc?export=view&id=" + file.getId();
  } catch (err) {
    return base64Data; // คืนค่าข้อความ base64 เดิมกลับไปหากมีปัญหาเรื่องสิทธิ์
  }
}

/**
 * ตัวช่วยสร้าง Object การตอบกลับเพื่อรองรับ CORS และ JSONP Callback ทั่วไป
 */
function createResponse(data, callback) {
  const jsonEncoded = JSON.stringify(data);
  if (callback) {
    const jsonpOutput = callback + "(" + jsonEncoded + ")";
    return ContentService.createTextOutput(jsonpOutput)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    return ContentService.createTextOutput(jsonEncoded)
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

export default function Dashboard({ 
  clinics, 
  onRefresh, 
  isLoading, 
  onBack,
  scriptUrl,
  onUpdateScriptUrl
}: DashboardProps) {
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSetup, setShowSetup] = useState<boolean>(false);
  const [tempUrl, setTempUrl] = useState<string>(scriptUrl);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Extract unique provinces
  const provinces = useMemo(() => {
    const list = clinics.map((c) => c.province).filter(Boolean);
    return ['all', ...Array.from(new Set(list)).sort()];
  }, [clinics]);

  // Compute stat metrics
  const stats = useMemo(() => {
    const total = clinics.length;
    
    const uniqueProvinces = new Set(clinics.map((c) => c.province).filter(Boolean));
    const totalProvinces = uniqueProvinces.size;
    
    let fiveStarCount = 0;
    clinics.forEach((c) => {
      if (String(c.review).includes('5')) {
        fiveStarCount++;
      }
    });

    return {
      total,
      totalProvinces,
      fiveStar: fiveStarCount
    };
  }, [clinics]);

  // Filter list
  const filteredClinics = useMemo(() => {
    return clinics.filter((c) => {
      // Province filter
      if (selectedProvince !== 'all' && c.province !== selectedProvince) {
        return false;
      }

      // Search keyword filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(query);
        const matchesProv = c.province.toLowerCase().includes(query);
        const matchesPhone = c.phone.toLowerCase().includes(query);
        return matchesName || matchesProv || matchesPhone;
      }

      return true;
    });
  }, [clinics, selectedProvince, searchQuery]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'คัดลอกโค้ดสำเร็จ!',
      showConfirmButton: false,
      timer: 1500
    });
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateScriptUrl(tempUrl);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-purple-100 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-200/40 min-h-[60vh]">
      {/* Top action block with back button */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8">
        <button
          onClick={onBack}
          className="mr-auto lg:mr-0 group bg-purple-50 hover:bg-purple-100/80 text-purple-800 font-bold py-2.5 px-5 rounded-full text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all duration-300 shrink-0"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          ย้อนกลับหน้าแรก
        </button>
        <h2 className="text-xl sm:text-2xl font-extrabold text-purple-950 text-center flex-1">
          📊 แดชบอร์ดการจัดการคลินิกพันธมิตรของเรา (Partner Clinics)
        </h2>
        <div className="flex gap-2.5 shrink-0 w-full lg:w-auto justify-end">
          <button
            onClick={() => setShowSetup(!showSetup)}
            className={`font-semibold py-2.5 px-5 rounded-full text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all duration-200 cursor-pointer hover:scale-103 ${
              showSetup 
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/25' 
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/15'
            }`}
          >
            <Settings className="w-4.5 h-4.5 animate-spin-slow" />
            {showSetup ? 'ปิดหน้าเชื่อมต่อคลาวด์' : '⚙️ Curation Cloud Link'}
          </button>
          
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-2.5 px-5 rounded-full text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-purple-500/15 cursor-pointer hover:scale-103 transition-all duration-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'กำลังซิงก์...' : '🔄 Curated Refresh'}
          </button>
        </div>
      </div>

      {/* Google Sheets Setup Instructions (Toggleable Widget) */}
      {showSetup && (
        <div className="mb-10 text-slate-800 bg-linear-to-br from-slate-900 via-slate-950 to-purple-950 p-6 sm:p-8 rounded-3xl border border-slate-850 shadow-2xl animate-fade-in relative overflow-hidden text-sm">
          {/* Background overlay flare */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <span className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
              <Database className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                🛠️ คู่มือติดตั้งสถาปัตยกรรมคลาวด์ฐานข้อมูลแบบ Real-time
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                เชื่อมต่อฐานข้อมูลของคลินิกโดยใช้ Google Sheet ID ของท่าน: <code className="text-amber-300 font-mono select-all">1M2h9dGWMMUNwFr1sy2WtvMBxgCsRvXbVf-BD8GD_lNA</code>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
            {/* Steps Column */}
            <div className="space-y-5 text-slate-300">
              <h4 className="font-extrabold text-sm text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <CloudLightning className="w-4 h-4" /> 
                3 ขั้นตอนยกระดับสถาปัตยกรรมคลาวด์ใน 2 นาที
              </h4>
              
              <ul className="space-y-4 text-xs sm:text-sm">
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-white">เตรียมแผ่นงานใน Google Sheets</h5>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      สร้างตารางใน Google Sheet ID: <span className="font-mono text-amber-200">1M2h9dGWMMUNwFr1sy2WtvMBxgCsRvXbVf-BD8GD_lNA</span> มอบชื่อแผ่นงาน 2 แผ่นดังนี้:
                    </p>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                        <p className="text-[11px] font-bold text-purple-300">แผ่นที่ 1: <code className="bg-slate-900 px-1 py-0.5 rounded text-white font-mono">Clinics</code></p>
                        <p className="text-[10px] text-slate-400 mt-1 leading-tight">แถวบนสุดใช้ส่วนหัว (A-J): จังหวัด, ชื่อคลินิก, ลิงก์เพจ, โลโก้, รูปปก, รีวิว, เบอร์โทร, ทันตแพทย์ประจำ, บริการเพิ่มเติม, วันที่บันทึก</p>
                      </div>
                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                        <p className="text-[11px] font-bold text-purple-300">แผ่นที่ 2: <code className="bg-slate-900 px-1 py-0.5 rounded text-white font-mono">Catalog</code></p>
                        <p className="text-[10px] text-slate-400 mt-1 leading-tight">แถวบนสุดใช้ส่วนหัว (A-B): ชื่อสินค้า, รูปภาพสินค้า</p>
                      </div>
                    </div>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-white">คัดลอกและอัปโหลด Apps Script (Code.gs)</h5>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      กดเมนู <b className="text-white">Extensions &gt; Apps Script</b> ใน Google Sheets กดวางโค้ดจากกล่องขวามือนี้ จากนั้นให้บันทึกไฟล์
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-white">Deploy คลาวด์เป็น Web App</h5>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      กด <b className="text-white">Deploy &gt; New Deployment</b> และตั้งค่าสิทธิ์ให้ 
                      <b className="text-amber-300"> "Everyone (ทุกคน)"</b> จากนั้นคัดลอกลิงก์ Web App URL ที่เพิ่งได้มา กรอกใส่กล่องทดสอบและกดเชื่อมโยงทันที!
                    </p>
                  </div>
                </li>
              </ul>

              {/* URL Dynamic input configuration form */}
              <form onSubmit={handleSaveUrl} className="pt-4 border-t border-white/10 mt-6">
                <label className="block text-amber-400 font-bold text-xs sm:text-sm mb-2">
                  🔌 ช่องระบุลิงก์ Web App API เพื่อเชื่อมต่อโครงข่ายคลาวด์:
                </label>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    className="flex-1 p-3 rounded-xl bg-slate-900 border border-slate-705 focus:border-amber-405 focus:outline-none text-white text-xs sm:text-sm font-mono placeholder-slate-600"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-purple-650 hover:bg-purple-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm shrink-0 shadow-lg cursor-pointer transition-transform duration-250 active:scale-95"
                    >
                      🔗 Secure Link
                    </button>
                    {scriptUrl !== 'https://script.google.com/macros/s/AKfycbwa707U2kQlK8GGnW4mGVWWdGm4MOzeylfu-xOHOZ8FAt8X35agRNSrvxnaZZEb0-Xi/exec' && (
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateScriptUrl('');
                          setTempUrl('https://script.google.com/macros/s/AKfycbwa707U2kQlK8GGnW4mGVWWdGm4MOzeylfu-xOHOZ8FAt8X35agRNSrvxnaZZEb0-Xi/exec');
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-red-400 border border-red-500/20 font-bold py-2.5 px-3 rounded-xl text-xs sm:text-sm shrink-0 cursor-pointer"
                        title="รีเซ็ตเป็นค่าเริ่มต้น"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-slate-500">
                  <p className="font-mono break-all leading-relaxed">
                    * ปัจจุบันเชื่อมต่อ: <span className="text-amber-200">{scriptUrl}</span>
                  </p>
                </div>
              </form>
            </div>

            {/* Code Block Column */}
            <div className="flex flex-col h-full min-h-[300px]">
              <div className="flex items-center justify-between bg-slate-800 border-x border-t border-slate-700 rounded-t-2xl px-4 py-2 text-slate-300">
                <span className="text-xs font-mono font-semibold flex items-center gap-1.5 text-white">
                  <FileText className="w-4 h-4 text-amber-500" />
                  Code.gs (Apps Script)
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="bg-slate-900 border border-slate-600 hover:border-slate-500 hover:bg-slate-850 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-400 hover:text-white transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      คัดลอกเรียบร้อย!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      คัดลอกโค้ด
                    </>
                  )}
                </button>
              </div>
              <textarea
                readOnly
                value={APPS_SCRIPT_CODE}
                className="w-full flex-1 min-h-[420px] bg-[#0a0f1d] border-x border-b border-slate-800 rounded-b-2xl p-4 text-xs sm:text-[11px] font-mono text-emerald-400 focus:outline-none resize-y shadow-inner scrollbar-thin scrollbar-thumb-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* Analytics/Metric Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs sm:text-sm font-semibold opacity-90">คลินิกพาร์ทเนอร์ทั้งหมด</p>
            <Building2 className="w-5 h-5 opacity-90" />
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold">{stats.total} แห่ง</p>
          <p className="text-[10px] opacity-75 mt-1">ขยายเครือข่ายพาร์ทเนอร์อย่างยั่งยืน</p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-650 text-white shadow-lg shadow-violet-500/25">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs sm:text-sm font-semibold opacity-90">บริการครอบคลุม</p>
            <MapPin className="w-5 h-5 opacity-90" />
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold">{stats.totalProvinces} จังหวัด</p>
          <p className="text-[10px] opacity-75 mt-1">ทั่วภาคเหนือ และพื้นที่บริการเครือข่าย</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs sm:text-sm font-semibold opacity-90">คลินิกรีวิวระดับ 5 ดาว</p>
            <Star className="w-5 h-5 opacity-90 fill-white" />
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold">{stats.fiveStar} แห่ง</p>
          <p className="text-[10px] opacity-75 mt-1">การันตีความพึงพอใจการผลิตระดับสากล</p>
        </div>
      </div>

      {/* Database Search & Statistics */}
      <div className="bg-purple-50/40 p-4.5 border border-purple-150 rounded-2xl mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type="text"
                placeholder="ค้นหาคลินิกพาร์ทเนอร์ด่วน (ชื่อ, เบอร์โทร, จังหวัด)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm pl-11 pr-4 py-3 rounded-xl bg-white border border-purple-200 text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-500/35 transition-all duration-200"
              />
            </div>
          </div>
          <div className="w-full md:w-64">
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full text-sm p-3.5 rounded-xl bg-white border border-purple-200 text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-500/35 transition-all duration-200 cursor-pointer"
            >
              <option value="all">กรองจังหวัดทั้งหมด</option>
              {provinces.filter(p => p !== 'all').map((prov) => (
                <option key={prov} value={prov}>
                  📍 {prov}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table View */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-purple-50/10 rounded-2xl border border-purple-100/50">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-purple-600 text-sm font-semibold mt-4">กำลังประมวลผลเซิร์ฟเวอร์คลาวด์...</p>
        </div>
      ) : filteredClinics.length === 0 ? (
        <div className="text-center py-16 bg-purple-50/10 rounded-2xl border border-dashed border-purple-100 text-purple-400">
          <Users className="w-10 h-10 mx-auto mb-3 text-purple-200 animate-bounce" />
          <p className="font-semibold text-purple-950 text-base">ไม่พบข้อมูลคลินิกพาร์ทเนอร์ในคลังระบบ</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-purple-100/50 shadow-inner bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              {/* Header */}
              <thead className="bg-linear-to-r from-purple-150/40 to-purple-200/10 border-b border-purple-100">
                <tr>
                  <th className="px-6 py-4.5 text-left text-xs font-bold text-purple-950 uppercase tracking-wider">
                    จังหวัด
                  </th>
                  <th className="px-6 py-4.5 text-left text-xs font-bold text-purple-950 uppercase tracking-wider">
                    ชื่อคลินิก / โลโก้พาร์ทเนอร์
                  </th>
                  <th className="px-6 py-4.5 text-left text-xs font-bold text-purple-950 uppercase tracking-wider">
                    หน้าปก (Facebook Cover)
                  </th>
                  <th className="px-6 py-4.5 text-left text-xs font-bold text-purple-950 uppercase tracking-wider">
                    คะแนนรีวิว
                  </th>
                  <th className="px-6 py-4.5 text-left text-xs font-bold text-purple-950 uppercase tracking-wider">
                    เบอร์โทรติดต่อ
                  </th>
                </tr>
              </thead>

              {/* Rows */}
              <tbody className="divide-y divide-purple-100/40">
                {filteredClinics.map((clinic, index) => (
                  <tr key={index} className="hover:bg-purple-50/40 transition-colors group">
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 bg-purple-50 border border-purple-250/50 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                        📍 {clinic.province}
                      </span>
                    </td>

                    {/* Logo and page details */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-200 bg-purple-50 flex items-center justify-center text-lg flex-shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105">
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
                          <p className="text-purple-950 font-bold text-sm tracking-tight">
                            {clinic.name}
                          </p>
                          {clinic.pageLink ? (
                            <a
                              href={clinic.pageLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-900 text-xs font-semibold mt-1 inline-flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              เยี่ยมชมเพจ
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <span className="text-gray-400 text-xs">ไม่มีลิงก์เพจ</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Cover Preview */}
                    <td className="px-6 py-4.5">
                      <div className="w-24 h-15 rounded-xl overflow-hidden border border-purple-150/80 bg-purple-50 shadow-sm relative group/cover max-w-[200px]">
                        {clinic.cover ? (
                          <a href={clinic.cover} target="_blank" rel="noopener noreferrer">
                            <img
                              src={clinic.cover}
                              alt="Clinic Cover"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/cover:scale-110"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://placehold.co/400x200/f3e8ff/9333ea?text=Dental+Lab`;
                              }}
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/cover:opacity-100 duration-300 flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-white" />
                            </div>
                          </a>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-purple-300 bg-purple-50">
                            ไม่มีภาพปก
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Star ratings */}
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span className="text-yellow-500 text-sm font-semibold tracking-wide bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1">
                        {clinic.review || '⭐️ 5⭐️'}
                      </span>
                    </td>

                    {/* Quick Phone Call */}
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm">
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
