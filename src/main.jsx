import React, { useState, useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom/client'

// --- أيقونات مدمجة SVG لضمان الاستقرار التام ---
const Icons = {
  Book: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
  History: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  X: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  Check: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  ArrowDown: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
};

const SURAS = ["الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"];

const App = () => {
  const appId = 'tikrar-master-v1';
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState({ isActive: false, sura: '', mode: 'verses', from: '', to: '', page: '', target: 10, count: 0 });
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2500);
    const h = localStorage.getItem(`${appId}-history`);
    const s = localStorage.getItem(`${appId}-session`);
    if (h) setHistory(JSON.parse(h));
    if (s) setSession(JSON.parse(s));
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(`${appId}-history`, JSON.stringify(history));
      localStorage.setItem(`${appId}-session`, JSON.stringify(session));
    }
  }, [history, session, isLoading]);

  const increment = () => {
    if (session.count < session.target) {
      const nc = session.count + 1;
      setSession(prev => ({ ...prev, count: nc }));
      if (nc === session.target) {
        const det = session.mode === 'verses' ? `آيات ${session.from}-${session.to}` : `وجه ${session.page}`;
        setHistory(prev => [{ id: Date.now(), title: session.sura, details: det, date: new Date().toLocaleDateString('ar-EG') }, ...prev]);
      }
    }
  };

  const progress = (session.count / session.target) * 100;
  const isDone = session.count >= session.target;

  if (isLoading) return (
    <div className="fixed inset-0 bg-[#064E3B] flex flex-col items-center justify-center text-white z-[500]">
      <div className="mb-6 animate-bounce text-emerald-400"><Icons.Book /></div>
      <h1 className="text-5xl font-black mb-2">تِكْرَارْ</h1>
      <p className="text-emerald-300 text-[10px] font-bold tracking-[0.3em] uppercase opacity-70">جاري التحميل</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAF5] p-4 flex flex-col items-center">
      <nav className="w-full max-w-md flex justify-between items-center mb-8 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-800 rounded-2xl flex items-center justify-center text-white shadow-lg"><Icons.Book /></div>
          <h1 className="text-2xl font-black text-emerald-950 tracking-tight">تِكْرَارْ</h1>
        </div>
        <button onClick={() => setShowHistory(true)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-800 shadow-sm border border-emerald-50 active:scale-90 transition-transform"><Icons.History /></button>
      </nav>

      <main className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-8 border border-white relative transition-all duration-500">
        {!session.isActive ? (
          <div className="space-y-7 text-right animate-in fade-in duration-500">
            <div className="space-y-2">
              <label className="text-sm font-black text-emerald-900 pr-1 flex items-center gap-2">اختر السورة</label>
              <button onClick={() => setShowPicker(true)} className="w-full h-16 px-6 bg-emerald-50/50 border-2 border-transparent hover:border-emerald-100 rounded-2xl flex items-center justify-between font-black text-emerald-950 transition-all">
                <span>{session.sura || "ابحث عن سورة..."}</span>
                <Icons.ArrowDown />
              </button>
            </div>

            <div className="flex p-1 bg-emerald-50/50 rounded-2xl">
              <button onClick={() => setSession(p=>({...p, mode:'verses'}))} className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${session.mode === 'verses' ? 'bg-white text-emerald-950 shadow-sm' : 'text-emerald-400'}`}>بالآيات</button>
              <button onClick={() => setSession(p=>({...p, mode:'page'}))} className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${session.mode === 'page' ? 'bg-white text-emerald-950 shadow-sm' : 'text-emerald-400'}`}>بالوجه</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {session.mode === 'verses' ? (
                <>
                  <input type="number" placeholder="من آية" className="h-14 bg-emerald-50/30 rounded-2xl text-center font-black outline-none border border-transparent focus:border-emerald-100" onChange={e=>setSession(p=>({...p, from: e.target.value}))} />
                  <input type="number" placeholder="إلى آية" className="h-14 bg-emerald-50/30 rounded-2xl text-center font-black outline-none border border-transparent focus:border-emerald-100" onChange={e=>setSession(p=>({...p, to: e.target.value}))} />
                </>
              ) : (
                <input type="number" placeholder="رقم الوجه / الصفحة" className="col-span-2 h-14 bg-emerald-50/30 rounded-2xl text-center font-black outline-none" onChange={e=>setSession(p=>({...p, page: e.target.value}))} />
              )}
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center font-black text-emerald-900 text-sm"><span>عدد التكرار المستهدف</span><span className="text-xl text-emerald-700">{session.target}</span></div>
              <input type="range" min="1" max="100" value={session.target} onChange={e=>setSession(p=>({...p, target: parseInt(e.target.value)}))} className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-800" />
            </div>

            <button onClick={()=>setSession(p=>({...p, isActive:true, count:0}))} disabled={!session.sura} className="w-full h-20 bg-emerald-800 hover:bg-emerald-900 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-emerald-900/10 active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center">ابدأ الجلسة</button>
          </div>
        ) : (
          <div className="text-center animate-in zoom-in-95 duration-500">
            <h2 className="text-4xl font-black text-emerald-950 mb-3">{session.sura}</h2>
            <p className="text-emerald-600 bg-emerald-50 px-5 py-1.5 rounded-full inline-block text-xs font-black mb-10">{session.mode === 'verses' ? `الآيات: ${session.from} ← ${session.to}` : `الصفحة: ${session.page}`}</p>
            
            <div className="relative w-64 h-64 mx-auto flex items-center justify-center mb-12">
              <svg className="absolute w-full h-full -rotate-90">
                <circle cx="128" cy="128" r="114" fill="transparent" stroke="#F1F5F9" strokeWidth="14" />
                <circle cx="128" cy="128" r="114" fill="transparent" stroke="#065F46" strokeWidth="14" strokeDasharray={716} strokeDashoffset={716 - (716 * progress) / 100} strokeLinecap="round" className="transition-all duration-700 ease-out" />
              </svg>
              <div className="text-center">
                <div className="text-8xl font-black text-emerald-950 leading-none">{session.count}</div>
                <div className="text-xs font-black text-emerald-400 mt-5 tracking-widest uppercase opacity-80">الهدف: {session.target}</div>
              </div>
            </div>

            <button onClick={increment} disabled={isDone} className={`w-full py-14 rounded-[3rem] text-4xl font-black transition-all active:scale-95 mb-8 flex flex-col items-center justify-center gap-2 ${isDone ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-emerald-800 text-white shadow-2xl shadow-emerald-900/30'}`}>
              {isDone ? <Icons.Check /> : 'تم التكرار'}
            </button>
            <div className="flex gap-4">
              <button onClick={()=>setSession(p=>({...p, count:0}))} className="flex-1 py-4 bg-emerald-50 text-emerald-800 rounded-2xl font-black text-sm">تصفير</button>
              <button onClick={()=>setSession(p=>({...p, isActive:false}))} className="flex-1 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-sm">إنهاء</button>
            </div>
          </div>
        )}
      </main>

      {/* Sura Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 bg-emerald-950/70 backdrop-blur-xl z-[600] flex items-end justify-center">
          <div className="bg-white w-full max-w-md h-[92vh] rounded-t-[3.5rem] p-8 flex flex-col animate-in slide-in-from-bottom duration-500">
            <div className="flex justify-between items-center mb-8"><h3 className="text-2xl font-black text-emerald-950">اختر السورة</h3><button onClick={()=>setShowPicker(false)} className="w-12 h-12 bg-emerald-50 text-emerald-900 rounded-full flex items-center justify-center"><Icons.X /></button></div>
            <div className="relative mb-6 text-right"><div className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-400"><Icons.Search /></div><input autoFocus type="text" placeholder="ابحث عن اسم السورة..." className="w-full h-16 pr-14 pl-6 bg-emerald-50 rounded-2xl outline-none font-black text-emerald-950 text-lg" onChange={e=>setSearch(e.target.value)} /></div>
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">{SURAS.filter(s=>s.includes(search)).map(s=>(<button key={s} onClick={()=>{setSession(p=>({...p, sura:s})); setShowPicker(false); setSearch('');}} className="w-full p-6 text-right font-black rounded-2xl transition-all flex justify-between items-center hover:bg-emerald-50 text-emerald-900 mb-2 border border-transparent hover:border-emerald-100"><span>{s}</span></button>))}</div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-emerald-950/70 backdrop-blur-xl z-[600] flex items-end justify-center">
          <div className="bg-white w-full max-w-md h-[85vh] rounded-t-[3.5rem] p-8 flex flex-col">
            <div className="flex justify-between items-center mb-10"><h3 className="text-2xl font-black text-emerald-950 flex items-center gap-3"><Icons.History /> سجل تِكْرَارْ</h3><button onClick={()=>setShowHistory(false)} className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center"><Icons.X /></button></div>
            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
              {history.length === 0 ? <div className="text-center py-20 opacity-20 font-black text-lg">لا يوجد سجلات حتى الآن</div> : history.map(h=>(<div key={h.id} className="p-6 bg-emerald-50/50 border border-emerald-50 rounded-[2rem] flex justify-between items-center"><div className="text-right"><div className="font-black text-lg text-emerald-950">{h.title}</div><div className="text-[10px] font-bold text-emerald-400 uppercase mt-1">{h.date} • {h.details}</div></div><button onClick={()=>{if(confirm('حذف؟')) setHistory(history.filter(x=>x.id!==h.id))}} className="p-3 text-rose-300 hover:text-rose-600 transition-colors"><Icons.Trash /></button></div>))}
            </div>
          </div>
        </div>
      )}
      <footer className="mt-auto py-8 text-emerald-900/10 text-[10px] font-black tracking-[0.5em] uppercase text-center">تِكْرَارْ • TIKRAR</footer>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

