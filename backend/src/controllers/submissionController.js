const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

exports.submitThesis = async (req, res) => {
  try {
    const { title, abstract, topic, advisor, departmentId } = req.body;
    const studentId = req.user.id;

    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    const file = req.files.file;
    const allowedExtensions = ['pdf', 'docx'];
    const fileExtension = path.extname(file.name).substring(1).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({ error: 'Only PDF and DOCX files are allowed' });
    }

    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    file.mv(filePath);

    const thesis = await prisma.thesis.create({
      data: {
        title,
        abstract,
        topic,
        advisor,
        fileName,
        filePath,
        fileSize: file.size,
        fileType: fileExtension,
        studentId,
        departmentId: parseInt(departmentId),
        status: 'PENDING',
      },
    });

    res.status(201).json({ 
      message: 'Thesis submitted successfully',
      thesis
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStudentTheses = async (req, res) => {
  try {
    const studentId = req.user.id;

    const theses = await prisma.thesis.findMany({
      where: { studentId },
      include: { 
        department: true,
        reviews: true,
        comments: true,
      },
    });

    res.json(theses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getThesisById = async (req, res) => {
  try {
    const { id } = req.params;

    const thesis = await prisma.thesis.findUnique({
      where: { id: parseInt(id) },
      include: { 
        department: true,
        reviews: {
          include: { reviewer: true }
        },
        comments: {
          include: { author: true }
        },
        student: true,
      },
    });

    if (!thesis) {
      return res.status(404).json({ error: 'Thesis not found' });
    }

    res.json(thesis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.downloadThesis = async (req, res) => {
  try {
    const { id } = req.params;

    const thesis = await prisma.thesis.findUnique({
      where: { id: parseInt(id) },
    });

    if (!thesis) {
      return res.status(404).json({ error: 'Thesis not found' });
    }

    const filePath = thesis.filePath;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filePath, thesis.fileName);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateThesisStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'REVISIONS_REQUESTED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const thesis = await prisma.thesis.update({
      where: { id: parseInt(id) },
      data: { status },
      include: { 
        department: true,
        student: true,
      },
    });

    res.json({ 
      message: `Thesis ${status.toLowerCase()}`,
      thesis
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteThesis = async (req, res) => {
  try {
    const { id } = req.params;

    const thesis = await prisma.thesis.findUnique({
      where: { id: parseInt(id) },
    });

    if (!thesis) {
      return res.status(404).json({ error: 'Thesis not found' });
    }

    // Delete the file if it exists
    if (thesis.filePath && fs.existsSync(thesis.filePath)) {
      fs.unlinkSync(thesis.filePath);
    }

    // Delete thesis and all related records (reviews, comments)
    await prisma.thesis.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Thesis deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
