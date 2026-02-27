import React, { useState, useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom/client'
// استدعاء الأيقونات بشكل فردي لضمان عدم حدوث تعارض في Vite
import { 
  CheckCircle2, RotateCcw, History, Plus, BookOpen, 
  Trash2, X, ChevronRight, Target, Search, ChevronDown, Sparkles 
} from 'lucide-react'

const SURAS = [
  "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"
];

const App = () => {
  const appId = 'tikrar-final-v1';
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState({
    isActive: false, sura: '', mode: 'verses', from: '', to: '', page: '', target: 10, count: 0
  });
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSuraPicker, setShowSuraPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. إدارة شاشة الترحيب
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // 2. استعادة البيانات مع حماية من الأخطاء (Safe JSON Parse)
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(`${appId}-session`);
      const savedHistory = localStorage.getItem(`${appId}-history`);
      if (savedSession) setSession(JSON.parse(savedSession));
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    } catch (e) {
      console.error("خطأ في استعادة البيانات، سيتم تصفير الذاكرة.");
      localStorage.clear();
    }
  }, []);

  // 3. حفظ البيانات
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(`${appId}-session`, JSON.stringify(session));
      localStorage.setItem(`${appId}-history`, JSON.stringify(history));
    }
  }, [session, history, isLoading]);

  const increment = () => {
    if (session.count < session.target) {
      const nextCount = session.count + 1;
      setSession(prev => ({ ...prev, count: nextCount }));
      if (nextCount === session.target) {
        const details = session.mode === 'verses' ? `الآيات ${session.from}-${session.to}` : `وجه ${session.page}`;
        setHistory(prev => [{ id: Date.now(), title: session.sura, details, date: new Date().toLocaleDateString('ar-EG'), target: session.target }, ...prev]);
      }
    }
  };

  const progress = (session.count / session.target) * 100;
  const isDone = session.count >= session.target;
  const filteredSuras = useMemo(() => SURAS.filter(s => s.includes(searchQuery)), [searchQuery]);

  // شاشة الترحيب (Splash)
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#064E3B] flex flex-col items-center justify-center text-white z-[300]" dir="rtl">
        <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-6 animate-pulse">
            <BookOpen size={40} className="text-emerald-400" />
        </div>
        <h1 className="text-4xl font-black mb-1">تِكْرَارْ</h1>
        <p className="text-emerald-300 text-[10px] font-bold tracking-widest uppercase">جاري التحميل</p>
      </div>
    );
  }

  // الواجهة الرئيسية
  return (
    <div className="min-h-screen bg-[#F8FAF5] p-4 flex flex-col items-center overflow-x-hidden" dir="rtl">
      <nav className="w-full max-w-md flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-800 rounded-xl flex items-center justify-center text-white shadow-lg"><BookOpen size={20} /></div>
          <h1 className="text-xl font-black text-emerald-950">تِكْرَارْ</h1>
        </div>
        <button onClick={() => setShowHistory(true)} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-800 shadow-sm border border-emerald-50"><History size={20} /></button>
      </nav>

      <main className="w-full max-w-md bg-white rounded-[2rem] shadow-xl p-6 border border-white relative">
        {!session.isActive ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            <button onClick={() => setShowSuraPicker(true)} className="w-full h-14 px-4 bg-emerald-50 rounded-xl flex items-center justify-between font-bold">
              <span>{session.sura || "اختر السورة..."}</span><ChevronDown size={18} />
            </button>
            <div className="flex p-1 bg-emerald-50 rounded-xl">
              <button onClick={() => setSession(p=>({...p, mode: 'verses'}))} className={`flex-1 py-2 text-sm font-black rounded-lg ${session.mode === 'verses' ? 'bg-white shadow-sm' : 'text-emerald-400'}`}>بالآيات</button>
              <button onClick={() => setSession(p=>({...p, mode: 'page'}))} className={`flex-1 py-2 text-sm font-black rounded-lg ${session.mode === 'page' ? 'bg-white shadow-sm' : 'text-emerald-400'}`}>بالوجه</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {session.mode === 'verses' ? (
                <>
                  <input type="number" placeholder="من" className="h-12 bg-emerald-50 rounded-lg text-center font-bold" onChange={(e)=>setSession(p=>({...p, from: e.target.value}))} />
                  <input type="number" placeholder="إلى" className="h-12 bg-emerald-50 rounded-lg text-center font-bold" onChange={(e)=>setSession(p=>({...p, to: e.target.value}))} />
                </>
              ) : (
                <input type="number" placeholder="رقم الصفحة" className="col-span-2 h-12 bg-emerald-50 rounded-lg text-center font-bold" onChange={(e)=>setSession(p=>({...p, page: e.target.value}))} />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-black"><span>الهدف</span><span>{session.target}</span></div>
              <input type="range" min="1" max="100" value={session.target} onChange={(e) => setSession(p=>({...p, target: parseInt(e.target.value)}))} className="w-full" />
            </div>
            <button onClick={startSession} disabled={!session.sura} className="w-full h-16 bg-emerald-800 text-white rounded-2xl font-black shadow-lg disabled:opacity-30">ابدأ</button>
          </div>
        ) : (
          <div className="text-center animate-in zoom-in-95">
            <h2 className="text-2xl font-black mb-6">{session.sura}</h2>
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center mb-8">
              <svg className="absolute w-full h-full -rotate-90"><circle cx="96" cy="96" r="88" fill="transparent" stroke="#F1F5F9" strokeWidth="10" /><circle cx="96" cy="96" r="88" fill="transparent" stroke="#065F46" strokeWidth="10" strokeDasharray={552} strokeDashoffset={552 - (552 * progress) / 100} strokeLinecap="round" className="transition-all duration-700"/></svg>
              <div className="text-5xl font-black text-emerald-950">{session.count}</div>
            </div>
            <button onClick={increment} disabled={isDone} className={`w-full py-10 rounded-2xl text-3xl font-black mb-6 ${isDone ? 'bg-emerald-50 text-emerald-900 border border-emerald-100' : 'bg-emerald-800 text-white shadow-xl'}`}>
              {isDone ? 'تم الحفظ' : 'تم التكرار'}
            </button>
            <button onClick={()=>setSession(p=>({...p, isActive: false}))} className="text-rose-500 font-bold text-sm">إنهاء الجلسة</button>
          </div>
        )}
      </main>

      {/* Picker */}
      {showSuraPicker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[250] flex items-end justify-center">
          <div className="bg-white w-full max-w-md h-[80vh] rounded-t-3xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4"><h3 className="font-black">اختر السورة</h3><button onClick={() => setShowSuraPicker(false)}><X size={20}/></button></div>
            <input type="text" placeholder="بحث..." className="w-full p-3 bg-gray-50 rounded-xl mb-4 text-right" onChange={(e) => setSearchQuery(e.target.value)} />
            <div className="flex-1 overflow-y-auto space-y-1">{filteredSuras.map(s => <button key={s} onClick={() => {setSession(p=>({...p, sura: s})); setShowSuraPicker(false);}} className="w-full p-4 text-right font-bold hover:bg-emerald-50 rounded-xl">{s}</button>)}</div>
          </div>
        </div>
      )}

      {/* History */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[250] flex items-end justify-center">
          <div className="bg-white w-full max-w-md h-[80vh] rounded-t-3xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6"><h3 className="font-black">السجل</h3><button onClick={() => setShowHistory(false)}><X/></button></div>
            <div className="flex-1 overflow-y-auto space-y-3">{history.length === 0 ? <p className="text-center py-20 opacity-30 font-bold">لا يوجد سجل</p> : history.map(h => <div key={h.id} className="p-4 bg-emerald-50 rounded-xl text-right"><div className="font-black text-emerald-950">{h.title}</div><div className="text-[10px] text-emerald-400 font-bold uppercase">{h.date} • {h.details}</div></div>)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

