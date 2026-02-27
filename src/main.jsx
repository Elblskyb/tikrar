import React, { useState, useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom/client'
import { 
  CheckCircle2, 
  RotateCcw, 
  History, 
  Plus, 
  BookOpen, 
  Trash2, 
  X, 
  ChevronRight,
  Target,
  Search,
  ChevronDown,
  Sparkles
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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedSession = localStorage.getItem(`${appId}-session`);
    const savedHistory = localStorage.getItem(`${appId}-history`);
    if (savedSession) setSession(JSON.parse(savedSession));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(`${appId}-session`, JSON.stringify(session));
      localStorage.setItem(`${appId}-history`, JSON.stringify(history));
    }
  }, [session, history, isLoading]);

  const increment = () => {
    if (session.count < session.target) {
      const nextCount = session.count + 1;
      setSession({ ...session, count: nextCount });
      if (nextCount === session.target) {
        const details = session.mode === 'verses' ? `الآيات ${session.from}-${session.to}` : `وجه ${session.page}`;
        setHistory([{ id: Date.now(), title: session.sura, details, date: new Date().toLocaleDateString('ar-EG'), target: session.target }, ...history]);
      }
    }
  };

  const filteredSuras = useMemo(() => SURAS.filter(s => s.includes(searchQuery)), [searchQuery]);
  const progress = (session.count / session.target) * 100;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#064E3B] flex flex-col items-center justify-center text-white z-[300]" dir="rtl">
        <BookOpen size={64} className="mb-4 animate-pulse text-emerald-400" />
        <h1 className="text-5xl font-black mb-2 tracking-tighter">تِكْرَارْ</h1>
        <p className="text-emerald-300 font-bold opacity-80 text-xs">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF5] p-4 sm:p-8 flex flex-col items-center" dir="rtl">
      <nav className="w-full max-w-md flex justify-between items-center mb-10">
        <div className="flex items-center gap-4 text-right">
          <div className="w-12 h-12 bg-emerald-800 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-emerald-950 leading-none">تِكْرَارْ</h1>
            <p className="text-[10px] text-emerald-600 font-bold mt-1">لضبط الحفظ وإتقانه</p>
          </div>
        </div>
        <button onClick={() => setShowHistory(true)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-800 shadow-sm border border-emerald-50"><History size={24} /></button>
      </nav>

      <main className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-white relative transition-all">
        {!session.isActive ? (
          <div className="space-y-7 text-right">
            <div className="space-y-2">
              <label className="text-sm font-black text-emerald-900 pr-1">اختر السورة</label>
              <button onClick={() => setShowSuraPicker(true)} className="w-full h-16 px-6 bg-emerald-50/50 border-2 border-transparent hover:border-emerald-100 rounded-2xl flex items-center justify-between font-bold transition-all">
                <span className={session.sura ? 'text-emerald-950' : 'text-emerald-300'}>{session.sura || "ابحث عن سورة..."}</span>
                <ChevronDown size={20} className="text-emerald-400" />
              </button>
            </div>

            <div className="flex p-1 bg-emerald-50/50 rounded-2xl">
              <button onClick={() => setSession({...session, mode: 'verses'})} className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${session.mode === 'verses' ? 'bg-white text-emerald-950 shadow-sm' : 'text-emerald-400'}`}>بالآيات</button>
              <button onClick={() => setSession({...session, mode: 'page'})} className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${session.mode === 'page' ? 'bg-white text-emerald-950 shadow-sm' : 'text-emerald-400'}`}>بالوجه</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {session.mode === 'verses' ? (
                <>
                  <input type="number" placeholder="من" className="w-full h-14 bg-emerald-50/30 rounded-xl text-center font-black" onChange={(e)=>setSession({...session, from: e.target.value})} />
                  <input type="number" placeholder="إلى" className="w-full h-14 bg-emerald-50/30 rounded-xl text-center font-black" onChange={(e)=>setSession({...session, to: e.target.value})} />
                </>
              ) : (
                <input type="number" placeholder="رقم الصفحة" className="col-span-2 w-full h-14 bg-emerald-50/30 rounded-xl text-center font-black" onChange={(e)=>setSession({...session, page: e.target.value})} />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between font-black text-emerald-900"><span>الهدف المكرر</span><span>{session.target}</span></div>
              <input type="range" min="1" max="100" value={session.target} onChange={(e) => setSession({...session, target: parseInt(e.target.value)})} className="w-full accent-emerald-800" />
            </div>

            <button onClick={startSession} disabled={!session.sura} className="w-full h-20 bg-emerald-800 text-white rounded-[2rem] font-black text-xl shadow-xl disabled:opacity-30 active:scale-95 transition-all">ابدأ التكرار</button>
          </div>
        ) : (
          <div className="animate-in zoom-in-95 duration-500">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black text-emerald-950 mb-2">{session.sura}</h2>
              <p className="text-emerald-500 font-bold">{session.mode === 'verses' ? `الآيات: ${session.from} ← ${session.to}` : `الصفحة: ${session.page}`}</p>
            </div>

            <div className="relative w-64 h-64 mx-auto flex items-center justify-center mb-12">
              <svg className="absolute w-full h-full -rotate-90"><circle cx="128" cy="128" r="114" fill="transparent" stroke="#F1F5F9" strokeWidth="14" /><circle cx="128" cy="128" r="114" fill="transparent" stroke="#065F46" strokeWidth="14" strokeDasharray={716} strokeDashoffset={716 - (716 * progress) / 100} strokeLinecap="round" className="transition-all duration-700"/></svg>
              <div className="text-center"><div className="text-8xl font-black text-emerald-950 leading-none">{session.count}</div><div className="text-xs font-black text-emerald-400 mt-4 uppercase">الهدف: {session.target}</div></div>
            </div>

            <button onClick={increment} disabled={isDone} className={`w-full py-14 rounded-[3rem] text-5xl font-black transition-all active:scale-95 mb-8 ${isDone ? 'bg-emerald-50 text-emerald-900' : 'bg-emerald-800 text-white shadow-2xl shadow-emerald-900/20'}`}>{isDone ? 'تم الحفظ' : 'تم التكرار'}</button>
            <button onClick={resetAll} className="w-full text-rose-500 font-black py-2">إنهاء الجلسة</button>
          </div>
        )}
      </main>

      {showSuraPicker && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[200] flex items-end justify-center">
          <div className="bg-white w-full max-w-md h-[90vh] rounded-t-[3rem] p-8 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500">
            <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-black text-emerald-950">اختر السورة</h3><button onClick={() => setShowSuraPicker(false)} className="p-2 bg-emerald-50 rounded-full text-emerald-900"><X size={24} /></button></div>
            <div className="relative mb-6"><Search className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-300" size={20} /><input type="text" placeholder="بحث..." className="w-full h-14 pr-12 pl-4 bg-emerald-50 rounded-2xl outline-none text-right font-bold" onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <div className="flex-1 overflow-y-auto space-y-2">{filteredSuras.map(s => <button key={s} onClick={() => {setSession({...session, sura: s}); setShowSuraPicker(false); setSearchQuery('');}} className="w-full p-5 text-right font-black bg-emerald-50/30 rounded-2xl hover:bg-emerald-50 transition-colors">{s}</button>)}</div>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[200] flex items-end justify-center">
          <div className="bg-white w-full max-w-md h-[80vh] rounded-t-[3rem] p-8 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-8 font-black"><h3>سجل الإنجازات</h3><button onClick={() => setShowHistory(false)}><X/></button></div>
            <div className="flex-1 overflow-y-auto space-y-4">{history.length === 0 ? <p className="text-center text-emerald-200 py-20 font-black text-xl leading-relaxed">السجل فارغ حالياً<br/>ابدأ أول تكرار لك الآن</p> : history.map(h => <div key={h.id} className="p-5 bg-emerald-50 rounded-[1.5rem] text-right"><div className="font-black text-emerald-950 text-lg">{h.title}</div><div className="text-xs font-bold text-emerald-400 mt-1 uppercase">{h.date} • {h.details}</div></div>)}</div>
            {history.length > 0 && <button onClick={() => {if(confirm('مسح السجل؟')) setHistory([])}} className="mt-4 w-full py-4 text-rose-500 font-black border-2 border-rose-50 rounded-2xl">مسح السجل</button>}
          </div>
        </div>
      )}
      <footer className="mt-auto py-8 text-emerald-900/10 text-[10px] font-black tracking-[0.5em] uppercase text-center">تِكْرَارْ • TIKRAR</footer>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)

