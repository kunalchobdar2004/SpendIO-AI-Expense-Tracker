import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

// =====================================
// 🎨 GLOBAL STYLES (WARM & ELEGANT THEME)
// =====================================
const GlobalStyles = () => (
  <style>{`
    body, html {
      margin: 0; padding: 0; width: 100%; min-height: 100%;
      background-color: #FAFAF9; /* Warm off-white */
      color: #292524; /* Stone 800 */
      font-family: 'Nunito', 'Inter', sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-up { animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .delay-100 { animation-delay: 0.15s; }
    .delay-200 { animation-delay: 0.3s; }
    
    /* Beautiful Soft Shadows */
    .soft-shadow { box-shadow: 0 20px 40px -15px rgba(0,0,0,0.05); }
    .hover-shadow:hover { box-shadow: 0 30px 60px -20px rgba(244, 63, 94, 0.15); transform: translateY(-3px); }
    
    /* Sunset Gradient Backgrounds */
    .bg-sunset { background: linear-gradient(135deg, #F43F5E, #F97316); }
    .text-sunset { background: linear-gradient(135deg, #F43F5E, #F97316); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #D6D3D1; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #A8A29E; }
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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-6 h-[80px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sunset text-white flex items-center justify-center font-black text-xl shadow-lg shadow-rose-200">S</div>
          <span className="text-2xl font-black tracking-tight text-stone-800">SpendIO</span>
        </Link>
        <nav className="hidden md:flex gap-8 items-center">
          {links.map(link => (
            <Link key={link.name} to={link.path} className={`text-base font-bold transition-all ${location.pathname === link.path ? 'text-rose-500' : 'text-stone-500 hover:text-rose-500'}`}>
              {link.name}
            </Link>
          ))}
          {!user && <Link to="/auth" className="ml-4 bg-sunset text-white px-8 py-3 rounded-xl text-sm font-bold hover-shadow transition-all">Get Started</Link>}
        </nav>
        {user && (
          <Link to="/profile" className="w-11 h-11 rounded-full bg-stone-100 text-rose-500 font-black flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-rose-400 transition-all cursor-pointer shadow-sm">
            {user.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" alt="Profile" /> : user.name.charAt(0).toUpperCase()}
          </Link>
        )}
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-stone-900 text-stone-400 py-16 mt-auto">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-sunset flex items-center justify-center text-white font-black text-sm">S</div>
          <span className="text-2xl font-black text-white">SpendIO</span>
        </div>
        <p className="text-base leading-relaxed max-w-sm text-stone-500 font-medium">
          A beautifully crafted financial tool. Let our AI handle the math, so you can focus on living your life.
        </p>
      </div>
      <div>
        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Platform</h4>
        <ul className="space-y-3 font-medium">
          <li><Link to="/" className="hover:text-rose-400 transition-colors">Features</Link></li>
          <li><Link to="/" className="hover:text-rose-400 transition-colors">Pricing</Link></li>
          <li><Link to="/faq" className="hover:text-rose-400 transition-colors">FAQ</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Legal</h4>
        <ul className="space-y-3 font-medium">
          <li><Link to="/" className="hover:text-rose-400 transition-colors">Privacy Policy</Link></li>
          <li><Link to="/" className="hover:text-rose-400 transition-colors">Terms of Service</Link></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-stone-800 text-center font-medium">
      <p>© 2026 SpendIO. Crafted beautifully for you.</p>
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
      <div className="min-h-screen flex flex-col selection:bg-rose-200 selection:text-rose-900">
        <Header user={user} handleLogout={handleLogout} />
        <main className="flex-grow flex flex-col w-full max-w-7xl mx-auto px-6 py-12">
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
// 🌟 PAGE 1: HOME PAGE (Warm & Fresh)
// =====================================
const HomePage = ({ user }) => {
  return (
    <div className="flex flex-col animate-slide-up w-full h-full pb-10">
      {/* Decorative Warm Blobs */}
      <div className="fixed top-[-10%] right-[-5%] w-[400px] h-[400px] bg-rose-200/50 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-orange-200/50 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto pt-16 pb-24">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-rose-100 text-rose-600 font-bold mb-8 shadow-sm">
          <span className="text-xl">✨</span> Discover SpendIO 2.0
        </div>
        <h1 className="text-6xl md:text-7xl font-black mb-8 leading-[1.1] text-stone-800">
          Tracking money shouldn't <br/> feel like <span className="text-sunset">homework.</span>
        </h1>
        <p className="text-xl text-stone-500 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
          Simply take a photo of your receipt and let our AI categorize it. Chat with your expenses like a friend. Beautiful, simple, and incredibly smart.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to={user ? "/dashboard" : "/auth"} className="bg-sunset text-white text-lg font-black py-4 px-10 rounded-2xl hover-shadow transition-all">
            {user ? "Open Dashboard" : "Start For Free"}
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[2.5rem] soft-shadow hover-shadow transition-all border border-stone-100">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-8 shadow-inner text-3xl">📸</div>
            <h3 className="text-2xl font-black mb-3 text-stone-800">Snap & Save</h3>
            <p className="text-stone-500 font-medium leading-relaxed">No more manual entry. Take a picture of your bill and our AI extracts the exact amount and category magically.</p>
          </div>
          
          <div className="bg-white p-10 rounded-[2.5rem] soft-shadow hover-shadow transition-all border border-stone-100">
            <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mb-8 shadow-inner text-3xl">💬</div>
            <h3 className="text-2xl font-black mb-3 text-stone-800">Chat with Data</h3>
            <p className="text-stone-500 font-medium leading-relaxed">Ask questions in plain English like "Where did I spend the most?" and get instant, accurate answers.</p>
          </div>
          
          <div className="bg-white p-10 rounded-[2.5rem] soft-shadow hover-shadow transition-all border border-stone-100">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mb-8 shadow-inner text-3xl">📊</div>
            <h3 className="text-2xl font-black mb-3 text-stone-800">Beautiful Charts</h3>
            <p className="text-stone-500 font-medium leading-relaxed">See where your money goes with stunning, colorful charts that make budgeting an absolute joy.</p>
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
      <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem] soft-shadow border border-stone-100 animate-slide-up">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto bg-sunset text-white rounded-3xl flex items-center justify-center text-3xl font-black mb-6 shadow-lg shadow-rose-200">S</div>
          <h2 className="text-3xl font-black text-stone-800">{isLogin ? "Welcome Back" : "Join SpendIO"}</h2>
          <p className="text-stone-500 font-medium mt-2">Your beautiful financial journey begins here.</p>
        </div>
        
        <div className="flex bg-stone-100 p-1.5 rounded-2xl mb-8">
          <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${isLogin ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-400'}`}>Log In</button>
          <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${!isLogin ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-400'}`}>Sign Up</button>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {!isLogin && <input type="text" required placeholder="Full Name" className="w-full p-4 font-bold text-stone-700 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-rose-400 focus:bg-white focus:ring-4 ring-rose-50 transition-all placeholder:font-medium" onChange={e=>setForm({...form, name:e.target.value})} />}
          <input type="email" required placeholder="Email Address" className="w-full p-4 font-bold text-stone-700 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-rose-400 focus:bg-white focus:ring-4 ring-rose-50 transition-all placeholder:font-medium" onChange={e=>setForm({...form, email:e.target.value})} />
          <input type="password" required placeholder="Password" className="w-full p-4 font-bold text-stone-700 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-rose-400 focus:bg-white focus:ring-4 ring-rose-50 transition-all placeholder:font-medium" onChange={e=>setForm({...form, password:e.target.value})} />
          <button type="submit" disabled={loading} className="w-full bg-sunset text-white text-lg font-black py-4 rounded-2xl hover-shadow transition-all disabled:opacity-70 mt-2">
            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
          </button>
        </form>
      </div>
    </div>
  );
};

// =====================================
// 📄 PROTECTED PAGE: DASHBOARD (Warm & Clean)
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
    if (!window.confirm("Are you sure you want to delete this?")) return;
    await fetch(`https://spendio-ai-expense-tracker.onrender.com/api/expenses/${id}`, { method: "DELETE" });
    fetchHistory();
  };

  const handleExportCSV = () => {
    const headers = ["Date", "Category", "Description", "Amount"];
    const rows = history.map(item => [new Date(item.date).toLocaleDateString(), item.category, item.description, item.amount]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "SpendIO_Data.csv");
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const totalExpenses = history.reduce((sum, item) => sum + Number(item.amount), 0);
  const budgetPercentage = (totalExpenses / budget) * 100;
  const chartData = history.reduce((acc, curr) => {
    const ex = acc.find(item => item.name === curr.category);
    if (ex) ex.value += Number(curr.amount); else acc.push({ name: curr.category, value: Number(curr.amount) });
    return acc;
  }, []);
  
  // Warm, elegant chart colors
  const COLORS = ["#F43F5E", "#F97316", "#10B981", "#8B5CF6", "#FBBF24"];

  return (
    <div className="grid lg:grid-cols-3 gap-8 animate-slide-up">
      {/* Left Column: Form */}
      <div className="lg:col-span-1">
        <div className="bg-white p-8 rounded-[2.5rem] soft-shadow border border-stone-100 sticky top-28">
          <h2 className="text-2xl font-black text-stone-800 mb-6 flex items-center gap-3">
            <span className="text-3xl">{editingId ? "✏️" : "💸"}</span>
            {editingId ? "Edit Expense" : "Add Expense"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-stone-500 mb-1 ml-1">Amount (₹)</label>
              <input type="number" required className="w-full p-4 font-black text-stone-800 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-rose-400 focus:bg-white focus:ring-4 ring-rose-50 transition-all text-lg" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-500 mb-1 ml-1">Category</label>
              <select className="w-full p-4 font-bold text-stone-700 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-rose-400 focus:bg-white focus:ring-4 ring-rose-50 transition-all" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option>Food</option><option>Transport</option><option>Utilities</option><option>Shopping</option><option>Entertainment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-500 mb-1 ml-1">Description</label>
              <input type="text" placeholder="e.g. Coffee" className="w-full p-4 font-bold text-stone-700 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-rose-400 focus:bg-white focus:ring-4 ring-rose-50 transition-all" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-500 mb-1 ml-1">Date</label>
              <input type="date" required className="w-full p-4 font-bold text-stone-700 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:border-rose-400 focus:bg-white focus:ring-4 ring-rose-50 transition-all" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className={`flex-1 text-white text-lg font-black py-4 rounded-2xl hover-shadow transition-all ${editingId ? 'bg-amber-500' : 'bg-sunset'}`}>
                {editingId ? "Update" : "Save"}
              </button>
              {editingId && (
                <button type="button" onClick={()=>{setEditingId(null); setForm({ amount: "", category: "Food", description: "", date: "" });}} className="bg-stone-100 text-stone-600 font-bold px-6 rounded-2xl hover:bg-stone-200 transition-colors">Cancel</button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Right Column: Analytics & List */}
      <div className="lg:col-span-2 flex flex-col gap-8 delay-100 animate-slide-up">
        
        {/* Top Widgets */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] soft-shadow border border-stone-100 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-[40px] opacity-60"></div>
            <div className="flex justify-between items-center mb-6 relative z-10">
              <p className="text-sm font-black uppercase tracking-widest text-emerald-600">Total Spend</p>
              <button onClick={() => { const b = prompt("Set your budget (₹):", budget); if(b && !isNaN(b)) { setBudget(Number(b)); localStorage.setItem("userBudget", Number(b)); } }} className="text-xs bg-emerald-50 text-emerald-600 px-3 py-2 rounded-lg font-bold hover:bg-emerald-100 transition-colors">Edit Limit</button>
            </div>
            <h3 className="text-5xl font-black text-stone-800 mb-2 relative z-10">₹{totalExpenses.toLocaleString()}</h3>
            <p className="text-sm text-stone-500 font-bold relative z-10">out of ₹{budget.toLocaleString()} limit</p>
            
            <div className="w-full h-3 rounded-full mt-8 bg-stone-100 overflow-hidden relative z-10">
              <div className={`h-full rounded-full transition-all duration-1000 ${budgetPercentage > 90 ? "bg-rose-500" : "bg-emerald-400"}`} style={{ width: `${Math.min(budgetPercentage, 100)}%` }}></div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] soft-shadow border border-stone-100 flex flex-col justify-center items-center relative">
            <h3 className="text-sm font-black text-stone-800 absolute top-8 left-8">Where it goes</h3>
            {chartData.length > 0 ? (
              <div className="w-full h-[180px] mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none">
                      {chartData.map((e, i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-stone-400 font-bold mt-8">No data to display.</p>
            )}
            <button onClick={handleExportCSV} className="absolute bottom-6 right-6 text-sm font-black text-orange-500 bg-orange-50 px-4 py-2 rounded-xl hover:bg-orange-100 transition-colors">📥 Export</button>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white p-8 rounded-[2.5rem] soft-shadow border border-stone-100">
          <h2 className="text-2xl font-black text-stone-800 mb-6 border-b border-stone-100 pb-4">History</h2>
          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-stone-50 border border-transparent hover:border-rose-100 hover:bg-rose-50/50 transition-all group flex justify-between items-center cursor-pointer">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl">
                      {item.category === 'Food' ? '🍔' : item.category === 'Transport' ? '🚕' : item.category === 'Shopping' ? '🛍️' : item.category === 'Entertainment' ? '🍿' : '⚡'}
                    </div>
                    <div>
                      <p className="font-black text-lg text-stone-800 leading-tight">{item.description || item.category}</p>
                      <p className="text-sm text-stone-500 font-bold mt-1">{new Date(item.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <p className="font-black text-xl text-stone-800">₹{item.amount}</p>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(item)} className="p-2.5 rounded-xl bg-indigo-50 text-indigo-500 hover:bg-indigo-100 transition-colors shadow-sm">✏️</button>
                      <button onClick={() => handleDelete(item.id)} className="p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors shadow-sm">🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-12">
               <p className="text-5xl mb-4">🌱</p>
               <p className="text-stone-500 font-bold text-lg">Your canvas is empty. Add a transaction!</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =====================================
// 📄 PROTECTED PAGE: SCAN BILL (Clean Upload Zone)
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
        alert("Oh no! Couldn't scan the image. Make sure it's clear."); 
      }
      setLoading(false);
    };
  };

  return (
    <div className="max-w-3xl mx-auto w-full animate-slide-up flex flex-col items-center justify-center py-10">
      <div className="bg-white p-12 md:p-16 rounded-[3rem] w-full text-center soft-shadow border border-stone-100 relative overflow-hidden">
        
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-100 rounded-full blur-[40px]"></div>

        <div className="w-20 h-20 mx-auto bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-inner relative z-10">📸</div>
        <h1 className="text-3xl font-black text-stone-800 mb-3 relative z-10">Smart Scanner</h1>
        <p className="text-base text-stone-500 mb-10 font-bold relative z-10">Upload any receipt and let AI do the data entry.</p>
        
        <div className="relative border-4 border-dashed border-stone-200 rounded-[2.5rem] bg-stone-50 hover:bg-stone-100/50 hover:border-orange-300 transition-all group overflow-hidden mx-auto">
          <div className="p-16 flex flex-col items-center justify-center">
            {loading ? (
              <>
                <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-6"></div>
                <p className="text-lg font-black text-orange-500 animate-pulse">Reading Receipt...</p>
              </>
            ) : (
              <>
                <p className="text-6xl mb-6 group-hover:scale-110 transition-transform">📄</p>
                <label className="bg-white text-stone-800 border border-stone-200 text-base font-black px-8 py-4 rounded-2xl cursor-pointer shadow-sm hover:shadow-md transition-all">
                  Choose Image
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
                <p className="text-sm text-stone-400 mt-6 font-bold uppercase tracking-widest">JPG, PNG • Under 5MB</p>
              </>
            )}
          </div>
        </div>

        {result && (
          <div className="mt-10 inline-flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-600 px-6 py-4 rounded-2xl text-lg font-black animate-slide-up">
            <span className="text-2xl">🎉</span> Added: ₹{result.amount} for {result.category}
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================
// 📄 PROTECTED PAGE: AI ADVISOR (Warm Chat UI)
// =====================================
const AiPage = ({ user, history }) => {
  const [insights, setInsights] = useState(null);
  const [chat, setChat] = useState("");
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hi there! I am your AI assistant. How can I help you understand your spending today? 👋' }]);
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
    } catch (err) { alert("Couldn't generate report right now."); }
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
      setMessages(p => [...p, { role: 'ai', text: "Oops, connection error!" }]);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 h-[75vh] animate-slide-up">
      {/* Left: AI Report Panel */}
      <div className="lg:col-span-1 bg-white rounded-[2.5rem] p-8 flex flex-col h-full overflow-y-auto soft-shadow border border-stone-100">
        <h2 className="text-2xl font-black text-stone-800 mb-2">Smart Report</h2>
        <p className="text-sm text-stone-500 mb-8 font-bold">Get a summary of your financial health.</p>
        
        <button onClick={fetchReport} disabled={loadingInsights} className="w-full bg-violet-50 text-violet-600 border border-violet-100 hover:bg-violet-100 text-base font-black py-4 rounded-2xl mb-6 transition-all disabled:opacity-50">
          {loadingInsights ? "Thinking..." : "Generate Analysis ✨"}
        </button>
        
        {insights && (
          <div className="space-y-6 flex-1 animate-slide-up mt-2">
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
              <p className="text-sm font-black text-violet-500 uppercase tracking-widest mb-3">Overview</p>
              <p className="text-base text-stone-700 leading-relaxed font-bold">{insights.summary}</p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
              <p className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-3">Tips for you</p>
              <ul className="space-y-3 text-base text-emerald-900 font-bold">
                {insights.suggestions.map((s,i)=>(
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-emerald-500">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Right: Modern Chat */}
      <div className="lg:col-span-2 bg-white rounded-[2.5rem] flex flex-col h-full overflow-hidden soft-shadow border border-stone-100">
        <div className="p-6 border-b border-stone-100 flex items-center gap-4 bg-white z-10">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center text-2xl shadow-inner">🤖</div>
          <div>
            <h3 className="text-lg font-black text-stone-800">SpendIO Assistant</h3>
            <p className="text-sm text-stone-500 font-bold">Online and ready</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-stone-50/50 custom-scrollbar flex flex-col gap-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role==='ai' ? 'justify-start' : 'justify-end'} animate-slide-up`}>
              <div className={`p-5 rounded-[1.5rem] max-w-[80%] text-base font-bold leading-relaxed shadow-sm ${m.role==='ai' ? 'bg-white text-stone-700 border border-stone-200 rounded-tl-sm' : 'bg-sunset text-white border-transparent rounded-tr-sm'}`}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-6 bg-white border-t border-stone-100">
          <div className="flex gap-3 mb-4 overflow-x-auto pb-2 custom-scrollbar">
            <button onClick={()=>handleChat(null, "What's my biggest expense?")} className="whitespace-nowrap bg-stone-100 text-stone-600 text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-stone-200 transition-colors">Biggest expense?</button>
            <button onClick={()=>handleChat(null, "How much did I spend on Food?")} className="whitespace-nowrap bg-stone-100 text-stone-600 text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-stone-200 transition-colors">Food total?</button>
          </div>
          <form onSubmit={(e)=>handleChat(e)} className="flex gap-3">
            <input type="text" className="flex-1 p-5 text-base bg-stone-100 border-none rounded-2xl outline-none focus:ring-4 ring-rose-100 text-stone-800 placeholder:text-stone-400 font-bold transition-all" placeholder="Ask anything..." value={chat} onChange={e=>setChat(e.target.value)} />
            <button type="submit" className="bg-stone-800 text-white px-8 rounded-2xl text-lg font-black hover:bg-stone-900 transition-all shadow-md">Send</button>
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
    <div className="max-w-5xl mx-auto space-y-8 w-full animate-slide-up">
      <div className="bg-white p-10 md:p-14 rounded-[3rem] soft-shadow border border-stone-100 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
        
        <div className="relative group cursor-pointer z-10" onClick={() => fileInputRef.current.click()}>
          <div className="w-40 h-40 rounded-full bg-stone-100 text-stone-400 font-black text-5xl flex items-center justify-center border-4 border-white shadow-lg overflow-hidden group-hover:border-rose-200 transition-all">
            {uploading ? <div className="text-sm font-bold text-rose-500">Wait...</div> : (user.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" alt="Profile" /> : user.name.charAt(0).toUpperCase())}
          </div>
          <div className="absolute bottom-2 right-2 bg-white text-stone-700 p-3 rounded-full shadow-md border border-stone-100 text-xl">📷</div>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
        </div>
        
        <div className="text-center md:text-left flex-1 z-10">
          <h1 className="text-4xl font-black text-stone-800 mb-2">{user.name}</h1>
          <p className="text-lg text-stone-500 mb-6 font-bold">{user.email}</p>
          <div className="inline-block bg-orange-50 text-orange-600 px-6 py-3 rounded-2xl text-base font-black shadow-sm border border-orange-100">Tracked: ₹{total.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] soft-shadow border border-stone-100 animate-slide-up delay-100">
          <h2 className="text-2xl font-black text-stone-800 mb-6 border-b border-stone-100 pb-4">Subscription</h2>
          <div className="bg-stone-50 p-8 rounded-3xl border border-stone-200">
            <p className="text-sm font-black text-rose-500 uppercase tracking-widest mb-2">Current Plan</p>
            <h3 className="text-3xl font-black text-stone-800 mb-2">Basic (Free)</h3>
            <p className="text-base text-stone-500 mb-8 font-bold">Unlimited manual entries. Standard AI limits.</p>
            <button className="w-full bg-white border-2 border-stone-200 text-stone-800 text-lg font-black py-4 rounded-2xl hover:border-stone-300 transition-colors shadow-sm">View Pro Plans</button>
          </div>
        </div>
        
        <div className="bg-white p-10 rounded-[3rem] soft-shadow border border-stone-100 animate-slide-up delay-200 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-black text-stone-800 mb-4 border-b border-stone-100 pb-4">Settings</h2>
            <p className="text-base text-stone-500 mb-8 font-bold">Log out from this device to secure your data.</p>
          </div>
          <button onClick={handleLogout} className="w-full bg-red-50 text-red-500 text-lg font-black py-5 rounded-2xl hover:bg-red-100 transition-all">
            Log Out Securely
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
    { q: "Is my financial data safe?", a: "Absolutely. We use enterprise-grade PostgreSQL to store your data securely, and it's strictly linked to your account." },
    { q: "How accurate is the receipt scanner?", a: "Very! It uses Google's latest Gemini AI Vision model to extract numbers and context from images." },
    { q: "Can I download my data?", a: "Yes, you can export your entire transaction history to CSV format with a single click in your dashboard." },
  ];
  return (
    <div className="max-w-4xl mx-auto w-full py-12 animate-slide-up">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-stone-800 mb-4">Questions?</h1>
        <p className="text-stone-500 font-bold text-lg">We've got answers.</p>
      </div>
      <div className="space-y-6">
        {faqs.map((f, i) => (
          <div key={i} className="p-8 rounded-[2rem] bg-white soft-shadow border border-stone-100">
            <h3 className="font-black text-stone-800 mb-3 text-xl">{f.q}</h3>
            <p className="text-base text-stone-600 font-medium leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;