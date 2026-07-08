# TrustPulse

**Adaptive Permission Decay + Crowdsourced Breach Detection**

TrustPulse is a personal **Digital Trust Dashboard** designed to solve two major privacy issues: **Permission Rot** (dormant apps retaining access forever) and **Delayed Breach Awareness** (finding out about leaks months after they happen). 

It manages privacy through a unified Trust Engine featuring two core modules:
1. **Consent Decay (Proactive Defense):** Automatically weakens and revokes app permissions over time if they remain unused.
2. **Canary Network (Reactive Detection):** Generates unique "trap" credentials (canary tokens/aliases) for every platform you use. If that specific credential appears in spam or data leaks, it confirms exactly which platform was breached, leveraging a crowdsourced network of users for immediate alerts.

## Architecture Overview

The system follows a modern client-server architecture with real-time event capabilities:

1. **Frontend (Client App)**
   - Built as a Single Page Application (SPA).
   - Manages the **Trust Health Bar** and **Canary Dashboard** interfaces.
   - Communicates with the backend REST APIs to fetch app permission statuses and perform actions (like revoking dormant apps).
   - Maintains an active WebSocket connection to listen for instant breach alerts.

2. **Backend (Server & Trust Engine)**
   - Exposes RESTful API endpoints for retrieving user personas, app statuses, and triggering permission revocations.
   - Hosts a **WebSocket (Socket.IO) Server** that streams real-time notifications to the frontend when a canary trip (breach) is detected.
   - Simulates the background tracking of app usages and third-party data leak monitors.

3. **Real-time Breach Notification Flow:**
   - A mock trigger endpoint (`/api/trigger-breach`) acts as the external leak monitor.
   - When triggered, the backend instantly emits a `canary-alert` payload over the active WebSocket.
   - The frontend intercepts this payload and displays a real-time, critical alert dialog to the user with actionable insights (e.g., source of leak, records exposed).

## Tech Stack

### Frontend
- **React.js** (v19) - Core UI framework
- **Vite** - Lightning-fast build tool and development server
- **Framer Motion** - Fluid animations and dynamic transitions
- **Lucide React** - Modern, crisp iconography
- **Socket.IO Client** - Real-time bidirectional event-based communication
- **Vanilla CSS** - Styling and responsive design

### Backend
- **Node.js & Express.js** - Fast, unopinionated web framework for REST API
- **Socket.IO** - Real-time WebSocket server for instant alerts
- **CORS** - Cross-origin resource sharing middleware

## Getting Started (Running Locally)

To run the prototype locally on your machine, you need to start both the frontend and backend servers.

### 1. Start the Backend
```bash
cd backend
npm install
node server.js
```
The backend server will run on `http://localhost:3001`.

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will be accessible via the Vite localhost link (usually `http://localhost:5173`).

---
Built for Digital Trust & Infrastructure.
