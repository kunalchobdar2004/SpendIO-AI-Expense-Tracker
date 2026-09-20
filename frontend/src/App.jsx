import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

// =====================================
// 🎨 GLOBAL STYLES
// =====================================
const GlobalStyles = () => (
  <style>{`
    body, html {
      margin: 0; padding: 0; width: 100%; min-height: 100%;
      background-color: #f8fafc; color: #1e293b; font-family: 'Inter', sans-serif;
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .delay-100 { animation-delay: 0.1s; }
    .bg-grid-pattern {
      background-size: 40px 40px;
      background-image: radial-gradient(circle, #cbd5e1 1.5px, transparent 1.5px);
    }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  `}</style>
);

// =====================================
// 🎨 COMPONENTS: HEADER & FOOTER
// =====================================
const Header = ({ user, handleLogout }) => {
  const location = useLocation();
  const publicLinks = [{ name: "Home", path: "/" }, { name: "Features", path: "/#features" }, { name: "FAQ", path: "/faq" }];
  const privateLinks = [{ name: "Dashboard", path: "/dashboard" }, { name: "Scan Bill", path: "/scan" }, { name: "AI Advisor", path: "/ai" }];
  const links = user ? privateLinks : publicLinks;

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white shadow-xl animate-fade-up">
      <div className="max-w-7xl mx-auto px-6 h-[80px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-xl bg-white text-indigo-700 flex items-center justify-center font-black text-2xl shadow-lg group-hover:scale-110 transition-transform">S</div>
          <span className="text-3xl font-black tracking-tight drop-shadow-md">SpendIO</span>
        </Link>
        <nav className="hidden md:flex gap-8 items-center">
          {links.map(link => (
            <Link key={link.name} to={link.path} className={`font-bold transition-all duration-300 hover:-translate-y-0.5 px-3 py-2 rounded-lg ${location.pathname === link.path ? 'bg-white/20 shadow-inner' : 'text-indigo-100 hover:text-white hover:bg-white/10'}`}>
              {link.name}
            </Link>
          ))}
          {!user && <Link to="/auth" className="ml-4 bg-white text-indigo-700 px-8 py-3 rounded-xl font-black hover:bg-indigo-50 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all">Sign In</Link>}
        </nav>
        {user && (
          <Link to="/profile" className="w-12 h-12 rounded-full bg-white text-indigo-700 font-black flex items-center justify-center shadow-lg transition-all cursor-pointer hover:scale-110 hover:ring-4 ring-white/30 text-xl overflow-hidden border-2 border-white">
            {user.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" alt="Profile" /> : user.name.charAt(0).toUpperCase()}
          </Link>
        )}
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t-8 border-indigo-500 mt-auto z-10 relative">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded bg-indigo-500 flex items-center justify-center text-white font-bold">S</div>
          <span className="text-2xl font-black text-white">SpendIO</span>
        </div>
        <p className="text-slate-400 leading-relaxed max-w-sm">The world's smartest AI-powered expense tracker. Take control of your financial future by letting AI do the heavy lifting.</p>
      </div>
      <div>
        <h4 className="text-white font-bold mb-4 text-lg">Product</h4>
        <ul className="space-y-3">
          <li className="hover:text-indigo-400 cursor-pointer transition-colors">Features</li>
          <li className="hover:text-indigo-400 cursor-pointer transition-colors">API Access</li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-4 text-lg">Company</h4>
        <ul className="space-y-3">
          <li className="hover:text-indigo-400 cursor-pointer transition-colors">About Us</li>
          <li className="hover:text-indigo-400 cursor-pointer transition-colors">Privacy Policy</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 text-center text-slate-500 font-medium">
      <p>© 2026 SpendIO Technologies Inc. All rights reserved.</p>
    </div>
  </footer>
);

// =====================================
// 🚀 MAIN APP WITH ROUTING
// =====================================
function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("authUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [history, setHistory] = useState([]);
  
  useEffect(() => { if (user) fetchHistory(); }, [user]);

  const fetchHistory = async () => {
    try {
      // 🟢 UPDATED TO RENDER URL
      const response = await fetch(`https://spendio-ai-expense-tracker.onrender.com/api/expenses?userId=${user.id}`);
      setHistory(await response.json());
    } catch (error) { console.error(error); }
  };

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    setUser(null);
    setHistory([]);
  };

  return (
    <Router>
      <GlobalStyles />
      <div className="min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white relative">
        <Header user={user} handleLogout={handleLogout} />
        <main className="flex-grow flex flex-col w-full max-w-7xl mx-auto px-6 py-10 z-10 relative">
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/auth" element={!user ? <AuthPage setUser={setUser} /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} history={history} fetchHistory={fetchHistory} /> : <Navigate to="/auth" />} />
            <Route path="/scan" element={user ? <ScanPage user={user} fetchHistory={fetchHistory} /> : <Navigate to="/auth" />} />
            <Route path="/ai" element={user ? <AiPage user={user} history={history} /> : <Navigate to="/auth" />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/profile" element={user ? <ProfilePage user={user} setUser={setUser} history={history} handleLogout={handleLogout} /> : <Navigate to="/auth" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

// =====================================
// 🌟 PAGE 1: HOME PAGE
// =====================================
const HomePage = ({ user }) => {
  return (
    <div className="flex flex-col items-center justify-center animate-fade-up relative w-full h-full">
      <div className="fixed top-0 left-0 w-full h-full bg-grid-pattern -z-10 opacity-[0.4] pointer-events-none"></div>
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-300/40 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-300/40 rounded-full blur-[150px] -z-10 pointer-events-none"></div>

      <div className="text-center max-w-5xl mx-auto pt-16 pb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold mb-8 shadow-sm">
          <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span></span>
          SpendIO 2.0 is Live
        </div>
        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight text-slate-900 drop-shadow-sm">
          Your Money. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Mastered by AI.</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
          Upload receipts, track expenses, and chat with your financial data. SpendIO acts as your personal 24/7 accountant.
        </p>
        <Link to={user ? "/dashboard" : "/auth"} className="bg-indigo-600 text-white font-black text-2xl py-5 px-14 rounded-2xl hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-600/30 hover:-translate-y-1 transition-all duration-300 inline-block">
          {user ? "Enter Workspace ➔" : "Start Free Trial ➔"}
        </Link>
      </div>

      <div id="features" className="grid md:grid-cols-3 gap-8 w-full relative z-10 mb-20 mt-10">
        <div className="bg-indigo-50/80 backdrop-blur-lg p-10 rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-200/50 hover:shadow-2xl transition-all hover:-translate-y-2">
          <div className="w-16 h-16 bg-white text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-6 font-bold shadow-md">📸</div>
          <h3 className="text-2xl font-black mb-3 text-slate-900">One-Tap Scan</h3>
          <p className="text-slate-600 leading-relaxed font-medium">Just upload a picture of your bill. Gemini AI will instantly read and save the exact amount.</p>
        </div>
        <div className="bg-purple-50/80 backdrop-blur-lg p-10 rounded-3xl border border-purple-100 shadow-xl shadow-purple-200/50 hover:shadow-2xl transition-all hover:-translate-y-2">
          <div className="w-16 h-16 bg-white text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6 font-bold shadow-md">🤖</div>
          <h3 className="text-2xl font-black mb-3 text-slate-900">AI Assistant</h3>
          <p className="text-slate-600 leading-relaxed font-medium">Ask questions like "How much did I spend on food this month?" and get an instant AI reply.</p>
        </div>
        <div className="bg-emerald-50/80 backdrop-blur-lg p-10 rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-200/50 hover:shadow-2xl transition-all hover:-translate-y-2">
          <div className="w-16 h-16 bg-white text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-6 font-bold shadow-md">📈</div>
          <h3 className="text-2xl font-black mb-3 text-slate-900">Visual Insights</h3>
          <p className="text-slate-600 leading-relaxed font-medium">Beautiful color-coded charts and budget trackers make understanding your finances effortless.</p>
        </div>
      </div>
    </div>
  );
};

// =====================================
// 🔐 PAGE 2: AUTH PAGE
// =====================================
const AuthPage = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 🟢 UPDATED TO RENDER URL
      const res = await fetch(`https://spendio-ai-expense-tracker.onrender.com/api/${isLogin ? 'login' : 'signup'}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) { 
        setUser(data); localStorage.setItem("authUser", JSON.stringify(data)); navigate("/dashboard");
      } else alert(data.error);
    } catch(err) { alert("Server Connection Failed!"); }
    setLoading(false);
  };

  return (
    <div className="w-full flex items-center justify-center min-h-[75vh] relative z-20">
      <div className="flex w-full max-w-6xl min-h-[75vh] rounded-[3rem] overflow-hidden animate-fade-up shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[#3f3f46] bg-[#09090b] text-slate-200 relative">
        <div className="hidden lg:flex flex-col relative w-1/2 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#311042] items-center justify-center p-12 overflow-hidden border-r border-[#27272a]">
          <div className="z-20 text-center animate-fade-up">
            <div className="w-28 h-28 mx-auto bg-white text-indigo-700 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.6)] mb-8 transform hover:rotate-12 transition-transform duration-500 font-black text-7xl">S</div>
            <h1 className="text-5xl font-black text-white mb-6 tracking-tight">Welcome to Spend<span className="text-indigo-400">IO</span></h1>
            <p className="text-lg text-indigo-200/80 leading-relaxed font-medium">Join the future of finance. Track, analyze, and optimize your spending with advanced AI technology.</p>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 relative">
          <div className="w-full max-w-md animate-fade-up delay-100">
            <h2 className="text-3xl font-extrabold mb-2 text-white">{isLogin ? "Welcome back!" : "Create an account"}</h2>
            <div className="flex p-1.5 rounded-2xl mb-8 bg-[#18181b] border border-[#27272a] mt-6">
              <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 text-sm ${isLogin ? 'bg-indigo-600 text-white shadow-lg border border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}>Sign In</button>
              <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 text-sm ${!isLogin ? 'bg-indigo-600 text-white shadow-lg border border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}>Sign Up</button>
            </div>
            <form onSubmit={submit} className="space-y-5">
              {!isLogin && <input type="text" required placeholder="Full Name" className="w-full rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-indigo-500 bg-[#18181b] border border-[#27272a] text-white" onChange={e=>setForm({...form, name:e.target.value})} />}
              <input type="email" required placeholder="Email Address" className="w-full rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-indigo-500 bg-[#18181b] border border-[#27272a] text-white" onChange={e=>setForm({...form, email:e.target.value})} />
              <input type="password" required placeholder="Password" className="w-full rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-indigo-500 bg-[#18181b] border border-[#27272a] text-white" onChange={e=>setForm({...form, password:e.target.value})} />
              <button type="submit" disabled={loading} className="w-full bg-white text-indigo-900 font-black text-lg py-4 rounded-2xl cursor-pointer hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all mt-6 disabled:opacity-70">
                {loading ? "Processing..." : (isLogin ? "Secure Sign In ➔" : "Create Account ➔")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================
// 📄 PROTECTED PAGE: DASHBOARD (WITH EDIT/DELETE & EXPORT)
// =====================================
const Dashboard = ({ user, history, fetchHistory }) => {
  const [form, setForm] = useState({ amount: "", category: "Food", description: "", date: "" });
  const [budget, setBudget] = useState(() => Number(localStorage.getItem("userBudget")) || 10000);
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    // 🟢 UPDATED TO RENDER URL
    const url = editingId ? `https://spendio-ai-expense-tracker.onrender.com/api/expenses/${editingId}` : "https://spendio-ai-expense-tracker.onrender.com/api/expenses";
    
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, userId: user.id }) });
    setForm({ amount: "", category: "Food", description: "", date: "" });
    setEditingId(null);
    fetchHistory();
  };

  const handleEdit = (item) => {
    const formattedDate = new Date(item.date).toISOString().split("T")[0];
    setForm({ amount: item.amount, category: item.category, description: item.description, date: formattedDate });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    // 🟢 UPDATED TO RENDER URL
    await fetch(`https://spendio-ai-expense-tracker.onrender.com/api/expenses/${id}`, { method: "DELETE" });
    fetchHistory();
  };

  const handleExportCSV = () => {
    const headers = ["Date", "Category", "Description", "Amount"];
    const rows = history.map(item => [new Date(item.date).toLocaleDateString(), item.category, item.description, item.amount]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "SpendIO_Report.csv");
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My SpendIO Update',
        text: `Hey! I have tracked ₹${totalExpenses} out of my ₹${budget} budget this month using SpendIO.`,
      }).catch(console.error);
    } else {
      alert("Sharing is not supported on this browser/device.");
    }
  };

  const totalExpenses = history.reduce((sum, item) => sum + Number(item.amount), 0);
  const budgetPercentage = (totalExpenses / budget) * 100;
  const chartData = history.reduce((acc, curr) => {
    const ex = acc.find(item => item.name === curr.category);
    if (ex) ex.value += Number(curr.amount); else acc.push({ name: curr.category, value: Number(curr.amount) });
    return acc;
  }, []);
  const COLORS = ["#4f46e5", "#ec4899", "#14b8a6", "#f59e0b", "#8b5cf6"];

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-grid-pattern -z-10 opacity-[0.4] pointer-events-none"></div>
      
      <div className="grid lg:grid-cols-3 gap-8 animate-fade-up relative z-10">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className={`backdrop-blur-md p-8 rounded-3xl border shadow-lg ${editingId ? 'bg-amber-50/90 border-amber-200' : 'bg-indigo-50/90 border-indigo-100'}`}>
            <h2 className={`text-2xl font-black mb-6 flex items-center gap-3 ${editingId ? 'text-amber-900' : 'text-indigo-900'}`}>
              <span className="bg-white p-2 rounded-xl shadow-sm">{editingId ? '✏️' : '➕'}</span> 
              {editingId ? "Edit Expense" : "Add Expense"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="number" required placeholder="Amount (₹)" className="w-full rounded-2xl p-4 bg-white border border-indigo-100 text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500 outline-none" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              <select className="w-full rounded-2xl p-4 bg-white border border-indigo-100 text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500 outline-none" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option>Food</option><option>Transport</option><option>Utilities</option><option>Shopping</option><option>Entertainment</option>
              </select>
              <input type="text" placeholder="Description (e.g. KFC)" className="w-full rounded-2xl p-4 bg-white border border-indigo-100 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <input type="date" required className="w-full rounded-2xl p-4 bg-white border border-indigo-100 text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              
              <div className="flex gap-2 mt-4">
                <button type="submit" className={`flex-1 text-white font-black text-lg py-4 rounded-2xl shadow-md transition-all ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                  {editingId ? "Update" : "Save"}
                </button>
                {editingId && (
                  <button type="button" onClick={()=>{setEditingId(null); setForm({ amount: "", category: "Food", description: "", date: "" });}} className="bg-slate-300 text-slate-800 font-bold px-6 rounded-2xl hover:bg-slate-400">Cancel</button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Analytics */}
        <div className="lg:col-span-2 flex flex-col gap-6 animate-fade-up delay-100">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-emerald-50/90 p-8 rounded-3xl border border-emerald-100 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-black uppercase tracking-wider text-emerald-600">Monthly Target</p>
                <button onClick={() => { const b = prompt("New Budget (e.g. 15000):", budget); if(b && !isNaN(b)) { setBudget(Number(b)); localStorage.setItem("userBudget", Number(b)); } }} className="text-xs font-bold text-white bg-emerald-500 px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors">Edit</button>
              </div>
              <h3 className="text-5xl font-black text-emerald-900">₹{totalExpenses}</h3>
              <p className="text-emerald-700 font-bold mt-2">of ₹{budget} limit</p>
              <div className="w-full h-4 rounded-full overflow-hidden mt-6 bg-emerald-200/50 shadow-inner border border-emerald-200">
                <div className={`h-full rounded-full transition-all duration-1000 ease-out ${budgetPercentage > 90 ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(budgetPercentage, 100)}%` }}></div>
              </div>
            </div>
            
            <div className="bg-blue-50/90 p-8 rounded-3xl border border-blue-100 shadow-lg flex flex-col justify-center">
              <h3 className="font-black text-blue-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button onClick={handleExportCSV} className="w-full bg-white text-blue-700 font-bold p-4 rounded-xl border border-blue-200 hover:bg-blue-600 hover:text-white transition-all text-left flex justify-between cursor-pointer">📥 Download CSV Report <span>➔</span></button>
                <button onClick={handleShare} className="w-full bg-white text-blue-700 font-bold p-4 rounded-xl border border-blue-200 hover:bg-blue-600 hover:text-white transition-all text-left flex justify-between cursor-pointer">🤝 Share with Family <span>➔</span></button>
              </div>
            </div>
          </div>
          
          {chartData.length > 0 && (
            <div className="bg-white/90 p-8 rounded-3xl border border-slate-200 shadow-lg h-[300px]">
              <h2 className="text-2xl font-black mb-2 text-slate-800">Visual Spend Split</h2>
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                    {chartData.map((e, i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', color: '#1e293b', fontWeight: 'bold' }} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: "5px" }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Transactions List */}
        <div className="lg:col-span-3 bg-white/90 p-8 rounded-3xl border border-slate-200 shadow-lg mt-2">
          <h2 className="text-2xl font-black mb-6 text-slate-800 flex items-center gap-2"><span>📋</span> Recent Transactions</h2>
          {history.length > 0 ? (
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group">
                  <div>
                    <p className="font-black text-lg text-slate-800">{item.category}</p>
                    <p className="text-sm text-slate-500 font-medium">{item.description} • {new Date(item.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <p className="font-black text-xl text-indigo-600">₹{item.amount}</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(item)} className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 font-bold">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 font-bold">Del</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-center text-slate-400 font-bold py-6">No expenses logged yet.</p>
          )}
        </div>

      </div>
    </>
  );
};

// =====================================
// 📄 PROTECTED PAGE: SCAN BILL
// =====================================
const ScanPage = ({ user, fetchHistory }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setResult(null); 
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        // 🟢 UPDATED TO RENDER URL
        const res = await fetch("https://spendio-ai-expense-tracker.onrender.com/api/scan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageBase64: reader.result }) });
        if(!res.ok) throw new Error("API failed");
        
        const data = await res.json();
        setResult(data);
        // 🟢 UPDATED TO RENDER URL
        await fetch('https://spendio-ai-expense-tracker.onrender.com/api/expenses', { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, userId: user.id }) });
        fetchHistory();
      } catch (err) { 
        alert("Scan Failed! Please ensure the image is clear and under 5MB, or check your API key."); 
      }
      setLoading(false);
    };
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-grid-pattern -z-10 opacity-[0.4] pointer-events-none"></div>
      <div className="grid lg:grid-cols-3 gap-8 animate-fade-up">
        <div className="lg:col-span-2 p-12 rounded-[3rem] bg-cyan-50/90 border border-cyan-100 shadow-xl text-center">
          <div className="w-24 h-24 mx-auto bg-white text-cyan-600 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-md">📸</div>
          <h1 className="text-4xl font-black mb-3 text-cyan-900">AI Receipt Scanner</h1>
          <p className="mb-10 text-cyan-700 font-bold text-lg">Let Gemini AI read your physical bills automatically.</p>
          
          <div className="border-4 border-dashed rounded-[2rem] p-20 mb-8 hover:border-cyan-400 border-cyan-300 bg-white/50 transition-all">
            {loading ? (
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-black text-cyan-700 text-xl animate-pulse">Extracting Data...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center group">
                <p className="text-7xl mb-6 group-hover:scale-110 transition-transform">📄</p>
                <input type="file" accept="image/*" onChange={handleUpload} className="block w-auto text-sm file:mr-4 file:py-4 file:px-8 file:rounded-xl file:border-0 file:font-black file:bg-cyan-600 file:text-white hover:file:bg-cyan-700 cursor-pointer mx-auto shadow-md hover:shadow-xl transition-all text-slate-500" />
              </div>
            )}
          </div>

          {result && (
            <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-6 rounded-2xl font-black text-xl animate-fade-up">
              ✅ Auto-Saved: ₹{result.amount} ({result.category})
            </div>
          )}
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6 animate-fade-up delay-100">
          <div className="bg-white/90 p-8 rounded-3xl border border-slate-200 shadow-lg">
            <h3 className="font-black text-xl text-slate-800 mb-4">📌 How it works</h3>
            <ol className="space-y-4 text-slate-600 font-bold list-decimal pl-5">
              <li>Place bill on a flat surface.</li>
              <li>Ensure good lighting & focus.</li>
              <li>Upload the image here.</li>
              <li>AI extracts Amount & Category.</li>
              <li>Done! Saved to dashboard.</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

// =====================================
// 📄 PROTECTED PAGE: AI ADVISOR
// =====================================
const AiPage = ({ user, history }) => {
  const [insights, setInsights] = useState(null);
  const [chat, setChat] = useState("");
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hello! I am your AI Financial Assistant. Ask me anything about your spending data. 🤖' }]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const fetchReport = async () => {
    setLoadingInsights(true);
    try {
      // 🟢 UPDATED TO RENDER URL
      const res = await fetch(`https://spendio-ai-expense-tracker.onrender.com/api/insights/${user.id}`);
      if(!res.ok) throw new Error("API Failed");
      setInsights(await res.json());
    } catch (err) {
      alert("AI Report failed to generate. Check backend connection.");
    }
    setLoadingInsights(false);
  };

  const handleChat = async (e, customText = null) => {
    if(e) e.preventDefault();
    const q = customText || chat;
    if(!q.trim()) return;
    
    setMessages(p => [...p, { role: 'user', text: q }]);
    setChat("");
    
    try {
      // 🟢 UPDATED TO RENDER URL
      const res = await fetch("https://spendio-ai-expense-tracker.onrender.com/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q, expenses: history }) });
      if(!res.ok) throw new Error("Chat Failed");
      const data = await res.json();
      setMessages(p => [...p, { role: 'ai', text: data.answer }]);
    } catch(err) {
      setMessages(p => [...p, { role: 'ai', text: "Connection error! Cannot reach the backend. ⚠️" }]);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-grid-pattern -z-10 opacity-[0.4] pointer-events-none"></div>

      <div className="grid lg:grid-cols-2 gap-8 animate-fade-up">
        {/* Left: Report */}
        <div className="bg-pink-50/90 p-10 rounded-3xl border border-pink-100 shadow-xl h-fit">
          <h2 className="text-3xl font-black mb-8 flex items-center gap-3 text-pink-900"><span className="bg-white p-3 rounded-xl shadow-sm text-pink-600">✨</span> Smart Report</h2>
          <button onClick={fetchReport} disabled={loadingInsights} className="w-full bg-pink-600 text-white font-black text-xl py-5 rounded-2xl mb-8 hover:bg-pink-700 shadow-lg transition-all disabled:opacity-50">
            {loadingInsights ? "Crunching Numbers..." : "Generate AI Analysis ➔"}
          </button>
          
          {insights && (
            <div className="space-y-6 animate-fade-up">
              <div className="p-8 rounded-2xl bg-white border border-pink-200 shadow-sm">
                <p className="font-black text-pink-700 text-xl mb-3">📊 Monthly Summary</p>
                <p className="text-slate-700 font-medium leading-relaxed">{insights.summary}</p>
              </div>
              <div className="p-8 rounded-2xl bg-white border border-pink-200 shadow-sm">
                <p className="font-black text-emerald-600 text-xl mb-3">💡 Actionable Tips</p>
                <ul className="space-y-3 text-slate-700 font-bold">{insights.suggestions.map((s,i)=><li key={i} className="flex gap-2"><span className="text-emerald-500">✓</span>{s}</li>)}</ul>
              </div>
            </div>
          )}
        </div>

        {/* Right: Chat */}
        <div className="bg-purple-50/90 p-10 rounded-3xl border border-purple-100 shadow-xl flex flex-col h-[700px] animate-fade-up delay-100">
          <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-purple-900"><span className="bg-white p-3 rounded-xl shadow-sm text-purple-600">💬</span> Chat with Data</h2>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={()=>handleChat(null, "Which category is highest?")} className="bg-white border border-purple-200 text-purple-700 text-sm font-bold px-4 py-2 rounded-full hover:bg-purple-600 hover:text-white transition-colors">Highest Category?</button>
            <button onClick={()=>handleChat(null, "Did I spend on Food recently?")} className="bg-white border border-purple-200 text-purple-700 text-sm font-bold px-4 py-2 rounded-full hover:bg-purple-600 hover:text-white transition-colors">Food Expenses?</button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-5 mb-6 pr-2 custom-scrollbar bg-white/50 p-6 rounded-2xl border border-purple-100">
            {messages.map((m, i) => (
              <div key={i} className={`p-5 rounded-2xl max-w-[85%] text-base font-bold shadow-md animate-fade-up ${m.role==='ai' ? 'bg-white text-purple-900 self-start' : 'bg-purple-600 text-white self-end ml-auto'}`}>
                {m.text}
              </div>
            ))}
          </div>
          
          <form onSubmit={(e)=>handleChat(e)} className="flex gap-3">
            <input type="text" className="flex-1 p-5 rounded-2xl bg-white border border-purple-200 text-purple-900 font-bold outline-none focus:ring-4 focus:ring-purple-200 transition-all shadow-sm" placeholder="Ask a question..." value={chat} onChange={e=>setChat(e.target.value)} />
            <button type="submit" className="bg-purple-600 text-white px-10 font-black text-lg rounded-2xl hover:bg-purple-700 shadow-md">Send</button>
          </form>
        </div>
      </div>
    </>
  );
};

// =====================================
// 📄 PROTECTED PAGE: PROFILE
// =====================================
const ProfilePage = ({ user, setUser, history, handleLogout }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const total = history.reduce((s, i) => s + Number(i.amount), 0);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        // 🟢 UPDATED TO RENDER URL
        const res = await fetch(`https://spendio-ai-expense-tracker.onrender.com/api/user/${user.id}/profile-pic`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profilePic: reader.result }) });
        if(res.ok) {
          const updatedUser = { ...user, profilePic: reader.result };
          setUser(updatedUser); localStorage.setItem("authUser", JSON.stringify(updatedUser));
        }
      } catch (err) { alert("Upload Failed"); }
      setUploading(false);
    };
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-grid-pattern -z-10 opacity-[0.4] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto space-y-8 animate-fade-up w-full">
        <div className="p-12 rounded-[3rem] bg-orange-50/90 border border-orange-100 shadow-xl flex flex-col md:flex-row items-center gap-10">
          
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
            <div className="w-40 h-40 rounded-full bg-orange-500 text-white font-black text-6xl flex items-center justify-center shadow-lg border-4 border-white overflow-hidden group-hover:opacity-80 transition-all">
              {uploading ? <div className="text-sm font-bold animate-pulse text-white">Uploading...</div> : (user.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" alt="Profile" /> : user.name.charAt(0).toUpperCase())}
            </div>
            <div className="absolute bottom-2 right-2 bg-white text-xl p-3 rounded-full shadow-md border border-slate-100 group-hover:scale-110 transition-transform">📷</div>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-5xl font-black text-orange-950 mb-2">{user.name}</h1>
            <p className="text-xl text-orange-700 font-bold mb-6">{user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <div className="bg-white text-orange-600 px-6 py-3 rounded-2xl font-black text-lg shadow-sm border border-orange-100">Total Spent: ₹{total}</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-10 rounded-[2.5rem] bg-rose-50/90 border border-rose-100 shadow-xl animate-fade-up delay-100">
            <h2 className="text-2xl font-black mb-6 text-rose-900">👑 Subscription</h2>
            <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm text-center">
              <span className="inline-block bg-rose-100 text-rose-700 font-black px-4 py-1 rounded-full text-sm mb-4">Current Plan</span>
              <h3 className="text-4xl font-black text-rose-600 mb-2">SpendIO Free</h3>
              <p className="text-rose-900/60 font-bold mb-6">Upgrade to PRO to unlock unlimited AI scans.</p>
              <button className="w-full bg-rose-600 text-white font-black py-4 rounded-xl hover:bg-rose-700 shadow-md transition-all">Upgrade Now</button>
            </div>
          </div>

          <div className="p-10 rounded-[2.5rem] bg-amber-50/90 border border-amber-100 shadow-xl animate-fade-up delay-200 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-black mb-6 text-amber-900">⚙️ Account Settings</h2>
            </div>
            <button onClick={handleLogout} className="w-full bg-red-100 text-red-600 border-2 border-red-200 font-black text-xl py-5 rounded-2xl hover:bg-red-600 hover:text-white hover:border-red-600 shadow-sm transition-all">
              🚪 Secure Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// =====================================
// 📄 PUBLIC PAGE: FAQ
// =====================================
const FaqPage = () => {
  const faqs = [
    { q: "How does the AI Scanner work?", a: "It uses Google Gemini Vision to read your uploaded physical receipts and automatically extracts the amount and category." },
    { q: "Is my data private?", a: "Yes, your expenses are stored securely in a private PostgreSQL database linked exclusively to your account." },
    { q: "How does the AI Chatbot work?", a: "The Chatbot dynamically reads your database entries and uses generative AI to answer questions about your spending." },
  ];
  return (
    <div className="max-w-4xl mx-auto p-12 rounded-[3rem] bg-slate-50/90 border border-slate-200 shadow-xl animate-fade-up">
      <h1 className="text-5xl font-black mb-12 text-center text-slate-900">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((f, i) => (
          <div key={i} className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <h3 className="font-black text-xl mb-3 text-indigo-700 flex items-center gap-3"><span className="bg-indigo-100 px-3 py-1 rounded-lg">Q</span> {f.q}</h3>
            <p className="pl-14 text-slate-600 font-medium text-lg">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;