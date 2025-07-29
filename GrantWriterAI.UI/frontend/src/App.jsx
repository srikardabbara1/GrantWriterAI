import '/public/styles.css';
import { useNavigate } from 'react-router-dom';
import grantTemplateImg from './assets/grantproposal_template.png';

function App() {
  const navigate = useNavigate();
  return (
    <>
      <nav>
        <div className="nav-flex">
          <div className="logo">GrantWriter<span className="logo-accent">AI</span></div>
          <button className="btn-login" onClick={() => navigate('/auth')}>Login or Sign Up</button>
        </div>
      </nav>
      {/* Hero Section: Vertically centered, arrow at bottom of viewport */}
      <div style={{ position: 'relative', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <section className="hero-full" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: 1200, margin: '0 auto', gap: 40 }}>
            <div className="hero-content" style={{ flex: 1, minWidth: 350 }}>
              <h1><strong>Generate Grants in Minutes, Not Hours</strong></h1>
              <p>GrantWriterAI uses cutting-edge AI to generate complete, polished grant proposals in minutes. Save time, cut costs, and boost your success rate.</p>
              <button className="btn-get-started" onClick={() => navigate('/home')}>Get Started</button>
            </div>
            <div className="hero-image" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <img src={grantTemplateImg} alt="Grant proposal template" style={{ maxWidth: 380, width: '100%', borderRadius: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }} />
            </div>
          </section>
        </div>
        {/* Animated Down Arrow at the bottom of the viewport */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'absolute', left: 0, bottom: 88 }}>
          <div className="scroll-indicator-bounce" style={{ cursor: 'pointer', animation: 'bounce 1.5s infinite' }} onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16.5c-.28 0-.53-.11-.71-.29l-6-6a1.003 1.003 0 0 1 1.42-1.42L12 13.59l5.29-5.3a1.003 1.003 0 0 1 1.42 1.42l-6 6c-.18.18-.43.29-.71.29z" fill="#1976d2"/>
            </svg>
          </div>
        </div>
        <style>{`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(12px); }
            60% { transform: translateY(6px); }
          }
        `}</style>
        <svg className="hero-wave" viewBox="0 0 1440 90" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#e3f6f5" d="M0,60 C360,120 1080,0 1440,60 L1440,90 L0,90 Z"/></svg>
      </div>
      {/* How it works section, only visible after scroll */}
      <section className="features">
        <h2>HOW IT WORKS</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Smart Prompts</h3>
            <p>Just answer a few simple questions—our AI crafts the perfect narrative.</p>
          </div>
          <div className="feature-card">
            <h3>Customizable Templates</h3>
            <p>Select from proven templates and tailor them to your project.</p>
          </div>
          <div className="feature-card">
            <h3>Collaboration</h3>
            <p>Invite teammates and iterate in real‑time.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
