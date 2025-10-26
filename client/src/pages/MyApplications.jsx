import React, { useState, useEffect } from 'react';
import { applicationAPI, handleAPIError } from '../services/api';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const { data } = await applicationAPI.getMy();
      setApplications(data);
    } catch (err) {
      handleAPIError(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'Pending': 'status-pending',
      'Verified': 'status-verified',
      'Approved': 'status-approved',
      'Rejected': 'status-rejected',
      'Hold': 'status-hold'
    };
    return statusMap[status] || 'status-pending';
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <div className="card">
        <div className="card-header">
          <h2>My Applications</h2>
        </div>

        {applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
            <p>No applications found.</p>
            <p>Start by submitting a new application.</p>
          </div>
        ) : (
          <div>
            {applications.map((app) => (
              <div key={app._id} className="application-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#667eea' }}>
                      {app.applicationNumber}
                    </h3>
                    <p style={{ margin: '4px 0', color: '#4a5568' }}>
                      <strong>Course:</strong> {app.course}
                    </p>
                    <p style={{ margin: '4px 0', color: '#4a5568' }}>
                      <strong>Submitted:</strong> {new Date(app.submittedAt).toLocaleDateString()}
                    </p>
                    {app.studentId && (
                      <p style={{ margin: '4px 0', color: '#48bb78', fontWeight: '600' }}>
                        <strong>Student ID:</strong> {app.studentId}
                      </p>
                    )}
                    {app.rollNumber && (
                      <p style={{ margin: '4px 0', color: '#48bb78', fontWeight: '600' }}>
                        <strong>Roll Number:</strong> {app.rollNumber}
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`status-badge ${getStatusBadgeClass(app.status)}`}>
                      {app.status}
                    </span>
                    {app.offerLetterUrl && (
                      <div style={{ marginTop: '10px' }}>
                        <a
                          href={`http://localhost:5000${app.offerLetterUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary"
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          📄 Download Offer Letter
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {app.remarks && (
                  <div style={{ marginTop: '12px', padding: '12px', background: '#f7fafc', borderRadius: '6px' }}>
                    <strong style={{ color: '#4a5568' }}>Remarks:</strong>
                    <p style={{ margin: '4px 0 0 0', color: '#718096' }}>{app.remarks}</p>
                  </div>
                )}

                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '12px', color: '#718096' }}>
                    <strong>Name:</strong> {app.fullName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#718096' }}>
                    <strong>Email:</strong> {app.email}
                  </div>
                  <div style={{ fontSize: '12px', color: '#718096' }}>
                    <strong>Phone:</strong> {app.phone}
                  </div>
                  <div style={{ fontSize: '12px', color: '#718096' }}>
                    <strong>Category:</strong> {app.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
