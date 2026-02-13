import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { submissionService, reviewService } from '../services/apiService';
import { FiChevronDown } from 'react-icons/fi';

export const ReviewPage = () => {
  const { id } = useParams();
  const [thesis, setThesis] = useState(null);
  const [review, setReview] = useState({
    status: 'PENDING',
    feedback: '',
    score: 3,
  });
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchThesis = async () => {
      try {
        const response = await submissionService.getThesisById(id);
        setThesis(response.data);
      } catch (err) {
        setError('Failed to load thesis');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchThesis();
    }
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    try {
      await reviewService.submitReview({
        thesisId: parseInt(id),
        ...review,
      });
      setReview({ status: 'PENDING', feedback: '', score: 3 });
      alert('✅ Review submitted successfully!');
    } catch (err) {
      setError('Failed to submit review');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await reviewService.addComment({
        thesisId: parseInt(id),
        content: comment,
      });
      setComment('');
      alert('💬 Comment added!');
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-xl text-gray-600 font-semibold">Loading thesis...</p>
        </div>
      </div>
    );
  }

  if (!thesis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-xl text-gray-600 font-semibold">Thesis not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Thesis Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-start gap-3">
              <span className="text-3xl">📄</span>
              {thesis.title}
            </h1>
            <p className="text-gray-600">
              By <span className="font-semibold">{thesis.student?.firstName} {thesis.student?.lastName}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-6 bg-gray-50 rounded-lg">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">🎯 Research Topic</p>
              <p className="text-gray-900 font-semibold">{thesis.topic}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">👨‍🏫 Advisor</p>
              <p className="text-gray-900 font-semibold">{thesis.advisor}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">🏫 Department</p>
              <p className="text-gray-900 font-semibold">{thesis.department?.name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">✓ Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                thesis.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                thesis.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {thesis.status}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-lg">📝 Abstract</h3>
            <p className="text-gray-700 leading-relaxed">{thesis.abstract}</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Review Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            ✅ Submit Review
          </h2>

          <form onSubmit={handleReviewSubmit} className="space-y-6">
            {/* Status */}
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-sm">Decision</label>
              <div className="relative">
                <select
                  value={review.status}
                  onChange={(e) => setReview({ ...review, status: e.target.value })}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  <option value="PENDING">⏳ Pending</option>
                  <option value="APPROVED">✅ Approved</option>
                  <option value="REJECTED">❌ Rejected</option>
                  <option value="REVISIONS_REQUESTED">📝 Revisions Requested</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Score */}
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-sm">Score (1-5 stars)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={review.score}
                  onChange={(e) => setReview({ ...review, score: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-right">
                  <p className="text-3xl font-bold text-indigo-600">{review.score}</p>
                  <p className="text-gray-600 text-sm">/ 5</p>
                </div>
              </div>
            </div>

            {/* Feedback */}
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-sm">💭 Detailed Feedback</label>
              <textarea
                value={review.feedback}
                onChange={(e) => setReview({ ...review, feedback: e.target.value })}
                rows="5"
                placeholder="Provide constructive feedback on the thesis..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={submitLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitLoading ? '⏳ Submitting...' : '🚀 Submit Review'}
            </button>
          </form>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            💬 Comments
          </h2>

          <form onSubmit={handleCommentSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts or questions about this thesis..."
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition mb-4"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              Add Comment
            </button>
          </form>

          {thesis.comments && thesis.comments.length > 0 ? (
            <div className="space-y-5">
              {thesis.comments.map((comment) => (
                <div key={comment.id} className="border-l-4 border-indigo-400 pl-4 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-gray-900 flex items-center gap-2">
                      👤 {comment.author?.firstName} {comment.author?.lastName}
                    </p>
                    <p className="text-gray-500 text-sm">{new Date(comment.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No comments yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
