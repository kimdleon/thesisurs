import React, { useState, useEffect } from 'react';
import { useModal } from '../contexts/ModalContext';
import apiService from '../services/apiService';
import { FiArrowRight, FiCheck, FiUpload, FiUsers, FiAward } from 'react-icons/fi';

const HomePage = () => {
  const [recentTheses, setRecentTheses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheses = async () => {
      try {
        const response = await apiService.get('/search/theses', {
          params: {
            status: 'APPROVED',
            pageSize: 3,
          }
        });
        setRecentTheses(response.data.theses || []);
      } catch (err) {
        console.error('Failed to load theses');
      } finally {
        setLoading(false);
      }
    };
    fetchTheses();
  }, []);
  const { openLoginModal, openRegisterModal } = useModal();

  return (
    <div className="min-h-scree">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="flex flex-col justify-center items-center px-4 py-20 text-center min-h-[70vh]">
          <div className="max-w-3xl mx-auto">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <img src="/urslogo.png" alt="URS Logo" className="h-16 w-16 mb-6 drop-shadow-lg" />
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl font-bold  mb-4 leading-tight">
              University Thesis Repository
            </h1>
            <p className="text-lg md:text-xl text-indigo-90 mb-8 font-light">
              Share, discover, and collaborate on groundbreaking academic research
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={openLoginModal}
                className="px-6 py-2 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition shadow-lg"
              >
                Sign In
              </button>
              <button
                onClick={openRegisterModal}
                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition transform hover:scale-105 border-2 border-white flex items-center justify-center gap-2 shadow-lg"
              >
                Get Started <FiArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Browse Link */}
            <a
              href="/browse"
              className=" hover:text-indigo-200 font-semibold transition inline-flex items-center gap-2"
            >
              Browse Theses Without Login <FiArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Recent Theses Section */}
        {!loading && recentTheses.length > 0 && (
          <div className="bg-white bg-opacity-95 backdrop-blur-sm py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Recent Theses</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recentTheses.map((thesis) => (
                  <div key={thesis.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{thesis.title}</h3>
                    <p className="text-blue-600 text-sm font-semibold mb-3">{thesis.course}</p>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{thesis.abstract}</p>
                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                      <span className="font-medium">{thesis.advisor}</span>
                      <span>{thesis.submittedDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="bg-white bg-opacity-95 backdrop-blur-sm py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Why Join URS?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition">
                <div className="inline-block bg-blue-100 rounded-full p-3 mb-4">
                  <FiUpload className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Share Your Work</h3>
                <p className="text-gray-600">
                  Publish your thesis and reach a broader audience within the academic community.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition">
                <div className="inline-block bg-purple-100 rounded-full p-3 mb-4">
                  <FiUsers className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Collaborate</h3>
                <p className="text-gray-600">
                  Connect with peers, advisors, and reviewers to improve your research through feedback.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition">
                <div className="inline-block bg-indigo-100 rounded-full p-3 mb-4">
                  <FiAward className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Get Recognized</h3>
                <p className="text-gray-600">
                  Showcase your research and build your academic reputation with a professional profile.
                </p>
              </div>
            </div>

            {/* Feature List */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-900">
              {[
                'Advanced search and filtering',
                'Review and approval workflow',
                'Secure file storage',
                'Academic integrity verified',
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <FiCheck className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="py-16 px-4 text-center">
          <h2 className="text-3xl font-bold  mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-indigo-90 mb-8 max-w-2xl mx-auto">
            Join thousands of students sharing and discovering innovative research in the University Thesis Repository.
          </p>
          <button
            onClick={openRegisterModal}
            className="px-10 py-4 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition transform hover:scale-105 shadow-lg"
          >
            Create Your Account Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
