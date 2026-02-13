const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.searchTheses = async (req, res) => {
  try {
    const { 
      keyword, 
      department, 
      topic, 
      advisor, 
      year, 
      status,
      pageSize = 10,
      page = 1 
    } = req.query;

    const where = {};

    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { abstract: { contains: keyword, mode: 'insensitive' } },
        { topic: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    if (department) {
      where.departmentId = parseInt(department);
    }

    if (topic) {
      where.topic = { contains: topic, mode: 'insensitive' };
    }

    if (advisor) {
      where.advisor = { contains: advisor, mode: 'insensitive' };
    }

    if (status) {
      where.status = status;
    }

    if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);
      where.submittedAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(pageSize);

    const [theses, total] = await Promise.all([
      prisma.thesis.findMany({
        where,
        skip,
        take: parseInt(pageSize),
        include: {
          department: true,
          student: {
            select: { id: true, firstName: true, lastName: true },
          },
          reviews: true,
        },
        orderBy: { submittedAt: 'desc' },
      }),
      prisma.thesis.count({ where }),
    ]);

    const totalPages = Math.ceil(total / parseInt(pageSize));

    res.json({
      theses,
      pagination: {
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFilters = async (req, res) => {
  try {
    const [departments, topics, advisors] = await Promise.all([
      prisma.department.findMany({
        select: { id: true, name: true },
      }),
      prisma.thesis.findMany({
        distinct: ['topic'],
        select: { topic: true },
      }),
      prisma.thesis.findMany({
        distinct: ['advisor'],
        select: { advisor: true },
      }),
    ]);

    res.json({
      departments,
      topics: topics.map(t => t.topic).filter(Boolean),
      advisors: advisors.map(a => a.advisor).filter(Boolean),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
