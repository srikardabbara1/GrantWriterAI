import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import '/public/styles.css';

const GrantResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Grant text is expected to be passed via location.state
  const initialGrant = location.state?.grantText || 'No grant text available.';
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

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #e3f6f5 0%, #f8f9fa 60%, #d0e6ff 100%)' }}>
      <nav>
        <div className="nav-flex">
          <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>GrantWriter<span className="logo-accent">AI</span></div>
          <button className="btn-login">My Account</button>
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
        <div className="grant-actions" style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          {isEditing ? (
            <button className="btn-get-started" onClick={handleSave} style={{ marginBottom: '1.5rem', fontSize: '1.15rem', padding: '1.1rem 2.5rem', borderRadius: '9999px', width: 240, textAlign: 'center' }}>Save</button>
          ) : (
            <button className="btn-get-started" onClick={handleEdit} style={{ marginBottom: '1.5rem', fontSize: '1.15rem', padding: '1.1rem 2.5rem', borderRadius: '9999px', width: 240, textAlign: 'center' }}>Edit</button>
          )}
          <button className="btn-get-started" onClick={handleDownload} style={{ fontSize: '1.15rem', padding: '1.1rem 2.5rem', borderRadius: '9999px', width: 240, textAlign: 'center' }}>Download as PDF</button>
        </div>
      </main>
    </div>
  );
};

export default GrantResult; 