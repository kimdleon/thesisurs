const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getAdminDashboard = async (req, res) => {
  try {
    const [totalUsers, totalTheses, approvedTheses, pendingTheses, departments] = await Promise.all([
      prisma.user.count(),
      prisma.thesis.count(),
      prisma.thesis.count({ where: { status: 'APPROVED' } }),
      prisma.thesis.count({ where: { status: 'PENDING' } }),
      prisma.department.findMany({
        include: {
          theses: {
            select: { id: true },
          },
        },
      }),
    ]);

    const allTheses = await prisma.thesis.findMany({
      select: { topic: true },
    });

    const topicCounts = {};
    allTheses.forEach(thesis => {
      topicCounts[thesis.topic] = (topicCounts[thesis.topic] || 0) + 1;
    });

    const topTopics = Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.json({
      stats: {
        totalUsers,
        totalTheses,
        approvedTheses,
        pendingTheses,
        rejectionRate: totalTheses > 0 ? 
          ((totalTheses - approvedTheses - pendingTheses) / totalTheses * 100).toFixed(2) : 0,
      },
      departmentStats: departments.map(dept => ({
        name: dept.name,
        thesesCount: dept.theses.length,
      })),
      topTopics,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;

    const [submissions, approvedCount, pendingCount, rejectedCount] = await Promise.all([
      prisma.thesis.findMany({
        where: { studentId },
        include: {
          reviews: true,
          comments: true,
        },
      }),
      prisma.thesis.count({
        where: { studentId, status: 'APPROVED' },
      }),
      prisma.thesis.count({
        where: { studentId, status: 'PENDING' },
      }),
      prisma.thesis.count({
        where: { studentId, status: 'REJECTED' },
      }),
    ]);

    res.json({
      stats: {
        totalSubmissions: submissions.length,
        approvedCount,
        pendingCount,
        rejectedCount,
      },
      submissions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReviewerDashboard = async (req, res) => {
  try {
    const reviewerId = req.user.id;

    const [reviewsCount, approvedCount, rejectedCount, pendingCount] = await Promise.all([
      prisma.review.count({
        where: { reviewerId },
      }),
      prisma.review.count({
        where: { reviewerId, status: 'APPROVED' },
      }),
      prisma.review.count({
        where: { reviewerId, status: 'REJECTED' },
      }),
      prisma.review.count({
        where: { reviewerId, status: 'PENDING' },
      }),
    ]);

    const thesesForReview = await prisma.thesis.findMany({
      where: {
        status: { in: ['PENDING', 'REVISIONS_REQUESTED'] },
      },
      include: {
        reviews: {
          where: { reviewerId },
        },
        student: {
          select: { id: true, firstName: true, lastName: true },
        },
        department: true,
      },
    });

    res.json({
      stats: {
        totalReviews: reviewsCount,
        approvedCount,
        rejectedCount,
        pendingCount,
      },
      thesesForReview,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
