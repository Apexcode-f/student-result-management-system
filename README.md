# Student Result Management System

This project is a web-based Student Result Management System for managing and viewing academic results. It is designed for use by students, teachers, and administrators.

## Features

- User registration and login (Student, Teacher, Admin)
- Admin dashboard to manage users and results
- Teacher dashboard to publish and view results
- Student dashboard to view personal results
- Secure password storage with bcrypt
- Responsive and modern user interface

## Project Structure

- `public/` — Frontend HTML, CSS, and JavaScript files
  - `index.html` — Home page
  - `login.html`, `register.html` — Auth pages
  - `dashboards/` — Dashboards for admin, teacher, and student
  - `css/styles.css` — Main stylesheet
  - `js/` — Frontend scripts
- `server.js` — Node.js backend server (Express, MSSQL)
- `database/student_result_system.sql` — Database schema
- `package.json` — Project dependencies

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up the database:**
   - Import `database/student_result_system.sql` into your SQL Server.
   - Update the database credentials in `server.js` if needed.
3. **Run the server:**
   ```bash
   npm start
   ```
4. **Open the app:**
   - Go to [http://localhost:3000](http://localhost:3000) in your browser.

## Technologies Used

- Node.js, Express
- Microsoft SQL Server
- HTML, CSS, JavaScript

## Author

Frank Asare

---

For any issues or questions, please contact the project author.
