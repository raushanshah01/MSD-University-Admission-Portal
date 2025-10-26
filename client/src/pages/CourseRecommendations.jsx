import React, { useState } from 'react';
import { smartAPI, handleAPIError } from '../services/api';
import { toast } from 'react-toastify';

export default function CourseRecommendations() {
  const [formData, setFormData] = useState({
    percentage: '',
    previousEducation: '',
    category: 'General',
    interests: ''
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await smartAPI.recommendCourses(formData);
      setRecommendations(data.recommendations);
      if (data.recommendations.length === 0) {
        toast.info('No recommendations found. Try adjusting your criteria.');
      } else {
        toast.success(`Found ${data.recommendations.length} course recommendations!`);
      }
    } catch (err) {
      handleAPIError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <div className="card">
        <div className="card-header">
          <h2>🎯 Course Recommendations</h2>
          <p style={{ color: '#718096', fontSize: '14px', marginTop: '8px' }}>
            Get personalized course recommendations based on your academic profile
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Academic Percentage/CGPA *</label>
              <input
                type="text"
                value={formData.percentage}
                onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                placeholder="e.g., 85.5"
                required
              />
            </div>
            <div className="form-group">
              <label>Previous Education *</label>
              <input
                type="text"
                value={formData.previousEducation}
                onChange={(e) => setFormData({ ...formData, previousEducation: e.target.value })}
                placeholder="e.g., 12th Science with PCM"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>
            <div className="form-group">
              <label>Interests (Optional)</label>
              <input
                type="text"
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                placeholder="e.g., computer programming, AI, software"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Finding Recommendations...' : '🔍 Get Recommendations'}
          </button>
        </form>
      </div>

      {recommendations.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#667eea', marginBottom: '16px' }}>
            Recommended Courses for You
          </h3>
          {recommendations.map((rec, index) => (
            <div key={index} className="recommendation-card">
              <div className="recommendation-score">
                Score: {rec.score}
              </div>
              <h3 style={{ color: '#667eea', marginBottom: '8px' }}>
                {rec.course}
              </h3>
              <p style={{ color: '#4a5568', marginBottom: '8px' }}>
                <strong>Code:</strong> {rec.code}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <p style={{ color: '#718096', fontSize: '14px', margin: '4px 0' }}>
                    <strong>Duration:</strong> {rec.duration}
                  </p>
                  <p style={{ color: '#718096', fontSize: '14px', margin: '4px 0' }}>
                    <strong>Fees:</strong> ₹{rec.fees?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#718096', fontSize: '14px', margin: '4px 0' }}>
                    <strong>Available Seats:</strong> {rec.availableSeats}/{rec.totalSeats}
                  </p>
                  <div style={{ marginTop: '4px' }}>
                    <div className="progress-bar" style={{ height: '8px' }}>
                      <div
                        className="progress-fill"
                        style={{ width: `${(rec.availableSeats / rec.totalSeats) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ padding: '12px', background: '#f7fafc', borderRadius: '6px' }}>
                <p style={{ color: '#4a5568', fontSize: '14px', margin: 0 }}>
                  <strong>Why this course?</strong> {rec.matchReason}
                </p>
              </div>
              {rec.eligibility && (
                <p style={{ color: '#718096', fontSize: '13px', marginTop: '8px', fontStyle: 'italic' }}>
                  Eligibility: {rec.eligibility}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
