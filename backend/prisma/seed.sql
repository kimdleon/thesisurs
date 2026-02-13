-- Seed data for initial setup
-- Run this after database migration: npx prisma db seed

-- Insert Departments
INSERT INTO "Department" (name, code, description, "createdAt", "updatedAt") VALUES
('BSIT', 'BSIT', 'Bachelor of Science in Information Technology', NOW(), NOW()),
('BSCE', 'BSCE', 'Bachelor of Science in Civil Engineering', NOW(), NOW()),
('BSA', 'BSA', 'Bachelor of Science in Accounting', NOW(), NOW()),
('BSHM', 'BSHM', 'Bachelor of Science in Hotel Management', NOW(), NOW()),
('BSIS', 'BSIS', 'Bachelor of Science in Information Systems', NOW(), NOW());

-- Insert Users (passwords are hashed in actual implementation)
INSERT INTO "User" (email, password, "firstName", "lastName", role, "departmentId", "createdAt", "updatedAt") VALUES
('admin@urs.edu', '$2b$10$...hash...', 'Admin', 'User', 'ADMIN', 1, NOW(), NOW()),
('student1@urs.edu', '$2b$10$...hash...', 'John', 'Doe', 'STUDENT', 1, NOW(), NOW()),
('student2@urs.edu', '$2b$10$...hash...', 'Jane', 'Smith', 'STUDENT', 2, NOW(), NOW()),
('reviewer1@urs.edu', '$2b$10$...hash...', 'Prof', 'Johnson', 'REVIEWER', 1, NOW(), NOW()),
('reviewer2@urs.edu', '$2b$10$...hash...', 'Dr', 'Williams', 'REVIEWER', 2, NOW(), NOW());

-- Insert Sample Theses
INSERT INTO "Thesis" (title, abstract, topic, advisor, "fileName", "filePath", "fileSize", "fileType", "studentId", "departmentId", status, "submittedAt", "updatedAt") VALUES
('Machine Learning Applications in Healthcare', 
'This thesis explores the application of machine learning algorithms in predictive healthcare analytics. We implemented deep neural networks to analyze patient data and predict disease outcomes with 95% accuracy.',
'Machine Learning',
'Dr. Sarah Chen',
'thesis_1.pdf',
'/uploads/thesis_1.pdf',
2048000,
'application/pdf',
2,
1,
'APPROVED',
NOW(),
NOW()),

('Sustainable Urban Planning and Green Architecture',
'This research investigates the implementation of green architectural principles in modern urban development. The study examines case studies from 15 countries and proposes a new framework for sustainable city planning.',
'Urban Development',
'Prof. Michael Rodriguez',
'thesis_2.pdf',
'/uploads/thesis_2.pdf',
3072000,
'application/pdf',
3,
2,
'APPROVED',
NOW(),
NOW()),

('Digital Marketing Strategies for SMEs in the Digital Age',
'An analysis of how small and medium enterprises can leverage digital marketing platforms to increase brand awareness and customer engagement. Includes case studies and recommendations for ROI optimization.',
'Digital Marketing',
'Dr. Emily Watson',
'thesis_3.pdf',
'/uploads/thesis_3.pdf',
1536000,
'application/pdf',
4,
3,
'APPROVED',
NOW(),
NOW()),

('Blockchain Technology in Supply Chain Management',
'This thesis demonstrates how blockchain technology can revolutionize supply chain transparency and efficiency. Implementation details and proof-of-concept with a retail company case study.',
'Blockchain',
'Prof. James Liu',
'thesis_4.pdf',
'/uploads/thesis_4.pdf',
2560000,
'application/pdf',
2,
1,
'PENDING',
NOW(),
NOW()),

('Teacher Professional Development in Remote Learning',
'A comprehensive study on the impact of professional development programs on teacher effectiveness in remote learning environments during and after the pandemic.',
'Education Technology',
'Dr. Patricia Green',
'thesis_5.pdf',
'/uploads/thesis_5.pdf',
1800000,
'application/pdf',
3,
4,
'PENDING',
NOW(),
NOW());

-- Note: Use the registration endpoint to create real users with proper password hashing
