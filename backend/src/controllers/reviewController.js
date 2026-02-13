const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.submitReview = async (req, res) => {
  try {
    const { thesisId, status, feedback, score } = req.body;
    const reviewerId = req.user.id;

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
      where: {
        thesisId: parseInt(thesisId),
        reviewerId,
      },
    });

    if (existingReview) {
      // Update existing review
      const updatedReview = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          status,
          feedback,
          score: score ? parseInt(score) : null,
        },
      });

      return res.json({ 
        message: 'Review updated successfully',
        review: updatedReview
      });
    }

    const review = await prisma.review.create({
      data: {
        thesisId: parseInt(thesisId),
        reviewerId,
        status,
        feedback,
        score: score ? parseInt(score) : null,
      },
    });

    // Update thesis status based on review
    await prisma.thesis.update({
      where: { id: parseInt(thesisId) },
      data: { status },
    });

    res.status(201).json({ 
      message: 'Review submitted successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReviewsForThesis = async (req, res) => {
  try {
    const { thesisId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { thesisId: parseInt(thesisId) },
      include: {
        reviewer: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReviewerDashboard = async (req, res) => {
  try {
    const reviewerId = req.user.id;

    const theses = await prisma.thesis.findMany({
      include: {
        reviews: {
          where: { reviewerId },
        },
        student: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        department: true,
      },
    });

    res.json(theses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { thesisId, content } = req.body;
    const authorId = req.user.id;

    const comment = await prisma.comment.create({
      data: {
        thesisId: parseInt(thesisId),
        authorId,
        content,
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    res.status(201).json({ 
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
