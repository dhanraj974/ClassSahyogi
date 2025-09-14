// Common JavaScript functions for ClassSahyogi
// This file contains shared functionality across all pages

// Check user authentication and redirect if needed
function checkAuthentication() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    return currentUser;
}

// Get user role
function getUserRole() {
    const currentUser = checkAuthentication();
    return currentUser.role || null;
}

// Check if user has admin access
function isAdmin() {
    const currentUser = checkAuthentication();
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    return (currentUser && currentUser.role === 'admin') || (adminLoggedIn === 'true');
}

// Check if user has teacher access
function isTeacher() {
    const currentUser = checkAuthentication();
    return currentUser && currentUser.role === 'teacher';
}

// Check if user has student access
function isStudent() {
    const currentUser = checkAuthentication();
    return currentUser && currentUser.role === 'student';
}

// Navigate to appropriate dashboard based on user role
function goToDashboard() {
    const currentUser = checkAuthentication();
    
    if (currentUser.role === 'admin') {
        window.location.href = 'admin-dashboard.html';
    } else if (currentUser.role === 'teacher') {
        window.location.href = 'teacher-dashboard.html';
    } else if (currentUser.role === 'student') {
        window.location.href = 'student-dashboard.html';
    } else {
        // No user logged in, go to main page
        window.location.href = 'index.html';
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUser');
    window.location.href = 'index.html';
}

// Hide navigation items based on user role
function updateNavigationForUser() {
    const userRole = getUserRole();
    const staffLinks = document.querySelectorAll('a[href="staff.html"]');
    
    if (userRole === 'teacher') {
        staffLinks.forEach(link => {
            link.style.display = 'none';
        });
    } else {
        staffLinks.forEach(link => {
            link.style.display = 'flex';
        });
    }
}

// Format date utility
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Generate unique ID
function generateId(prefix = 'ID') {
    return prefix + Date.now() + Math.random().toString(36).substr(2, 9);
}

// Load data from localStorage
function loadData() {
    return {
        students: JSON.parse(localStorage.getItem('students')) || [],
        staff: JSON.parse(localStorage.getItem('staffData')) || [],
        attendance: JSON.parse(localStorage.getItem('attendance')) || {},
        marks: JSON.parse(localStorage.getItem('marks')) || {},
        fees: JSON.parse(localStorage.getItem('feesData')) || {}
    };
}

// Save data to localStorage
function saveData(data) {
    if (data.students) localStorage.setItem('students', JSON.stringify(data.students));
    if (data.staff) localStorage.setItem('staffData', JSON.stringify(data.staff));
    if (data.attendance) localStorage.setItem('attendance', JSON.stringify(data.attendance));
    if (data.marks) localStorage.setItem('marks', JSON.stringify(data.marks));
    if (data.fees) localStorage.setItem('feesData', JSON.stringify(data.fees));
}

// Initialize common functionality
document.addEventListener('DOMContentLoaded', function() {
    updateNavigationForUser();
});
