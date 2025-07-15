# 🚀 DevFlow – A Modern Developer Q&A Platform

DevFlow is a full-stack developer-focused Q&A platform inspired by StackOverflow. It enables developers to post questions, write answers, vote, follow tags, build reputation, and get real-time notifications. Built for scalability and speed, DevFlow offers a clean, modern backend powered by Node.js, MongoDB, Redis, and Socket.io.

---

## ⚙️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Real-Time**: Socket.IO + Redis Pub/Sub
- **Job Queue**: BullMQ + Redis
- **Authentication**: JWT (Access + Refresh Tokens)
- **Rate Limiting**: express-rate-limit
- **Security**: Helmet, XSS-Clean, Mongo-Sanitize, CORS
- **Logging**: Morgan 

---

## ✨ Features

### 👥 User Module
- Signup/Login with JWT auth
- Refresh token flow
- Update profile & avatar
- View public user profile with activity and stats
- Reputation score based on activity

### 📝 Questions & Answers
- Post, edit, and delete questions
- Write and upvote/downvote answers
- Accept answers
- Pagination and sorting

### 🔍 Search & Filtering
- Full-text search using MongoDB text indexes
- Filter questions by tags
- Sort by newest, top-voted, or most relevant

### 🏷️ Tags
- Auto-suggest and autocomplete
- Track tag usage count
- View tag-specific question feeds

### 🔔 Notifications
- Real-time in-app notifications (Socket.IO + Redis)
- New answers, comments, votes, and mentions
- Mark notifications as read/unread

### 📊 Reputation System
- Gain/lose points on votes and accepted answers
- View reputation stats per user
- Badge support for milestones (coming soon)

### 🧾 Activity Feed
- Personal timeline of questions, answers, votes
- Public activity visible on user profile

### 🛡️ Security
- Secure HTTP headers (Helmet)
- NoSQL Injection protection (mongo-sanitize)
- XSS filtering (xss-clean)
- Rate limiting on sensitive routes

### 🧑‍💼 Admin Tools
- Admin dashboard for managing reported content and users
- Block/flag/unflag users and questions

