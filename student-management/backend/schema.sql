CREATE DATABASE IF NOT EXISTS student_management;
USE student_management;

CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role_id INT NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  student_code VARCHAR(20) UNIQUE NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  grade VARCHAR(10) NOT NULL,
  guardian_name VARCHAR(120),
  guardian_phone VARCHAR(20),
  address TEXT,
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE teachers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  full_name VARCHAR(120) NOT NULL,
  department VARCHAR(120),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(120) NOT NULL,
  grade VARCHAR(10) NOT NULL,
  teacher_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);

CREATE TABLE enrollments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  attendance_date DATE NOT NULL,
  status ENUM('Present', 'Absent', 'Late') NOT NULL,
  marked_by INT,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (marked_by) REFERENCES teachers(id)
);

CREATE TABLE marks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  assessment_title VARCHAR(120) NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  grade VARCHAR(5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE assignments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,
  title VARCHAR(120) NOT NULL,
  description TEXT,
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE timetable (
  id INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,
  day_of_week ENUM('Mon','Tue','Wed','Thu','Fri','Sat') NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room VARCHAR(40),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
