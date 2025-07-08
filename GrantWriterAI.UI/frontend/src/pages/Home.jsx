import React, { useState } from 'react';

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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Step 1: Title submit
  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (form.title.trim()) {
      setStep(2);
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
      alert('Form submitted! (See console for response)');
      console.log(result);
    } catch (err) {
      alert('Failed to submit grant proposal.');
      console.error(err);
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
            {/* Stepper */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', gap: '1.2rem' }}>
              <span style={{ color: step === 1 ? '#1976d2' : '#222', textShadow: step === 1 ? '0 0 16px #b3d6f7' : 'none', fontWeight: 800, fontSize: '2.1rem', borderRadius: '8px', padding: '0 0.3em' }}>Title</span>
              <span style={{ color: '#22b14c', fontSize: '2.2rem', fontWeight: 900, margin: '0 0.2em' }}>→</span>
              <span style={{ color: step === 2 ? '#1976d2' : '#222', textShadow: step === 2 ? '0 0 16px #b3d6f7' : 'none', fontWeight: 800 }}>Information</span>
              <span style={{ color: '#22b14c', fontSize: '2.2rem', fontWeight: 900, margin: '0 0.2em' }}>→</span>
              <span style={{ color: '#222', fontWeight: 800 }}>Grant!</span>
            </div>
            {/* Step 1: Title input */}
            {step === 1 && (
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
            )}
            {/* Step 2: Full form */}
            {step === 2 && (
              <form className="grant-inputs-form" onSubmit={handleFullFormSubmit}>
                <div className="form-grid">
                  {/* Left Column */}
                  <div className="form-col">
                    <section>
                      <h3>BASIC APPLICANT INFORMATION</h3>
                      <input type="text" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} />
                      <input type="text" name="organization" placeholder="Organization / institution (if applicable)" value={form.organization} onChange={handleChange} />
                      <input type="text" name="role" placeholder="Role or Title" value={form.role} onChange={handleChange} />
                      <input type="text" name="contact" placeholder="Contact Info" value={form.contact} onChange={handleChange} />
                      <input type="text" name="linkedin" placeholder="Linkedin, or Personal Website (optional but useful)" value={form.linkedin} onChange={handleChange} />
                    </section>
                    <section>
                      <h3>GRANT TYPE & CONTEXT</h3>
                      <select name="grantType" value={form.grantType} onChange={handleChange}><option>What type of grant is this?</option></select>
                      <input type="text" name="programOrAgency" placeholder="Project start program or agency name" value={form.programOrAgency} onChange={handleChange} />
                      <input type="text" name="applicationDeadline" placeholder="Application deadline" value={form.applicationDeadline} onChange={handleChange} />
                    </section>
                    <section>
                      <h3>PROJECT SUMMARY</h3>
                      <input type="text" name="projectTitle" placeholder="Project Title" value={form.projectTitle} onChange={handleChange} />
                      <input type="text" name="elevatorPitch" placeholder="One-liner elevator pitch" value={form.elevatorPitch} onChange={handleChange} />
                      <input type="text" name="projectDates" placeholder="Project start and end dates" value={form.projectDates} onChange={handleChange} />
                      <select name="fundingRequested" value={form.fundingRequested} onChange={handleChange}><option>Amount or funding requested</option></select>
                    </section>
                    <section>
                      <h3>METHODOLOGY (PROJECT PLAN)</h3>
                      <input type="text" name="what" placeholder="What will be done?" value={form.what} onChange={handleChange} />
                      <input type="text" name="how" placeholder="How will it be done?" value={form.how} onChange={handleChange} />
                      <input type="text" name="timeline" placeholder="Timeline or milestones" value={form.timeline} onChange={handleChange} />
                    </section>
                    <section>
                      <h3>TEAM & CAPABILITIES</h3>
                      <input type="text" name="teamMembers" placeholder="Who is on the team? What are their roles and qualifications?" value={form.teamMembers} onChange={handleChange} />
                      <input type="text" name="teamExperience" placeholder="Past experience relevant to this project" value={form.teamExperience} onChange={handleChange} />
                    </section>
                    <section>
                      <h3>BUDGET OVERVIEW</h3>
                      <input type="text" name="budgetTotal" placeholder="Total budget" value={form.budgetTotal} onChange={handleChange} />
                      <input type="text" name="budgetRequested" placeholder="Funding requested" value={form.budgetRequested} onChange={handleChange} />
                      <input type="text" name="budgetBreakdown" placeholder="Breakdown by category (e.g., Personnel, Equipment, Travel, Overhead, etc.)" value={form.budgetBreakdown} onChange={handleChange} />
                      <input type="text" name="budgetMatching" placeholder="Any matching or in-kind contributions?" value={form.budgetMatching} onChange={handleChange} />
                    </section>
                  </div>
                  {/* Right Column */}
                  <div className="form-col">
                    <section>
                      <h3>PROBLEM STATEMENT</h3>
                      <input type="text" name="problem" placeholder="What problem or need does this project address?" value={form.problem} onChange={handleChange} />
                      <input type="text" name="importance" placeholder="Why is this issue important or urgent?" value={form.importance} onChange={handleChange} />
                      <input type="text" name="affected" placeholder="Who is affected and how?" value={form.affected} onChange={handleChange} />
                    </section>
                    <section>
                      <h3>GOALS & OBJECTIVES</h3>
                      <input type="text" name="goal" placeholder="Primary goal of the project" value={form.goal} onChange={handleChange} />
                      <input type="text" name="objectives" placeholder="2-3 specific, measurable objectives" value={form.objectives} onChange={handleChange} />
                      <input type="text" name="tools" placeholder="Tools, technologies, or techniques involved" value={form.tools} onChange={handleChange} />
                    </section>
                    <section>
                      <h3>BUDGET OVERVIEW</h3>
                      <input type="text" name="budgetTotal" placeholder="Total budget" value={form.budgetTotal} onChange={handleChange} />
                      <input type="text" name="budgetRequested" placeholder="Funding requested" value={form.budgetRequested} onChange={handleChange} />
                      <input type="text" name="budgetBreakdown" placeholder="Breakdown by category (e.g., Personnel, Equipment, Travel, Overhead, etc.)" value={form.budgetBreakdown} onChange={handleChange} />
                      <input type="text" name="budgetMatching" placeholder="Any matching or in kind contributions?" value={form.budgetMatching} onChange={handleChange} />
                    </section>
                    <section>
                      <h3>OUTCOMES & IMPACT</h3>
                      <input type="text" name="outcomesExpected" placeholder="Expected results" value={form.outcomesExpected} onChange={handleChange} />
                      <input type="text" name="beneficiaries" placeholder="Who benefits and how?" value={form.beneficiaries} onChange={handleChange} />
                      <input type="text" name="success" placeholder="How will success be measured?" value={form.success} onChange={handleChange} />
                      <input type="text" name="sustainability" placeholder="Long-term sustainability or scalability" value={form.sustainability} onChange={handleChange} />
                    </section>
                    <section>
                      <h3>COMPLIANCE / ALIGNMENT</h3>
                      <input type="text" name="alignment" placeholder="How does this align with the funder's priorities or mission?" value={form.alignment} onChange={handleChange} />
                      <input type="text" name="considerations" placeholder="Any ethical, environmental, or regulatory considerations?" value={form.considerations} onChange={handleChange} />
                    </section>
                  </div>
                </div>
                {/* Supporting Material Section (optional uploads) */}
                <div className="supporting-material-section">
                  <h3 style={{ textAlign: 'center', margin: '2.5rem 0 1.2rem 0' }}>SUPPORTING MATERIAL (OPTIONAL UPLOADS)</h3>
                  <div className="upload-grid">
                    <label className="upload-card">
                      <input type="file" hidden />
                      <span>CVs or bios</span>
                    </label>
                    <label className="upload-card">
                      <input type="file" hidden />
                      <span>Letters of support</span>
                    </label>
                    <label className="upload-card">
                      <input type="file" hidden />
                      <span>Past grant summaries</span>
                    </label>
                    <label className="upload-card">
                      <input type="file" hidden />
                      <span>Whitepapers or research data</span>
                    </label>
                  </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                  <button className="btn-get-started" type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Generate Grant'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Home; 