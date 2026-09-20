import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

// =====================================
// 🎨 GLOBAL STYLES (CLEAN & MINIMAL)
// =====================================
const GlobalStyles = () => (
  <style>{`
    body, html {
      margin: 0; padding: 0; width: 100%; min-height: 100%;
      background-color: #FAFAFA; color: #0F172A; font-family: 'Inter', system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-up { animation: fadeUp 0.5s ease-out forwards; }
    .delay-100 { animation-delay: 0.1s; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
    
    /* Document Scanner Laser Animation */
    @keyframes scanLaser {
      0% { top: 0; opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }
    .laser-line {
      position: absolute; left: 0; right: 0; height: 2px;
      background: #3B82F6; box-shadow: 0 0 10px #3B82F6;
      animation: scanLaser 2s infinite linear;
    }
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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">S</div>
          <span className="text-xl font-bold tracking-tight text-slate-900">SpendIO</span>
        </Link>
        <nav className="hidden md:flex gap-8 items-center">
          {links.map(link => (
            <Link key={link.name} to={link.path} className={`text-sm font-semibold transition-colors ${location.pathname === link.path ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>
              {link.name}
            </Link>
          ))}
          {!user && <Link to="/auth" className="ml-4 bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors">Sign In</Link>}
        </nav>
        {user && (
          <Link to="/profile" className="w-9 h-9 rounded-full bg-slate-100 text-indigo-600 font-bold flex items-center justify-center border border-slate-200 overflow-hidden hover:ring-2 ring-indigo-500 ring-offset-2 transition-all">
            {user.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" alt="Profile" /> : user.name.charAt(0).toUpperCase()}
          </Link>
        )}
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-[#0B0F19] text-slate-400 py-12 mt-auto border-t border-slate-800">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">S</div>
          <span className="text-lg font-bold text-white">SpendIO</span>
        </div>
        <p className="text-sm leading-relaxed max-w-sm text-slate-500">
          Intelligent expense management for modern professionals. Powered by advanced AI to help you track, analyze, and optimize your financial life.
        </p>
      </div>
      <div>
        <h4 className="text-slate-50 font-semibold mb-4 text-sm uppercase tracking-wider">Product</h4>
        <ul className="space-y-3 text-sm">
          <li><Link to="/" className="hover:text-white transition-colors">Features</Link></li>
          <li><Link to="/" className="hover:text-white transition-colors">Pricing</Link></li>
          <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-slate-50 font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
        <ul className="space-y-3 text-sm">
          <li><Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          <li><Link to="/" className="hover:text-white transition-colors">Terms of Service</Link></li>
          <li><Link to="/" className="hover:text-white transition-colors">Contact Us</Link></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
      <p>© 2026 SpendIO. All rights reserved.</p>
      <p>Designed with precision.</p>
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
      <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
        <Header user={user} handleLogout={handleLogout} />
        <main className="flex-grow flex flex-col w-full max-w-7xl mx-auto px-6 py-8">
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
// 🌟 PAGE 1: HOME PAGE (SaaS Professional Look)
// =====================================
const HomePage = ({ user }) => {
  return (
    <div className="flex flex-col animate-fade-up w-full h-full pb-10">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 pt-12 pb-24 border-b border-slate-200">
        <div className="flex-1 md:pr-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span> SpendIO Version 2.0
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-slate-900 leading-tight">
            Financial clarity, <br/>
            <span className="text-indigo-600">powered by AI.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
            Automate your expense tracking. Scan receipts instantly, visualize your cash flow, and ask complex financial questions to your personal AI assistant.
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <Link to={user ? "/dashboard" : "/auth"} className="bg-slate-900 text-white text-sm font-semibold py-3 px-8 rounded-lg hover:bg-slate-800 transition-all shadow-sm">
              {user ? "Go to Dashboard" : "Get Started Free"}
            </Link>
            <Link to="/faq" className="bg-white text-slate-700 border border-slate-200 text-sm font-semibold py-3 px-8 rounded-lg hover:bg-slate-50 transition-all">
              Learn More
            </Link>
          </div>
        </div>
        
        {/* Abstract UI Mockup */}
        <div className="flex-1 w-full max-w-lg hidden md:block relative">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 relative z-10 transform translate-x-4">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <div className="font-semibold text-slate-900">Total Balance</div>
              <div className="text-indigo-600 font-bold">₹24,500.00</div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                    <div className="space-y-1">
                      <div className="w-20 h-3 bg-slate-200 rounded"></div>
                      <div className="w-12 h-2 bg-slate-100 rounded"></div>
                    </div>
                  </div>
                  <div className="w-16 h-3 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
          {/* Decorative background element */}
          <div className="absolute inset-0 bg-indigo-50 rounded-3xl transform rotate-3 -z-10 scale-105"></div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to manage money</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">SpendIO combines traditional expense tracking with cutting-edge AI to eliminate manual data entry.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-6 border border-indigo-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-900">Automated Extraction</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Upload any receipt or invoice. Our AI Vision model extracts the exact amount and categorizes it instantly.</p>
          </div>
          <div className="p-8 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-slate-50 text-slate-700 rounded-lg flex items-center justify-center mb-6 border border-slate-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-900">Conversational AI</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Chat directly with your database. Ask "How much did I spend on cabs this week?" and get precise answers.</p>
          </div>
          <div className="p-8 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-slate-50 text-slate-700 rounded-lg flex items-center justify-center mb-6 border border-slate-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-900">Visual Analytics</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Track your monthly budgets with clean, beautiful charts and easily export your data for tax season.</p>
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
    <div className="w-full flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-fade-up">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto bg-indigo-600 text-white rounded flex items-center justify-center text-xl font-bold mb-4">S</div>
          <h2 className="text-2xl font-bold text-slate-900">{isLogin ? "Sign in to SpendIO" : "Create an account"}</h2>
          <p className="text-slate-500 text-sm mt-2">Enter your details below to continue.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
          <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${isLogin ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Log in</button>
          <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${!isLogin ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Sign up</button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {!isLogin && <input type="text" required placeholder="Full Name" className="w-full p-3 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" onChange={e=>setForm({...form, name:e.target.value})} />}
          <input type="email" required placeholder="Email Address" className="w-full p-3 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" onChange={e=>setForm({...form, email:e.target.value})} />
          <input type="password" required placeholder="Password" className="w-full p-3 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" onChange={e=>setForm({...form, password:e.target.value})} />
          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white text-sm font-semibold py-3 rounded-lg hover:bg-slate-800 transition-all disabled:opacity-70 mt-4">
            {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
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
    if (!window.confirm("Delete this transaction?")) return;
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

  const totalExpenses = history.reduce((sum, item) => sum + Number(item.amount), 0);
  const budgetPercentage = (totalExpenses / budget) * 100;
  const chartData = history.reduce((acc, curr) => {
    const ex = acc.find(item => item.name === curr.category);
    if (ex) ex.value += Number(curr.amount); else acc.push({ name: curr.category, value: Number(curr.amount) });
    return acc;
  }, []);
  const COLORS = ["#4F46E5", "#0EA5E9", "#10B981", "#F59E0B", "#8B5CF6"];

  return (
    <div className="grid lg:grid-cols-3 gap-6 animate-fade-up">
      {/* Left Column: Form */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
          <h2 className="text-lg font-bold text-slate-900 mb-5 border-b border-slate-100 pb-3">
            {editingId ? "Edit Transaction" : "New Transaction"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Amount (₹)</label>
              <input type="number" required className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
              <select className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option>Food</option><option>Transport</option><option>Utilities</option><option>Shopping</option><option>Entertainment</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
              <input type="text" placeholder="e.g. Uber ride" className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Date</label>
              <input type="date" required className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 text-slate-700" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 bg-slate-900 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-slate-800 transition-all">
                {editingId ? "Save Changes" : "Add Record"}
              </button>
              {editingId && (
                <button type="button" onClick={()=>{setEditingId(null); setForm({ amount: "", category: "Food", description: "", date: "" });}} className="bg-slate-100 text-slate-600 text-sm font-semibold px-4 rounded-lg hover:bg-slate-200">Cancel</button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Right Column: Analytics & List */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-slate-500">Monthly Expenses</p>
              <button onClick={() => { const b = prompt("Update Budget Limit:", budget); if(b && !isNaN(b)) { setBudget(Number(b)); localStorage.setItem("userBudget", Number(b)); } }} className="text-xs font-medium text-indigo-600 hover:underline">Edit Budget</button>
            </div>
            <h3 className="text-4xl font-bold text-slate-900 mb-1">₹{totalExpenses.toLocaleString()}</h3>
            <p className="text-xs text-slate-500">of ₹{budget.toLocaleString()} budget</p>
            <div className="w-full h-2 rounded-full mt-4 bg-slate-100 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${budgetPercentage > 90 ? "bg-red-500" : "bg-indigo-500"}`} style={{ width: `${Math.min(budgetPercentage, 100)}%` }}></div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center">
            {chartData.length > 0 ? (
              <div className="w-full h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                      {chartData.map((e, i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-slate-400">No chart data</p>
            )}
            <button onClick={handleExportCSV} className="mt-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded hover:bg-slate-100 border border-slate-200">Export CSV</button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Recent Transactions</h2>
          {history.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {history.map((item) => (
                <div key={item.id} className="py-3 flex justify-between items-center group">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                      {item.category.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{item.description || item.category}</p>
                      <p className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-sm text-slate-900">₹{item.amount}</p>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(item)} className="text-xs text-indigo-600 hover:underline font-medium">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-xs text-red-600 hover:underline font-medium">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-center text-sm text-slate-500 py-4">No records found. Start adding expenses.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// =====================================
// 📄 PROTECTED PAGE: SCAN BILL (Professional UI)
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
        alert("Scan Failed! Please ensure the image is clear and under 5MB."); 
      }
      setLoading(false);
    };
  };

  return (
    <div className="max-w-3xl mx-auto w-full animate-fade-up">
      <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Document Scanner</h1>
        <p className="text-sm text-slate-500 mb-8">Upload a receipt or invoice. AI will extract the details automatically.</p>
        
        <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group overflow-hidden">
          {loading && <div className="laser-line"></div>}
          
          <div className="p-16 flex flex-col items-center justify-center">
            {loading ? (
              <>
                <svg className="w-10 h-10 text-indigo-500 animate-spin mb-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <p className="text-sm font-semibold text-slate-600">Processing Document...</p>
              </>
            ) : (
              <>
                <svg className="w-12 h-12 text-slate-400 mb-4 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                <p className="text-sm font-medium text-slate-700 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-500 mb-4">PNG, JPG, JPEG up to 5MB</p>
                <label className="bg-white border border-slate-200 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-50 shadow-sm">
                  Select File
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
              </>
            )}
          </div>
        </div>

        {result && (
          <div className="mt-8 bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 animate-fade-up">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            Successfully logged: ₹{result.amount} under '{result.category}'
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================
// 📄 PROTECTED PAGE: AI ADVISOR (Chat Interface)
// =====================================
const AiPage = ({ user, history }) => {
  const [insights, setInsights] = useState(null);
  const [chat, setChat] = useState("");
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hello. I am your AI Financial Assistant. How can I analyze your data today?' }]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const fetchReport = async () => {
    setLoadingInsights(true);
    try {
      const res = await fetch(`https://spendio-ai-expense-tracker.onrender.com/api/insights/${user.id}`);
      if(!res.ok) throw new Error("API Failed");
      setInsights(await res.json());
    } catch (err) { alert("Report generation failed."); }
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
      setMessages(p => [...p, { role: 'ai', text: "Connection error." }]);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[75vh] animate-fade-up">
      {/* Left: Summary Panel */}
      <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-full overflow-y-auto">
        <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">AI Analysis</h2>
        <p className="text-sm text-slate-500 mb-6">Generate a comprehensive summary of your spending patterns.</p>
        
        <button onClick={fetchReport} disabled={loadingInsights} className="w-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-sm font-semibold py-2.5 rounded-lg mb-6 hover:bg-indigo-100 transition-colors disabled:opacity-50">
          {loadingInsights ? "Analyzing Data..." : "Generate Monthly Report"}
        </button>
        
        {insights && (
          <div className="space-y-4 flex-1 animate-fade-up">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Executive Summary</p>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">{insights.summary}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recommendations</p>
              <ul className="space-y-2">
                {insights.suggestions.map((s,i)=>(
                  <li key={i} className="text-sm text-slate-700 flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-indigo-500 mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Right: Chat Terminal */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">SpendIO Assistant</h3>
            <p className="text-xs text-slate-500">Connected to your financial database</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role==='ai' ? 'justify-start' : 'justify-end'}`}>
              <div className={`p-3.5 rounded-xl max-w-[80%] text-sm leading-relaxed ${m.role==='ai' ? 'bg-slate-100 text-slate-800 rounded-tl-sm' : 'bg-indigo-600 text-white rounded-tr-sm shadow-sm'}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1 custom-scrollbar">
            <button onClick={()=>handleChat(null, "Summarize my top expenses.")} className="whitespace-nowrap bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors">Top expenses?</button>
            <button onClick={()=>handleChat(null, "How much did I spend on Food?")} className="whitespace-nowrap bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors">Food total?</button>
          </div>
          <form onSubmit={(e)=>handleChat(e)} className="flex gap-2">
            <input type="text" className="flex-1 p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 transition-colors" placeholder="Ask about your spending..." value={chat} onChange={e=>setChat(e.target.value)} />
            <button type="submit" className="bg-slate-900 text-white px-5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors">Send</button>
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
    <div className="max-w-4xl mx-auto space-y-6 w-full animate-fade-up">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
          <div className="w-28 h-28 rounded-full bg-slate-100 text-slate-400 font-bold text-3xl flex items-center justify-center border-4 border-white shadow-md overflow-hidden group-hover:ring-4 ring-indigo-50 transition-all">
            {uploading ? <div className="text-xs">Loading...</div> : (user.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" alt="Profile" /> : user.name.charAt(0).toUpperCase())}
          </div>
          <div className="absolute bottom-0 right-0 bg-white border border-slate-200 text-slate-600 p-1.5 rounded-full shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
          </div>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
          <p className="text-sm text-slate-500 mb-4">{user.email}</p>
          <div className="inline-block bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold border border-slate-200">Total Tracked: ₹{total.toLocaleString()}</div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Plan Details</h2>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs font-bold text-indigo-600 uppercase mb-1">Current Plan</p>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Starter Free</h3>
            <p className="text-xs text-slate-500 mb-4">Basic AI scans and local tracking.</p>
            <button className="w-full bg-white border border-slate-200 text-slate-700 text-sm font-semibold py-2 rounded-lg hover:bg-slate-50">View Upgrade Options</button>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Account Actions</h2>
            <p className="text-sm text-slate-500 mb-4">Manage your session and data.</p>
          </div>
          <button onClick={handleLogout} className="w-full bg-white border border-red-200 text-red-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-red-50 transition-colors">
            Sign Out Securely
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
    { q: "How secure is my data?", a: "Your data is stored in a secure PostgreSQL database. We use industry-standard encryption and do not share your raw data with third parties." },
    { q: "How does the scanner work?", a: "It utilizes Google's Gemini Vision model to intelligently parse text from images, extracting numbers and categorizing them automatically." },
    { q: "Can I export my data?", a: "Yes, you can export all your transaction history as a CSV file anytime from the Dashboard." },
  ];
  return (
    <div className="max-w-3xl mx-auto w-full py-8 animate-fade-up">
      <h1 className="text-3xl font-bold mb-8 text-slate-900 text-center">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-2">{f.q}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;