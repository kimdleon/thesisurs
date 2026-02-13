import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

const getStatusIcon = (status) => {
  switch(status) {
    case 'APPROVED': return '✅';
    case 'REJECTED': return '❌';
    case 'PENDING': return '⏳';
    case 'REVISIONS_REQUESTED': return '📝';
    default: return '📄';
  }
};

const getStatIcon = (key) => {
  const icons = {
    totalSubmissions: '📚',
    approved: '✅',
    pending: '⏳',
    rejected: '❌',
    totalReviews: '👁️',
    completed: '🏆',
  };
  return icons[key] || '📊';
};

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        let response;
        
        if (user.role === 'ADMIN') {
          response = await dashboardService.getAdminDashboard();
        } else if (user.role === 'STUDENT') {
          response = await dashboardService.getStudentDashboard();
        } else if (user.role === 'REVIEWER') {
          response = await dashboardService.getReviewerDashboard();
        }

        setStats(response.data.stats);
        setSubmissions(response.data.submissions || response.data.thesesForReview || []);
      } catch (err) {
        setError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboard();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-xl text-gray-600 font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {user.firstName}! 👋</h1>
          <p className="text-gray-600">Here's a summary of your recent activity</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-8 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats && Object.entries(stats).map(([key, value]) => (
            <div key={key} className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium capitalize mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-4xl font-bold text-gray-900">{value}</p>
                </div>
                <div className="text-4xl opacity-50">{getStatIcon(key)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Submissions Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              📋
              {user.role === 'STUDENT' ? 'My Submissions' : 'Theses for Review'}
            </h2>
          </div>

          {submissions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-600 text-lg">No submissions yet</p>
              {user.role === 'STUDENT' && (
                <a href="/submit" className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
                  Submit your first thesis
                </a>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {submissions.map((submission) => (
                <div key={submission.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                          <span className="text-2xl">📄</span>
                          {submission.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Topic: <span className="font-medium">{submission.topic}</span>
                        </p>
                      </div>
                      <span className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 whitespace-nowrap ml-4 ${
                        submission.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        submission.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        submission.status === 'REVISIONS_REQUESTED' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {getStatusIcon(submission.status)}
                        {submission.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-gray-600 text-sm">Advisor</p>
                        <p className="font-semibold text-gray-900">{submission.advisor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600 text-sm">Submitted</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
