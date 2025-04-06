# Task Manager Frontend

This is the frontend for the Task Manager application, built with **ReactJS** (Node 18). It allows users to manage their tasks via a responsive and intuitive interface.

## 🌟 Features

- 🔐 **User Authentication**
  - JWT-based login and registration
  - Secure session handling
- ✅ **Task Management**
  - Create, read, update, and delete tasks
  - Mark tasks as completed
- 🎯 **Task Attributes**
  - Title, Description, Due Date, Priority, Status, Category
- 🧠 **Missed Task Detection**
  - Highlights tasks that are past their due date
- 🔍 **Filters & Search**
  - Filter by Category, Priority, Status, and Due Date
  - Dynamic filtering with instant updates
  - Remove individual filters or clear all
- 📱 **Responsive Design**
  - Mobile and desktop-friendly layouts

## 🔒 Security Features

- JWT token stored in `localStorage`
- Auth-protected routes using React Router
- Logout mechanism to clear tokens
- Input validation to prevent injection attacks

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18)
- npm or yarn

### Steps


# Clone the repo
git clone <your-repo-url>
cd task-manager-frontend

# Install dependencies
npm install

# Start the development server
npm start
