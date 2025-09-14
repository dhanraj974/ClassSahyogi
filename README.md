# ClassSahyogi - Role-Based Dashboard System

A comprehensive school management system with three distinct user roles: Admin, Teacher, and Student. Each role has specific permissions and access levels.

## 🚀 Features

### 🔐 Authentication System
- **Common Login Page**: Single login interface for all user types
- **Role Selection**: Users select their role (Admin, Teacher, Student) during login
- **Session Management**: Secure session handling with automatic redirection
- **Demo Credentials**: Pre-configured test accounts for each role

### 👑 Admin Dashboard
- **Full Access**: Complete control over all system features
- **Staff Management**: Add, edit, and manage staff members
- **Student Management**: Full student enrollment and data management
- **Fees Management**: Complete fee collection and tracking
- **Analytics**: Comprehensive reports and analytics
- **System Settings**: Access to all configuration options

### 👨‍🏫 Teacher Dashboard
- **Limited Access**: Most features available except staff management
- **Student Viewing**: View student information and data
- **Attendance Management**: Mark and track student attendance
- **Marks Entry**: Enter and manage student marks
- **Timetable Access**: View class schedules
- **Analytics**: View performance reports for their classes
- **Restrictions**: Cannot add/remove staff members

### 🎓 Student Dashboard
- **Read-Only Access**: View personal data only
- **Personal Information**: View own profile details
- **Academic Performance**: View marks and grades
- **Attendance Tracking**: View personal attendance records
- **Fees Status**: Check fee payment status
- **Notifications**: View important announcements
- **No Editing**: Cannot modify any data

## 📁 File Structure

```
├── main-portal.html        # Main entry point with role selection
├── login.html              # Common login page for all users
├── admin-dashboard.html    # Admin dashboard with full access
├── teacher-dashboard.html  # Teacher dashboard with limited access
├── student-dashboard.html  # Student dashboard with read-only access
├── student-login.html      # Student-specific login page
├── admin-login.html        # Admin-specific login page
├── index.html              # Teacher dashboard (legacy)
├── analytics.html          # Analytics page
├── enrollment.html         # Student enrollment page
├── fees.html              # Fees management page
├── attendance.html        # Attendance management page
├── marks.html             # Marks management page
├── staff.html             # Staff management page
├── timetable.html         # Timetable management page
└── README.md              # This documentation file
```

## 🔑 Demo Credentials

### Admin Access
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Full system control

### Teacher Access
- **Username**: `teacher`
- **Password**: `teacher123`
- **Access**: Limited (no staff management)

### Student Access
- **Username**: `student`
- **Password**: `student123`
- **Access**: Read-only personal data

## 🚀 Getting Started

1. **Open the Main Portal**
   - Open `main-portal.html` in your web browser
   - This is the main entry point for all users

2. **Select Your Role**
   - Click on the appropriate role card (Admin, Teacher, or Student)
   - Each role has different access levels and features

3. **Login with Credentials**
   - **Admin**: Use `admin` / `admin123`
   - **Teacher**: Use `teacher` / `teacher123`
   - **Student**: Use roll number `ST001`

4. **Access Your Dashboard**
   - After successful login, you'll be redirected to your role-specific dashboard
   - Each dashboard has different features based on your role

## 🎯 Role-Based Features

### Admin Features
- ✅ Add/Remove Staff Members
- ✅ Manage Student Enrollment
- ✅ Handle Fee Collection
- ✅ View All Analytics
- ✅ Manage Attendance
- ✅ Enter/Edit Marks
- ✅ System Configuration
- ✅ User Management

### Teacher Features
- ❌ Add/Remove Staff Members (Restricted)
- ✅ View Student Information
- ✅ Mark Attendance
- ✅ Enter Student Marks
- ✅ View Timetable
- ✅ View Fees Status
- ✅ View Analytics
- ✅ Basic Settings

### Student Features
- ❌ Edit Any Data (Read-Only)
- ✅ View Personal Information
- ✅ View Own Marks
- ✅ View Own Attendance
- ✅ View Fee Status
- ✅ View Timetable
- ✅ View Notifications

## 🔒 Security Features

- **Session Management**: Automatic logout on browser close
- **Role Validation**: Each page validates user role before allowing access
- **Redirect Protection**: Unauthorized users are redirected to login
- **Data Isolation**: Students can only see their own data

## 🎨 Design Features

- **Modern UI**: Clean, professional interface design
- **Responsive Layout**: Works on desktop and mobile devices
- **Role-Specific Branding**: Different color schemes and icons for each role
- **Intuitive Navigation**: Easy-to-use navigation menus
- **Visual Feedback**: Clear indicators for restricted features

## 📊 Dashboard Components

### Admin Dashboard
- Key statistics overview
- Quick action buttons
- Recent activity feed
- Full navigation menu

### Teacher Dashboard
- Class-specific statistics
- Teaching-focused quick actions
- Restricted features notice
- Activity tracking

### Student Dashboard
- Personal performance metrics
- Academic information display
- Read-only data tables
- Attendance charts

## 🔧 Technical Implementation

- **Pure HTML/CSS/JavaScript**: No external dependencies except Chart.js
- **Local Storage**: Data persistence using browser localStorage
- **Session Storage**: User session management
- **Chart.js**: Interactive charts and graphs
- **Responsive Design**: Mobile-friendly layouts

## 🚀 Future Enhancements

- Database integration
- Real-time notifications
- File upload capabilities
- Advanced reporting
- Mobile app development
- Multi-language support

## 📞 Support

For any issues or questions about the system, please refer to the code comments or contact the development team.

---

**ClassSahyogi** - Empowering Education Through Technology
