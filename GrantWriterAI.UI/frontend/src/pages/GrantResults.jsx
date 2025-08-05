import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserProfileDropdown from '../components/UserProfileDropdown';
import '/public/styles.css';

const GrantResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const searchData = location.state?.searchData;
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGrant, setSelectedGrant] = useState(null);

  useEffect(() => {
    if (searchData) {
      searchForGrants();
    } else {
      setError('No search data provided');
      setLoading(false);
    }
  }, [searchData]);

  const searchForGrants = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3000/api/search-grants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchData),
      });
      
      const result = await response.json();
      
      if (result && result.grants) {
        setGrants(result.grants);
      } else {
        setError('No grants found matching your criteria');
      }
    } catch (err) {
      console.error('Error searching for grants:', err);
      setError('Failed to search for grants. Please try again.');
    }
    
    setLoading(false);
  };

  const handleGrantSelect = (grant) => {
    setSelectedGrant(grant);
  };

  const handleStartProposal = (grant) => {
    // Navigate to the intake form with the selected grant information
    navigate('/intake', { 
      state: { 
        title: grant.title,
        selectedGrant: grant,
        fromSearch: true
      } 
    });
  };

  const formatAmount = (amount) => {
    if (!amount) return 'Varies';
    const num = parseInt(amount.replace(/\D/g, ''));
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(0)}K`;
    }
    return `$${num.toLocaleString()}`;
  };

  const getMatchScore = (grant) => {
    // Simple scoring algorithm - in a real app, this would be more sophisticated
    let score = 70; // Base score
    
    if (searchData.organization_type && grant.organization_types?.includes(searchData.organization_type)) {
      score += 15;
    }
    
    if (searchData.project_category && grant.categories?.includes(searchData.project_category)) {
      score += 15;
    }
    
    return Math.min(score, 100);
  };

  if (loading) {
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
          maxWidth: 1000, 
          margin: '3rem auto', 
          background: '#fff', 
          borderRadius: 24, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)', 
          padding: '3rem 4rem',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              animation: 'spin 1s linear infinite'
            }}>
              <span style={{ color: '#fff', fontSize: '1.5rem' }}>🔍</span>
            </div>
            <h2 style={{ fontWeight: 700, fontSize: '1.8rem', marginBottom: '0.5rem' }}>
              Searching for Grants...
            </h2>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              Analyzing your criteria and finding the best matches
            </p>
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </main>
      </div>
    );
  }

  if (error) {
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
          maxWidth: 1000, 
          margin: '3rem auto', 
          background: '#fff', 
          borderRadius: 24, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)', 
          padding: '3rem 4rem',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: '#f44336',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <span style={{ color: '#fff', fontSize: '1.5rem' }}>⚠️</span>
            </div>
            <h2 style={{ fontWeight: 700, fontSize: '1.8rem', marginBottom: '0.5rem' }}>
              No Grants Found
            </h2>
            <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>
              {error}
            </p>
            <button 
              className="btn-get-started"
              onClick={() => navigate('/find-grants')}
              style={{ fontSize: '1.1rem', padding: '1rem 2rem', borderRadius: '9999px' }}
            >
              Try Different Criteria
            </button>
          </div>
        </main>
      </div>
    );
  }

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
        maxWidth: 1200, 
        margin: '3rem auto', 
        background: '#fff', 
        borderRadius: 24, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)', 
        padding: '3rem 4rem'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontWeight: 800, fontSize: '2.5rem', marginBottom: '1rem', color: '#1976d2' }}>
            Grant Recommendations
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '1rem' }}>
            We found {grants.length} grants that match your criteria:
          </p>
          <div style={{ 
            background: '#f8f9fa', 
            borderRadius: 12, 
            padding: '1.5rem',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#1976d2' }}>
              Your Search Criteria:
            </div>
            <div style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.6' }}>
              <strong>Organization:</strong> {searchData.organization_name} • 
              <strong>Project:</strong> {searchData.project_title} • 
              <strong>Category:</strong> {searchData.project_category} • 
              <strong>Funding:</strong> {searchData.funding_amount}
            </div>
          </div>
        </div>

        {/* Grants List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {grants.map((grant, index) => {
            const matchScore = getMatchScore(grant);
            return (
              <div 
                key={index}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 16,
                  padding: '2rem',
                  background: selectedGrant === grant ? '#f8f9fa' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedGrant === grant ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.05)'
                }}
                onClick={() => handleGrantSelect(grant)}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontWeight: 700, 
                      fontSize: '1.4rem', 
                      marginBottom: '0.5rem',
                      color: '#1976d2'
                    }}>
                      {grant.title}
                    </h3>
                    <p style={{ 
                      color: '#666', 
                      fontSize: '1rem', 
                      marginBottom: '1rem',
                      lineHeight: '1.5'
                    }}>
                      {grant.description}
                    </p>
                  </div>
                  <div style={{ 
                    background: matchScore >= 90 ? '#4caf50' : matchScore >= 80 ? '#ff9800' : '#f44336',
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    minWidth: 60,
                    textAlign: 'center'
                  }}>
                    {matchScore}% Match
                  </div>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div>
                    <strong style={{ color: '#333' }}>Funding Amount:</strong>
                    <div style={{ color: '#666', marginTop: '0.25rem' }}>
                      {formatAmount(grant.amount)}
                    </div>
                  </div>
                  <div>
                    <strong style={{ color: '#333' }}>Deadline:</strong>
                    <div style={{ color: '#666', marginTop: '0.25rem' }}>
                      {grant.deadline || 'Rolling'}
                    </div>
                  </div>
                  <div>
                    <strong style={{ color: '#333' }}>Funder:</strong>
                    <div style={{ color: '#666', marginTop: '0.25rem' }}>
                      {grant.funder}
                    </div>
                  </div>
                  <div>
                    <strong style={{ color: '#333' }}>Eligibility:</strong>
                    <div style={{ color: '#666', marginTop: '0.25rem' }}>
                      {grant.eligibility || 'See details'}
                    </div>
                  </div>
                </div>

                {selectedGrant === grant && (
                  <div style={{ 
                    borderTop: '1px solid #e0e0e0', 
                    paddingTop: '1.5rem',
                    marginTop: '1rem'
                  }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <strong style={{ color: '#333' }}>Key Requirements:</strong>
                      <ul style={{ 
                        margin: '0.5rem 0 0 1.5rem', 
                        color: '#666',
                        lineHeight: '1.6'
                      }}>
                        {grant.requirements?.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        )) || ['Requirements to be determined']}
                      </ul>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(grant.url, '_blank');
                        }}
                        style={{
                          padding: '0.75rem 1.5rem',
                          background: 'none',
                          border: '1px solid #1976d2',
                          borderRadius: '9999px',
                          color: '#1976d2',
                          cursor: 'pointer',
                          fontSize: '0.95rem',
                          fontWeight: 600
                        }}
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartProposal(grant);
                        }}
                        className="btn-get-started"
                        style={{
                          fontSize: '0.95rem',
                          padding: '0.75rem 1.5rem',
                          borderRadius: '9999px',
                          fontWeight: 600
                        }}
                      >
                        Start Proposal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div style={{ 
          marginTop: '3rem', 
          paddingTop: '2rem', 
          borderTop: '1px solid #e0e0e0',
          textAlign: 'center'
        }}>
          <button
            onClick={() => navigate('/find-grants')}
            style={{
              padding: '1rem 2rem',
              background: 'none',
              border: '1px solid #ddd',
              borderRadius: '9999px',
              color: '#666',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
              marginRight: '1rem'
            }}
          >
            Refine Search
          </button>
          <button
            onClick={() => navigate('/home')}
            className="btn-get-started"
            style={{
              fontSize: '1rem',
              padding: '1rem 2rem',
              borderRadius: '9999px',
              fontWeight: 600
            }}
          >
            Start New Proposal
          </button>
        </div>
      </main>
    </div>
  );
};

export default GrantResults; 