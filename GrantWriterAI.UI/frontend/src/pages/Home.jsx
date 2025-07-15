import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
          <button className="btn-login">My Account</button>
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
          </div>
        </main>
      </div>
    </>
  );
};

export default Home; 