import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '/public/styles.css';

const UserProfileDropdown = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [grantCount, setGrantCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Mock grant count - in a real app, you'd fetch this from your database
  useEffect(() => {
    if (user) {
      // For now, we'll use a mock count. In the future, you can:
      // 1. Store grant data in Supabase database
      // 2. Query the database for grants created by this user
      // 3. Update this count when grants are created
      setGrantCount(3); // Mock data
    }
  }, [user]);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div 
      style={{ position: 'relative' }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        className="btn-login"
        style={{ cursor: 'pointer' }}
      >
        {user.email}
      </button>
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          border: '1px solid #eee',
          minWidth: 280,
          zIndex: 1000,
          marginTop: 8,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: '#fff',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              {user.user_metadata?.full_name || 'User'}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
              {user.email}
            </div>
          </div>

          {/* Stats */}
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid #eee'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <span style={{ color: '#666', fontSize: '0.9rem' }}>Grants Created</span>
              <span style={{ 
                background: '#e3f2fd', 
                color: '#1976d2', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '9999px',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                {grantCount}
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#666', fontSize: '0.9rem' }}>Member Since</span>
              <span style={{ color: '#333', fontSize: '0.9rem' }}>
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ padding: '1rem' }}>
            <button
              onClick={() => navigate('/profile')}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'none',
                border: '1px solid #ddd',
                borderRadius: 8,
                color: '#333',
                cursor: 'pointer',
                fontSize: '0.9rem',
                marginBottom: '0.5rem',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
              onMouseLeave={(e) => e.target.style.background = 'none'}
            >
              Edit Profile
            </button>
            
            <button
              onClick={handleSignOut}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#f44336',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown; 