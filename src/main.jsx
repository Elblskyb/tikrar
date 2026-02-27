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

// قائمة سور القرآن الكريم
const SURAS = [
  "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"
];

const App = () => {
  // معرف التطبيق للتخزين المحلي
  const appId = 'tikrar-pro-v4';

  // --- الحالات (States) ---
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState({
    isActive: false,
    sura: '',
    mode: 'verses',
    from: '',
    to: '',
    page: '',
    target: 10,
    count: 0
  });

  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSuraPicker, setShowSuraPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // --- تأثير شاشة الترحيب (Splash Screen) ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // --- استعادة البيانات المحفوظة ---
  useEffect(() => {
    const savedSession = localStorage.getItem(`${appId}-session`);
    const savedHistory = localStorage.getItem(`${appId}-history`);
    if (savedSession) setSession(JSON.parse(savedSession));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // --- حفظ البيانات تلقائياً ---
  useEffect(() => {
    if (!isLoading) localStorage.setItem(`${appId}-session`, JSON.stringify(session));
  }, [session, isLoading]);

  useEffect(() => {
    if (!isLoading) localStorage.setItem(`${appId}-history`, JSON.stringify(history));
  }, [history, isLoading]);

  // --- الوظائف (Actions) ---
  const startSession = () => {
    if (!session.sura) return;
    setSession({ ...session, isActive: true, count: 0 });
  };

  const increment = () => {
    if (session.count < session.target) {
      const nextCount = session.count + 1;
      setSession({ ...session, count: nextCount });
      
      if (nextCount === session.target) {
        const details = session.mode === 'verses' 
          ? `الآيات ${session.from}-${session.to}`
          : `وجه ${session.page}`;
        
        setHistory([{
          id: Date.now(),
          title: session.sura,
          details,
          date: new Date().toLocaleDateString('ar-EG'),
          target: session.target
        }, ...history]);
      }
    }
  };

  const resetAll = () => {
    if(confirm("هل تود اختيار سورة جديدة؟")) {
      setSession({
        isActive: false,
        sura: '',
        mode: 'verses',
        from: '',
        to: '',
        page: '',
        target: 10,
        count: 0
      });
    }
  };

  // تصفية قائمة السور حسب البحث
  const filteredSuras = useMemo(() => {
    return SURAS.filter(s => s.includes(searchQuery));
  }, [searchQuery]);

  const progress = (session.count / session.target) * 100;
  const isDone = session.count >= session.target;

  // --- عرض شاشة الترحيب ---
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#064E3B] flex flex-col items-center justify-center z-[200] text-white overflow-hidden" dir="rtl">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center animate-bounce duration-[2000ms]">
            <BookOpen size={48} className="text-emerald-400" />
          </div>
        </div>
        <h1 className="text-5xl font-black mb-2 tracking-tighter">تِكْرَارْ</h1>
        <p className="text-emerald-300 font-bold tracking-[0.3em] opacity-80 text-xs">لضبط الحفظ وإتقانه</p>
        
        <div className="absolute bottom-12 flex flex-col items-center gap-2">
            <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 animate-loading-bar"></div>
            </div>
            <span className="text-[10px] text-emerald-300/50 uppercase tracking-widest font-black">جاري التحميل</span>
        </div>
      </div>
    );
  }

  // --- عرض التطبيق الرئيسي ---
  return (
    <div className="min-h-screen bg-[#F8FAF5] text-[#1E293B] flex flex-col items-center p-4 sm:p-8 font-arabic" dir="rtl">
      
      {/* رأس الصفحة */}
      <nav className="w-full max-w-md flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-800 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-emerald-900/10">
            <BookOpen size={28} />
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-black text-emerald-950 tracking-tight">تِكْرَارْ</h1>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest opacity-70">المساعد الرقمي للحفظ</p>
          </div>
        </div>
        <button 
          onClick={() => setShowHistory(true)}
          className="w-14 h-14 flex items-center justify-center bg-white rounded-2xl border border-emerald-50 text-emerald-800 shadow-sm active:scale-90"
        >
          <History size={26} />
        </button>
      </nav>

      {/* منطقة المحتوى الرئيسية */}
      <main className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl shadow-emerald-950/5 p-8 border border-white relative transition-all">
        
        {!session.isActive ? (
          /* واجهة الإعداد */
          <div className="space-y-7 text-right">
            <div className="space-y-3">
              <label className="text-sm font-black text-emerald-900 pr-1 flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-400" />
                اختر السورة
              </label>
              <button 
                onClick={() => setShowSuraPicker(true)}
                className="w-full h-16 px-6 bg-emerald-50/40 border-2 border-transparent hover:border-emerald-100 rounded-2xl flex items-center justify-between text-emerald-950 font-bold transition-all"
              >
                <span className={session.sura ? 'opacity-100' : 'opacity-30'}>
                  {session.sura || "اضغط للبحث عن سورة..."}
                </span>
                <ChevronDown size={20} className="text-emerald-400" />
              </button>
            </div>

            <div className="flex p-1.5 bg-emerald-50/50 rounded-2xl">
              {['verses', 'page'].map((m) => (
                <button 
                  key={m}
                  onClick={() => setSession({...session, mode: m})}
                  className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${session.mode === m ? 'bg-white text-emerald-950 shadow-sm' : 'text-emerald-500'}`}
                >
                  {m === 'verses' ? 'بالآيات' : 'بالوجه'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-5">
              {session.mode === 'verses' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-emerald-600 pr-2">مِن آية</label>
                    <input type="number" value={session.from} onChange={(e) => setSession({...session, from: e.target.value})} className="w-full h-14 px-4 bg-emerald-50/30 border border-emerald-50 rounded-2xl outline-none font-black text-center text-lg" placeholder="1" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-emerald-600 pr-2">إلى آية</label>
                    <input type="number" value={session.to} onChange={(e) => setSession({...session, to: e.target.value})} className="w-full h-14 px-4 bg-emerald-50/30 border border-emerald-50 rounded-2xl outline-none font-black text-center text-lg" placeholder="10" />
                  </div>
                </>
              ) : (
                <div className="col-span-2 space-y-2">
                  <label className="text-[11px] font-black text-emerald-600 pr-2">رقم الصفحة</label>
                  <input type="number" value={session.page} onChange={(e) => setSession({...session, page: e.target.value})} className="w-full h-14 px-4 bg-emerald-50/30 border border-emerald-50 rounded-2xl outline-none font-black text-center text-lg" placeholder="مثلاً: 125" />
                </div>
              )}
            </div>

            <div className="space-y-5 pt-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-black text-emerald-950 flex items-center gap-2">
                   <Target size={18} className="text-emerald-500" />
                   تكرار الحفظ المستهدف
                </label>
                <span className="text-2xl font-black text-emerald-800">{session.target}</span>
              </div>
              <input 
                type="range" min="1" max="100" value={session.target} 
                onChange={(e) => setSession({...session, target: parseInt(e.target.value)})}
                className="w-full h-2.5 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-800"
              />
            </div>

            <button 
              onClick={startSession}
              disabled={!session.sura}
              className="w-full h-20 bg-emerald-800 hover:bg-emerald-900 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-emerald-900/10 active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-4 mt-6"
            >
              بدء جلسة التكرار
              <ChevronRight size={28} className="rotate-180" />
            </button>
          </div>
        ) : (
          /* واجهة العداد النشط */
          <div className="animate-in fade-in duration-500">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black text-emerald-950 mb-3">{session.sura}</h2>
              <div className="inline-flex items-center px-6 py-2 bg-emerald-50 text-emerald-900 rounded-full text-sm font-black border border-emerald-100/50">
                {session.mode === 'verses' ? `الآيات: ${session.from} ← ${session.to}` : `الصفحة: ${session.page}`}
              </div>
            </div>

            <div className="relative w-64 h-64 mx-auto flex items-center justify-center mb-12">
              <svg className="absolute w-full h-full -rotate-90">
                <circle cx="128" cy="128" r="114" fill="transparent" stroke="#F1F5F9" strokeWidth="14" />
                <circle 
                  cx="128" cy="128" r="114" fill="transparent" stroke="#065F46" strokeWidth="14" 
                  strokeDasharray={716} strokeDashoffset={716 - (716 * progress) / 100}
                  strokeLinecap="round" className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="text-center">
                <div className="text-8xl font-black text-emerald-950 tabular-nums leading-none">
                  {session.count}
                </div>
                <div className="text-[10px] font-black text-emerald-400 mt-5 tracking-[0.3em] uppercase">الهدف: {session.target}</div>
              </div>
            </div>

            <button 
              onClick={increment}
              disabled={isDone}
              className={`w-full py-14 rounded-[3rem] text-5xl font-black shadow-2xl transition-all active:scale-[0.97] mb-10 flex flex-col items-center justify-center gap-4
                ${isDone 
                  ? 'bg-emerald-50 text-emerald-900 cursor-default border border-emerald-100 shadow-none' 
                  : 'bg-emerald-800 text-white hover:bg-emerald-900'}`}
            >
              {isDone ? (
                <>
                  <CheckCircle2 size={56} className="text-emerald-600" />
                  <span className="text-2xl">تم الحفظ بحمد الله</span>
                </>
              ) : (
                'تـم التكرار'
              )}
            </button>

            <div className="flex gap-5">
              <button 
                onClick={() => setSession({...session, count: 0})}
                className="flex-1 py-5 bg-emerald-50 text-emerald-800 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-emerald-100"
              >
                <RotateCcw size={20} />
                تصفير
              </button>
              <button 
                onClick={resetAll}
                className="flex-1 py-5 bg-rose-50 text-rose-600 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-rose-100"
              >
                <Plus size={20} className="rotate-45" />
                جديد
              </button>
            </div>
          </div>
        )}
      </main>

      {/* نافذة اختيار السورة */}
      {showSuraPicker && (
        <div className="fixed inset-0 bg-emerald-950/70 backdrop-blur-2xl z-[150] flex items-end justify-center">
          <div className="bg-white w-full max-w-md h-[92vh] rounded-t-[3.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500">
            <div className="p-8 border-b border-emerald-50">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-emerald-950">اختر السورة</h3>
                <button onClick={() => setShowSuraPicker(false)} className="w-12 h-12 bg-emerald-50 text-emerald-900 rounded-full flex items-center justify-center">
                  <X size={24} />
                </button>
              </div>
              <div className="relative group">
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-300" size={22} />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="ابحث عن اسم السورة..." 
                  className="w-full h-16 pr-14 pl-6 bg-emerald-50 border-none rounded-[1.5rem] outline-none text-emerald-950 font-bold text-lg text-right"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="grid grid-cols-1 gap-3 pb-10">
                {filteredSuras.map((sura) => (
                  <button 
                    key={sura}
                    onClick={() => {
                      setSession({...session, sura});
                      setShowSuraPicker(false);
                      setSearchQuery('');
                    }}
                    className={`w-full p-6 text-right font-black rounded-2xl transition-all flex justify-between items-center
                      ${session.sura === sura ? 'bg-emerald-800 text-white shadow-xl' : 'bg-emerald-50/40 hover:bg-emerald-50 text-emerald-950'}`}
                  >
                    <span className="text-lg">{sura}</span>
                    {session.sura === sura && <CheckCircle2 size={22} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* نافذة السجل */}
      {showHistory && (
        <div className="fixed inset-0 bg-emerald-950/70 backdrop-blur-2xl z-[150] flex items-end justify-center">
          <div className="bg-white w-full max-w-md h-[88vh] rounded-t-[3.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500">
            <div className="p-10 flex justify-between items-center border-b border-emerald-50">
              <h3 className="text-2xl font-black text-emerald-950 flex items-center gap-4">
                <History className="text-emerald-600" size={28} />
                سجل تِكْرَارْ
              </h3>
              <button onClick={() => setShowHistory(false)} className="w-12 h-12 bg-white text-emerald-950 rounded-full flex items-center justify-center shadow-sm">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-5 custom-scrollbar">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-emerald-100/50 py-20">
                  <Sparkles size={80} strokeWidth={1} />
                  <p className="mt-6 font-black text-xl text-center">أتمم تكرار سورة<br/>لبدء سجلك هنا</p>
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="p-6 bg-white border border-emerald-50 rounded-[2rem] flex justify-between items-center shadow-sm">
                    <div className="text-right">
                      <div className="font-black text-xl text-emerald-950">{item.title}</div>
                      <div className="text-xs font-bold text-emerald-500 mt-2 flex items-center gap-3">
                        <span className="bg-emerald-50 px-2 py-0.5 rounded-lg">{item.details}</span>
                        <span>•</span>
                        <span>{item.target} تكراراً</span>
                      </div>
                      <div className="text-[10px] text-slate-300 mt-2 font-bold tracking-wider">{item.date}</div>
                    </div>
                    <button 
                      onClick={() => setHistory(history.filter(h => h.id !== item.id))}
                      className="w-12 h-12 flex items-center justify-center text-rose-100 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                ))
              )}
            </div>
            {history.length > 0 && (
              <div className="p-8 bg-white border-t border-emerald-50">
                <button 
                  onClick={() => { if(confirm('هل تود مسح السجل بالكامل؟')) setHistory([]); }}
                  className="w-full py-5 text-rose-600 font-black border-2 border-rose-50 rounded-[1.5rem]"
                >
                  مسح السجل بالكامل
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* تذييل الصفحة */}
      <footer className="mt-auto py-8 text-emerald-900/10 text-[11px] font-black tracking-[0.5em] uppercase text-center select-none">
        تِكْرَارْ • TIKRAR
      </footer>

      {/* الأنماط الإضافية (Styles) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }
        .animate-loading-bar {
            animation: loading 2.5s ease-in-out infinite;
            width: 50%;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        input[type=range] { direction: rtl; }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 30px;
          width: 30px;
          border-radius: 50%;
          background: #064E3B;
          cursor: pointer;
          border: 6px solid white;
          box-shadow: 0 4px 15px rgba(6, 78, 59, 0.2);
        }
      `}} />
    </div>
  );
};

// تشغيل React
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

