# TrustPulse

**Adaptive Permission Decay + Crowdsourced Breach Detection + Enterprise Governance**

TrustPulse is a comprehensive Digital Trust Dashboard designed to solve major privacy and security issues across both personal and enterprise surfaces: Permission Rot (dormant apps retaining access forever) and Delayed Breach Awareness (finding out about leaks months after they happen). 

It manages privacy through a unified Trust Engine featuring core modules for individuals and organizations.

## Architecture Overview

1. **Consent Decay (Proactive Defense):** Automatically weakens and revokes app permissions over time if they remain unused. 
2. **Canary Network (Reactive Detection):** Generates unique trap credentials (canary tokens/aliases) for platforms. If that specific credential appears in spam or data leaks, it confirms exactly which platform was breached, leveraging a crowdsourced network for immediate alerts.
3. **Risk Scoring Engine (B2B):** Quantifies application risk using a proprietary algorithm that weighs Scope Breadth (30%), Data Sensitivity (30%), Dormancy (25%), and Blast Radius (15%).
4. **Automated Offboarding (B2B):** Integrates with the employee lifecycle to automatically revoke high-risk application access when a user is offboarded, and flags lower-risk apps for manual admin review.

## Architecture Overview

The system follows a modern client-server architecture with real-time event capabilities and multi-tenant support:

1. **Frontend (Client App)**
   - Built as a Single Page Application (SPA) using React Router for view management.
   - **Personal Dashboard:** Manages the Trust Health Bar and Canary Dashboard interfaces for individual users.
   - **Org Admin Console:** A B2B suite featuring a Network Signal widget, App Directory with Risk Score breakdowns, Member Directory with Offboarding workflows, and isolated Alerts Feeds.
   - Communicates with backend REST APIs and maintains active WebSocket connections for instant breach alerts.

2. **Backend (Server & Trust Engine)**
   - Exposes RESTful API endpoints for retrieving multi-tenant data (Organizations, Users, Apps, Canaries, Audit Logs).
   - Hosts a WebSocket (Socket.IO) Server utilizing room-based isolation (`io.to(orgId).emit`) to stream real-time tenant-specific notifications when a canary trip is detected.
   - Calculates dynamic risk scores and handles business logic for automated offboarding and compliance log generation.

3. **Real-time Breach Notification Flow:**
   - An endpoint (`/api/trigger-breach`) acts as the external leak monitor.
   - When triggered for a specific organization, the backend instantly emits a `canary-alert` payload over the active WebSocket room.
   - The frontend intercepts this payload and displays a real-time, critical alert dialog with actionable incident response steps.

## Tech Stack

### Frontend
- **React.js** (v19) - Core UI framework
- **React Router** - Client-side routing for Personal and B2B views
- **Vite** - Build tool and development server
- **Framer Motion** - Fluid animations and dynamic layout transitions
- **Lucide React** - Modern, crisp iconography
- **Socket.IO Client** - Real-time bidirectional event-based communication
- **Vanilla CSS** - Styling and responsive design

### Backend
- **Node.js & Express.js** - Fast web framework for REST API
- **Socket.IO** - Real-time WebSocket server for instant alerts
- **CORS** - Cross-origin resource sharing middleware

## Getting Started (Running Locally)

To run the platform locally, you need to start both the frontend and backend servers.

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

### 3. Testing the Personas
- **Personal View:** Log in using `safe@trustpulse.com` (or any non-admin email).
- **Admin Console:** Log in using `admin@acme.com` to access the B2B suite.

---
Built for Digital Trust & Infrastructure.
