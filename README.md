# Intelligent Urban Waste Management System

A full-stack web application for improving urban waste management through digital complaint reporting, complaint tracking, staff assignment, waste collection coordination, notifications, and administrative monitoring.

The application provides separate functionality for citizens, staff, and administrators with secure authentication and role-based access control.

---

## Live Application

### Frontend

https://frontend-rdwsbz7rs-mahesh-nayak53s-projects.vercel.app

### Backend

https://intelligent-urban-waste-backend.onrender.com

### Backend Health Check

https://intelligent-urban-waste-backend.onrender.com/health

---

## GitHub Repository

https://github.com/mahesh-nayak53/intelligent-urban-waste-management

---

## Project Overview

The Intelligent Urban Waste Management System is designed to provide a centralized platform for managing waste-related complaints and collection activities.

Citizens can report waste-related issues, track their complaints, and receive notifications.

Staff members can view assigned complaints, update complaint statuses, and manage collection-related tasks.

Administrators can manage users, staff, complaints, assignments, notifications, and system-level statistics through an administrative dashboard.

---

## Objectives

The main objectives of this project are:

- Digitize urban waste complaint management
- Allow citizens to report waste-related problems
- Provide real-time complaint status tracking
- Enable administrators to assign complaints to staff
- Help staff manage assigned complaints
- Improve communication through notifications
- Provide dashboards and statistics for monitoring
- Reduce manual waste management processes
- Provide a centralized waste management platform

---

# Features

## Authentication

- User registration
- User login
- JWT-based authentication
- Secure password hashing
- Logout functionality
- Role-based authentication
- Protected routes

---

## Citizen Features

Citizens can:

- Create an account
- Login securely
- Submit waste complaints
- Upload complaint images/files
- View submitted complaints
- Track complaint status
- View complaint history
- Receive notifications
- View activity information
- Monitor complaint progress

---

## Staff Features

Staff members can:

- Login securely
- Access staff dashboard
- View assigned complaints
- View complaint details
- Update complaint status
- Manage waste collection tasks
- View notifications
- Monitor assigned activities

---

## Admin Features

Administrators can:

- Access admin dashboard
- Manage users
- Manage staff members
- View complaints
- View complaint details
- Assign complaints to staff
- Update complaint status
- Manage waste collection activities
- View notifications
- Monitor system activity
- View dashboard statistics
- Analyze complaint trends
- Monitor complaint priorities
- View zone-based statistics

---

# Dashboard Features

The application includes different dashboard components for monitoring the waste management system.

### Complaint Status

Displays the distribution of complaints based on their current status.

### Complaint Trends

Provides a visual representation of complaint trends over time.

### Priority Distribution

Displays complaints based on priority levels.

### Zone Statistics

Provides statistics based on different geographical zones.

### Activity Feed

Displays recent system activities.

### Notifications

Allows users and staff to view and manage system notifications.

---

# Technology Stack

## Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Axios
- Recharts

## Backend

- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- Spring Security
- JWT
- Maven

## Database

- MySQL-compatible TiDB Cloud
- Hibernate ORM
- JPA

## Deployment

- Vercel - Frontend
- Render - Backend
- TiDB Cloud - Database

## Version Control

- Git
- GitHub

---

# Architecture

```text
                    ┌─────────────────────────────┐
                    │       User / Browser        │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │      React Frontend         │
                    │       Vite + Tailwind       │
                    │          Vercel             │
                    └──────────────┬──────────────┘
                                   │
                              REST API
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │     Spring Boot Backend     │
                    │       Spring Security       │
                    │          JWT                │
                    │           JPA               │
                    │          Render             │
                    └──────────────┬──────────────┘
                                   │
                                  JDBC
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │        TiDB Cloud           │
                    │     MySQL Compatible        │
                    │        Database              │
                    └─────────────────────────────┘
