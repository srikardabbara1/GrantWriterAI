import '/public/styles.css';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  return (
    <>
      <nav>
        <div className="nav-flex">
          <div className="logo">GrantWriter<span className="logo-accent">AI</span></div>
          <button className="btn-login">Login or Sign Up</button>
        </div>
      </nav>
      <section className="hero-full">
        <div className="hero-content">
          <h1><strong>Generate Grants in Minutes, Not Hours</strong></h1>
          <p>GrantWriterAI uses cutting-edge AI to generate complete, polished grant proposals in minutes. Save time, cut costs, and boost your success rate.</p>
          <button className="btn-get-started" onClick={() => navigate('/home')}>Get Started</button>
        </div>
        <div className="hero-image">
          <img src="/assets/grantproposal_template.png" alt="Grant proposal template" />
        </div>
        <div className="scroll-indicator">
          <svg viewBox="0 0 24 24"><path d="M12 16.5c-.28 0-.53-.11-.71-.29l-6-6a1.003 1.003 0 0 1 1.42-1.42L12 13.59l5.29-5.3a1.003 1.003 0 0 1 1.42 1.42l-6 6c-.18.18-.43.29-.71.29z"/></svg>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 90" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#e3f6f5" d="M0,60 C360,120 1080,0 1440,60 L1440,90 L0,90 Z"/></svg>
      </section>
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
