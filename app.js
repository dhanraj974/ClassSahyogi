// ClassSahyogi - School Management System
// Main application JavaScript file

// Global variables for the school management system
let currentUser = null;
let students = [];
let staff = [];
let attendance = {};
let marks = {};
let fees = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    checkAuthentication();
});

// Load data from localStorage
function loadData() {
    students = JSON.parse(localStorage.getItem('students')) || [];
    staff = JSON.parse(localStorage.getItem('staffData')) || [];
    attendance = JSON.parse(localStorage.getItem('attendance')) || {};
    marks = JSON.parse(localStorage.getItem('marks')) || {};
    fees = JSON.parse(localStorage.getItem('feesData')) || {};
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('staffData', JSON.stringify(staff));
    localStorage.setItem('attendance', JSON.stringify(attendance));
    localStorage.setItem('marks', JSON.stringify(marks));
    localStorage.setItem('feesData', JSON.stringify(fees));
}

// Check user authentication
function checkAuthentication() {
    const user = sessionStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        updateUIForUser();
    }
}

// Update UI based on user role
function updateUIForUser() {
    if (!currentUser) return;
    
    // Update navigation based on user role
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === 'staff.html' && currentUser.role === 'teacher') {
            link.style.display = 'none';
        }
    });
}

// Utility function to format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Utility function to generate unique ID
function generateId(prefix = 'ID') {
    return prefix + Date.now() + Math.random().toString(36).substr(2, 9);
}

// Export functions for use in other files
window.ClassSahyogi = {
    loadData,
    saveData,
    formatDate,
    generateId,
    currentUser: () => currentUser
};