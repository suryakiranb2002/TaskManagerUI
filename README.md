
---

### 🔧 `README.md` for Backend (Spring Boot)


# Task Manager Backend

This is the backend of the Task Manager application, built using **Java 17** and **Spring Boot**. It exposes RESTful APIs for authentication and task management.

## 🌟 Features

- 👤 **User Management**
  - Register and login endpoints
  - JWT-based authentication and authorization
- 📋 **Task Management APIs**
  - CRUD operations for tasks
  - Supports attributes: Title, Description, Due Date, Priority, Status, and Category

## 🔒 Security Features

- JWT Authentication using Spring Security
- Passwords securely hashed with BCrypt
- Role-based access protection (e.g., only authenticated users can manage their tasks)
- CORS configuration for frontend communication
- Input validation on DTOs

## 📦 Tech Stack

- Java 17
- Spring Boot
- Spring Security
- JWT (JSON Web Tokens)
- MySQL (or H2 for dev)
- Maven
- Hibernate / JPA

## 🚀 Setup Instructions

### Prerequisites

- Java 17
- Maven
- MySQL Server (if not using H2)

### Steps


# Clone the repo
git clone <your-repo-url>
cd task-manager-backend

# Set up MySQL database
CREATE DATABASE task_manager;

# Update `application.properties` or `application.yml` with your DB credentials

# Build the project
mvn clean install

# Run the app
mvn spring-boot:run
