# Real-Time High-Traffic Sneaker Drop System

A full-stack application designed to handle high-concurrency "Limited Edition Sneaker Drops." The system ensures atomic reservations to prevent overselling and provides real-time stock synchronization across all clients.

## 🚀 Live Demo & Video
- **Live Application:** wll be added soon
- **Video Demo (Loom):** will be added soon

## 🛠 Tech Stack
- **Frontend:** React, Tailwind CSS (for clean, functional UI)
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (Hosted on Neon)
- **ORM:** Sequelize
- **Real-Time:** Socket.io for live stock updates and activity feeds

## 🏗 Architecture Choices

### 1. Atomic Reservations & Concurrency
To prevent "Overselling", I've implemented a **Row-Level Locking** strategy using PostgreSQL transactions. 
- When a user clicks "Reserve," the backend starts a Sequelize transaction.
- It uses `SELECT ... FOR UPDATE` (via `lock: transaction.LOCK.UPDATE`) to lock the specific Drop row. This ensures that if 100 users hit the button simultaneously, the database processes them sequentially.
- The stock is only decremented if `availableStock > 0` within that protected transaction.

### 2. 60-Second Stock Recovery
To handle the "Stock Recovery" mechanism:
- Upon a successful reservation, the system initiates a `scheduleExpirationCheck`.
- This utilizes a Node.js timer (or background worker) that triggers after 60 seconds.
- If the reservation status has not changed to "completed" (purchased), the system automatically expires the reservation, increments the `availableStock` back, and broadcasts the update via WebSockets to all clients.

### 3. Real-Time Sync
- **Socket.io** is used to broadcast `stock-updated` events globally whenever a reservation is made, expires, or a purchase is finalized.
- The "Drop Activity Feed" is updated dynamically, showing the 3 most recent successful purchasers for each drop.

## ⚙️ Setup Instructions
### Prerequisites
- Node.js (version: 24.13.1)
- PostgreSQL Database

### Installation
1. Clone the repository:
```shell
git clone https://github.com/masrur-sakib/sneaker_repo.git
```
2. In the root or backend or frontend folder
```shell
npm i or npm install
```
3. To run backend, frontend locally run following command from backend, frontend respactively
```shell
npm run dev
```

### Database Setup
1. Create a .env file in the backend directory with your DATABASE_URL, PORT & FRONTEND_URL.
2. The application uses sequelize.sync({ alter: true }) to automatically build the schema (Users, Drops, Reservations, Purchases) on startup.

## 🧪 Concurrency Testing
A dedicated script is provided to simulate high traffic and verify the "Atomic Reservation" system. It sends 10 concurrent requests to a single drop to ensure no overselling occurs.

**To run the concurrency test:**
1. Ensure the backend server is running (`npm run dev`).
2. Run the following command from the backend root folder:
```shell
node test/test-concurrency.js
```
