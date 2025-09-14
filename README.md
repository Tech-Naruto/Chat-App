# Chat App Frontend

A minimal, emotionally resonant chat interface built with precision and purpose. Engineered for real-time reliability and pixel-perfect UI—currently optimized for laptops, with cross-device enhancements underway.

[🔗 Live Demo](https://chat-app-delta-henna-92.vercel.app)

[🎥 Watch the Demo](https://tech-naruto.github.io/Chat-App-Demo-Video/)

## 🧩 Overview

This is a real-time chat application frontend designed for speed, reliability, and emotional resonance. Key features include:

- **Authentication Flows**

  - Login and SignUp
  - Secure logout across devices

- **Live Messaging**

  - Real-time message delivery via WebSocket
  - Latest messages appear at the top
  - Message count indicators for each thread

- **Presence Indicators**

  - Online status tracking using Redis expiry keys
  - Heartbeat mechanism for accurate presence updates

- **Animations & UX**

  - Smooth transitions powered by Framer Motion

- **Backend Integration Highlights**

  - WebSocket for real-time communication
  - Redis pub/sub for fast data access and decoupled presence logic
  - Expiry keys to offload presence tracking from the database

## 🚀 Features

- Edit your profile details and avatar
- Add and search friends from contacts
- Discover new users with smart suggestions
- Chat with emoji-rich messages
- Real-time updates with online status indicators

## 🛠 Tech Stack

| Layer            | Tools & Libraries                            |
| ---------------- | -------------------------------------------- |
| Build Tool       | Vite (lightning-fast dev + optimized builds) |
| UI Framework     | React, Tailwind CSS                          |
| Animation        | Framer Motion                                |
| State Management | Redux with persistent store                  |
| Data Fetching    | Axios                                        |
| Real-Time Comm   | WebSocket (frontend)                         |
| Backend Support  | Redis (pub/sub, expiry keys for presence)    |

## 🔒 Security

- Tokens are validated at runtime for format and expiration to ensure safe authentication.
- Passwords are securely hashed using `bcrypt` before storage.
- Messages are encrypted with Node.js `crypto` for added privacy.
- Session data is cleared on logout to prevent leaks across devices.

## 🧭 Final Notes

This project blends real-time architecture with emotionally resonant design.  
Built for reliability, clarity, and connection—across devices, browsers, and moments.  
Feel free to explore, or just enjoy the experience.

— Krish Vardhan Pal
