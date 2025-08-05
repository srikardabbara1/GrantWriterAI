import React, { useState, useEffect } from 'react';
import '/public/styles.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AutoFillPrompt from '../components/AutoFillPrompt';

const ORG_SIZE_OPTIONS = [
  { value: 'small', label: 'Small (1–5)' },
  { value: 'medium', label: 'Medium (6–20)' },
  { value: 'large', label: 'Large (20+)' },
];
const ORG_STATUS_OPTIONS = [
  { value: '501c3', label: '501(c)(3)' },
  { value: 'fiscal_sponsor', label: 'Fiscal sponsor' },
  { value: 'other', label: 'Other' },
];

const TYPE_OF_GRANT_OPTIONS = [
  { value: 'program', label: 'Program' },
  { value: 'operating', label: 'Operating' },
  { value: 'capacity_building', label: 'Capacity-building' },
  { value: 'capital', label: 'Capital' },
  { value: 'research', label: 'Research' },
  { value: 'other', label: 'Other' },
];

const initialOrgInfo = {
  org_name: '',
  org_mission: '',
  org_year_founded: '',
  org_location: '',
  org_website: '',
  org_size: '',
  org_status: '',
};

const initialContactInfo = {
  contact_name: '',
  contact_email: '',
  contact_title: '',
};

const initialGrantOpportunity = {
  funder_name: '',
  grant_title_or_url: '',
  amount_requested: '',
  deadline: '',
  type_of_grant: '',
  is_new_or_existing_program: '',
};

const initialProgramDetails = {
  program_name: '',
  problem_statement: '',
  target_population: '',
  program_description: '',
  program_goals: [''],
  evaluation_plan: '',
  collaborators_partners: '',
  program_duration: '',
};

const initialBudgetInfo = {
  total_project_budget: '',
  amount_requested: '',
  budget_use_summary: '',
  other_funders: '',
};

const initialAttachments = {
  upload_logo: null,
  upload_pitch_deck_or_summary: null,
  upload_990_or_financials: null,
};

const TONE_OPTIONS = [
  { value: '', label: 'No preference' },
  { value: 'formal', label: 'Formal' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'data-driven', label: 'Data-driven' },
  { value: 'storytelling', label: 'Storytelling' },
];
const initialToneStyle = {
  tone_preference: '',
  include_personal_story: '',
};

const STEP_LABELS = [
  'Organization',
  'Contact',
  'Opportunity',
  'Program',
  'Budget',
  'Attachments',
  'Tone & Style',
];

const IntakeForm = ({ onSave, onNext, savedData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Multi-step state
  const [step, setStep] = useState(1);
  const [orgInfo, setOrgInfo] = useState(savedData?.orgInfo || initialOrgInfo);
  const [contactInfo, setContactInfo] = useState(savedData?.contactInfo || initialContactInfo);
  const [grantOpportunity, setGrantOpportunity] = useState(savedData?.grantOpportunity || initialGrantOpportunity);
  const [programDetails, setProgramDetails] = useState(savedData?.programDetails || initialProgramDetails);
  const [budgetInfo, setBudgetInfo] = useState(savedData?.budgetInfo || initialBudgetInfo);
  const [attachments, setAttachments] = useState(savedData?.attachments || initialAttachments);
  const [toneStyle, setToneStyle] = useState(savedData?.toneStyle || initialToneStyle);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Auto-fill state
  const [showAutoFillPrompt, setShowAutoFillPrompt] = useState(false);
  const [hasShownAutoFill, setHasShownAutoFill] = useState(false);

  // On mount, if title is passed from Home, prefill org_name
  useEffect(() => {
    if (location.state && location.state.title) {
      setOrgInfo(prev => ({ ...prev, org_name: location.state.title }));
    }
  }, [location.state]);

  // Show auto-fill prompt for authenticated users
  useEffect(() => {
    if (user && !hasShownAutoFill && !savedData) {
      setShowAutoFillPrompt(true);
      setHasShownAutoFill(true);
    }
  }, [user, hasShownAutoFill, savedData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrgInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Validation for each step
  const validate = () => {
    const newErrors = {};
    if (step === 1) {
      if (!orgInfo.org_name.trim()) newErrors.org_name = 'Organization name is required.';
      if (!orgInfo.org_mission.trim()) newErrors.org_mission = 'Mission is required.';
      if (!orgInfo.org_location.trim()) newErrors.org_location = 'Location is required.';
      if (!orgInfo.org_size) newErrors.org_size = 'Organization size is required.';
      if (!orgInfo.org_status) newErrors.org_status = 'Status is required.';
    } else if (step === 2) {
      if (!contactInfo.contact_name.trim()) newErrors.contact_name = 'Contact name is required.';
      if (!contactInfo.contact_email.trim()) newErrors.contact_email = 'Contact email is required.';
    } else if (step === 3) {
      if (!grantOpportunity.funder_name.trim()) newErrors.funder_name = 'Funder name is required.';
      if (!grantOpportunity.grant_title_or_url.trim()) newErrors.grant_title_or_url = 'Grant title or URL is required.';
      if (!grantOpportunity.amount_requested) newErrors.amount_requested = 'Amount requested is required.';
      if (!grantOpportunity.deadline) newErrors.deadline = 'Deadline is required.';
      if (!grantOpportunity.type_of_grant) newErrors.type_of_grant = 'Type of grant is required.';
      if (!grantOpportunity.is_new_or_existing_program) newErrors.is_new_or_existing_program = 'Please select new or existing program.';
    } else if (step === 4) {
      if (!programDetails.program_name.trim()) newErrors.program_name = 'Program name is required.';
      if (!programDetails.problem_statement.trim()) newErrors.problem_statement = 'Problem statement is required.';
      if (!programDetails.target_population.trim()) newErrors.target_population = 'Target population is required.';
      if (!programDetails.program_description.trim()) newErrors.program_description = 'Program description is required.';
      if (!programDetails.program_duration.trim()) newErrors.program_duration = 'Program duration is required.';
      if (!programDetails.program_goals.length || programDetails.program_goals.some(g => !g.trim())) newErrors.program_goals = 'At least one program goal is required.';
    } else if (step === 5) {
      if (!budgetInfo.total_project_budget) newErrors.total_project_budget = 'Total project budget is required.';
      if (!budgetInfo.amount_requested) newErrors.amount_requested = 'Amount requested is required.';
      if (!budgetInfo.budget_use_summary.trim()) newErrors.budget_use_summary = 'Budget use summary is required.';
    } else if (step === 6) {
      // No required fields for attachments
    } else if (step === 7) {
      // No required fields for tone/style
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (onSave) onSave({ orgInfo, contactInfo, grantOpportunity, programDetails, budgetInfo, attachments, toneStyle });
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (validate()) {
      if (step === 1) setStep(2);
      else if (step === 2) setStep(3);
      else if (step === 3) setStep(4);
      else if (step === 4) setStep(5);
      else if (step === 5) setStep(6);
      else if (step === 6) setStep(7);
      else {
        // Final submit
        setLoading(true);
        try {
          // Prepare data as a single JSON object
          const data = { orgInfo, contactInfo, grantOpportunity, programDetails, budgetInfo, attachments, toneStyle };
          // For now, omit file uploads from attachments (backend integration needed for files)
          const response = await fetch('http://localhost:3000/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          const result = await response.json();
                              if (result && result.result) {
                      // Pass both the grant text and the form data
                      const allFormData = { orgInfo, contactInfo, grantOpportunity, programDetails, budgetInfo, attachments, toneStyle };
                      navigate('/grant-result', { state: { grantText: result.result, formData: allFormData } });
                    } else {
                      setSubmitError('Failed to generate grant proposal.');
                    }
        } catch (err) {
          setSubmitError('An error occurred while generating the grant proposal.');
        }
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Handlers for dynamic program_goals
  const handleGoalChange = (idx, value) => {
    setProgramDetails(prev => {
      const goals = [...prev.program_goals];
      goals[idx] = value;
      return { ...prev, program_goals: goals };
    });
  };
  const addGoal = () => {
    setProgramDetails(prev => ({ ...prev, program_goals: [...prev.program_goals, ''] }));
  };
  const removeGoal = (idx) => {
    setProgramDetails(prev => {
      const goals = prev.program_goals.filter((_, i) => i !== idx);
      return { ...prev, program_goals: goals };
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setAttachments(prev => ({ ...prev, [name]: files[0] || null }));
  };

  // Auto-fill handlers
  const handleAutoFillAccept = (autoFillData) => {
    if (autoFillData.contact_email) {
      setContactInfo(prev => ({ ...prev, contact_email: autoFillData.contact_email }));
    }
    if (autoFillData.contact_name) {
      setContactInfo(prev => ({ ...prev, contact_name: autoFillData.contact_name }));
    }
    if (autoFillData.org_name) {
      setOrgInfo(prev => ({ ...prev, org_name: autoFillData.org_name }));
    }
    if (autoFillData.org_mission) {
      setOrgInfo(prev => ({ ...prev, org_mission: autoFillData.org_mission }));
    }
    if (autoFillData.org_location) {
      setOrgInfo(prev => ({ ...prev, org_location: autoFillData.org_location }));
    }
    setShowAutoFillPrompt(false);
  };

  const handleAutoFillDecline = () => {
    setShowAutoFillPrompt(false);
  };

  const handleAutoFillClose = () => {
    setShowAutoFillPrompt(false);
    setHasShownAutoFill(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #e3f6f5 0%, #f8f9fa 60%, #d0e6ff 100%)' }}>
      {showAutoFillPrompt && (
        <AutoFillPrompt
          onAccept={handleAutoFillAccept}
          onDecline={handleAutoFillDecline}
          onClose={handleAutoFillClose}
        />
      )}
      <nav>
        <div className="nav-flex">
          <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>GrantWriter<span className="logo-accent">AI</span></div>
          <button className="btn-login" onClick={() => navigate('/auth')}>
            {user ? `${user.email}` : 'Sign In'}
          </button>
        </div>
      </nav>
      <main className="home-container" style={{ maxWidth: 900, minWidth: 500, margin: '4rem auto', background: '#fff', borderRadius: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '3.5rem 4.5rem 3.5rem 4.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Stepper Bar */}
        <div style={{ width: '100%', marginBottom: '2.5rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 700, gap: 0 }}>
            {STEP_LABELS.map((label, idx) => {
              const isCompleted = step > idx + 1;
              const isCurrent = step === idx + 1;
              const ballColor = isCurrent ? '#1976d2' : isCompleted ? '#22b14c' : '#222';
              const textColor = isCurrent ? '#1976d2' : isCompleted ? '#22b14c' : '#222';
              return (
                <React.Fragment key={label}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 70 }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: ballColor,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      boxShadow: isCurrent ? '0 0 0 4px #e3f6f5' : 'none',
                      transition: 'background 0.2s',
                    }}>{idx + 1}</div>
                    <div style={{ fontSize: '0.95rem', color: textColor, marginTop: 6, textAlign: 'center', fontWeight: isCurrent ? 700 : 500 }}>{label}</div>
                  </div>
                  {idx < STEP_LABELS.length - 1 && (
                    <div style={{ flex: 1, height: 4, background: isCompleted ? '#22b14c' : '#ccc', margin: '0 2px', borderRadius: 2 }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
        {/* Section Title */}
        <h2 style={{ fontWeight: 800, fontSize: '2.4rem', marginBottom: '2.2rem', textAlign: 'center' }}>
          {step === 1 ? 'Organization Information' : step === 2 ? 'Contact Information' : step === 3 ? 'Grant Opportunity' : step === 4 ? 'Program Details' : step === 5 ? 'Budget Info' : step === 6 ? 'Attachments' : 'Tone and Style'}
        </h2>
        <form onSubmit={handleNext} style={{ width: '100%' }}>
          {step === 1 && (
            <div className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Organization Name</label>
                <input
                  type="text"
                  name="org_name"
                  value={orgInfo.org_name}
                  onChange={e => setOrgInfo({ ...orgInfo, org_name: e.target.value })}
                  className="form-input"
                  style={{
                    fontSize: '1.25rem',
                    padding: '1.1rem 2.2rem',
                    borderRadius: '9999px',
                    border: 'none',
                    background: '#f7f7f7',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    width: '60%',
                    outline: 'none',
                    marginBottom: 0
                  }}
                  placeholder="Legal Name of Nonprofit *"
                />
                {errors.org_name && <div className="form-error">{errors.org_name}</div>}
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Mission Statement</label>
                <textarea
                  name="org_mission"
                  value={orgInfo.org_mission}
                  onChange={e => setOrgInfo({ ...orgInfo, org_mission: e.target.value })}
                  className="form-input"
                  rows={5}
                  style={{
                    width: '90%',
                    fontSize: '1.18rem',
                    padding: '1.1rem 2.2rem',
                    borderRadius: '28px',
                    border: 'none',
                    background: '#f7f7f7',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    outline: 'none',
                    resize: 'vertical',
                    marginBottom: 0
                  }}
                  placeholder="Mission Statement *"
                />
                {errors.org_mission && <div className="form-error">{errors.org_mission}</div>}
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Year Founded</label>
                <input
                  type="number"
                  name="org_year_founded"
                  value={orgInfo.org_year_founded}
                  onChange={e => setOrgInfo({ ...orgInfo, org_year_founded: e.target.value })}
                  className="form-input"
                  style={{
                    fontSize: '1.18rem',
                    padding: '1.1rem 2.2rem',
                    borderRadius: '9999px',
                    border: 'none',
                    background: '#f7f7f7',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    width: '40%',
                    outline: 'none',
                    marginBottom: 0
                  }}
                  placeholder="Year Founded"
                />
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Location (City, State or Region Served)</label>
                <input
                  type="text"
                  name="org_location"
                  value={orgInfo.org_location}
                  onChange={e => setOrgInfo({ ...orgInfo, org_location: e.target.value })}
                  className="form-input"
                  style={{
                    fontSize: '1.18rem',
                    padding: '1.1rem 2.2rem',
                    borderRadius: '9999px',
                    border: 'none',
                    background: '#f7f7f7',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    width: '70%',
                    outline: 'none',
                    marginBottom: 0
                  }}
                  placeholder="Location (City, State or Region Served) *"
                />
                {errors.org_location && <div className="form-error">{errors.org_location}</div>}
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Website</label>
                <input
                  type="text"
                  name="org_website"
                  value={orgInfo.org_website}
                  onChange={e => setOrgInfo({ ...orgInfo, org_website: e.target.value })}
                  className="form-input"
                  style={{
                    fontSize: '1.18rem',
                    padding: '1.1rem 2.2rem',
                    borderRadius: '9999px',
                    border: 'none',
                    background: '#f7f7f7',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    width: '60%',
                    outline: 'none',
                    marginBottom: 0
                  }}
                  placeholder="Website"
                />
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Organization Size</label>
                <select
                  name="org_size"
                  value={orgInfo.org_size}
                  onChange={e => setOrgInfo({ ...orgInfo, org_size: e.target.value })}
                  className="form-input"
                  style={{
                    fontSize: '1.18rem',
                    padding: '1.1rem 2.2rem',
                    borderRadius: '9999px',
                    border: 'none',
                    background: '#f7f7f7',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    width: '50%',
                    outline: 'none',
                    marginBottom: 0
                  }}
                >
                  <option value="">Select size</option>
                  {ORG_SIZE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                {errors.org_size && <div className="form-error">{errors.org_size}</div>}
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Organization Status</label>
                <select
                  name="org_status"
                  value={orgInfo.org_status}
                  onChange={e => setOrgInfo({ ...orgInfo, org_status: e.target.value })}
                  className="form-input"
                  style={{
                    fontSize: '1.18rem',
                    padding: '1.1rem 2.2rem',
                    borderRadius: '9999px',
                    border: 'none',
                    background: '#f7f7f7',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    width: '50%',
                    outline: 'none',
                    marginBottom: 0
                  }}
                >
                  <option value="">Select status</option>
                  {ORG_STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                {errors.org_status && <div className="form-error">{errors.org_status}</div>}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Contact Name</label>
                <input
                  type="text"
                  name="contact_name"
                  value={contactInfo.contact_name}
                  onChange={e => setContactInfo({ ...contactInfo, contact_name: e.target.value })}
                  className="form-input"
                  style={{ fontSize: '1.25rem', padding: '1.1rem 2.2rem', borderRadius: '9999px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '60%', outline: 'none', marginBottom: 0 }}
                  placeholder="Contact Name *"
                />
                {errors.contact_name && <div className="form-error">{errors.contact_name}</div>}
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Contact Email</label>
                <input
                  type="text"
                  name="contact_email"
                  value={contactInfo.contact_email}
                  onChange={e => setContactInfo({ ...contactInfo, contact_email: e.target.value })}
                  className="form-input"
                  style={{ fontSize: '1.25rem', padding: '1.1rem 2.2rem', borderRadius: '9999px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '60%', outline: 'none', marginBottom: 0 }}
                  placeholder="Contact Email *"
                />
                {errors.contact_email && <div className="form-error">{errors.contact_email}</div>}
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Contact Title</label>
                <input
                  type="text"
                  name="contact_title"
                  value={contactInfo.contact_title}
                  onChange={e => setContactInfo({ ...contactInfo, contact_title: e.target.value })}
                  className="form-input"
                  style={{ fontSize: '1.18rem', padding: '1.1rem 2.2rem', borderRadius: '9999px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '60%', outline: 'none', marginBottom: 0 }}
                  placeholder="Contact Title"
                />
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Funder Name</label>
                <input
                  type="text"
                  name="funder_name"
                  value={grantOpportunity.funder_name}
                  onChange={e => setGrantOpportunity({ ...grantOpportunity, funder_name: e.target.value })}
                  className="form-input"
                  style={{ fontSize: '1.25rem', padding: '1.1rem 2.2rem', borderRadius: '9999px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '60%', outline: 'none', marginBottom: 0 }}
                  placeholder="Funder Name *"
                />
                {errors.funder_name && <div className="form-error">{errors.funder_name}</div>}
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Grant Title or URL</label>
                <input
                  type="text"
                  name="grant_title_or_url"
                  value={grantOpportunity.grant_title_or_url}
                  onChange={e => setGrantOpportunity({ ...grantOpportunity, grant_title_or_url: e.target.value })}
                  className="form-input"
                  style={{ fontSize: '1.18rem', padding: '1.1rem 2.2rem', borderRadius: '9999px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '60%', outline: 'none', marginBottom: 0 }}
                  placeholder="Grant Title or URL *"
                />
                {errors.grant_title_or_url && <div className="form-error">{errors.grant_title_or_url}</div>}
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Amount Requested (USD)</label>
                <input
                  type="number"
                  name="amount_requested"
                  value={grantOpportunity.amount_requested}
                  onChange={e => setGrantOpportunity({ ...grantOpportunity, amount_requested: e.target.value })}
                  className="form-input"
                  style={{ fontSize: '1.18rem', padding: '1.1rem 2.2rem', borderRadius: '9999px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '40%', outline: 'none', marginBottom: 0 }}
                  placeholder="Amount Requested *"
                />
                {errors.amount_requested && <div className="form-error">{errors.amount_requested}</div>}
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={grantOpportunity.deadline}
                  onChange={e => setGrantOpportunity({ ...grantOpportunity, deadline: e.target.value })}
                  className="form-input"
                  style={{ fontSize: '1.18rem', padding: '1.1rem 2.2rem', borderRadius: '9999px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '40%', outline: 'none', marginBottom: 0 }}
                  placeholder="Deadline *"
                />
                {errors.deadline && <div className="form-error">{errors.deadline}</div>}
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Type of Grant</label>
                <select
                  name="type_of_grant"
                  value={grantOpportunity.type_of_grant}
                  onChange={e => setGrantOpportunity({ ...grantOpportunity, type_of_grant: e.target.value })}
                  className="form-input"
                  style={{ fontSize: '1.18rem', padding: '1.1rem 2.2rem', borderRadius: '9999px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '50%', outline: 'none', marginBottom: 0 }}
                >
                  <option value="">Select type</option>
                  {TYPE_OF_GRANT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                {errors.type_of_grant && <div className="form-error">{errors.type_of_grant}</div>}
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Is this for a new or existing program?</label>
                <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '1.1rem' }}>
                    <input type="radio" name="is_new_or_existing_program" value="new" checked={grantOpportunity.is_new_or_existing_program === 'new'} onChange={e => setGrantOpportunity({ ...grantOpportunity, is_new_or_existing_program: e.target.value })} />
                    New
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '1.1rem' }}>
                    <input type="radio" name="is_new_or_existing_program" value="existing" checked={grantOpportunity.is_new_or_existing_program === 'existing'} onChange={e => setGrantOpportunity({ ...grantOpportunity, is_new_or_existing_program: e.target.value })} />
                    Existing
                  </label>
                </div>
                {errors.is_new_or_existing_program && <div className="form-error">{errors.is_new_or_existing_program}</div>}
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Program Name</label>
                <input type="text" name="program_name" value={programDetails.program_name} onChange={e => setProgramDetails({ ...programDetails, program_name: e.target.value })} className="form-input" style={{ fontSize: '1.25rem', padding: '1.1rem 2.2rem', borderRadius: '9999px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '60%', outline: 'none', marginBottom: 0 }} />
                {errors.program_name && <div className="form-error">{errors.program_name}</div>}
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Problem Statement</label>
                <textarea name="problem_statement" value={programDetails.problem_statement} onChange={e => setProgramDetails({ ...programDetails, problem_statement: e.target.value })} className="form-input" rows={3} style={{ fontSize: '1.18rem', padding: '1.1rem 2.2rem', borderRadius: '28px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '90%', outline: 'none', resize: 'vertical', marginBottom: 0 }} />
                {errors.problem_statement && <div className="form-error">{errors.problem_statement}</div>}
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Target Population</label>
                <textarea name="target_population" value={programDetails.target_population} onChange={e => setProgramDetails({ ...programDetails, target_population: e.target.value })} className="form-input" rows={3} style={{ fontSize: '1.18rem', padding: '1.1rem 2.2rem', borderRadius: '28px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '90%', outline: 'none', resize: 'vertical', marginBottom: 0 }} />
                {errors.target_population && <div className="form-error">{errors.target_population}</div>}
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Program Description</label>
                <textarea name="program_description" value={programDetails.program_description} onChange={e => setProgramDetails({ ...programDetails, program_description: e.target.value })} className="form-input" rows={3} style={{ fontSize: '1.18rem', padding: '1.1rem 2.2rem', borderRadius: '28px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '90%', outline: 'none', resize: 'vertical', marginBottom: 0 }} />
                {errors.program_description && <div className="form-error">{errors.program_description}</div>}
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Program Goals</label>
                {programDetails.program_goals.map((goal, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <input type="text" value={goal} onChange={e => handleGoalChange(idx, e.target.value)} className="form-input" style={{ flex: 1, fontSize: '1.18rem', padding: '1.1rem 2.2rem', borderRadius: '9999px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }} />
                    {programDetails.program_goals.length > 1 && (
                      <button type="button" onClick={() => removeGoal(idx)} style={{ background: 'none', border: 'none', color: '#d32f2f', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>Remove</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addGoal} className="btn-get-started" style={{ marginTop: 4, fontSize: '0.95rem', padding: '0.5rem 1.2rem' }}>Add Goal</button>
                {errors.program_goals && <div className="form-error">{errors.program_goals}</div>}
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Evaluation Plan</label>
                <textarea name="evaluation_plan" value={programDetails.evaluation_plan} onChange={e => setProgramDetails({ ...programDetails, evaluation_plan: e.target.value })} className="form-input" rows={3} style={{ fontSize: '1.18rem', padding: '1.1rem 2.2rem', borderRadius: '28px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '90%', outline: 'none', resize: 'vertical', marginBottom: 0 }} />
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Collaborators/Partners</label>
                <textarea name="collaborators_partners" value={programDetails.collaborators_partners} onChange={e => setProgramDetails({ ...programDetails, collaborators_partners: e.target.value })} className="form-input" rows={2} style={{ fontSize: '1.18rem', padding: '1.1rem 2.2rem', borderRadius: '28px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '90%', outline: 'none', resize: 'vertical', marginBottom: 0 }} />
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Program Duration</label>
                <input type="text" name="program_duration" value={programDetails.program_duration} onChange={e => setProgramDetails({ ...programDetails, program_duration: e.target.value })} className="form-input" style={{ fontSize: '1.18rem', padding: '1.1rem 2.2rem', borderRadius: '9999px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '60%', outline: 'none', marginBottom: 0 }} />
                {errors.program_duration && <div className="form-error">{errors.program_duration}</div>}
              </div>
            </div>
          )}
          {step === 5 && (
            <div className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Total Project Budget (USD)</label>
                <input type="number" name="total_project_budget" value={budgetInfo.total_project_budget} onChange={e => setBudgetInfo({ ...budgetInfo, total_project_budget: e.target.value })} className="form-input" style={{ fontSize: '1.25rem', padding: '1.1rem 2.2rem', borderRadius: '9999px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '60%', outline: 'none', marginBottom: 0 }} />
                {errors.total_project_budget && <div className="form-error">{errors.total_project_budget}</div>}
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Amount Requested (USD)</label>
                <input type="number" name="amount_requested" value={budgetInfo.amount_requested} onChange={e => setBudgetInfo({ ...budgetInfo, amount_requested: e.target.value })} className="form-input" style={{ fontSize: '1.18rem', padding: '1.1rem 2.2rem', borderRadius: '9999px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '40%', outline: 'none', marginBottom: 0 }} />
                {errors.amount_requested && <div className="form-error">{errors.amount_requested}</div>}
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Budget Use Summary</label>
                <textarea name="budget_use_summary" value={budgetInfo.budget_use_summary} onChange={e => setBudgetInfo({ ...budgetInfo, budget_use_summary: e.target.value })} className="form-input" rows={3} style={{ fontSize: '1.18rem', padding: '1.1rem 2.2rem', borderRadius: '28px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '90%', outline: 'none', resize: 'vertical', marginBottom: 0 }} />
                {errors.budget_use_summary && <div className="form-error">{errors.budget_use_summary}</div>}
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Other Funders (optional)</label>
                <textarea name="other_funders" value={budgetInfo.other_funders} onChange={e => setBudgetInfo({ ...budgetInfo, other_funders: e.target.value })} className="form-input" rows={2} style={{ fontSize: '1.18rem', padding: '1.1rem 2.2rem', borderRadius: '28px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '90%', outline: 'none', resize: 'vertical', marginBottom: 0 }} />
              </div>
            </div>
          )}
          {step === 6 && (
            <div className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Upload Organization Logo</label>
                <input type="file" name="upload_logo" accept="image/*" onChange={handleFileChange} className="form-input" style={{ fontSize: '1.18rem', padding: '1.1rem 2.2rem', borderRadius: '9999px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '60%', outline: 'none', marginBottom: 0 }} />
                {attachments.upload_logo && <div style={{ fontSize: '0.95rem', color: '#1976d2', marginTop: 4 }}>{attachments.upload_logo.name}</div>}
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Upload Pitch Deck or Summary</label>
                <input type="file" name="upload_pitch_deck_or_summary" onChange={handleFileChange} className="form-input" style={{ fontSize: '1.18rem', padding: '1.1rem 2.2rem', borderRadius: '9999px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '60%', outline: 'none', marginBottom: 0 }} />
                {attachments.upload_pitch_deck_or_summary && <div style={{ fontSize: '0.95rem', color: '#1976d2', marginTop: 4 }}>{attachments.upload_pitch_deck_or_summary.name}</div>}
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Upload 990 or Financials</label>
                <input type="file" name="upload_990_or_financials" onChange={handleFileChange} className="form-input" style={{ fontSize: '1.18rem', padding: '1.1rem 2.2rem', borderRadius: '9999px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '60%', outline: 'none', marginBottom: 0 }} />
                {attachments.upload_990_or_financials && <div style={{ fontSize: '0.95rem', color: '#1976d2', marginTop: 4 }}>{attachments.upload_990_or_financials.name}</div>}
              </div>
            </div>
          )}
          {step === 7 && (
            <div className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Tone Preference</label>
                <select name="tone_preference" value={toneStyle.tone_preference} onChange={e => setToneStyle({ ...toneStyle, tone_preference: e.target.value })} className="form-input" style={{ fontSize: '1.18rem', padding: '1.1rem 2.2rem', borderRadius: '9999px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '50%', outline: 'none', marginBottom: 0 }}>
                  {TONE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>Include Personal Story (optional)</label>
                <textarea name="include_personal_story" value={toneStyle.include_personal_story} onChange={e => setToneStyle({ ...toneStyle, include_personal_story: e.target.value })} className="form-input" rows={3} style={{ fontSize: '1.18rem', padding: '1.1rem 2.2rem', borderRadius: '28px', border: 'none', background: '#f7f7f7', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', width: '90%', outline: 'none', resize: 'vertical', marginBottom: 0 }} />
              </div>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: step === 1 ? 'flex-end' : 'space-between', gap: 16, marginTop: 32 }}>
            {step > 1 && <button type="button" className="btn-get-started" onClick={handleBack}>Back</button>}
            <button type="button" className="btn-get-started" onClick={handleSave}>Save</button>
            <button type="submit" className="btn-get-started" disabled={loading}>{step === 7 ? (loading ? 'Generating...' : 'Finish') : 'Next'}</button>
          </div>
        </form>
        {submitError && <div style={{ color: '#d32f2f', marginTop: 16, textAlign: 'center', fontWeight: 600 }}>{submitError}</div>}
      </main>
    </div>
  );
};

export default IntakeForm; 