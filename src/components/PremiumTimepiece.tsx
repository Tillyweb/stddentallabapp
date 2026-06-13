import React, { useState, useEffect } from 'react';
import { Sun, Moon, Sunrise, Sunset, Clock, Compass, Activity } from 'lucide-react';

export default function PremiumTimepiece() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format numbers for monospaced clock display
  const formatTimeToken = (num: number) => {
    return num.toString().padStart(2, '0').split('').join(' ');
  };

  // Get active greeting based on time
  const getGreeting = () => {
    const hours = time.getHours();
    if (hours >= 5 && hours < 12) return "GOOD MORNING";
    if (hours >= 12 && hours < 17) return "GOOD AFTERNOON";
    if (hours >= 17 && hours < 22) return "GOOD EVENING";
    return "GOOD NIGHT";
  };

  // Get UTC Time Zone offset (e.g. UTC+07:00)
  const getTimeZoneString = () => {
    const offset = -time.getTimezoneOffset();
    const sign = offset >= 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(offset) / 60).toString().padStart(2, '0');
    const minutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
    return `UTC${sign}${hours}:${minutes}`;
  };

  // Calculate Day Progress percentage
  const getDayProgress = () => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const totalSecondsInDay = 24 * 60 * 60;
    const elapsedSeconds = (hours * 3600) + (minutes * 60) + seconds;
    return ((elapsedSeconds / totalSecondsInDay) * 100).toFixed(2);
  };

  // Get Week Number of the Year
  const getWeekNumber = () => {
    const startOfYear = new Date(time.getFullYear(), 0, 1);
    const pastDays = Math.floor((time.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
  };

  // Simplified Moon Phase calculation (Synodic period is ~29.53 days)
  const getMoonPhase = () => {
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = time.getDate();
    
    // Simple astronomical formula for moon age
    let c = 0, e = 0, jd = 0, b = 0;
    if (month < 3) {
      c = -1;
    }
    const jdYear = year + c;
    const jdMonth = month + 9 + (c * -12);
    
    // Julian date approximation
    const k1 = Math.floor(365.25 * (jdYear + 4716));
    const k2 = Math.floor(30.6001 * (jdMonth + 1));
    const k3 = Math.floor((Math.floor((jdYear + 184) / 100) * 3) / 4) - 38;
    jd = k1 + k2 + day + k3 + 59;
    
    const ip = (jd - 2451550.1) / 29.530588853;
    const age = (ip - Math.floor(ip)) * 29.53;
    
    if (age < 1.84) return { emoji: "🌑", name: "NEW MOON" };
    if (age < 5.53) return { emoji: "🌒", name: "WAXING CRESCENT" };
    if (age < 9.22) return { emoji: "🌓", name: "FIRST QUARTER" };
    if (age < 12.91) return { emoji: "🌔", name: "WAXING GIBBOUS" };
    if (age < 16.61) return { emoji: "🌕", name: "FULL MOON" };
    if (age < 20.30) return { emoji: "🌖", name: "WANING GIBBOUS" };
    if (age < 23.99) return { emoji: "🌗", name: "LAST QUARTER" };
    if (age < 27.68) return { emoji: "🌘", name: "WANING CRESCENT" };
    return { emoji: "🌑", name: "NEW MOON" };
  };

  const moon = getMoonPhase();
  const greeting = getGreeting();
  const dayProgress = getDayProgress();
  const weekNum = getWeekNumber();
  const timezone = getTimeZoneString();

  // Formatting hours, minutes, seconds
  const hStr = formatTimeToken(time.getHours());
  const mStr = formatTimeToken(time.getMinutes());
  const sStr = formatTimeToken(time.getSeconds());
  const meridiem = time.getHours() >= 12 ? "POST MERIDIEM" : "ANTE MERIDIEM";

  // Formatting calendar date
  const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  const thaiDay = time.getDate();
  const thaiMonth = thaiMonths[time.getMonth()];
  const thaiYear = time.getFullYear() + 543;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-purple-100 bg-white/70 backdrop-blur-xl p-6 text-purple-950 shadow-xl shadow-purple-100/20">
      {/* Decorative luxury watch dial lines in background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-100/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Greeting Header & Title */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-b border-purple-100/60 pb-4 mb-5 gap-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-purple-600 animate-spin-slow" />
          <span className="text-[10px] tracking-[0.2em] font-medium text-purple-800/80 uppercase">
            HOROLOGY · PRECISION CHRONOMETER
          </span>
        </div>
        <div className="text-[10px] tracking-[0.15em] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
          {greeting}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Main Display: Premium Timepiece Dial (Clock) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-3 text-center border-r border-purple-100/80 lg:pr-8">
          <span className="text-[10px] tracking-[0.3em] text-purple-800/60 font-medium mb-1">
            LOCAL TIMEPIECE
          </span>

          {/* Time text with monospaced style, light weight, letter spacing and separator */}
          <div className="text-3xl sm:text-4xl font-light tracking-widest text-purple-950 font-mono my-2.5 flex items-center gap-1">
            <span>{hStr}</span>
            <span className="text-amber-500 animate-pulse font-sans">∶</span>
            <span>{mStr}</span>
            <span className="text-amber-500 animate-pulse font-sans">∶</span>
            <span className="text-purple-600/80 text-2xl sm:text-3xl">{sStr}</span>
          </div>

          <span className="text-[9px] tracking-[0.4em] font-medium text-purple-800/80 mt-1 uppercase">
            {meridiem} ( {timezone} )
          </span>

          {/* Separator · label indicators */}
          <div className="text-[8px] tracking-[0.25em] text-purple-400 uppercase mt-2.5">
            HOURS · MINUTES · SECONDS
          </div>
        </div>

        {/* Dynamic Complications / Metadata */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          
          {/* Complication 1: Calendar Date */}
          <div className="bg-purple-50/30 border border-purple-100/50 p-3.5 rounded-2xl flex flex-col justify-between shadow-xs">
            <span className="text-[9px] tracking-wider text-purple-800/60 uppercase block mb-1">
              Calendar Date
            </span>
            <span className="text-sm font-semibold text-purple-900 tracking-wide">
              {thaiDay} {thaiMonth} {thaiYear}
            </span>
            <span className="text-[9px] text-purple-500 mt-1 font-medium">
              Week {weekNum} of {time.getFullYear()}
            </span>
          </div>

          {/* Complication 2: Moon Phase */}
          <div className="bg-purple-50/30 border border-purple-100/50 p-3.5 rounded-2xl flex flex-col justify-between shadow-xs">
            <span className="text-[9px] tracking-wider text-purple-800/60 uppercase block mb-1">
              Moon Phase
            </span>
            <div className="flex items-center gap-2 my-0.5">
              <span className="text-2xl">{moon.emoji}</span>
              <span className="text-xs font-semibold text-amber-700 tracking-wider font-mono">
                {moon.name}
              </span>
            </div>
            <span className="text-[8px] text-purple-500 uppercase tracking-widest mt-1 font-medium">
              As of Today
            </span>
          </div>

          {/* Complication 3: Day Progress Elapsed */}
          <div className="bg-purple-50/30 border border-purple-100/50 p-3.5 rounded-2xl col-span-2 shadow-xs">
            <div className="flex justify-between items-center text-[9px] text-purple-800/60 uppercase mb-2">
              <span className="tracking-wider">Elapsed Duration</span>
              <span className="font-mono text-amber-600 font-bold">{dayProgress}% OF DAY</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-purple-100/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-650 via-indigo-550 to-amber-500 rounded-full transition-all duration-1000"
                style={{ width: `${dayProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[8px] text-purple-400 mt-1.5 font-medium">
              <span>00 ∶ 00 ANTE MERIDIEM</span>
              <span>24 ∶ 00 POST MERIDIEM</span>
            </div>
          </div>
          
        </div>
      </div>

      {/* Sun Schedule Interval Info Panel */}
      <div className="mt-5 pt-4 border-t border-purple-100/80 flex flex-wrap justify-between items-center gap-4 text-purple-800/80 text-xs font-light">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-purple-800/80 font-medium">
            <Sunrise className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[9px] uppercase tracking-wider">Sunrise : 05·52</span>
          </span>
          <span className="text-purple-200">|</span>
          <span className="flex items-center gap-1 text-purple-800/80 font-medium">
            <Sunset className="w-3.5 h-3.5 text-purple-650" />
            <span className="text-[9px] uppercase tracking-wider">Sunset : 18·58</span>
          </span>
        </div>
        <div className="text-[8px] tracking-widest text-purple-500 uppercase flex items-center gap-1.5 font-bold">
          <Activity className="w-3 h-3 text-emerald-600 animate-pulse" />
          SYSTEM OPERATING AT OPTIMAL INTERVAL
        </div>
      </div>
    </div>
  );
}
