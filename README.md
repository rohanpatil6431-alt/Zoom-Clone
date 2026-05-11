# 🎥 Zoom Clone — Real-Time Video Conferencing App

A full-stack video conferencing application built with WebRTC, Socket.io, and the MERN stack. Supports multi-participant video calls, real-time chat, screen sharing, and user authentication — all in the browser, no plugins required.

> **Live Demo**: [Add link] &nbsp;|&nbsp; **GitHub**: [Add link]

---

## ✨ Features

- **Multi-participant video calls** — Real-time peer-to-peer connections via WebRTC
- **Audio/Video controls** — Toggle camera and mic without dropping the call
- **Screen sharing** — Share display to all participants in one click
- **In-call chat** — Real-time messaging with unread badge notifications
- **User authentication** — Secure login with session management
- **Call history** — Track past meetings and participant info
- **Responsive UI** — Works across screen sizes

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React, Material-UI, CSS Modules, React Context API |
| **Real-time** | Socket.io (client + server), WebRTC (RTCPeerConnection) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Media** | Browser MediaStreams API, `getUserMedia`, `getDisplayMedia` |

---

## 🧠 Key Learnings

### WebRTC & Peer-to-Peer Communication
- Established direct browser-to-browser media streams using `RTCPeerConnection`
- Implemented SDP offer/answer negotiation and ICE candidate exchange for NAT traversal
- Managed multiple simultaneous peer connections without degrading stream quality

### Socket.io for Signaling & Chat
- Built a custom signaling layer to coordinate WebRTC handshakes between peers
- Used rooms and namespaces to scope events per meeting session
- Handled connection/disconnection edge cases gracefully in multi-user scenarios

### React State & Media Management
- Managed complex async state with `useRef` + `useEffect` across video grid, chat, and controls
- Dynamically enabled/disabled audio and video tracks mid-call without re-initiating the stream
- Implemented screen capture using `getDisplayMedia` and swapped media tracks live

### Full-Stack Integration
- Designed an event-driven backend architecture to coordinate real-time state across all clients
- Configured CORS and handled WebSocket lifecycle (connect, reconnect, disconnect) reliably

---

## ⚔️ Challenges Overcome

| Challenge | How I solved it |
|-----------|----------------|
| Managing N×N peer connections | Maintained a `useRef` map of `RTCPeerConnection` objects keyed by socket ID |
| Toggling media without stream interruption | Accessed and muted individual tracks instead of replacing the entire stream |
| Reliable chat delivery to all participants | Routed messages server-side through Socket.io rooms rather than P2P |
| Complex video grid layout | Used CSS Grid with dynamic column calculation based on participant count |
| Browser permission and error handling | Wrapped `getUserMedia` calls with graceful fallbacks and user-facing feedback |

---

## 🚀 Planned Enhancements

- [ ] Meeting recording
- [ ] Virtual backgrounds
- [ ] Hand raise feature
- [ ] End-to-end encryption
- [ ] Meeting scheduling + calendar integration
- [ ] Chat reactions and threaded replies
- [ ] Analytics dashboard

---



*Built to deeply understand real-time communication on the web — WebRTC, socket-based signaling, and full-stack coordination under one project.*
