import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserProfileDropdown from '../components/UserProfileDropdown';

const initialFormState = {
  title: '',
  fullName: '',
  organization: '',
  role: '',
  contact: '',
  linkedin: '',
  grantType: '',
  programOrAgency: '',
  applicationDeadline: '',
  projectTitle: '',
  elevatorPitch: '',
  projectDates: '',
  fundingRequested: '',
  what: '',
  how: '',
  timeline: '',
  teamMembers: '',
  teamExperience: '',
  budgetTotal: '',
  budgetRequested: '',
  budgetBreakdown: '',
  budgetMatching: '',
  problem: '',
  importance: '',
  affected: '',
  goal: '',
  objectives: '',
  tools: '',
  outcomesExpected: '',
  beneficiaries: '',
  success: '',
  sustainability: '',
  alignment: '',
  considerations: '',
};

const Home = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Step 1: Title submit
  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (form.title.trim()) {
      navigate('/intake', { state: { title: form.title } });
    } else {
      alert('Please enter a grant proposal title.');
    }
  };

  // Step 2: Full form submit
  const handleFullFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (result && result.result) {
        navigate('/grant-result', { state: { grantText: result.result } });
      } else {
        alert('Failed to generate grant proposal.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while generating the grant proposal.');
    }
    setSubmitting(false);
  };

  return (
    <>
      <nav>
        <div className="nav-flex">
          <a href="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="logo">GrantWriter<span className="logo-accent">AI</span></div>
          </a>
          {user ? (
            <UserProfileDropdown />
          ) : (
            <button className="btn-login" onClick={() => navigate('/auth')}>Login or Sign Up</button>
          )}
        </div>
      </nav>
      <div style={{ width: '100%', minHeight: '100vh', background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <main className="home-container" style={{ position: 'relative', zIndex: 1, minHeight: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <div style={{
            background: '#fff',
            borderRadius: '28px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            padding: '2.5rem 3.5rem 2.5rem 3.5rem',
            maxWidth: 950,
            width: '100%',
            margin: '3rem auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
          }}>
            <section className="new-proposal-section" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '2rem', marginBottom: '0.7rem' }}>New Grant Proposal</h2>
              <p style={{ color: '#444', fontSize: '1.08rem', marginBottom: '2.2rem' }}>
                Get started on a new grant proposal. Simply begin by titling your proposal and click the next arrow to begin filling in the information needed to get started!
              </p>
              <form className="proposal-form" id="proposalForm" onSubmit={handleTitleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '2.5rem' }}>
                <input
                  type="text"
                  id="grantTitleInput"
                  name="title"
                  placeholder="Grant Proposal Title..."
                  value={form.title}
                  onChange={handleChange}
                  style={{
                    fontSize: '1.25rem',
                    padding: '1.1rem 2.2rem',
                    borderRadius: '9999px',
                    border: 'none',
                    background: '#f7f7f7',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    width: '60%',
                    outline: 'none',
                  }}
                />
                <button className="btn-get-started" type="submit" style={{ fontSize: '1.25rem', padding: '1.1rem 2.5rem', borderRadius: '9999px', fontWeight: 700 }}>Next</button>
              </form>
            </section>

            {/* Divider */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '2.5rem',
              gap: '1rem'
            }}>
              <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }}></div>
              <span style={{ color: '#666', fontSize: '0.9rem', fontWeight: 500 }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }}></div>
            </div>

            <section className="find-grants-section" style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '2rem', marginBottom: '0.7rem' }}>Find Grants</h2>
              <p style={{ color: '#444', fontSize: '1.08rem', marginBottom: '2.2rem' }}>
                Don't know what you're applying for yet? Enter your information, and we will source the best grants for your purpose.
              </p>
              <div style={{ 
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f6f5 100%)', 
                borderRadius: '16px', 
                padding: '2rem',
                border: '1px solid #e0e0e0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#1976d2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}>
                    🔍
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '0.3rem', color: '#1976d2' }}>
                      Grant Discovery Tool
                    </h3>
                    <p style={{ color: '#666', fontSize: '1rem', margin: 0 }}>
                      Tell us about your organization and project, and we'll find matching grants
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button 
                    className="btn-get-started" 
                    onClick={() => navigate('/find-grants')}
                    style={{ 
                      fontSize: '1.1rem', 
                      padding: '1rem 2rem', 
                      borderRadius: '9999px', 
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Start Grant Search
                  </button>
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>
                    Takes 2-3 minutes • Get personalized recommendations
                  </span>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home; 