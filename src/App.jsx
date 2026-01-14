import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scroll, Briefcase, Search, Shield, 
  ChevronDown, Key, Bell, MousePointer, 
  Paperclip, Feather, Lock, User 
} from 'lucide-react';
import './App.css'; 

const App = () => {
  const [currentView, setCurrentView] = useState('login'); 
  const [notification, setNotification] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => { window.scrollTo(0, 0); }, [currentView]);

  // --- ACTIONS ---
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.8; utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const playClickSound = () => {
    const audio = new Audio("https://cdn.freesound.org/previews/256/256513_4486188-lq.mp3");
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio interaction needed"));
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAction = (actionTitle, actionDesc, speakText) => {
    playClickSound();
    speak(speakText);
    showNotification(`PROTOCOL: ${actionTitle}`);
    const newLog = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `${actionTitle} - ${actionDesc}`
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Auth Handlers
  const handleLogin = (e) => {
    e.preventDefault(); playClickSound(); speak("Access granted.");
    showNotification("ACCESS GRANTED"); setTimeout(() => setCurrentView('dashboard'), 1500);
  };
  const handleRegister = (e) => {
    e.preventDefault(); playClickSound(); speak("Identity verified.");
    showNotification("ACCOUNT CREATED"); setTimeout(() => setCurrentView('dashboard'), 1500);
  };
  const handleLogout = () => {
    playClickSound(); speak("System shutting down.");
    setTimeout(() => { setCurrentView('login'); setLogs([]); }, 2000);
  };

  // --- VIEW RENDERING ---
  return (
    <div className="app-container">
      <div className="vintage-overlay"></div>

      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
            className="vintage-toast"
          >
            <div className="flex items-center gap-3">
              <Bell size={18} className="animate-pulse" />
              <span>{notification}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGIN VIEW */}
      {currentView === 'login' && (
        <div className="auth-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="auth-box">
            <div className="flex justify-center mb-4">
               <div className="logo-box"><Lock size={28} /></div>
            </div>
            <h1 className="auth-title">Login</h1>
            <p className="auth-subtitle">ENTER CREDENTIALS TO ACCESS ARCHIVES</p>
            <form onSubmit={handleLogin}>
              <div className="vintage-input-group">
                <label className="vintage-label">Agent ID</label>
                <input type="email" required className="vintage-input" placeholder="agent@ledger.com" />
              </div>
              <div className="vintage-input-group">
                <label className="vintage-label">Password</label>
                <input type="password" required className="vintage-input" placeholder="••••••••" />
              </div>
              <button type="submit" className="control-btn" style={{ justifyContent: 'center', background: '#2c1810', color: '#f4e4bc', marginTop: '1rem' }}>
                ACCESS TERMINAL
              </button>
            </form>
            <p className="toggle-link" onClick={() => setCurrentView('register')}>New Agent? Register Here</p>
          </motion.div>
        </div>
      )}

      {/* REGISTER VIEW */}
      {currentView === 'register' && (
        <div className="auth-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="auth-box">
            <div className="flex justify-center mb-4">
               <div className="logo-box"><User size={28} /></div>
            </div>
            <h1 className="auth-title">Register</h1>
            <p className="auth-subtitle">CREATE NEW CLEARANCE PROFILE</p>
            <form onSubmit={handleRegister}>
              <div className="vintage-input-group">
                <label className="vintage-label">Full Name</label>
                <input type="text" required className="vintage-input" placeholder="John Doe" />
              </div>
              <div className="vintage-input-group">
                <label className="vintage-label">Email</label>
                <input type="email" required className="vintage-input" placeholder="agent@ledger.com" />
              </div>
              <div className="vintage-input-group">
                <label className="vintage-label">Password</label>
                <input type="password" required className="vintage-input" placeholder="••••••••" />
              </div>
              <button type="submit" className="control-btn" style={{ justifyContent: 'center', background: '#2c1810', color: '#f4e4bc', marginTop: '1rem' }}>
                INITIALIZE ACCOUNT
              </button>
            </form>
            <p className="toggle-link" onClick={() => setCurrentView('login')}>Back to Login</p>
          </motion.div>
        </div>
      )}

      {/* DASHBOARD VIEW */}
      {currentView === 'dashboard' && (
        <>
          <nav className="navbar">
            <div className="brand">
              <div className="logo-box"><Scroll size={20}/></div>
              <div><h1>The Ledger</h1><p>EST. 2026</p></div>
            </div>
            <button className="control-btn" style={{ width: 'auto', padding: '0.5rem 1.5rem', marginBottom: 0, background: '#8b0000', color: '#f4e4bc', borderColor: '#2c1810' }} onClick={handleLogout}>LOG OUT</button>
          </nav>

          <header className="hero-section">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
              <p className="hero-subtitle">OFFICIAL ARCHIVES</p>
              <h1 className="hero-title">The Daily<br/>Ledger</h1>
              <p style={{ fontStyle: 'italic', fontSize: '1.2rem', opacity: 0.8 }}>"Secure. Timeless. Efficient."</p>
            </motion.div>
            <div className="scroll-indicator" onClick={() => document.getElementById('guide').scrollIntoView({behavior: 'smooth'})}>
              <span style={{ fontFamily: 'Courier Prime', fontSize: '0.8rem', letterSpacing: '2px' }}>HOW IT WORKS</span>
              <div className="scroll-line"></div>
              <ChevronDown />
            </div>
          </header>

          <section id="guide" className="guide-section">
            <div className="section-header">
              <h2>Operating Protocols</h2>
              <div style={{ width: '80px', height: '3px', background: '#2c1810', margin: '1rem auto' }}></div>
            </div>
            <div className="cards-grid">
              <div className="guide-card">
                <div className="step-badge">STEP 01</div>
                <div className="text-center">
                  <Key size={32} style={{ margin: '0.5rem auto' }} />
                  <h3 className="font-bold text-lg mb-2">AUTHENTICATE</h3>
                  <p className="font-serif italic text-sm">Verified access only.</p>
                </div>
              </div>
              <div className="guide-card">
                <div className="step-badge">STEP 02</div>
                <div className="text-center">
                  <MousePointer size={32} style={{ margin: '0.5rem auto' }} />
                  <h3 className="font-bold text-lg mb-2">EXECUTE</h3>
                  <p className="font-serif italic text-sm">Initiate protocols via panel.</p>
                </div>
              </div>
              <div className="guide-card">
                <div className="step-badge">STEP 03</div>
                <div className="text-center">
                  <Scroll size={32} style={{ margin: '0.5rem auto' }} />
                  <h3 className="font-bold text-lg mb-2">ARCHIVE</h3>
                  <p className="font-serif italic text-sm">Review confirmation log.</p>
                </div>
              </div>
            </div>
            <div className="proceed-container">
              <button className="control-btn" style={{ width: 'auto', display: 'inline-flex', background: '#2c1810', color: '#f4e4bc', justifyContent: 'center' }} onClick={() => document.getElementById('dashboard').scrollIntoView({behavior: 'smooth'})}>
                PROCEED TO TERMINAL
              </button>
            </div>
          </section>

          <main id="dashboard" className="dashboard-section">
            {/* Left Column */}
            <div>
              <div className="control-header">
                <Key size={24} />
                <h2 style={{ textTransform: 'uppercase', letterSpacing: '2px', margin: 0, fontSize: '1.5rem' }}>Control Panel</h2>
              </div>
              
              <div onClick={() => handleAction("JOB APPLICATION", "Sent to HR.", "Processing Job Application.")} className="control-btn group">
                <div className="btn-icon-box"><Briefcase size={20}/></div>
                <div><h4 className="font-bold uppercase m-0 text-sm">Apply for Job</h4><p className="text-xs font-mono opacity-70 m-0">Submit credentials</p></div>
              </div>

              <div onClick={() => handleAction("INVENTORY CHECK", "Database scanned.", "Initiating inventory scan.")} className="control-btn group">
                <div className="btn-icon-box"><Search size={20}/></div>
                <div><h4 className="font-bold uppercase m-0 text-sm">Check Inventory</h4><p className="text-xs font-mono opacity-70 m-0">Full database scan</p></div>
              </div>

              <div onClick={() => handleAction("SECURITY PROTOCOL", "Firewall active.", "Running security diagnostics.")} className="control-btn group">
                <div className="btn-icon-box"><Shield size={20}/></div>
                <div><h4 className="font-bold uppercase m-0 text-sm">Run Security</h4><p className="text-xs font-mono opacity-70 m-0">System sweep</p></div>
              </div>
            </div>

            {/* Right Column: Notebook */}
            <div className="notebook-wrapper">
              <div className="paperclip-icon">
                 <Paperclip size={60} color="#2c1810" strokeWidth={1.5} />
              </div>
              
              <div className="notebook">
                <div className="notebook-lines"></div>
                
                <div className="relative z-10 flex justify-between items-end border-b-2 border-[#2c1810] pb-4 mb-6">
                  <div>
                    <h2 className="text-3xl font-bold m-0 leading-none">Daily Correspondence</h2>
                  </div>
                  <div className="text-right font-mono text-xs opacity-60">PAGE 429<br/>VOL. II</div>
                </div>
                
                <div className="log-list relative z-10 min-h-[400px]">
                  {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 opacity-40">
                      <Feather size={48} className="mb-4"/><p className="italic text-xl">"Awaiting operator input..."</p>
                    </div>
                  ) : (
                    logs.map((log) => (
                      <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="log-item">
                        <span className="log-time">{log.time}</span><span className="uppercase tracking-wide">{log.text}</span>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Fixed Stamp */}
                <div className="stamp-box">
                  <div className="text-xs font-bold">OFFICIAL</div>
                  <div className="text-xl font-black leading-none my-1">TOP<br/>SECRET</div>
                  <div className="text-xs font-bold">VERIFIED</div>
                </div>
              </div>
            </div>
          </main>

          <footer style={{ background: '#2c1810', color: '#f4e4bc', textAlign: 'center', padding: '2rem', marginTop: '4rem' }}>
            <p className="font-mono text-xs tracking-[0.3em] opacity-60">SYSTEM ID: VINTAGE-99 // END OF LINE</p>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;