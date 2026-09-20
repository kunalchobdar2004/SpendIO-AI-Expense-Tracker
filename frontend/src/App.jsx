import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

// =====================================
// 🎨 GLOBAL STYLES (DARK MODE, NEON & ANIMATIONS)
// =====================================
const GlobalStyles = () => (
  <style>{`
    body, html {
      margin: 0; padding: 0; width: 100%; min-height: 100%;
      background-color: #020617; /* Slate 950 */
      color: #F8FAFC; 
      font-family: 'Inter', system-ui, sans-serif;
      overflow-x: hidden;
    }
    
    /* Animations */
    @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
    @keyframes pulseGlow { 0% { box-shadow: 0 0 0 0 rgba(139,92,246,0.4); } 70% { box-shadow: 0 0 20px 10px rgba(139,92,246,0); } 100% { box-shadow: 0 0 0 0 rgba(139,92,246,0); } }
    @keyframes gradientBG { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
    
    .animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-float { animation: float 4s ease-in-out infinite; }
    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }

    /* Custom Gradients & Glassmorphism */
    .text-gradient { background: linear-gradient(to right, #38BDF8, #818CF8, #E879F9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .bg-gradient-animated { background: linear-gradient(-45deg, #4F46E5, #0EA5E9, #8B5CF6); background-size: 400% 400%; animation: gradientBG 10s ease infinite; }
    
    .glass-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
    .glass-card:hover {
      border-color: rgba(139, 92, 246, 0.3);
      box-shadow: 0 0 20px rgba(139, 92, 246, 0.15);
      transform: translateY(-2px);
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #020617; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #64748B; }
    
    /* Scanner Laser */
    @keyframes scanLaser { 0% { top: 0; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
    .laser-line { position: absolute; left: 0; right: 0; height: 3px; background: #38BDF8; box-shadow: 0 0 15px 5px rgba(56, 189, 248, 0.5); animation: scanLaser 2s infinite linear; z-index: 10; }
  `}</style>
);

// Background Ambient Glowing Orbs
const AmbientBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] animate-float"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/20 blur-[150px] animate-float" style={{ animationDelay: '2s' }}></div>
    <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-fuchsia-600/10 blur-[100px] animate-float" style={{ animationDelay: '1s' }}></div>
  </div>
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
    <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-animated text-white flex items-center justify-center font-black text-xl shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:scale-110 transition-transform duration-300">S</div>
          <span className="text-2xl font-bold tracking-tight text-white group-hover:text-gradient transition-all">SpendIO</span>
        </Link>
        <nav className="hidden md:flex gap-8 items-center">
          {links.map(link => (
            <Link key={link.name} to={link.path} className={`text-sm font-semibold transition-all duration-300 px-3 py-2 rounded-lg ${location.pathname === link.path ? 'text-cyan-400 bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              {link.name}
            </Link>
          ))}
          {!user && <Link to="/auth" className="ml-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">Sign In</Link>}
        </nav>
        {user && (
          <Link to="/profile" className="w-10 h-10 rounded-full bg-slate-800 text-cyan-400 font-bold flex items-center justify-center overflow-hidden border-2 border-white/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all cursor-pointer">
            {user.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" alt="Profile" /> : user.name.charAt(0).toUpperCase()}
          </Link>
        )}
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-[#020617] border-t border-white/10 pt-16 pb-8 relative overflow-hidden mt-auto z-10">
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 relative z-10">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-animated flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_rgba(139,92,246,0.5)]">S</div>
          <span className="text-2xl font-black text-white tracking-wide">Spend<span className="text-cyan-400">IO</span></span>
        </div>
        <p className="text-slate-400 leading-relaxed max-w-sm font-medium">Next-generation financial intelligence. Neural-powered receipt scanning and conversational analytics, designed exclusively for the modern web.</p>
      </div>
      <div>
        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest opacity-80">Platform</h4>
        <ul className="space-y-4 text-sm font-medium text-slate-500">
          <li><Link to="/" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 hover:bg-cyan-400 transition-colors"></span> AI Vision</Link></li>
          <li><Link to="/" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 hover:bg-cyan-400 transition-colors"></span> Smart Chatbot</Link></li>
          <li><Link to="/faq" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 hover:bg-cyan-400 transition-colors"></span> Knowledge Base</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest opacity-80">System</h4>
        <ul className="space-y-4 text-sm font-medium text-slate-500">
          <li><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> DB Status: Optimal</span></li>
          <li><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> AI Engine: Gemini Active</span></li>
          <li><Link to="/" className="hover:text-cyan-400 transition-colors">Privacy & Security</Link></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600 font-medium">
      <p>© 2026 SpendIO Technologies. Initialized via AI.</p>
      <p className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">Crafted with <span className="text-fuchsia-500 animate-pulse">♥</span> for the Future</p>
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
      <AmbientBackground />
      <div className="min-h-screen flex flex-col selection:bg-cyan-500/30 selection:text-cyan-100 relative z-10">
        <Header user={user} handleLogout={handleLogout} />
        <main className="flex-grow flex flex-col w-full max-w-7xl mx-auto px-6 py-10">
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
    <div className="flex flex-col animate-fade-up w-full h-full pb-10">
      <div className="text-center max-w-4xl mx-auto pt-20 pb-28 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-cyan-300 text-xs font-bold mb-8 uppercase tracking-widest border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.15)] animate-fade-up">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute"></span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 relative"></span>
          System v2.0 Operational
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight text-white animate-fade-up delay-100">
          Command your wealth. <br/>
          <span className="text-gradient">Driven by AI.</span>
        </h1>
        
        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium animate-fade-up delay-200">
          Experience the future of personal finance. Neural receipt extraction, dynamic visual analytics, and conversational intelligence embedded in one powerful dark dashboard.
        </p>
        
        <div className="flex gap-6 justify-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <Link to={user ? "/dashboard" : "/auth"} className="relative group">
            <div className="absolute -inset-1 bg-gradient-animated rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <button className="relative bg-[#020617] text-white font-bold text-lg py-4 px-10 rounded-xl leading-none flex items-center gap-3 border border-white/10 group-hover:bg-transparent transition-all">
              {user ? "Access Terminal" : "Initialize System"} <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </button>
          </Link>
        </div>
      </div>

      <div id="features" className="py-10 mb-20 relative">
        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          <div className="glass-card p-10 rounded-3xl animate-fade-up delay-100 group">
            <div className="w-14 h-14 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center mb-8 border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Neural Vision</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">Upload raw invoice data. Our integrated Gemini Vision node instantly parses text, amount, and context with zero manual input.</p>
          </div>
          
          <div className="glass-card p-10 rounded-3xl animate-fade-up delay-200 group">
            <div className="w-14 h-14 bg-fuchsia-500/10 text-fuchsia-400 rounded-2xl flex items-center justify-center mb-8 border border-fuchsia-500/20 group-hover:bg-fuchsia-500 group-hover:text-white transition-all shadow-[0_0_20px_rgba(217,70,239,0.2)]">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Logic Chatbot</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">Query your database naturally. "What was my highest burn rate this month?" The AI Engine generates exact, contextual responses.</p>
          </div>
          
          <div className="glass-card p-10 rounded-3xl animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-8 border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] group">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Dynamic Dashboards</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">Experience your financial flow visually. Real-time rendering of expense distribution, budget limits, and CSV data extraction capabilities.</p>
          </div>
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
    <div className="w-full flex items-center justify-center min-h-[75vh]">
      <div className="glass-card w-full max-w-md p-10 rounded-[2rem] relative overflow-hidden animate-fade-up">
        {/* Glow effect inside card */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 blur-[50px] rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/20 blur-[50px] rounded-full"></div>
        
        <div className="text-center mb-10 relative z-10">
          <div className="w-14 h-14 mx-auto bg-gradient-animated text-white rounded-2xl flex items-center justify-center text-2xl font-black mb-6 shadow-[0_0_20px_rgba(139,92,246,0.4)]">S</div>
          <h2 className="text-3xl font-black text-white tracking-tight">{isLogin ? "Authentication" : "Register Node"}</h2>
          <p className="text-slate-400 text-sm mt-3 font-medium">Enter secure credentials to proceed.</p>
        </div>
        
        <div className="flex bg-slate-900/50 p-1.5 rounded-xl mb-8 relative z-10 border border-white/5">
          <button onClick={() => setIsLogin(true)} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Login</button>
          <button onClick={() => setIsLogin(false)} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Sign Up</button>
        </div>

        <form onSubmit={submit} className="space-y-5 relative z-10">
          {!isLogin && <input type="text" required placeholder="Full Name" className="w-full p-4 text-sm bg-slate-900/50 border border-white/10 rounded-xl outline-none focus:border-cyan-500 focus:bg-slate-900 text-white transition-all placeholder:text-slate-500" onChange={e=>setForm({...form, name:e.target.value})} />}
          <input type="email" required placeholder="Secure Email" className="w-full p-4 text-sm bg-slate-900/50 border border-white/10 rounded-xl outline-none focus:border-cyan-500 focus:bg-slate-900 text-white transition-all placeholder:text-slate-500" onChange={e=>setForm({...form, email:e.target.value})} />
          <input type="password" required placeholder="Password Array" className="w-full p-4 text-sm bg-slate-900/50 border border-white/10 rounded-xl outline-none focus:border-cyan-500 focus:bg-slate-900 text-white transition-all placeholder:text-slate-500" onChange={e=>setForm({...form, password:e.target.value})} />
          <button type="submit" disabled={loading} className="w-full bg-gradient-animated text-white text-lg font-black py-4 rounded-xl hover:scale-[1.02] shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all disabled:opacity-70 mt-4">
            {loading ? "Authenticating..." : (isLogin ? "Initialize Session" : "Create Node")}
          </button>
        </form>
      </div>
    </div>
  );
};

// =====================================
// 📄 PROTECTED PAGE: DASHBOARD 
// =====================================
const Dashboard = ({ user, history, fetchHistory }) => {
  const [form, setForm] = useState({ amount: "", category: "Food", description: "", date: "" });
  const [budget, setBudget] = useState(() => Number(localStorage.getItem("userBudget")) || 10000);
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
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
    if (!window.confirm("Purge this transaction from database?")) return;
    await fetch(`https://spendio-ai-expense-tracker.onrender.com/api/expenses/${id}`, { method: "DELETE" });
    fetchHistory();
  };

  const handleExportCSV = () => {
    const headers = ["Date", "Category", "Description", "Amount"];
    const rows = history.map(item => [new Date(item.date).toLocaleDateString(), item.category, item.description, item.amount]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "SpendIO_Encrypted_Report.csv");
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const totalExpenses = history.reduce((sum, item) => sum + Number(item.amount), 0);
  const budgetPercentage = (totalExpenses / budget) * 100;
  const chartData = history.reduce((acc, curr) => {
    const ex = acc.find(item => item.name === curr.category);
    if (ex) ex.value += Number(curr.amount); else acc.push({ name: curr.category, value: Number(curr.amount) });
    return acc;
  }, []);
  
  // Neon Colors for dark theme chart
  const COLORS = ["#38BDF8", "#D946EF", "#4ADE80", "#FBBF24", "#818CF8"];

  return (
    <div className="grid lg:grid-cols-3 gap-8 animate-fade-up">
      {/* Left Column: Form */}
      <div className="lg:col-span-1">
        <div className="glass-card p-8 rounded-3xl sticky top-28">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            {editingId ? "Update Data Node" : "Input New Node"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Metric (₹)</label>
              <input type="number" required className="w-full p-4 text-sm bg-slate-900/50 border border-white/10 rounded-xl outline-none focus:border-cyan-500 text-white font-mono" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Classification</label>
              <select className="w-full p-4 text-sm bg-slate-900 border border-white/10 rounded-xl outline-none focus:border-cyan-500 text-white" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option>Food</option><option>Transport</option><option>Utilities</option><option>Shopping</option><option>Entertainment</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Meta Description</label>
              <input type="text" placeholder="Transaction context" className="w-full p-4 text-sm bg-slate-900/50 border border-white/10 rounded-xl outline-none focus:border-cyan-500 text-white" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Timestamp</label>
              <input type="date" required className="w-full p-4 text-sm bg-slate-900 border border-white/10 rounded-xl outline-none focus:border-cyan-500 text-slate-300" style={{ colorScheme: 'dark' }} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className={`flex-1 text-white text-sm font-bold py-4 rounded-xl transition-all shadow-lg ${editingId ? 'bg-fuchsia-600 hover:bg-fuchsia-500' : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]'}`}>
                {editingId ? "Commit Update" : "Inject Data"}
              </button>
              {editingId && (
                <button type="button" onClick={()=>{setEditingId(null); setForm({ amount: "", category: "Food", description: "", date: "" });}} className="bg-slate-800 text-white border border-white/10 text-sm font-bold px-6 rounded-xl hover:bg-slate-700">Abort</button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Right Column: Analytics & List */}
      <div className="lg:col-span-2 flex flex-col gap-8 delay-100 animate-fade-up">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full group-hover:bg-cyan-500/20 transition-all"></div>
            <div className="flex justify-between items-center mb-4 relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Burn Rate</p>
              <button onClick={() => { const b = prompt("Update Target Capacity:", budget); if(b && !isNaN(b)) { setBudget(Number(b)); localStorage.setItem("userBudget", Number(b)); } }} className="text-xs bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 rounded-md text-white font-bold transition-all">Modify Limit</button>
            </div>
            <h3 className="text-5xl font-black text-white mb-2 font-mono relative z-10">₹{totalExpenses.toLocaleString()}</h3>
            <p className="text-sm text-slate-400 font-medium relative z-10">of ₹{budget.toLocaleString()} capacity</p>
            <div className="w-full h-3 rounded-full mt-6 bg-slate-800 overflow-hidden border border-white/5 relative z-10">
              <div className={`h-full rounded-full transition-all duration-1000 ${budgetPercentage > 90 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "bg-gradient-animated shadow-[0_0_10px_rgba(34,211,238,0.5)]"}`} style={{ width: `${Math.min(budgetPercentage, 100)}%` }}></div>
            </div>
          </div>
          
          <div className="glass-card p-8 rounded-3xl flex flex-col justify-center items-center relative">
            <h3 className="text-sm font-bold absolute top-8 left-8 text-white">Visual Distribution</h3>
            {chartData.length > 0 ? (
              <div className="w-full h-[180px] mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" stroke="rgba(255,255,255,0.05)" strokeWidth={2}>
                      {chartData.map((e, i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 'bold' }} itemStyle={{color: '#fff'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-slate-500 font-medium">No vectors detected</p>
            )}
            <button onClick={handleExportCSV} className="absolute bottom-6 right-6 text-xs font-bold text-cyan-400 hover:text-white transition-colors flex items-center gap-1"><span className="text-lg">↓</span> Export CSV</button>
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
            <svg className="w-5 h-5 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
            Data Logs
          </h2>
          {history.length > 0 ? (
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 hover:bg-white/10 transition-all group flex justify-between items-center">
                  <div className="flex gap-5 items-center">
                    <div className="w-12 h-12 rounded-xl bg-[#020617] border border-white/10 flex items-center justify-center text-lg font-black text-cyan-400 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-shadow">
                      {item.category.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-base text-white">{item.description || item.category}</p>
                      <p className="text-xs text-slate-400 font-medium tracking-wide mt-1">{new Date(item.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <p className="font-mono font-bold text-lg text-white">₹{item.amount}</p>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(item)} className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500 hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-center text-sm text-slate-500 font-medium py-8 bg-black/20 rounded-2xl border border-white/5">Database empty. Initiate first input.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// =====================================
// 📄 PROTECTED PAGE: SCAN BILL (Cyberpunk Scanner)
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
        const res = await fetch("https://spendio-ai-expense-tracker.onrender.com/api/scan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageBase64: reader.result }) });
        if(!res.ok) throw new Error("API failed");
        
        const data = await res.json();
        setResult(data);
        await fetch('https://spendio-ai-expense-tracker.onrender.com/api/expenses', { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, userId: user.id }) });
        fetchHistory();
      } catch (err) { 
        alert("Extraction Failed. Ensure image clarity."); 
      }
      setLoading(false);
    };
  };

  return (
    <div className="max-w-4xl mx-auto w-full animate-fade-up flex flex-col items-center justify-center min-h-[60vh]">
      <div className="glass-card p-12 md:p-16 rounded-[3rem] w-full text-center relative overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.05)]">
        
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-[3rem]"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-fuchsia-500/50 rounded-br-[3rem]"></div>

        <h1 className="text-3xl font-black text-white mb-3 tracking-wide">Optical AI Extraction</h1>
        <p className="text-sm text-slate-400 mb-10 font-medium">Transmit document image. Gemini Neural Net will isolate data automatically.</p>
        
        <div className="relative border border-white/20 rounded-[2rem] bg-[#020617] hover:bg-white/5 transition-all group overflow-hidden max-w-2xl mx-auto shadow-inner">
          {loading && <div className="laser-line"></div>}
          
          <div className="p-20 flex flex-col items-center justify-center">
            {loading ? (
              <>
                <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                <p className="text-sm font-bold text-cyan-400 animate-pulse tracking-widest uppercase">Processing Matrix...</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cyan-500/10 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all">
                  <svg className="w-10 h-10 text-slate-400 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
                </div>
                <label className="bg-gradient-animated text-white text-base font-bold px-8 py-4 rounded-xl cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:scale-105 transition-all block">
                  Select Visual Node
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
                <p className="text-xs text-slate-500 mt-6 font-mono uppercase tracking-widest">Supported: JPG, PNG (Max 5MB)</p>
              </>
            )}
          </div>
        </div>

        {result && (
          <div className="mt-10 inline-flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-400 px-6 py-4 rounded-xl text-base font-bold animate-fade-up shadow-[0_0_15px_rgba(34,197,94,0.2)]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Data Encoded: ₹{result.amount} [{result.category}]
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================
// 📄 PROTECTED PAGE: AI ADVISOR (Neon Terminal Interface)
// =====================================
const AiPage = ({ user, history }) => {
  const [insights, setInsights] = useState(null);
  const [chat, setChat] = useState("");
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Terminal Active. AI Financial Core online. Awaiting query...' }]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [messages]);

  const fetchReport = async () => {
    setLoadingInsights(true);
    try {
      const res = await fetch(`https://spendio-ai-expense-tracker.onrender.com/api/insights/${user.id}`);
      if(!res.ok) throw new Error("API Failed");
      setInsights(await res.json());
    } catch (err) { alert("Analysis sequence failed."); }
    setLoadingInsights(false);
  };

  const handleChat = async (e, customText = null) => {
    if(e) e.preventDefault();
    const q = customText || chat;
    if(!q.trim()) return;
    
    setMessages(p => [...p, { role: 'user', text: q }]);
    setChat("");
    
    try {
      const res = await fetch("https://spendio-ai-expense-tracker.onrender.com/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q, expenses: history }) });
      const data = await res.json();
      setMessages(p => [...p, { role: 'ai', text: data.answer }]);
    } catch(err) {
      setMessages(p => [...p, { role: 'ai', text: "Error: Neural link severed." }]);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 h-[75vh] animate-fade-up">
      {/* Left: AI Report Panel */}
      <div className="lg:col-span-1 glass-card rounded-[2rem] p-8 flex flex-col h-full overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-fuchsia-500 animate-pulse"></span>
          Deep Analysis
        </h2>
        <p className="text-xs text-slate-400 mb-8 font-mono uppercase tracking-widest border-b border-white/10 pb-4">Generate comprehensive logic matrix</p>
        
        <button onClick={fetchReport} disabled={loadingInsights} className="w-full bg-white/5 border border-fuchsia-500/30 text-fuchsia-400 hover:bg-fuchsia-500 hover:text-white text-sm font-bold py-4 rounded-xl mb-6 transition-all shadow-[0_0_15px_rgba(217,70,239,0.1)] hover:shadow-[0_0_20px_rgba(217,70,239,0.4)] disabled:opacity-50 tracking-wide uppercase">
          {loadingInsights ? "Compiling..." : "Run Diagnostics"}
        </button>
        
        {insights && (
          <div className="space-y-6 flex-1 animate-fade-up mt-4">
            <div className="bg-[#020617] p-5 rounded-xl border border-white/10 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
              <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">System Conclusion</p>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">{insights.summary}</p>
            </div>
            <div className="bg-[#020617] p-5 rounded-xl border border-white/10 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
              <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3">Optimization Vectors</p>
              <ul className="space-y-3 text-sm text-slate-300 font-medium">
                {insights.suggestions.map((s,i)=>(
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500 text-lg leading-none">›</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Right: Terminal Chat */}
      <div className="lg:col-span-2 glass-card rounded-[2rem] flex flex-col h-full overflow-hidden border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.05)]">
        <div className="p-5 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">Gemini Console</h3>
              <p className="text-xs text-cyan-400 font-mono">Status: Connected [Port 5000]</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-[#020617]/50 custom-scrollbar flex flex-col gap-5">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role==='ai' ? 'justify-start' : 'justify-end'} animate-fade-up`}>
              <div className={`p-4 rounded-2xl max-w-[80%] text-sm font-medium leading-relaxed border ${m.role==='ai' ? 'bg-slate-800/80 text-slate-200 border-white/10 rounded-tl-sm' : 'bg-gradient-animated text-white border-transparent rounded-tr-sm shadow-[0_0_15px_rgba(99,102,241,0.3)]'}`}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-5 bg-white/5 border-t border-white/10">
          <div className="flex gap-3 mb-4 overflow-x-auto pb-2 custom-scrollbar">
            <button onClick={()=>handleChat(null, "Identify anomaly in spending.")} className="whitespace-nowrap bg-[#020617] border border-cyan-500/30 text-cyan-400 text-xs font-bold px-4 py-2 rounded-lg hover:bg-cyan-500 hover:text-white transition-colors uppercase tracking-wider">Detect Anomalies</button>
            <button onClick={()=>handleChat(null, "Calculate total Food metric.")} className="whitespace-nowrap bg-[#020617] border border-fuchsia-500/30 text-fuchsia-400 text-xs font-bold px-4 py-2 rounded-lg hover:bg-fuchsia-500 hover:text-white transition-colors uppercase tracking-wider">Food Total</button>
          </div>
          <form onSubmit={(e)=>handleChat(e)} className="flex gap-3">
            <input type="text" className="flex-1 p-4 text-sm bg-[#020617] border border-white/10 rounded-xl outline-none focus:border-cyan-500 text-white placeholder:text-slate-600 font-mono transition-all" placeholder="Enter logic query >_" value={chat} onChange={e=>setChat(e.target.value)} />
            <button type="submit" className="bg-cyan-500 text-[#020617] px-8 rounded-xl text-base font-black hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all">EXEC</button>
          </form>
        </div>
      </div>
    </div>
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
    <div className="max-w-5xl mx-auto space-y-8 w-full animate-fade-up">
      <div className="glass-card p-10 md:p-14 rounded-[3rem] flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full"></div>
        
        <div className="relative group cursor-pointer z-10" onClick={() => fileInputRef.current.click()}>
          <div className="w-36 h-36 rounded-full bg-[#020617] text-white font-black text-5xl flex items-center justify-center border-2 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)] overflow-hidden group-hover:border-cyan-400 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all">
            {uploading ? <div className="text-sm font-mono text-cyan-400 animate-pulse">SYNC...</div> : (user.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" alt="Profile" /> : user.name.charAt(0).toUpperCase())}
          </div>
          <div className="absolute bottom-1 right-1 bg-cyan-500 text-[#020617] p-2.5 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
          </div>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
        </div>
        
        <div className="text-center md:text-left flex-1 z-10">
          <h1 className="text-4xl font-black text-white mb-2 tracking-wide">{user.name}</h1>
          <p className="text-lg text-slate-400 mb-6 font-mono">{user.email}</p>
          <div className="inline-block bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-sm backdrop-blur-md">Total Data Volume: <span className="text-cyan-400">₹{total.toLocaleString()}</span></div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-card p-10 rounded-3xl animate-fade-up delay-100">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">License Information</h2>
          <div className="bg-[#020617] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-500/10 blur-[30px] rounded-full"></div>
            <p className="text-xs font-bold text-fuchsia-400 uppercase tracking-widest mb-2 relative z-10">Current Node</p>
            <h3 className="text-2xl font-black text-white mb-2 relative z-10">Dev Mode (Free)</h3>
            <p className="text-sm text-slate-400 mb-6 font-medium relative z-10">Standard AI generation limits applied.</p>
            <button className="w-full bg-white/5 border border-white/10 text-white text-sm font-bold py-3.5 rounded-xl hover:bg-white/10 transition-colors relative z-10">Request Enterprise Key</button>
          </div>
        </div>
        
        <div className="glass-card p-10 rounded-3xl animate-fade-up delay-200 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-4">System Operations</h2>
            <p className="text-sm text-slate-400 mb-8 font-medium">Terminate current session and encrypt local storage.</p>
          </div>
          <button onClick={handleLogout} className="w-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold py-4 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] tracking-wider uppercase">
            Terminate Session
          </button>
        </div>
      </div>
    </div>
  );
};

// =====================================
// 📄 PUBLIC PAGE: FAQ
// =====================================
const FaqPage = () => {
  const faqs = [
    { q: "Is the database secure?", a: "Yes. All metrics are logged in a highly secure PostgreSQL instance hosted on Neon servers, linked exclusively to your user ID." },
    { q: "How does the Vision node work?", a: "SpendIO integrates Google's Gemini Multimodal AI. It actively analyzes image pixels to extract character data, numerical values, and context." },
    { q: "Can I retrieve my raw data?", a: "Affirmative. Dashboard capabilities allow for one-click CSV compilation and export for external spreadsheet software." },
  ];
  return (
    <div className="max-w-4xl mx-auto w-full py-12 animate-fade-up">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-white mb-4 tracking-wide">Knowledge Base</h1>
        <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">System Documentation</p>
      </div>
      <div className="space-y-6">
        {faqs.map((f, i) => (
          <div key={i} className="p-8 rounded-3xl glass-card relative overflow-hidden group">
            <div className="absolute left-0 top-0 w-1 h-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors"></div>
            <h3 className="font-bold text-white mb-3 text-lg">{f.q}</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;