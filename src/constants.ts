import { Clinic, CatalogItem } from './types';

export const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwa707U2kQlK8GGnW4mGVWWdGm4MOzeylfu-xOHOZ8FAt8X35agRNSrvxnaZZEb0-Xi/exec";

export const PROVINCES_LIST = [
  "กระบี่", "กรุงเทพมหานคร", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", "ขอนแก่น", 
  "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ชัยนาท", "ชัยภูมิ", "ชุมพร", "เชียงราย", 
  "เชียงใหม่", "ตรัง", "ตราด", "ตาก", "นครนายก", "นครปฐม", "นครพนม", "นครราชสีมา", 
  "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี", "นราธิวาส", "น่าน", "บึงกาฬ", "บุรีรัมย์", 
  "ปทุมธานี", "ประจวบคีรีขันธ์", "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา", "พะเยา", 
  "พังงา", "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์", "แพร่", 
  "ภูเก็ต", "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน", "ยโสธร", "ยะลา", "ร้อยเอ็ด", 
  "ระนอง", "ระยอง", "ราชบุรี", "ลพบุรี", "ลำปาง", "ลำพูน", "เลย", "ศรีสะเกษ", 
  "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ", "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", 
  "สระบุรี", "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์", 
  "หนองคาย", "หนองบัวลำภู", "อ่างทอง", "อำนาจเจริญ", "อุดรธานี", "อุตรดิตถ์", 
  "อุทัยธานี", "อุบลราชธานี"
];

export const MOCK_CLINICS: Clinic[] = [
  {
    province: "เชียงใหม่",
    name: "S.T.D. Dental Clinic ดอยสะเก็ด",
    pageLink: "https://www.facebook.com/std.dentallab",
    logo: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=100&h=100&fit=crop&auto=format",
    cover: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&h=400&fit=crop&auto=format",
    review: "5⭐️",
    phone: "081-555-9991"
  },
  {
    province: "เชียงใหม่",
    name: "สไมล์แคร์ ทันตกรรม (SmileCare Chiang Mai)",
    pageLink: "https://facebook.com",
    logo: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=100&h=100&fit=crop&auto=format",
    cover: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop&auto=format",
    review: "5⭐️",
    phone: "089-111-2222"
  },
  {
    province: "ลำพูน",
    name: "คลินิกทันตกรรมหมอใจดี ลำพูน",
    pageLink: "https://facebook.com",
    logo: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=100&h=100&fit=crop&auto=format",
    cover: "https://images.unsplash.com/photo-1447483530572-cf510170442f?w=600&h=400&fit=crop&auto=format",
    review: "4⭐️",
    phone: "053-999-888"
  },
  {
    province: "เชียงราย",
    name: "ล้านนาสไมล์ดี ทันตกรรม (Lanna Smile)",
    pageLink: "https://facebook.com",
    logo: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=100&h=100&fit=crop&auto=format",
    cover: "https://images.unsplash.com/photo-1504813184591-015578a0c24c?w=600&h=400&fit=crop&auto=format",
    review: "5⭐️",
    phone: "087-777-6665"
  },
  {
    province: "กรุงเทพมหานคร",
    name: "สยามเด็นทัล คลินิกและลาบอราทอรี่",
    pageLink: "https://facebook.com",
    logo: "https://images.unsplash.com/photo-1504813184591-015578a0c24c?w=100&h=100&fit=crop&auto=format",
    cover: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=600&h=400&fit=crop&auto=format",
    review: "5⭐️",
    phone: "02-123-4567"
  }
];

export const MOCK_CATALOG: CatalogItem[] = [
  { 
    name: "Smart Metal Retainer (รีเทนเนอร์ปุ่มโลหะอัจฉริยะ)", 
    imageUrl: "https://images.unsplash.com/photo-1598256989476-8ff56a29dcdc?w=600&h=400&fit=crop&auto=format" 
  },
  { 
    name: "All Metal Retainer (รีเทนเนอร์โครงโลหะผสมพิเศษ)", 
    imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&h=400&fit=crop&auto=format" 
  },
  { 
    name: "Standard Hawley Retainer (รีเทนเนอร์ฐานอะคริลิกสีชมพูพาสเทล)", 
    imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&h=400&fit=crop&auto=format" 
  },
  { 
    name: "Retainer with Aesthetic Wire (รีเทนเนอร์ลวดใสเพื่อความสวยงาม)", 
    imageUrl: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=600&h=400&fit=crop&auto=format" 
  }
];
