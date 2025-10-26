
import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

export default function ApplicationWizard({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    category: '',
    phone: '',
    email: '',
    address: '',
    guardianName: '',
    guardianPhone: '',
    course: '',
    previousEducation: '',
    percentage: ''
  });
  const [files, setFiles] = useState({});
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoSaving, setAutoSaving] = useState(false);

  const totalSteps = 4;

  // Load saved progress
  useEffect(() => {
    loadProgress();
    loadCourses();
  }, []);

  const loadProgress = async () => {
    try {
      const progress = await api.getFormProgress();
      if (progress && progress.formData) {
        setFormData({ ...formData, ...progress.formData });
        setCurrentStep(progress.step || 1);
      }
    } catch (err) {
      console.error('Failed to load progress:', err);
    }
  };

  const loadCourses = async () => {
    try {
      const data = await api.getCourses();
      setCourses(data);
    } catch (err) {
      console.error('Failed to load courses:', err);
    }
  };

  // Auto-save progress
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < totalSteps) {
        saveProgress();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData, currentStep]);

  const saveProgress = async () => {
    try {
      setAutoSaving(true);
      await api.saveFormProgress(currentStep, formData);
      setAutoSaving(false);
    } catch (err) {
      console.error('Auto-save failed:', err);
      setAutoSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.fullName || !formData.dob || !formData.gender) {
          setError('Please fill all required fields');
          return false;
        }
        break;
      case 2:
        if (!formData.phone || !formData.email || !formData.address) {
          setError('Please fill all required fields');
          return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
          setError('Please enter a valid email');
          return false;
        }
        break;
      case 3:
        if (!formData.course || !formData.previousEducation || !formData.percentage) {
          setError('Please fill all required fields');
          return false;
        }
        break;
      case 4:
        if (!files.photo || !files.marksheet10 || !files.idProof) {
          setError('Please upload all required documents');
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
      setError('');
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;

    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      
      // Append form fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Append files
      Object.keys(files).forEach(key => {
        if (files[key]) {
          submitData.append(key, files[key]);
        }
      });

      await api.submitApplication(submitData);
      await api.clearFormProgress();
      
      if (onComplete) onComplete();
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3>Personal Information</h3>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="">Select Category</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h3>Contact Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Complete address"
                rows="3"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Guardian Name</label>
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  placeholder="Parent/Guardian name"
                />
              </div>
              <div className="form-group">
                <label>Guardian Phone</label>
                <input
                  type="tel"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  placeholder="Guardian contact number"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h3>Academic Information</h3>
            <div className="form-group">
              <label>Select Course *</label>
              <select name="course" value={formData.course} onChange={handleChange} required>
                <option value="">Choose a course</option>
                {courses.map(c => (
                  <option key={c._id} value={c.name}>
                    {c.name} ({c.code}) - {c.availableSeats} seats available
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Previous Education *</label>
                <input
                  type="text"
                  name="previousEducation"
                  value={formData.previousEducation}
                  onChange={handleChange}
                  placeholder="e.g., 12th Science"
                  required
                />
              </div>
              <div className="form-group">
                <label>Percentage/CGPA *</label>
                <input
                  type="text"
                  name="percentage"
                  value={formData.percentage}
                  onChange={handleChange}
                  placeholder="e.g., 85.5%"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h3>Upload Documents</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Please upload clear, readable copies. Accepted formats: JPG, PNG, PDF (max 5MB each)
            </p>
            <div className="form-group">
              <label>Passport Photo * (max 2MB)</label>
              <input
                type="file"
                name="photo"
                onChange={handleFileChange}
                accept="image/*"
                required
              />
              {files.photo && <small>✓ {files.photo.name}</small>}
            </div>
            <div className="form-group">
              <label>10th Marksheet *</label>
              <input
                type="file"
                name="marksheet10"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                required
              />
              {files.marksheet10 && <small>✓ {files.marksheet10.name}</small>}
            </div>
            <div className="form-group">
              <label>12th Marksheet</label>
              <input
                type="file"
                name="marksheet12"
                onChange={handleFileChange}
                accept="image/*,.pdf"
              />
              {files.marksheet12 && <small>✓ {files.marksheet12.name}</small>}
            </div>
            <div className="form-group">
              <label>Other Certificate (if any)</label>
              <input
                type="file"
                name="certificate"
                onChange={handleFileChange}
                accept="image/*,.pdf"
              />
              {files.certificate && <small>✓ {files.certificate.name}</small>}
            </div>
            <div className="form-group">
              <label>ID Proof (Aadhar/PAN) *</label>
              <input
                type="file"
                name="idProof"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                required
              />
              {files.idProof && <small>✓ {files.idProof.name}</small>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Admission Application Form</h2>
        <div style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>Step {currentStep} of {totalSteps}</span>
            {autoSaving && <span style={{ color: '#667eea', fontSize: '12px' }}>💾 Auto-saving...</span>}
          </div>
          <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '2px' }}>
            <div style={{ 
              width: `${(currentStep / totalSteps) * 100}%`, 
              height: '100%', 
              background: '#667eea', 
              borderRadius: '2px',
              transition: 'width 0.3s'
            }} />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-error">{error}</div>}
        
        {renderStep()}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="btn-secondary"
          >
            Previous
          </button>
          
          {currentStep < totalSteps ? (
            <button type="button" onClick={nextStep} className="btn-primary">
              Next
            </button>
          ) : (
            <button type="submit" disabled={loading} className="btn-success">
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
