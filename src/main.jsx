import React, { useState, useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom/client'

// --- أيقونات SVG مدمجة لضمان عدم حدوث شاشة بيضاء ---
const Icons = {
  Book: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
  History: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  Check: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
  X: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Search: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Trash: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
};

const SURAS = ["الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"];

const App = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState({ isActive: false, sura: '', target: 10, count: 0 });
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    const h = localStorage.getItem('t-history');
    if (h) setHistory(JSON.parse(h));
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('t-history', JSON.stringify(history));
  }, [history]);

  const increment = () => {
    if (session.count < session.target) {
      const nc = session.count + 1;
      setSession({...session, count: nc});
      if (nc === session.target) {
        setHistory([{id: Date.now(), sura: session.sura, date: new Date().toLocaleDateString('ar-EG')}, ...history]);
      }
    }
  };

  if (loading) return (
    <div className="fixed inset-0 bg-[#064E3B] flex flex-col items-center justify-center text-white" dir="rtl">
      <div className="mb-4 animate-bounce"><Icons.Book /></div>
      <h1 className="text-4xl font-black">تِكْرَارْ</h1>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAF5] p-4 font-sans text-right" dir="rtl">
      <nav className="max-w-md mx-auto flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-emerald-900">تِكْرَارْ</h1>
        <button onClick={() => setShowHistory(true)} className="p-3 bg-white rounded-xl shadow-sm border border-emerald-50"><Icons.History /></button>
      </nav>

      <main className="max-w-md mx-auto bg-white rounded-[2.5rem] shadow-xl p-6 border border-emerald-50">
        {!session.isActive ? (
          <div className="space-y-6">
            <button onClick={() => setShowPicker(true)} className="w-full p-4 bg-emerald-50 rounded-xl font-bold flex justify-between items-center">
              <span>{session.sura || "اختر السورة..."}</span>
              <div className="rotate-90"><Icons.Book /></div>
            </button>
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-700">عدد التكرار المستهدف</label>
              <input type="range" min="1" max="100" value={session.target} onChange={e=>setSession({...session, target: parseInt(e.target.value)})} className="w-full" />
              <div className="text-center font-black text-emerald-800">{session.target}</div>
            </div>
            <button onClick={()=>setSession({...session, isActive:true, count:0})} disabled={!session.sura} className="w-full p-5 bg-emerald-800 text-white rounded-2xl font-black disabled:opacity-30">ابدأ الجلسة</button>
          </div>
        ) : (
          <div className="text-center py-4">
            <h2 className="text-3xl font-black mb-8 text-emerald-950">{session.sura}</h2>
            <div className="text-8xl font-black mb-10 text-emerald-900 transition-all">{session.count}</div>
            <button onClick={increment} disabled={session.count >= session.target} className={`w-full py-12 rounded-3xl text-4xl font-black shadow-lg transition-all active:scale-95 ${session.count >= session.target ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-800 text-white'}`}>
              {session.count >= session.target ? 'تم الحفظ' : 'تم التكرار'}
            </button>
            <button onClick={()=>setSession({...session, isActive:false})} className="mt-8 text-rose-500 font-bold">إنهاء الجلسة</button>
          </div>
        )}
      </main>

      {/* Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-white w-full h-[80vh] rounded-t-[2rem] p-6 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4"><h3 className="font-black text-xl">اختر السورة</h3><button onClick={()=>setShowPicker(false)}><Icons.X /></button></div>
            <div className="relative mb-4"><div className="absolute right-3 top-3 opacity-30"><Icons.Search /></div><input type="text" placeholder="بحث..." className="w-full p-3 pr-10 bg-gray-100 rounded-xl outline-none" onChange={e=>setSearch(e.target.value)} /></div>
            <div className="flex-1 overflow-y-auto">{SURAS.filter(s=>s.includes(search)).map(s=>(<button key={s} onClick={()=>{setSession({...session, sura:s}); setShowPicker(false);}} className="w-full p-4 border-b text-right font-bold hover:bg-emerald-50 transition-colors">{s}</button>))}</div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-white w-full h-[80vh] rounded-t-[2rem] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6"><h3 className="font-black text-xl">سجل الإنجازات</h3><button onClick={()=>setShowHistory(false)}><Icons.X /></button></div>
            <div className="flex-1 overflow-y-auto space-y-3">{history.length === 0 ? <p className="text-center py-20 opacity-20 font-bold">السجل فارغ</p> : history.map(h=>(<div key={h.id} className="p-4 bg-emerald-50 rounded-xl flex justify-between items-center"><div className="text-right font-black text-emerald-950">{h.sura}</div><div className="text-[10px] font-bold text-emerald-400">{h.date}</div></div>))}</div>
          </div>
        </div>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

