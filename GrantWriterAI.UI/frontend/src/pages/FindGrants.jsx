import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserProfileDropdown from '../components/UserProfileDropdown';
import '/public/styles.css';

const ORGANIZATION_TYPES = [
  { value: 'nonprofit', label: 'Nonprofit Organization' },
  { value: 'school', label: 'School/Educational Institution' },
  { value: 'healthcare', label: 'Healthcare Organization' },
  { value: 'government', label: 'Government Agency' },
  { value: 'research', label: 'Research Institution' },
  { value: 'community', label: 'Community Organization' },
  { value: 'arts', label: 'Arts & Culture Organization' },
  { value: 'environmental', label: 'Environmental Organization' },
  { value: 'other', label: 'Other' },
];

const PROJECT_CATEGORIES = [
  { value: 'education', label: 'Education & Youth Development' },
  { value: 'healthcare', label: 'Healthcare & Medical Research' },
  { value: 'environment', label: 'Environment & Conservation' },
  { value: 'arts', label: 'Arts & Culture' },
  { value: 'community', label: 'Community Development' },
  { value: 'technology', label: 'Technology & Innovation' },
  { value: 'social_services', label: 'Social Services' },
  { value: 'research', label: 'Research & Development' },
  { value: 'infrastructure', label: 'Infrastructure & Facilities' },
  { value: 'other', label: 'Other' },
];

const GRANT_AMOUNTS = [
  { value: 'under_10k', label: 'Under $10,000' },
  { value: '10k_50k', label: '$10,000 - $50,000' },
  { value: '50k_100k', label: '$50,000 - $100,000' },
  { value: '100k_500k', label: '$100,000 - $500,000' },
  { value: '500k_1m', label: '$500,000 - $1,000,000' },
  { value: 'over_1m', label: 'Over $1,000,000' },
];

const FindGrants = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    organization_name: '',
    organization_type: '',
    organization_location: '',
    organization_mission: '',
    project_title: '',
    project_category: '',
    project_description: '',
    funding_amount: '',
    timeline: '',
    target_population: '',
    expected_outcomes: '',
  });
  const [loading, setLoading] = useState(false);

  // Handle pre-filled data from grant result page
  useEffect(() => {
    if (location.state?.prefillData) {
      const prefillData = location.state.prefillData;
      setFormData(prev => ({
        ...prev,
        organization_name: prefillData.organization_name || prev.organization_name,
        organization_type: prefillData.organization_type || prev.organization_type,
        organization_location: prefillData.organization_location || prev.organization_location,
        organization_mission: prefillData.organization_mission || prev.organization_mission,
        project_title: prefillData.project_title || prev.project_title,
        project_category: prefillData.project_category || prev.project_category,
        project_description: prefillData.project_description || prev.project_description,
        target_population: prefillData.target_population || prev.target_population,
        funding_amount: prefillData.funding_amount || prev.funding_amount,
        timeline: prefillData.timeline || prev.timeline,
        expected_outcomes: prefillData.expected_outcomes || prev.expected_outcomes,
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log('Searching for grants with:', formData);
      
      const response = await fetch('http://localhost:3000/api/search-grants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Search result:', result);
      
      if (result && result.grants) {
        navigate('/grant-results', { state: { searchData: formData } });
      } else {
        console.error('No grants in response:', result);
        alert('No grants found. Please try different search criteria.');
      }
    } catch (error) {
      console.error('Error searching for grants:', error);
      alert(`Error: ${error.message}. Please check if your backend server is running.`);
    }
    setLoading(false);
  };

  const renderStep1 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <label style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>
          Organization Name *
        </label>
        <input
          type="text"
          name="organization_name"
          value={formData.organization_name}
          onChange={handleChange}
          style={{
            fontSize: '1.25rem',
            padding: '1.1rem 2.2rem',
            borderRadius: '9999px',
            border: 'none',
            background: '#f7f7f7',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            width: '100%',
            outline: 'none',
          }}
          placeholder="Enter your organization name"
        />
      </div>

      <div>
        <label style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>
          Organization Type *
        </label>
        <select
          name="organization_type"
          value={formData.organization_type}
          onChange={handleChange}
          style={{
            fontSize: '1.25rem',
            padding: '1.1rem 2.2rem',
            borderRadius: '9999px',
            border: 'none',
            background: '#f7f7f7',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            width: '100%',
            outline: 'none',
          }}
        >
          <option value="">Select organization type</option>
          {ORGANIZATION_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>
          Organization Location *
        </label>
        <input
          type="text"
          name="organization_location"
          value={formData.organization_location}
          onChange={handleChange}
          style={{
            fontSize: '1.25rem',
            padding: '1.1rem 2.2rem',
            borderRadius: '9999px',
            border: 'none',
            background: '#f7f7f7',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            width: '100%',
            outline: 'none',
          }}
          placeholder="City, State or region served"
        />
      </div>

      <div>
        <label style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>
          Organization Mission
        </label>
        <textarea
          name="organization_mission"
          value={formData.organization_mission}
          onChange={handleChange}
          rows={4}
          style={{
            width: '100%',
            fontSize: '1.18rem',
            padding: '1.1rem 2.2rem',
            borderRadius: '28px',
            border: 'none',
            background: '#f7f7f7',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            outline: 'none',
            resize: 'vertical',
          }}
          placeholder="Briefly describe your organization's mission and goals"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <label style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>
          Project Title *
        </label>
        <input
          type="text"
          name="project_title"
          value={formData.project_title}
          onChange={handleChange}
          style={{
            fontSize: '1.25rem',
            padding: '1.1rem 2.2rem',
            borderRadius: '9999px',
            border: 'none',
            background: '#f7f7f7',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            width: '100%',
            outline: 'none',
          }}
          placeholder="What would you like to call your project?"
        />
      </div>

      <div>
        <label style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>
          Project Category *
        </label>
        <select
          name="project_category"
          value={formData.project_category}
          onChange={handleChange}
          style={{
            fontSize: '1.25rem',
            padding: '1.1rem 2.2rem',
            borderRadius: '9999px',
            border: 'none',
            background: '#f7f7f7',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            width: '100%',
            outline: 'none',
          }}
        >
          <option value="">Select project category</option>
          {PROJECT_CATEGORIES.map(category => (
            <option key={category.value} value={category.value}>{category.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>
          Project Description *
        </label>
        <textarea
          name="project_description"
          value={formData.project_description}
          onChange={handleChange}
          rows={4}
          style={{
            width: '100%',
            fontSize: '1.18rem',
            padding: '1.1rem 2.2rem',
            borderRadius: '28px',
            border: 'none',
            background: '#f7f7f7',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            outline: 'none',
            resize: 'vertical',
          }}
          placeholder="Describe what you want to accomplish with this project"
        />
      </div>

      <div>
        <label style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>
          Target Population
        </label>
        <input
          type="text"
          name="target_population"
          value={formData.target_population}
          onChange={handleChange}
          style={{
            fontSize: '1.25rem',
            padding: '1.1rem 2.2rem',
            borderRadius: '9999px',
            border: 'none',
            background: '#f7f7f7',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            width: '100%',
            outline: 'none',
          }}
          placeholder="Who will benefit from this project?"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <label style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>
          Funding Amount Needed *
        </label>
        <select
          name="funding_amount"
          value={formData.funding_amount}
          onChange={handleChange}
          style={{
            fontSize: '1.25rem',
            padding: '1.1rem 2.2rem',
            borderRadius: '9999px',
            border: 'none',
            background: '#f7f7f7',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            width: '100%',
            outline: 'none',
          }}
        >
          <option value="">Select funding amount</option>
          {GRANT_AMOUNTS.map(amount => (
            <option key={amount.value} value={amount.value}>{amount.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>
          Project Timeline
        </label>
        <input
          type="text"
          name="timeline"
          value={formData.timeline}
          onChange={handleChange}
          style={{
            fontSize: '1.25rem',
            padding: '1.1rem 2.2rem',
            borderRadius: '9999px',
            border: 'none',
            background: '#f7f7f7',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            width: '100%',
            outline: 'none',
          }}
          placeholder="e.g., 12 months, 6 months, etc."
        />
      </div>

      <div>
        <label style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, display: 'block' }}>
          Expected Outcomes
        </label>
        <textarea
          name="expected_outcomes"
          value={formData.expected_outcomes}
          onChange={handleChange}
          rows={4}
          style={{
            width: '100%',
            fontSize: '1.18rem',
            padding: '1.1rem 2.2rem',
            borderRadius: '28px',
            border: 'none',
            background: '#f7f7f7',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            outline: 'none',
            resize: 'vertical',
          }}
          placeholder="What results do you expect from this project?"
        />
      </div>
    </div>
  );

  const stepTitles = ['Organization Info', 'Project Details', 'Funding & Timeline'];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #e3f6f5 0%, #f8f9fa 60%, #d0e6ff 100%)' }}>
      <nav>
        <div className="nav-flex">
          <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>
            GrantWriter<span className="logo-accent">AI</span>
          </div>
          {user ? (
            <UserProfileDropdown />
          ) : (
            <button className="btn-login" onClick={() => navigate('/auth')}>Login or Sign Up</button>
          )}
        </div>
      </nav>

      <main style={{ 
        maxWidth: 900, 
        margin: '3rem auto', 
        background: '#fff', 
        borderRadius: 24, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)', 
        padding: '3rem 4rem',
        minHeight: 'calc(100vh - 200px)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontWeight: 800, fontSize: '2.5rem', marginBottom: '1rem', color: '#1976d2' }}>
            Find Matching Grants
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
            Tell us about your organization and project, and we'll find the best grant opportunities for you.
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            {stepTitles.map((title, index) => (
              <div key={title} style={{ 
                flex: 1, 
                textAlign: 'center',
                color: step >= index + 1 ? '#1976d2' : '#999',
                fontWeight: step === index + 1 ? 700 : 500
              }}>
                {title}
              </div>
            ))}
          </div>
          <div style={{ 
            height: 8, 
            background: '#e0e0e0', 
            borderRadius: 4,
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
              width: `${(step / 3) * 100}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Form Content */}
        <div style={{ marginBottom: '3rem' }}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        {/* Navigation Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingTop: '2rem',
          borderTop: '1px solid #eee'
        }}>
          <button
            onClick={handleBack}
            disabled={step === 1}
            style={{
              padding: '1rem 2rem',
              background: step === 1 ? '#f5f5f5' : '#fff',
              border: '1px solid #ddd',
              borderRadius: '9999px',
              color: step === 1 ? '#999' : '#333',
              cursor: step === 1 ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={loading}
            className="btn-get-started"
            style={{
              fontSize: '1.1rem',
              padding: '1rem 2.5rem',
              borderRadius: '9999px',
              fontWeight: 700,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Searching...' : step === 3 ? 'Find Grants' : 'Next'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default FindGrants; 