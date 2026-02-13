import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { submissionService } from '../services/apiService';
import { authService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import { FiChevronDown } from 'react-icons/fi';

export const SubmissionPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    topic: '',
    advisor: '',
    departmentId: user?.departmentId || '',
  });
  const [departments, setDepartments] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.role !== 'STUDENT') {
      navigate('/dashboard');
    }

    // Fetch departments
    const fetchDepartments = async () => {
      try {
        const response = await authService.getDepartments();
        setDepartments(response.data);
      } catch (err) {
        console.error('Failed to load departments');
      }
    };

    fetchDepartments();
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Only PDF and DOCX files are allowed');
        return;
      }
      if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
        setError('File size must be less than 50MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }
    if (!formData.departmentId) {
      setError('Please select a department');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formDataWithFile = new FormData();
      Object.keys(formData).forEach(key => {
        formDataWithFile.append(key, formData[key]);
      });
      formDataWithFile.append('file', file);

      await submissionService.submitThesis(formDataWithFile);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            📤 Submit Your Thesis
          </h1>
          <p className="text-gray-600">Share your academic work with the community</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-8 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-sm">
                📚 Thesis Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter the title of your thesis..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                required
              />
            </div>

            {/* Abstract */}
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-sm">
                ✍️ Abstract
              </label>
              <textarea
                name="abstract"
                value={formData.abstract}
                onChange={handleChange}
                rows="5"
                placeholder="Provide a brief summary of your research..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                required
              />
            </div>

            {/* Topic & Advisor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-3 text-sm">
                  🎯 Research Topic
                </label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="e.g., Artificial Intelligence"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-3 text-sm">
                  👨‍🏫 Advisor Name
                </label>
                <input
                  type="text"
                  name="advisor"
                  value={formData.advisor}
                  onChange={handleChange}
                  placeholder="Your thesis advisor..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>
            </div>

            {/* Course Selection */}
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-sm">
                📖 Select Your Course
              </label>
              <div className="relative">
                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                  required
                >
                  <option value="">Choose a course...</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-sm">
                📎 Upload Document (PDF or DOCX)
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.docx"
                  className="hidden"
                  id="file-input"
                  required
                />
                <label htmlFor="file-input" className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition bg-gray-50">
                  <div className="text-center">
                    <span className="text-4xl mb-2 block">📁</span>
                    <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                    <p className="text-gray-500 text-sm mt-1">PDF or DOCX (max 50MB)</p>
                  </div>
                </label>
              </div>
              {file && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="text-green-700 font-semibold">{file.name}</p>
                    <p className="text-green-600 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 mt-8"
            >
              {loading ? '⏳ Submitting...' : '🚀 Submit Thesis'}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900 font-semibold mb-2">💡 Submission Tips:</p>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>✓ Ensure your document is well-formatted and free of errors</li>
              <li>✓ Include all required sections (introduction, methods, results, conclusion)</li>
              <li>✓ Meet the file size requirements (max 50MB)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionPage;
