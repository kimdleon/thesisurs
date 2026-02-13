import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { FiFilter, FiSearch, FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const PublicThesisList = () => {
  const [theses, setTheses] = useState([]);
  const [filters, setFilters] = useState({
    keyword: '',
    department: '',
    advisor: '',
    topic: '',
  });
  const [filterOptions, setFilterOptions] = useState({
    departments: [],
    advisors: [],
    topics: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchFilters();
    fetchTheses();
  }, []);

  useEffect(() => {
    fetchTheses();
  }, [filters, page]);

  const fetchFilters = async () => {
    try {
      const response = await apiService.get('/search/filters');
      setFilterOptions(response.data);
    } catch (err) {
      console.error('Failed to fetch filters:', err);
    }
  };

  const fetchTheses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page,
        pageSize: 10,
        status: 'APPROVED',
        ...(filters.keyword && { keyword: filters.keyword }),
        ...(filters.department && { department: filters.department }),
        ...(filters.advisor && { advisor: filters.advisor }),
        ...(filters.topic && { topic: filters.topic }),
      });

      const response = await apiService.get(`/search/theses?${params}`);
      setTheses(response.data.theses || []);
      setPagination(response.data.pagination || {});
      setError('');
    } catch (err) {
      setError('Failed to load theses: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
    setPage(1);
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setFilters(prev => ({
      ...prev,
      keyword,
    }));
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-8 flex items-center gap-4">
          <img src="/urslogo.png" alt="URS Logo" className="h-16 w-16" />
          <div>
            <h1 className="text-4xl font-bold mb-2">Thesis Repository</h1>
            <p className="text-indigo-100">Browse approved theses from our university</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <FiFilter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filter Theses</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Title, abstract..."
                  value={filters.keyword}
                  onChange={handleSearch}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <FiSearch className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Course</label>
              <div className="relative">
                <select
                  name="department"
                  value={filters.department}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  <option value="">All Courses</option>
                  {filterOptions.departments?.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Advisor */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Advisor</label>
              <div className="relative">
                <select
                  name="advisor"
                  value={filters.advisor}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  <option value="">All Advisors</option>
                  {filterOptions.advisors?.map(adv => (
                    <option key={adv} value={adv}>
                      {adv}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Topic</label>
              <div className="relative">
                <select
                  name="topic"
                  value={filters.topic}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  <option value="">All Topics</option>
                  {filterOptions.topics?.map(top => (
                    <option key={top} value={top}>
                      {top}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading theses...</p>
          </div>
        ) : theses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No theses found matching your filters.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {theses.map(thesis => (
                <div key={thesis.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{thesis.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{thesis.abstract}</p>
                      
                      <div className="flex gap-6 text-sm text-gray-600">
                        <span>📍 <strong>Course:</strong> {thesis.department?.code}</span>
                        <span>👨‍🏫 <strong>Advisor:</strong> {thesis.advisor}</span>
                        <span>📚 <strong>Topic:</strong> {thesis.topic}</span>
                        <span>📅 <strong>Submitted:</strong> {new Date(thesis.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        ✓ Approved
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mb-8">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-300 transition"
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: pagination.totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`px-3 py-2 rounded-lg transition ${
                        page === i + 1
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                  disabled={page === pagination.totalPages}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-300 transition"
                >
                  Next
                </button>
              </div>
            )}

            {/* Info */}
            <div className="text-center text-sm text-gray-600">
              Showing {theses.length} of {pagination.total} theses
            </div>
          </>
        )}

        {/* Login CTA */}
        <div className="mt-12 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Want to submit your own thesis?</h3>
          <p className="text-gray-600 mb-4">Create an account to upload and manage your research submissions.</p>
          <Link
            to="/register"
            className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicThesisList;
