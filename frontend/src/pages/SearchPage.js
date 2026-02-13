import React, { useState, useEffect } from 'react';
import { searchService } from '../services/apiService';
import { FiChevronDown } from 'react-icons/fi';

export const SearchPage = () => {
  const [filters, setFilters] = useState(null);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    department: '',
    topic: '',
    advisor: '',
    year: '',
    status: '',
    page: 1,
  });
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await searchService.getFilters();
        setFilters(response.data);
      } catch (err) {
        setError('Failed to load filters');
      }
    };

    fetchFilters();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const response = await searchService.searchTheses(searchParams);
      setResults(response.data.theses);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
      page: 1,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            🔍 Search Theses
          </h1>
          <p className="text-gray-600">Discover academic research from our repository</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-8 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Search Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 mb-10">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Main Search */}
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-sm">
                🔎 Search by Keyword
              </label>
              <input
                type="text"
                name="keyword"
                value={searchParams.keyword}
                onChange={handleChange}
                placeholder="Search title, abstract, topic..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Filter Grid */}
            {filters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">🏫 Department</label>
                  <div className="relative">
                    <select
                      name="department"
                      value={searchParams.department}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                    >
                      <option value="">All Departments</option>
                      {filters.departments && filters.departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">🎯 Research Topic</label>
                  <div className="relative">
                    <select
                      name="topic"
                      value={searchParams.topic}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                    >
                      <option value="">All Topics</option>
                      {filters.topics && filters.topics.map(topic => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">👨‍🏫 Advisor</label>
                  <div className="relative">
                    <select
                      name="advisor"
                      value={searchParams.advisor}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                    >
                      <option value="">All Advisors</option>
                      {filters.advisors && filters.advisors.map(advisor => (
                        <option key={advisor} value={advisor}>{advisor}</option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">📅 Year</label>
                  <input
                    type="number"
                    name="year"
                    value={searchParams.year}
                    onChange={handleChange}
                    placeholder="2024"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">✓ Status</label>
                  <div className="relative">
                    <select
                      name="status"
                      value={searchParams.status}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                    >
                      <option value="">All Status</option>
                      <option value="APPROVED">Approved</option>
                      <option value="PENDING">Pending</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? '⏳ Searching...' : '🚀 Search'}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <>
            {results.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  📚 Results <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-lg ml-2">{pagination?.total}</span>
                </h2>

                <div className="grid grid-cols-1 gap-5 mb-8">
                  {results.map((thesis) => (
                    <div key={thesis.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-start gap-2">
                            <span className="text-2xl">📄</span>
                            {thesis.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3">
                            By <span className="font-semibold">{thesis.student?.firstName} {thesis.student?.lastName}</span>
                          </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap ml-4 ${
                          thesis.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                          thesis.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                          thesis.status === 'REVISIONS_REQUESTED' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {thesis.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">{thesis.abstract}</p>

                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                        <span className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">
                          🎯 {thesis.topic}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                          🏫 {thesis.department?.name}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                          👨‍🏫 {thesis.advisor}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setSearchParams({ ...searchParams, page: searchParams.page - 1 })}
                      disabled={searchParams.page === 1}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <span className="px-4 py-2 text-gray-700 font-medium bg-white rounded-lg border border-gray-200">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setSearchParams({ ...searchParams, page: searchParams.page + 1 })}
                      disabled={searchParams.page === pagination.totalPages}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-xl text-gray-600">No theses found matching your criteria</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search terms</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
