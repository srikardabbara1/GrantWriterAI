import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import '/public/styles.css';
import { useAuth } from '../contexts/AuthContext';
import UserProfileDropdown from '../components/UserProfileDropdown';

const GrantResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  // Grant text is expected to be passed via location.state
  const initialGrant = location.state?.grantText || 'No grant text available.';
  const formData = location.state?.formData; // Get the original form data
  const [grantText, setGrantText] = useState(initialGrant);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);

  const handleDownload = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(grantText, 180);
    doc.text(lines, 15, 20);
    doc.save('grant_proposal.pdf');
  };

  const handleAdditionalGrants = () => {
    // Prepare search data from the original form data
    const searchData = {
      organization_name: formData?.orgInfo?.org_name || '',
      organization_type: formData?.orgInfo?.org_status || '',
      organization_location: formData?.orgInfo?.org_location || '',
      organization_mission: formData?.orgInfo?.org_mission || '',
      project_title: formData?.programDetails?.program_name || '',
      project_category: '', // We'll let user select this
      project_description: formData?.programDetails?.program_description || '',
      target_population: formData?.programDetails?.target_population || '',
      funding_amount: formData?.budgetInfo?.amount_requested ? 
        (parseInt(formData.budgetInfo.amount_requested) >= 1000000 ? 'over_1m' :
         parseInt(formData.budgetInfo.amount_requested) >= 500000 ? '500k_1m' :
         parseInt(formData.budgetInfo.amount_requested) >= 100000 ? '100k_500k' :
         parseInt(formData.budgetInfo.amount_requested) >= 50000 ? '50k_100k' :
         parseInt(formData.budgetInfo.amount_requested) >= 10000 ? '10k_50k' : 'under_10k') : '',
      timeline: formData?.programDetails?.program_duration || '',
      expected_outcomes: formData?.programDetails?.evaluation_plan || ''
    };

    // Navigate to find grants with pre-filled data
    navigate('/find-grants', { state: { prefillData: searchData } });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #e3f6f5 0%, #f8f9fa 60%, #d0e6ff 100%)' }}>
      <nav>
        <div className="nav-flex">
          <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>GrantWriter<span className="logo-accent">AI</span></div>
          {user ? (
            <UserProfileDropdown />
          ) : (
            <button className="btn-login" onClick={() => navigate('/auth')}>Login or Sign Up</button>
          )}
        </div>
      </nav>
      <main className="finished-grant-container" style={{ maxWidth: 900, margin: '3rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '2.5rem 2.5rem 2rem 2.5rem' }}>
        <div className="grant-doc-area">
          <div className="grant-doc" style={{ minHeight: 300, border: '1px solid #eee', borderRadius: 8, padding: 24, background: '#fafcff', fontSize: '1.1rem', color: '#222', marginBottom: 24 }}>
            <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Grant Proposal</h2>
            <p style={{ textAlign: 'center', color: '#888', marginBottom: 24 }}>(Edit your grant directly in this document)</p>
            {isEditing ? (
              <textarea
                value={grantText}
                onChange={e => setGrantText(e.target.value)}
                style={{ width: '100%', minHeight: 300, fontSize: '1.1rem', padding: 12, borderRadius: 8, border: '1px solid #ccc', resize: 'vertical' }}
              />
            ) : (
              <div style={{ whiteSpace: 'pre-wrap', minHeight: 300 }}>{grantText}</div>
            )}
          </div>
        </div>
        <div className="grant-actions" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          {isEditing ? (
            <button className="btn-get-started" onClick={handleSave} style={{ fontSize: '1.15rem', padding: '1.1rem 2.5rem', borderRadius: '9999px', width: 240, textAlign: 'center' }}>Save</button>
          ) : (
            <button className="btn-get-started" onClick={handleEdit} style={{ fontSize: '1.15rem', padding: '1.1rem 2.5rem', borderRadius: '9999px', width: 240, textAlign: 'center' }}>Edit</button>
          )}
          <button className="btn-get-started" onClick={handleDownload} style={{ fontSize: '1.15rem', padding: '1.1rem 2.5rem', borderRadius: '9999px', width: 240, textAlign: 'center' }}>Download as PDF</button>
        </div>
        
        {/* Additional Grants Section */}
        <div style={{ 
          marginTop: '3rem', 
          paddingTop: '2rem', 
          borderTop: '1px solid #eee',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            fontWeight: 700, 
            fontSize: '1.4rem', 
            marginBottom: '1rem',
            color: '#1976d2'
          }}>
            Looking for More Opportunities?
          </h3>
          <p style={{ 
            color: '#666', 
            fontSize: '1rem', 
            marginBottom: '2rem',
            maxWidth: 600,
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Discover additional grants that match your organization and project criteria.
          </p>
          <button
            onClick={handleAdditionalGrants}
            style={{
              fontSize: '1.1rem',
              padding: '1rem 2.5rem',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            🔍 Find Additional Grants
          </button>
        </div>
      </main>
    </div>
  );
};

export default GrantResult; 