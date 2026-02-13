import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import { FiBarChart2, FiFile, FiCheckCircle, FiClock, FiCheck, FiX, FiMoreVertical, FiEye, FiTrash2 } from 'react-icons/fi';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [theses, setTheses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedThesis, setSelectedThesis] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiService.get('/dashboard/admin', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);

        // Fetch all theses to display pending ones
        const thesesResponse = await apiService.get('/search/theses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTheses(thesesResponse.data.theses || []);
        setError('');
      } catch (err) {
        setError('Failed to load admin dashboard: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleUpdateStatus = async (thesisId, newStatus) => {
    try {
      setUpdatingId(thesisId);
      await apiService.patch(`/submission/${thesisId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the theses list locally
      setTheses(theses.map(t => 
        t.id === thesisId ? { ...t, status: newStatus } : t
      ));

      // Update selected thesis if it's the one being updated
      if (selectedThesis?.id === thesisId) {
        setSelectedThesis({ ...selectedThesis, status: newStatus });
      }

      setError('');
    } catch (err) {
      setError(`Failed to update status: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (thesisId) => {
    if (window.confirm('Are you sure you want to delete this thesis?')) {
      try {
        setUpdatingId(thesisId);
        await apiService.delete(`/submission/${thesisId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Remove from list
        setTheses(theses.filter(t => t.id !== thesisId));
        setSelectedThesis(null);
        setOpenMenu(null);
        setError('');
      } catch (err) {
        setError(`Failed to delete thesis: ${err.message}`);
      } finally {
        setUpdatingId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading admin dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  const pendingTheses = theses.filter(t => t.status === 'PENDING');
  const approvedTheses = theses.filter(t => t.status === 'APPROVED');
  const rejectedTheses = theses.filter(t => t.status === 'REJECTED');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <FiBarChart2 className="w-10 h-10 text-indigo-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage and review all thesis submissions</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Theses</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.stats.totalTheses}</p>
                </div>
                <FiFile className="w-12 h-12 text-indigo-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{stats.stats.approvedTheses}</p>
                </div>
                <FiCheckCircle className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending Review</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.stats.pendingTheses}</p>
                </div>
                <FiClock className="w-12 h-12 text-yellow-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.stats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">👥</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Department Stats */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Department Submissions</h2>
              <div className="space-y-3">
                {stats.departmentStats.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{dept.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{
                            width: `${(dept.thesesCount / Math.max(...stats.departmentStats.map(d => d.thesesCount), 1)) * 100}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-gray-600 font-semibold w-8">{dept.thesesCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Top Thesis Topics</h2>
              <div className="space-y-2">
                {stats.topTopics.slice(0, 8).map((topic, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-gray-700">{topic.topic}</span>
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {topic.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pending Theses Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Pending Theses ({pendingTheses.length})
            </h2>
          </div>

          {pendingTheses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FiClock className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No pending theses to review</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Department</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Topic</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Submitted</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingTheses.map((thesis) => (
                    <tr key={thesis.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{thesis.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {thesis.student ? `${thesis.student.firstName} ${thesis.student.lastName}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {thesis.department ? thesis.department.code : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{thesis.topic}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(thesis.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenu(openMenu === thesis.id ? null : thesis.id)}
                            className="p-2 hover:bg-gray-200 rounded transition"
                          >
                            <FiMoreVertical className="w-5 h-5 text-gray-600" />
                          </button>

                          {openMenu === thesis.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              <button
                                onClick={() => {
                                  setSelectedThesis(thesis);
                                  setOpenMenu(null);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 transition"
                              >
                                <FiEye className="w-4 h-4" /> View & Decide
                              </button>
                              <button
                                onClick={() => {
                                  handleDelete(thesis.id);
                                  setOpenMenu(null);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2 transition border-t"
                              >
                                <FiTrash2 className="w-4 h-4" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Approved Theses */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Approved Theses ({approvedTheses.length})
            </h2>
          </div>

          {approvedTheses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FiCheckCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No approved theses yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Department</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Approved</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedTheses.map((thesis) => (
                    <tr key={thesis.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{thesis.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {thesis.student ? `${thesis.student.firstName} ${thesis.student.lastName}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {thesis.department ? thesis.department.code : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-green-600 font-semibold">✓ Approved</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedThesis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header with Gradient */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 text-white p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{selectedThesis.title}</h2>
                  <p className="text-indigo-100 text-sm flex items-center gap-2">
                    <span>👤</span>
                    {selectedThesis.student ? `${selectedThesis.student.firstName} ${selectedThesis.student.lastName}` : 'N/A'}
                  </p>
                  <p className="text-indigo-200 text-xs mt-1">
                    📧 {selectedThesis.student?.email || 'N/A'} • 
                    🏢 {selectedThesis.department?.code || 'N/A'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedThesis(null)}
                  className="text-white hover:text-indigo-100 transition p-2 hover:bg-white/20 rounded-lg"
                >
                  <span className="text-2xl">✕</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">Topic</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedThesis.topic}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">Advisor</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedThesis.advisor}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">Department</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedThesis.department?.code || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">File</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{selectedThesis.fileName}</p>
                      <p className="text-sm text-gray-600">{(selectedThesis.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <a
                      href={`http://localhost:5001/api/submission/${selectedThesis.id}/download`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 px-3 py-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded text-sm font-semibold transition"
                    >
                      View
                    </a>
                  </div>
                </div>
              </div>

              {/* Abstract */}
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-3">Abstract</p>
                <p className="text-gray-700 leading-relaxed">{selectedThesis.abstract}</p>
              </div>

              {/* Decision Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    if (window.confirm('Reject this thesis?')) {
                      handleUpdateStatus(selectedThesis.id, 'REJECTED');
                      setSelectedThesis(null);
                    }
                  }}
                  disabled={updatingId === selectedThesis.id}
                  className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 transition font-semibold text-sm flex items-center gap-2"
                >
                  <FiX className="w-4 h-4" /> Reject
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Approve this thesis?')) {
                      handleUpdateStatus(selectedThesis.id, 'APPROVED');
                      setSelectedThesis(null);
                    }
                  }}
                  disabled={updatingId === selectedThesis.id}
                  className="px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 transition font-semibold text-sm flex items-center gap-2"
                >
                  <FiCheck className="w-4 h-4" /> Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
