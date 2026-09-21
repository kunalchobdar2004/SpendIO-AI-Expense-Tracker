import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const GlobalStyles = () => (
  <style>{`
    body, html {
      margin: 0; padding: 0; width: 100%; min-height: 100%;
      background-color: #050B14;
      color: #f8fafc;
      font-family: 'Inter', sans-serif;
      overflow-x: hidden;
    }
    
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    
    .glass-card {
      background: rgba(15, 23, 42, 0.65) !important;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      color: white !important;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
    }
    .glass-card:hover {
      border-color: rgba(255, 255, 255, 0.2) !important;
      transform: translateY(-2px);
    }
    
    .glass-input {
      background: rgba(0, 0, 0, 0.4) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      color: white !important;
    }
    .glass-input::placeholder { color: rgba(255, 255, 255, 0.5); }
    .glass-input:focus { border-color: #38bdf8 !important; outline: none; box-shadow: 0 0 10px rgba(56, 189, 248, 0.3); }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }
  `}</style>
);

const ImageBackground = () => (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundImage: `url('/22001.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'left center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#050B14',
    zIndex: -10
  }}>
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(to right, rgba(5,11,20,0.85) 0%, rgba(5,11,20,0.5) 50%, rgba(5,11,20,0.85) 100%)'
    }}></div>
  </div>
);

const Header = ({ user }) => {
  const location = useLocation();
  const publicLinks = [{ name: "Home", path: "/" }, { name: "Features", path: "/features" }, { name: "FAQ", path: "/faq" }];
  const privateLinks = [{ name: "Dashboard", path: "/dashboard" }, { name: "Features", path: "/features" }, { name: "Scan Bill", path: "/scan" }, { name: "AI Advisor", path: "/ai" }];
  const links = user ? privateLinks : publicLinks;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-transparent transition-all" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%)' }}>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[70px] md:h-[80px] flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white flex items-center justify-center font-black text-lg md:text-xl shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform">S</div>
          <span className="text-xl md:text-2xl font-black tracking-tight text-white drop-shadow-md">SpendIO</span>
        </Link>
        
        <nav className="hidden md:flex gap-6 items-center">
          {links.map(link => (
            <Link key={link.name} to={link.path} className={`font-bold transition-all duration-300 hover:-translate-y-0.5 px-3 py-2 rounded-lg ${location.pathname === link.path ? 'bg-white/10 text-cyan-400 shadow-inner' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
              {link.name}
            </Link>
          ))}
          {!user && <Link to="/auth" className="ml-4 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-6 py-2.5 rounded-xl font-bold hover:bg-cyan-500 hover:text-[#050B14] hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all">Sign In</Link>}
        </nav>

        {user ? (
          <Link to="/profile" className="hidden md:flex w-10 h-10 rounded-full bg-slate-800 text-cyan-400 font-bold items-center justify-center border-2 border-white/20 hover:border-cyan-400 transition-all cursor-pointer overflow-hidden shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            {user.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" alt="Profile" /> : user.name.charAt(0).toUpperCase()}
          </Link>
        ) : (
          <Link to="/auth" className="md:hidden text-cyan-400 font-bold text-sm bg-cyan-500/10 px-4 py-2 rounded-lg border border-cyan-500/30">Sign In</Link>
        )}
      </div>
    </header>
  );
};

const MobileNav = ({ user }) => {
  const location = useLocation();
  const links = user 
    ? [
        { name: "Dash", path: "/dashboard", icon: "📊" },
        { name: "Scan", path: "/scan", icon: "📸" },
        { name: "AI", path: "/ai", icon: "🤖" },
        { name: "Profile", path: "/profile", icon: "👤" }
      ]
    : [
        { name: "Home", path: "/", icon: "🏠" },
        { name: "Features", path: "/features", icon: "✨" },
        { name: "FAQ", path: "/faq", icon: "❓" }
      ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-50 glass-card rounded-none border-t border-white/10 flex justify-around items-center p-3 pb-6">
      {links.map(link => (
        <Link key={link.name} to={link.path} className={`flex flex-col items-center gap-1 transition-all ${location.pathname === link.path ? 'text-cyan-400 scale-110' : 'text-slate-400 hover:text-white'}`}>
          <span className="text-xl">{link.icon}</span>
          <span className="text-[10px] font-bold">{link.name}</span>
        </Link>
      ))}
    </div>
  );
};

const Footer = () => (
  <footer className="pt-12 md:pt-16 pb-24 md:pb-8 mt-auto z-10 relative bg-black">
    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 shadow-[0_0_15px_rgba(255,255,255,0.2)]"></div>
    
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10 mb-8 md:mb-12 relative z-10">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-black shadow-lg">S</div>
          <span className="text-xl md:text-2xl font-black text-white tracking-tight">Spend<span className="text-cyan-400">IO</span></span>
        </div>
        <p className="text-slate-400 leading-relaxed max-w-sm font-medium text-sm md:text-base">The smartest AI-powered expense tracker. Take control of your financial future by letting AI do the heavy lifting.</p>
      </div>
      <div>
        <h4 className="text-white font-bold mb-3 md:mb-4 text-xs md:text-sm tracking-widest uppercase opacity-80">Product</h4>
        <ul className="space-y-2 md:space-y-3 font-medium text-slate-400 text-sm">
          <li><Link to="/features" className="hover:text-white cursor-pointer transition-colors">Features</Link></li>
          <li><Link to="/features" className="hover:text-white cursor-pointer transition-colors">API Access</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-3 md:mb-4 text-xs md:text-sm tracking-widest uppercase opacity-80">Company</h4>
        <ul className="space-y-2 md:space-y-3 font-medium text-slate-400 text-sm">
          <li><Link to="/features" className="hover:text-white cursor-pointer transition-colors">About Us</Link></li>
          <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm font-medium text-slate-500">
      <p>© 2026 SpendIO Technologies Inc.</p>
      <p className="mt-2 md:mt-0 flex items-center gap-2">Designed with <span className="text-red-500 text-base md:text-lg animate-pulse">❤️</span> by Kunal</p>
    </div>
  </footer>
);

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
      <div className="min-h-screen flex flex-col selection:bg-cyan-500/30 selection:text-white relative z-10">
        <ImageBackground />
        <Header user={user} handleLogout={handleLogout} />
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 z-10 pb-24 md:pb-10">
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/auth" element={!user ? <AuthPage setUser={setUser} /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} history={history} fetchHistory={fetchHistory} /> : <Navigate to="/auth" />} />
            <Route path="/scan" element={user ? <ScanPage user={user} fetchHistory={fetchHistory} /> : <Navigate to="/auth" />} />
            <Route path="/ai" element={user ? <AiPage user={user} history={history} /> : <Navigate to="/auth" />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/profile" element={user ? <ProfilePage user={user} setUser={setUser} history={history} handleLogout={handleLogout} /> : <Navigate to="/auth" />} />
          </Routes>
        </main>
        <Footer />
        <MobileNav user={user} />
      </div>
    </Router>
  );
}

const HomePage = ({ user }) => {
  return (
    <div className="flex flex-col items-center justify-center animate-fade-up w-full h-full pb-6 md:pb-10">
      <div className="text-center max-w-4xl mx-auto pt-10 md:pt-16 pb-12 md:pb-20 relative z-10">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-4 md:mb-6 leading-tight tracking-tight text-white drop-shadow-2xl">
          Your Money. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Mastered by AI.</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed font-medium text-slate-300 px-4 md:px-0">
          Upload receipts, track expenses, and chat with your financial data. SpendIO acts as your personal 24/7 accountant.
        </p>
        <Link to={user ? "/dashboard" : "/auth"} className="bg-cyan-500 hover:bg-cyan-400 text-[#050B14] font-black text-base md:text-lg py-3 md:py-4 px-8 md:px-10 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all inline-block hover:-translate-y-1">
          {user ? "Enter Dashboard ➔" : "Start Free Trial ➔"}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 w-full mb-10 mt-6 relative z-10">
        <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#050B14]/40 backdrop-blur-xl border border-red-500/30 hover:border-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] transition-all group">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-4 md:mb-6 group-hover:bg-red-500 group-hover:text-white transition-all shadow-lg">📸</div>
          <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-white">One-Tap Scan</h3>
          <p className="text-slate-400 font-medium text-xs md:text-sm leading-relaxed">Just upload a picture of your bill. Gemini AI will instantly read and save the exact amount.</p>
        </div>
        <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#050B14]/40 backdrop-blur-xl border border-cyan-500/30 hover:border-cyan-500 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all group">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-4 md:mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-lg">🤖</div>
          <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-white">AI Assistant</h3>
          <p className="text-slate-400 font-medium text-xs md:text-sm leading-relaxed">Ask questions like "How much did I spend on food this month?" and get an instant AI reply.</p>
        </div>
        <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#050B14]/40 backdrop-blur-xl border border-purple-500/30 hover:border-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all group sm:col-span-2 md:col-span-1">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-4 md:mb-6 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-lg">📈</div>
          <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-white">Visual Insights</h3>
          <p className="text-slate-400 font-medium text-xs md:text-sm leading-relaxed">Beautiful color-coded charts and budget trackers make understanding your finances effortless.</p>
        </div>
      </div>
    </div>
  );
};

const FeaturesPage = () => {
  return (
    <div className="max-w-6xl mx-auto w-full py-8 md:py-12 animate-fade-up">
      <div className="text-center mb-10 md:mb-16 relative">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 md:mb-6 tracking-tight relative z-10">Powerful Features</h1>
        <p className="text-slate-400 font-medium text-sm md:text-lg max-w-2xl mx-auto relative z-10 px-4 md:px-0">Everything you need to master your personal finances without the hassle of manual spreadsheets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-[#050B14]/60 backdrop-blur-xl border border-red-500/20 hover:border-red-500/50 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] group transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-4 md:mb-6 group-hover:bg-red-500 group-hover:text-[#050B14] transition-all">📸</div>
          <h3 className="text-2xl md:text-3xl font-black mb-3 md:mb-4 text-white">Smart Vision Scanner</h3>
          <p className="text-slate-400 font-medium text-sm md:text-base leading-relaxed mb-4 md:mb-6">Powered by Google Gemini Vision. Simply point your camera at any receipt, and our AI will automatically detect the total amount and categorize the expense. No more typing.</p>
          <ul className="space-y-2 text-xs md:text-sm font-bold text-slate-300">
            <li className="flex items-center gap-2"><span className="text-red-400">✓</span> Supports JPG & PNG (up to 5MB)</li>
            <li className="flex items-center gap-2"><span className="text-red-400">✓</span> Auto-detects Categories</li>
            <li className="flex items-center gap-2"><span className="text-red-400">✓</span> Error-free numeric extraction</li>
          </ul>
        </div>

        <div className="bg-[#050B14]/60 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/50 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] group transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)]">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-4 md:mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-all">🤖</div>
          <h3 className="text-2xl md:text-3xl font-black mb-3 md:mb-4 text-white">Conversational AI Chatbot</h3>
          <p className="text-slate-400 font-medium text-sm md:text-base leading-relaxed mb-4 md:mb-6">Talk to your data naturally. Our integrated AI analyzes your entire database to answer specific queries instantly. It's like having a financial advisor in your pocket.</p>
          <ul className="space-y-2 text-xs md:text-sm font-bold text-slate-300">
            <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> "How much did I spend on cabs?"</li>
            <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> "What is my highest category?"</li>
            <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Dynamic Monthly Reports</li>
          </ul>
        </div>

        <div className="bg-[#050B14]/60 backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/50 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] group transition-all shadow-[0_0_15px_rgba(168,85,247,0.1)]">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-4 md:mb-6 group-hover:bg-purple-500 group-hover:text-white transition-all">📈</div>
          <h3 className="text-2xl md:text-3xl font-black mb-3 md:mb-4 text-white">Visual Analytics</h3>
          <p className="text-slate-400 font-medium text-sm md:text-base leading-relaxed mb-4 md:mb-6">Understand your cash flow at a glance. We provide real-time beautiful pie charts and an intuitive budget tracker to keep you within your limits.</p>
          <ul className="space-y-2 text-xs md:text-sm font-bold text-slate-300">
            <li className="flex items-center gap-2"><span className="text-purple-400">✓</span> Category-wise breakdowns</li>
            <li className="flex items-center gap-2"><span className="text-purple-400">✓</span> Dynamic Progress Bars</li>
            <li className="flex items-center gap-2"><span className="text-purple-400">✓</span> Warning indicators for overspending</li>
          </ul>
        </div>

        <div className="bg-[#050B14]/60 backdrop-blur-xl border border-blue-500/20 hover:border-blue-500/50 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] group transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)]">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-4 md:mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all">🔐</div>
          <h3 className="text-2xl md:text-3xl font-black mb-3 md:mb-4 text-white">Secure Cloud Storage</h3>
          <p className="text-slate-400 font-medium text-sm md:text-base leading-relaxed mb-4 md:mb-6">Your data belongs to you. Every expense is securely encrypted and stored in a private PostgreSQL database, accessible only via your secure login.</p>
          <ul className="space-y-2 text-xs md:text-sm font-bold text-slate-300">
            <li className="flex items-center gap-2"><span className="text-blue-400">✓</span> Enterprise-grade PostgreSQL</li>
            <li className="flex items-center gap-2"><span className="text-blue-400">✓</span> One-Click CSV Export</li>
            <li className="flex items-center gap-2"><span className="text-blue-400">✓</span> Family Sharing capabilities</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

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
    <div className="w-full flex items-center justify-center min-h-[60vh] md:min-h-[70vh] relative z-20">
      <div className="w-full max-w-md p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] glass-card animate-fade-up relative overflow-hidden mx-2 md:mx-0">
        <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-red-500/20 blur-[50px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-24 md:w-32 h-24 md:h-32 bg-cyan-500/20 blur-[50px] rounded-full"></div>

        <div className="text-center mb-6 md:mb-8 relative z-10">
          <div className="w-14 h-14 md:w-16 md:h-16 mx-auto bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] font-black text-2xl md:text-3xl mb-4 md:mb-6">S</div>
          <h2 className="text-2xl md:text-3xl font-black text-white">{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p className="text-slate-400 font-medium text-xs md:text-sm mt-2">Enter your details below to continue.</p>
        </div>
        
        <div className="flex bg-black/40 p-1 md:p-1.5 rounded-xl mb-6 md:mb-8 relative z-10 border border-white/5">
          <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 md:py-2.5 rounded-lg font-bold transition-all text-xs md:text-sm ${isLogin ? 'bg-white/10 text-white shadow-md border border-white/10' : 'text-slate-500 hover:text-white'}`}>Log In</button>
          <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 md:py-2.5 rounded-lg font-bold transition-all text-xs md:text-sm ${!isLogin ? 'bg-white/10 text-white shadow-md border border-white/10' : 'text-slate-500 hover:text-white'}`}>Sign Up</button>
        </div>
        
        <form onSubmit={submit} className="space-y-3 md:space-y-4 relative z-10">
          {!isLogin && <input type="text" required placeholder="Full Name" className="w-full rounded-xl py-3 md:py-4 px-4 md:px-5 text-sm md:text-base glass-input" onChange={e=>setForm({...form, name:e.target.value})} />}
          <input type="email" required placeholder="Email Address" className="w-full rounded-xl py-3 md:py-4 px-4 md:px-5 text-sm md:text-base glass-input" onChange={e=>setForm({...form, email:e.target.value})} />
          <input type="password" required placeholder="Password" className="w-full rounded-xl py-3 md:py-4 px-4 md:px-5 text-sm md:text-base glass-input" onChange={e=>setForm({...form, password:e.target.value})} />
          <button type="submit" disabled={loading} className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#050B14] font-black text-base md:text-lg py-3 md:py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] mt-2 md:mt-4">
            {loading ? "Processing..." : (isLogin ? "Secure Sign In ➔" : "Create Account ➔")}
          </button>
        </form>
      </div>
    </div>
  );
};

const Dashboard = ({ user, history, fetchHistory }) => {
  const [form, setForm] = useState({ amount: "", category: "Food", description: "", date: "" });
  const [budget, setBudget] = useState(() => Number(localStorage.getItem("userBudget")) || 10000);
  const [editingId, setEditingId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

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
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    await fetch(`https://spendio-ai-expense-tracker.onrender.com/api/expenses/${id}`, { method: "DELETE" });
    fetchHistory();
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in your browser. Please try Google Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    
    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      setIsProcessingVoice(true);
      
      try {
        const prompt = `Extract expense details from this text: "${transcript}". Reply ONLY with valid JSON exactly like this format: {"amount": number, "category": "Food" | "Transport" | "Utilities" | "Shopping" | "Entertainment", "description": "short string"}. Do not add any extra text or markdown.`;
        const res = await fetch("https://spendio-ai-expense-tracker.onrender.com/api/chat", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: prompt, expenses: [] })
        });
        
        const data = await res.json();
        const cleanJson = data.answer.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        
        setForm({
          amount: parsed.amount || "",
          category: parsed.category || "Food",
          description: parsed.description || transcript,
          date: new Date().toISOString().split("T")[0]
        });
      } catch(err) { alert("Couldn't parse voice correctly. Please try again."); }
      setIsProcessingVoice(false);
    };
    
    recognition.onerror = () => { setIsListening(false); setIsProcessingVoice(false); };
    recognition.start();
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My SpendIO Update',
        text: `Hey! I have tracked ₹${totalExpenses} out of my ₹${budget} budget this month using SpendIO.`,
      }).catch(console.error);
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  const totalExpenses = history.reduce((sum, item) => sum + Number(item.amount), 0);
  const budgetPercentage = (totalExpenses / budget) * 100;
  const chartData = history.reduce((acc, curr) => {
    const ex = acc.find(item => item.name === curr.category);
    if (ex) ex.value += Number(curr.amount); else acc.push({ name: curr.category, value: Number(curr.amount) });
    return acc;
  }, []);
  const COLORS = ["#EF4444", "#38BDF8", "#A855F7", "#FBBF24", "#10B981"];

  return (
    <div className="grid lg:grid-cols-3 gap-6 md:gap-8 animate-fade-up">
      <div className="lg:col-span-1">
        <div className="glass-card p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] static lg:sticky lg:top-28">
          <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center justify-between text-white">
            <div className="flex items-center gap-2 md:gap-3">
              <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm md:text-base">{editingId ? '✏️' : '➕'}</span> 
              <span>{editingId ? "Edit Expense" : "Add Expense"}</span>
            </div>
            
            <button 
              type="button" 
              onClick={handleVoiceInput} 
              disabled={isListening || isProcessingVoice} 
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-xl transition-all border ${isListening ? 'bg-red-500 text-white animate-pulse border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]' : isProcessingVoice ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-white/10 text-cyan-400 hover:bg-cyan-500 hover:text-black border-white/20'}`} 
              title="Click & Speak"
            >
              {isProcessingVoice ? '⏳' : '🎙️'}
            </button>
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <input type="number" required placeholder="Amount (₹)" className="w-full rounded-xl p-3 md:p-4 text-sm md:text-base glass-input font-bold" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <select className="w-full rounded-xl p-3 md:p-4 text-sm md:text-base glass-input font-bold" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option className="bg-slate-900">Food</option><option className="bg-slate-900">Transport</option><option className="bg-slate-900">Utilities</option><option className="bg-slate-900">Shopping</option><option className="bg-slate-900">Entertainment</option>
            </select>
            <input type="text" placeholder="Description (e.g. KFC)" className="w-full rounded-xl p-3 md:p-4 text-sm md:text-base glass-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input type="date" required className="w-full rounded-xl p-3 md:p-4 text-sm md:text-base glass-input text-slate-300" style={{ colorScheme: 'dark' }} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            
            <div className="flex gap-2 md:gap-3 mt-4 md:mt-6">
              <button type="submit" className={`flex-1 text-white font-black py-3 md:py-4 text-sm md:text-base rounded-xl shadow-lg transition-all ${editingId ? 'bg-red-500 hover:bg-red-400' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-900'}`}>
                {editingId ? "Update" : "Save"}
              </button>
              {editingId && (
                <button type="button" onClick={()=>{setEditingId(null); setForm({ amount: "", category: "Food", description: "", date: "" });}} className="bg-white/10 text-white font-bold px-4 md:px-6 rounded-xl border border-white/20 hover:bg-white/20 text-sm md:text-base">Cancel</button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="glass-card p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] relative overflow-hidden">
            <div className="flex justify-between items-start mb-3 md:mb-4 relative z-10">
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-cyan-400">Monthly Target</p>
              <button onClick={() => { const b = prompt("Update Budget Limit:", budget); if(b && !isNaN(b)) { setBudget(Number(b)); localStorage.setItem("userBudget", Number(b)); } }} className="text-[10px] md:text-xs bg-white/10 px-2 py-1 md:px-3 md:py-1.5 rounded-lg border border-white/10 hover:bg-white/20 transition-colors">Edit Limit</button>
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-white relative z-10">₹{totalExpenses.toLocaleString()}</h3>
            <p className="text-xs md:text-sm text-slate-400 font-medium mt-1 md:mt-2 relative z-10">of ₹{budget.toLocaleString()} limit</p>
            <div className="w-full h-1.5 md:h-2 rounded-full mt-4 md:mt-6 bg-black/50 border border-white/10 relative z-10 overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${budgetPercentage > 90 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"}`} style={{ width: `${Math.min(budgetPercentage, 100)}%` }}></div>
            </div>
          </div>
          
          <div className="glass-card p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] flex flex-col justify-center">
            <h3 className="font-black text-white mb-3 md:mb-4 text-sm md:text-base">Quick Actions</h3>
            <div className="space-y-2 md:space-y-3">
              <button onClick={handleExportCSV} className="w-full bg-white/10 text-white font-bold p-3 md:p-4 text-xs md:text-sm rounded-xl border border-white/20 hover:bg-cyan-500 hover:border-cyan-500 hover:text-[#050B14] transition-all text-left flex justify-between cursor-pointer">📥 Download CSV Report <span>➔</span></button>
              <button onClick={handleShare} className="w-full bg-white/10 text-white font-bold p-3 md:p-4 text-xs md:text-sm rounded-xl border border-white/20 hover:bg-cyan-500 hover:border-cyan-500 hover:text-[#050B14] transition-all text-left flex justify-between cursor-pointer">🤝 Share with Family <span>➔</span></button>
            </div>
          </div>
        </div>

        {chartData.length > 0 && (
          <div className="glass-card p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] h-[250px] md:h-[300px] flex flex-col items-center">
            <h2 className="text-base md:text-lg font-bold text-white align-self-start w-full mb-1 md:mb-2">Visual Spend Split</h2>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value" stroke="rgba(255,255,255,0.1)" strokeWidth={2}>
                  {chartData.map((e, i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#050B14', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: '#fff', fontWeight: 'bold' }} itemStyle={{color: '#fff'}} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="glass-card p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem]">
          <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-white border-b border-white/10 pb-3 md:pb-4 flex items-center gap-2"><span>📋</span> Recent Transactions</h2>
          {history.length > 0 ? (
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 md:p-4 rounded-xl md:rounded-2xl bg-black/30 border border-white/5 hover:border-cyan-500/40 transition-all group flex-wrap gap-2">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-white group-hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] text-xs md:text-base">
                      {item.category === 'Food' ? '🍔' : item.category === 'Transport' ? '🚕' : item.category === 'Shopping' ? '🛍️' : item.category === 'Entertainment' ? '🍿' : '⚡'}
                    </div>
                    <div>
                      <p className="font-bold text-sm md:text-base text-white">{item.description || item.category}</p>
                      <p className="text-[10px] md:text-xs text-slate-400 font-medium tracking-widest mt-0.5 md:mt-1">{new Date(item.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:gap-6 ml-auto">
                    <p className="font-mono font-bold text-base md:text-xl text-white">₹{item.amount}</p>
                    <div className="flex gap-1 md:gap-2">
                      <button onClick={() => handleEdit(item)} className="p-1.5 md:p-2 rounded-lg bg-white/10 text-white hover:bg-cyan-500 hover:text-black transition-colors text-xs md:text-base">✏️</button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 md:p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors text-xs md:text-base">🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-center text-slate-500 font-medium py-6 md:py-8 text-sm md:text-base">No expenses logged yet. Add your first expense!</p>}
        </div>
      </div>
    </div>
  );
};

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
        const data = await res.json();
        setResult(data);
        await fetch('https://spendio-ai-expense-tracker.onrender.com/api/expenses', { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, userId: user.id }) });
        fetchHistory();
      } catch (err) { alert("Scan Failed! Please ensure the image is clear."); }
      setLoading(false);
    };
  };

  return (
    <div className="max-w-4xl mx-auto w-full animate-fade-up flex flex-col items-center justify-center min-h-[60vh]">
      <div className="glass-card p-6 sm:p-10 md:p-16 rounded-[1.5rem] md:rounded-[3rem] w-full text-center relative overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.05)]">

        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4 md:mb-6 text-3xl md:text-4xl shadow-inner border border-white/20">📸</div>
        <h1 className="text-2xl md:text-3xl font-black text-white mb-2 md:mb-3 tracking-wide">AI Receipt Scanner</h1>
        <p className="text-xs md:text-sm text-slate-400 mb-6 md:mb-10 font-medium">Let Gemini AI read your physical bills automatically.</p>
        
        <div className="relative border border-white/20 rounded-[1.5rem] md:rounded-[2rem] bg-black/40 hover:bg-white/5 transition-all group overflow-hidden max-w-2xl mx-auto shadow-inner">
          <div className="p-10 md:p-20 flex flex-col items-center justify-center">
            {loading ? (
              <>
                <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-4 md:mb-6 shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                <p className="text-xs md:text-sm font-bold text-cyan-400 animate-pulse tracking-widest uppercase">Extracting Data...</p>
              </>
            ) : (
              <>
                <p className="text-5xl md:text-7xl mb-4 md:mb-6 group-hover:scale-110 transition-transform">📄</p>
                <label className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm md:text-base font-bold px-6 py-3 md:px-8 md:py-4 rounded-xl cursor-pointer hover:scale-105 transition-all block">
                  Select File
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
                <p className="text-[10px] md:text-xs text-slate-500 mt-4 md:mt-6 font-mono uppercase tracking-widest">Supported: JPG, PNG (Max 5MB)</p>
              </>
            )}
          </div>
        </div>

        {result && (
          <div className="mt-6 md:mt-10 inline-flex items-center gap-2 md:gap-3 bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 md:px-6 md:py-4 rounded-xl text-sm md:text-base font-bold animate-fade-up">
            ✅ Saved: ₹{result.amount} ({result.category})
          </div>
        )}
      </div>
    </div>
  );
};

const AiPage = ({ user, history }) => {
  const [insights, setInsights] = useState(null);
  const [chat, setChat] = useState("");
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hello! I am your AI Financial Assistant. Ask me anything about your spending data. 🤖' }]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const fetchReport = async () => {
    setLoadingInsights(true);
    try {
      const res = await fetch(`https://spendio-ai-expense-tracker.onrender.com/api/insights/${user.id}`);
      if(!res.ok) throw new Error("API Failed");
      setInsights(await res.json());
    } catch (err) { alert("AI Report failed to generate."); }
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
      setMessages(p => [...p, { role: 'ai', text: "Connection error!" }]);
    }
  };

  const calculateForecast = () => {
    if(!history || history.length === 0) return null;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthExpenses = history.filter(h => {
      const d = new Date(h.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    if(thisMonthExpenses.length === 0) return null;
    const totalSpent = thisMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const today = new Date().getDate();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dailyAvg = totalSpent / today;
    const projectedTotal = Math.round(dailyAvg * daysInMonth);
    const budget = Number(localStorage.getItem('userBudget')) || 10000;
    const isOver = projectedTotal > budget;
    const difference = Math.abs(projectedTotal - budget);
    return { projectedTotal, isOver, difference, daysLeft: daysInMonth - today };
  };

  const forecast = calculateForecast();

  return (
    <div className="grid lg:grid-cols-3 gap-6 md:gap-8 animate-fade-up">
      <div className="lg:col-span-1 glass-card rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 flex flex-col h-full overflow-y-auto border-t-4 border-t-pink-500">
        
        {forecast && (
          <div className="bg-black/40 p-4 md:p-5 rounded-xl md:rounded-2xl border border-white/10 shadow-inner mb-6 md:mb-8">
            <h3 className="text-[10px] md:text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-2"><span>🔮</span> AI Forecast</h3>
            <p className="text-xs md:text-sm text-slate-300 font-medium mb-2 md:mb-3">At your current pace, your estimated spend by end of the month will be:</p>
            <h4 className="text-2xl md:text-3xl font-black text-white mb-2">₹{forecast.projectedTotal.toLocaleString()}</h4>
            <div className={`inline-block px-2 py-1 md:px-3 md:py-1 rounded-lg text-[10px] md:text-xs font-bold ${forecast.isOver ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
              {forecast.isOver ? `₹${forecast.difference.toLocaleString()} over budget` : `₹${forecast.difference.toLocaleString()} under budget`}
            </div>
          </div>
        )}

        <h2 className="text-lg md:text-xl font-bold text-white mb-2 flex items-center gap-2 md:gap-3">
          <span className="bg-white/20 p-1.5 md:p-2 rounded-lg md:rounded-xl">✨</span> Smart Report
        </h2>
        <p className="text-[10px] md:text-xs text-slate-400 mb-4 md:mb-6 uppercase tracking-widest border-b border-white/10 pb-3 md:pb-4">AI Analysis of your spending</p>
        
        <button onClick={fetchReport} disabled={loadingInsights} className="w-full bg-pink-500 hover:bg-pink-400 text-white font-bold py-3 md:py-4 text-sm md:text-base rounded-xl mb-4 md:mb-6 transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)] disabled:opacity-50">
          {loadingInsights ? "Crunching Numbers..." : "Generate Report"}
        </button>
        
        {insights && (
          <div className="space-y-4 md:space-y-6 flex-1 animate-fade-up mt-2">
            <div className="bg-black/40 p-4 md:p-5 rounded-xl border border-white/10 shadow-inner">
              <p className="text-[10px] md:text-xs font-bold text-pink-400 uppercase tracking-widest mb-2 md:mb-3">📊 Monthly Summary</p>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">{insights.summary}</p>
            </div>
            <div className="bg-black/40 p-4 md:p-5 rounded-xl border border-white/10 shadow-inner">
              <p className="text-[10px] md:text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 md:mb-3">💡 Actionable Tips</p>
              <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-slate-300 font-medium">
                {insights.suggestions.map((s,i)=>(
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-2 glass-card rounded-[1.5rem] md:rounded-[2rem] flex flex-col h-[500px] lg:h-[700px] overflow-hidden border-t-4 border-t-cyan-500 mt-6 lg:mt-0">
        <div className="p-4 md:p-5 border-b border-white/10 bg-white/5 flex items-center gap-3 md:gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 text-base md:text-xl">💬</div>
          <div>
            <h3 className="text-sm md:text-base font-bold text-white tracking-wide">AI Chatbot</h3>
            <p className="text-[10px] md:text-xs text-slate-400">Ask questions in plain English</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-black/20 custom-scrollbar flex flex-col gap-4 md:gap-5">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role==='ai' ? 'justify-start' : 'justify-end'} animate-fade-up`}>
              <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl max-w-[85%] md:max-w-[80%] text-xs md:text-sm font-medium leading-relaxed border ${m.role==='ai' ? 'bg-slate-800/80 text-white border-white/10 rounded-tl-sm' : 'bg-cyan-500 text-slate-900 border-transparent rounded-tr-sm font-bold'}`}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 md:p-5 bg-white/5 border-t border-white/10">
          <div className="flex gap-2 md:gap-3 mb-3 md:mb-4 overflow-x-auto pb-2 custom-scrollbar">
            <button onClick={()=>handleChat(null, "Which category is highest?")} className="whitespace-nowrap bg-black border border-white/20 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-white/10 transition-colors">Highest Category?</button>
            <button onClick={()=>handleChat(null, "Did I spend on Food recently?")} className="whitespace-nowrap bg-black border border-white/20 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-white/10 transition-colors">Food Expenses?</button>
          </div>
          <form onSubmit={(e)=>handleChat(e)} className="flex gap-2 md:gap-3">
            <input type="text" className="flex-1 p-3 md:p-4 text-xs md:text-sm bg-black/50 border border-white/10 rounded-xl outline-none focus:border-cyan-500 text-white transition-all glass-input" placeholder="Ask a question..." value={chat} onChange={e=>setChat(e.target.value)} />
            <button type="submit" className="bg-cyan-500 text-[#050B14] px-5 md:px-8 rounded-xl text-sm md:text-base font-black hover:bg-cyan-400 transition-all">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

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
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 animate-fade-up w-full">
      <div className="glass-card p-8 md:p-14 rounded-[1.5rem] md:rounded-[3rem] flex flex-col md:flex-row items-center gap-6 md:gap-12 relative overflow-hidden">
        
        <div className="relative group cursor-pointer z-10" onClick={() => fileInputRef.current.click()}>
          <div className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-black/50 text-white font-black text-3xl md:text-5xl flex items-center justify-center border-2 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)] overflow-hidden group-hover:border-cyan-400 transition-all">
            {uploading ? <div className="text-xs md:text-sm font-bold text-cyan-400">Wait...</div> : (user.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" alt="Profile" /> : user.name.charAt(0).toUpperCase())}
          </div>
          <div className="absolute bottom-0 right-0 md:bottom-1 md:right-1 bg-white text-black p-1.5 md:p-2.5 rounded-full shadow-lg text-xs md:text-base">📷</div>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
        </div>
        
        <div className="text-center md:text-left flex-1 z-10">
          <h1 className="text-2xl md:text-4xl font-black text-white mb-1 md:mb-2">{user.name}</h1>
          <p className="text-sm md:text-lg text-slate-400 mb-4 md:mb-6">{user.email}</p>
          <div className="inline-block bg-white/10 border border-white/20 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-bold shadow-sm">Total Tracked: <span className="text-cyan-400">₹{total.toLocaleString()}</span></div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <div className="glass-card p-6 md:p-10 rounded-[1.5rem] md:rounded-3xl animate-fade-up delay-100">
          <h2 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6 border-b border-white/10 pb-3 md:pb-4">👑 Subscription</h2>
          <div className="bg-black/30 p-5 md:p-6 rounded-xl md:rounded-2xl border border-white/10 text-center">
            <span className="inline-block bg-white/10 text-white font-bold px-3 py-1 rounded-full text-xs md:text-sm mb-3 md:mb-4 border border-white/20">Current Plan</span>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-1 md:mb-2">SpendIO Free</h3>
            <p className="text-xs md:text-sm text-slate-400 mb-4 md:mb-6 font-medium">Upgrade to PRO to unlock unlimited AI scans.</p>
            <button className="w-full bg-white text-black text-xs md:text-sm font-bold py-3 md:py-4 rounded-xl hover:bg-cyan-400 transition-colors">Upgrade Now</button>
          </div>
        </div>
        
        <div className="glass-card p-6 md:p-10 rounded-[1.5rem] md:rounded-3xl animate-fade-up delay-200 flex flex-col justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 border-b border-white/10 pb-3 md:pb-4">⚙️ Account Settings</h2>
            <p className="text-xs md:text-sm text-slate-400 mb-6 md:mb-8 font-medium">Log out securely from this device.</p>
          </div>
          <button onClick={handleLogout} className="w-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs md:text-sm font-bold py-3 md:py-4 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg">
            Log Out Securely
          </button>
        </div>
      </div>
    </div>
  );
};

const FaqPage = () => {
  const faqs = [
    { q: "How does the AI Scanner work?", a: "It uses Google Gemini Vision to read your uploaded physical receipts and automatically extracts the amount and category." },
    { q: "Is my data private?", a: "Yes, your expenses are stored securely in a private PostgreSQL database linked exclusively to your account." },
    { q: "How does the AI Chatbot work?", a: "The Chatbot dynamically reads your database entries and uses generative AI to answer questions about your spending." },
  ];
  return (
    <div className="max-w-4xl mx-auto w-full py-8 md:py-12 animate-fade-up">
      <div className="text-center mb-10 md:mb-16">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-3 md:mb-4">Frequently Asked Questions</h1>
      </div>
      <div className="space-y-4 md:space-y-6">
        {faqs.map((f, i) => (
          <div key={i} className="p-6 md:p-8 rounded-2xl md:rounded-3xl glass-card relative overflow-hidden">
            <h3 className="font-bold text-white mb-2 md:mb-3 text-sm md:text-lg flex items-center gap-2 md:gap-3"><span className="bg-white/10 px-2.5 py-1 md:px-3 md:py-1 rounded-md md:rounded-lg text-cyan-400">Q</span> {f.q}</h3>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium pl-10 md:pl-12">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;