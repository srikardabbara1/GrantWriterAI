import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '/public/styles.css';

const AutoFillPrompt = ({ onAccept, onDecline, onClose }) => {
  const { user } = useAuth();
  const [selectedFields, setSelectedFields] = useState({
    contact_name: true,
    contact_email: true,
    org_name: false,
    org_mission: false,
    org_location: false,
  });

  const handleAccept = () => {
    const autoFillData = {};
    
    if (selectedFields.contact_email && user?.email) {
      autoFillData.contact_email = user.email;
    }
    
    if (selectedFields.contact_name && user?.user_metadata?.full_name) {
      autoFillData.contact_name = user.user_metadata.full_name;
    }
    
    if (selectedFields.org_name && user?.user_metadata?.organization_name) {
      autoFillData.org_name = user.user_metadata.organization_name;
    }
    
    if (selectedFields.org_mission && user?.user_metadata?.organization_mission) {
      autoFillData.org_mission = user.user_metadata.organization_mission;
    }
    
    if (selectedFields.org_location && user?.user_metadata?.organization_location) {
      autoFillData.org_location = user.user_metadata.organization_location;
    }
    
    onAccept(autoFillData);
  };

  const handleFieldToggle = (field) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (!user) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '2rem',
        maxWidth: 500,
        width: '100%',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
      }}>
        <h3 style={{
          marginBottom: '1rem',
          color: '#1976d2',
          fontSize: '1.4rem',
          textAlign: 'center'
        }}>
          Auto-fill Your Information
        </h3>
        
        <p style={{
          marginBottom: '1.5rem',
          color: '#666',
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          We can pre-fill some fields with your saved information to save you time. Select which fields you'd like to auto-fill:
        </p>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0.75rem',
            padding: '0.5rem',
            borderRadius: 8,
            background: selectedFields.contact_email ? '#e3f2fd' : '#f5f5f5'
          }}>
            <input
              type="checkbox"
              id="contact_email"
              checked={selectedFields.contact_email}
              onChange={() => handleFieldToggle('contact_email')}
              style={{ marginRight: '0.75rem' }}
            />
            <label htmlFor="contact_email" style={{ cursor: 'pointer', flex: 1 }}>
              <strong>Email Address</strong>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                {user.email}
              </div>
            </label>
          </div>

          {user.user_metadata?.full_name && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.75rem',
              padding: '0.5rem',
              borderRadius: 8,
              background: selectedFields.contact_name ? '#e3f2fd' : '#f5f5f5'
            }}>
              <input
                type="checkbox"
                id="contact_name"
                checked={selectedFields.contact_name}
                onChange={() => handleFieldToggle('contact_name')}
                style={{ marginRight: '0.75rem' }}
              />
              <label htmlFor="contact_name" style={{ cursor: 'pointer', flex: 1 }}>
                <strong>Contact Name</strong>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  {user.user_metadata.full_name}
                </div>
              </label>
            </div>
          )}

          {user.user_metadata?.organization_name && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.75rem',
              padding: '0.5rem',
              borderRadius: 8,
              background: selectedFields.org_name ? '#e3f2fd' : '#f5f5f5'
            }}>
              <input
                type="checkbox"
                id="org_name"
                checked={selectedFields.org_name}
                onChange={() => handleFieldToggle('org_name')}
                style={{ marginRight: '0.75rem' }}
              />
              <label htmlFor="org_name" style={{ cursor: 'pointer', flex: 1 }}>
                <strong>Organization Name</strong>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  {user.user_metadata.organization_name}
                </div>
              </label>
            </div>
          )}

          {user.user_metadata?.organization_mission && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.75rem',
              padding: '0.5rem',
              borderRadius: 8,
              background: selectedFields.org_mission ? '#e3f2fd' : '#f5f5f5'
            }}>
              <input
                type="checkbox"
                id="org_mission"
                checked={selectedFields.org_mission}
                onChange={() => handleFieldToggle('org_mission')}
                style={{ marginRight: '0.75rem' }}
              />
              <label htmlFor="org_mission" style={{ cursor: 'pointer', flex: 1 }}>
                <strong>Organization Mission</strong>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  {user.user_metadata.organization_mission.substring(0, 50)}...
                </div>
              </label>
            </div>
          )}

          {user.user_metadata?.organization_location && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.75rem',
              padding: '0.5rem',
              borderRadius: 8,
              background: selectedFields.org_location ? '#e3f2fd' : '#f5f5f5'
            }}>
              <input
                type="checkbox"
                id="org_location"
                checked={selectedFields.org_location}
                onChange={() => handleFieldToggle('org_location')}
                style={{ marginRight: '0.75rem' }}
              />
              <label htmlFor="org_location" style={{ cursor: 'pointer', flex: 1 }}>
                <strong>Organization Location</strong>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  {user.user_metadata.organization_location}
                </div>
              </label>
            </div>
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center'
        }}>
          <button
            onClick={handleAccept}
            className="btn-get-started"
            style={{
              fontSize: '1rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              minWidth: 120
            }}
          >
            Auto-fill Selected
          </button>
          
          <button
            onClick={onDecline}
            style={{
              fontSize: '1rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              background: 'none',
              border: '1px solid #ddd',
              color: '#666',
              cursor: 'pointer',
              minWidth: 120
            }}
          >
            Skip
          </button>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '1rem'
        }}>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#999',
              cursor: 'pointer',
              fontSize: '0.9rem',
              textDecoration: 'underline'
            }}
          >
            Don't show again
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoFillPrompt; 