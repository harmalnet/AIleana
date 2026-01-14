# AIleana - Payments & Calls Backend

A NestJS-based backend service demonstrating wallet management, payment processing with Monnify integration, and call session tracking with REST-based signaling.

## 🎯 Features Implemented

### 1. User Management & Authentication
- ✅ User registration with automatic wallet creation
- ✅ JWT-based authentication
- ✅ Secure password hashing with bcrypt
- ✅ Protected routes with JWT guards

### 2. Wallet Management
- ✅ Automatic wallet creation on user registration
- ✅ Real-time balance tracking
- ✅ Credit/Debit operations with transaction validation
- ✅ Insufficient balance checks

### 3. Payment Flow (Monnify Integration - Mocked)
- ✅ Payment initiation with unique transaction references
- ✅ Mocked Monnify API integration
- ✅ Webhook handling for payment confirmation
- ✅ Automatic wallet crediting on successful payment
- ✅ Payment history tracking
- ✅ Payment verification endpoint

### 4. Call Session Management
- ✅ Call initiation with balance verification
- ✅ REST-based signaling (mocked WebRTC)
- ✅ Call status tracking (initiated, ongoing, ended, rejected, etc.)
- ✅ Duration-based charging (NGN 50/minute)
- ✅ Automatic wallet deduction on call end
- ✅ Call history with incoming/outgoing classification
- ✅ Support for voice and video call types

## 📋 Tech Stack

- **Framework:** NestJS 10.x
- **Database:** TypeORM with PostgreSQL 15
- **Authentication:** JWT with Passport
- **Validation:** class-validator, class-transformer
- **API Documentation:** Swagger/OpenAPI
- **Security:** Helmet, Throttling, bcrypt
- **Containerization:** Docker & Docker Compose

## 🐳 Docker Setup (Quickest Way)

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

The application will be available at:
- **API:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/api/docs
- **PostgreSQL:** localhost:5432

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.13.0
- PostgreSQL >= 15 (or Docker)
- npm >= 9.2.0

### Installation

```bash
# Navigate to project
cd AIleana

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Update .env with your database credentials
```

### Database Setup

#### Option 1: Using Docker (Recommended)

```bash
# Start PostgreSQL and the app in Docker
docker-compose up -d

# View logs
docker-compose logs -f
```

#### Option 2: Local PostgreSQL

```bash
# Create database
psql -U postgres
CREATE DATABASE aileana_db;

# Exit psql
\q

# Run migrations (if any)
npm run migration:run
```

### Run the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The application will be available at:
- **API:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/api/docs
- **Health Check:** http://localhost:3000/health

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "fullName": "John Doe",
  "phoneNumber": "+2348012345678",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "john.doe@example.com",
    "fullName": "John Doe",
    "phoneNumber": "+2348012345678"
  },
  "token": "jwt_token_here"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

### Wallet Endpoints

#### Get Wallet Balance
```http
GET /api/v1/wallets/balance
Authorization: Bearer {token}
```

**Response:**
```json
{
  "balance": 5000,
  "currency": "NGN"
}
```

#### Fund Wallet (Demo - Direct Credit)
```http
POST /api/v1/wallets/fund
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 1000
}
```

**Response:**
```json
{
  "message": "Wallet funded successfully (Demo)",
  "balance": 1000,
  "credited": 1000
}
```

> **Note:** In demo mode, this endpoint directly credits the wallet instead of initiating a payment gateway flow.

### Payment Endpoints

#### Monnify Webhook (Simulate Payment)
```http
POST /api/v1/payments/webhook/monnify
Content-Type: application/json

{
  "transactionReference": "TXN-1234567890-abc123",
  "paymentReference": "PAY-1234567890-xyz789",
  "amountPaid": 1000,
  "totalPayable": 1000,
  "paymentStatus": "PAID",
  "paidOn": "2024-01-14 12:00:00",
  "paymentMethod": "ACCOUNT_TRANSFER"
}
```

#### Verify Payment
```http
GET /api/v1/payments/verify/{transactionReference}
Authorization: Bearer {token}
```

#### Payment History
```http
GET /api/v1/payments/history
Authorization: Bearer {token}
```

### Call Endpoints

#### Initiate Call
```http
POST /api/v1/calls/initiate
Authorization: Bearer {token}
Content-Type: application/json

{
  "receiverId": "receiver-uuid",
  "callType": "voice"
}
```

**Response:**
```json
{
  "message": "Call initiated successfully",
  "sessionId": "CALL-1234567890-abc123",
  "callId": "uuid",
  "callType": "voice",
  "status": "initiated",
  "receiver": {
    "id": "uuid",
    "fullName": "Jane Doe"
  },
  "ratePerMinute": 50
}
```

#### Answer Call
```http
POST /api/v1/calls/{sessionId}/answer
Authorization: Bearer {token}
```

#### End Call
```http
POST /api/v1/calls/{sessionId}/end
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Call ended successfully",
  "sessionId": "CALL-1234567890-abc123",
  "duration": 180,
  "totalCost": 150,
  "status": "ended"
}
```

#### Call History
```http
GET /api/v1/calls/history
Authorization: Bearer {token}
```

#### Send Signal (Mock WebRTC)
```http
POST /api/v1/calls/{sessionId}/signal
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "offer",
  "data": {
    "sdp": "v=0..."
  }
}
```

## 💡 Architecture Highlights

### Clean Architecture
- **Domain-Driven Design:** Each feature is isolated in its own domain module
- **Separation of Concerns:** Controllers, Services, Entities, DTOs are clearly separated
- **Dependency Injection:** Leveraging NestJS DI container

### Security
- **JWT Authentication:** Secure token-based authentication
- **Password Hashing:** bcrypt for secure password storage
- **Request Validation:** Automatic DTO validation with class-validator
- **Rate Limiting:** Throttling to prevent abuse
- **Security Headers:** Helmet middleware

### Payment Flow

**Demo Mode (Current Implementation):**
1. User initiates wallet funding via `/api/v1/wallets/fund`
2. System immediately credits the wallet with the specified amount
3. Returns updated balance

**Production Flow (Available via `/api/v1/payments` endpoints):**
1. User initiates wallet funding
2. System creates payment record with unique transaction reference
3. Monnify API is called (mocked) to generate payment link
4. User completes payment externally
5. Monnify sends webhook to `/api/v1/payments/webhook/monnify`
6. System verifies payment and credits wallet

### Call Flow
1. Caller initiates call → System checks wallet balance
2. Call session created with status "initiated"
3. Receiver gets notified (in real app via WebSocket)
4. Receiver answers → Status changes to "ongoing", start time recorded
5. Participants exchange signals (mocked WebRTC)
6. Either party ends call → Duration calculated, wallet charged

## 🔧 Environment Variables

```env
# Application
NODE_ENV=development
PORT=3000
APP_NAME=AIleana

# Database
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=aileana_db

# JWT
JWT_SECRET=aileana-super-secret-key-change-in-production
JWT_EXPIRATION=7d

# Monnify (Mocked)
MONNIFY_API_KEY=mock-api-key
MONNIFY_SECRET_KEY=mock-secret-key
MONNIFY_CONTRACT_CODE=mock-contract-code
MONNIFY_BASE_URL=https://api.monnify.com
```

## 📊 Database Schema

### Users
- id (UUID, PK)
- email (unique)
- fullName
- phoneNumber
- password (hashed)
- isActive

### Wallets
- id (UUID, PK)
- userId (FK to Users)
- balance (decimal)
- currency (default: NGN)

### Payments
- id (UUID, PK)
- walletId (FK to Wallets)
- transactionReference (unique)
- paymentReference
- amount
- status (pending, success, failed)
- type (wallet_funding, call_charge)

### Call Sessions
- id (UUID, PK)
- callerId (FK to Users)
- receiverId (FK to Users)
- sessionId (unique)
- callType (voice, video)
- status (initiated, ongoing, ended, rejected, etc.)
- duration (seconds)
- totalCost
- ratePerMinute (NGN 50)

## 🎨 Project Structure

```
AIleana/
├── src/
│   ├── domains/
│   │   ├── auth/          # Authentication & JWT
│   │   ├── users/         # User management
│   │   ├── wallets/       # Wallet operations
│   │   ├── payments/      # Payment processing
│   │   └── calls/         # Call sessions
│   ├── common/            # Shared utilities
│   ├── configs/           # Configuration modules
│   ├── decorators/        # Custom decorators
│   ├── filters/           # Exception filters
│   ├── guards/            # Route guards
│   ├── interceptors/      # Interceptors
│   ├── validators/        # Custom validators
│   └── main.ts            # Bootstrap
├── test/                  # E2E tests
└── README.md
```

## 🚧 Limitations & Future Enhancements

### Current Limitations (Mocked)
- Monnify API integration is mocked (not calling real API)
- WebRTC signaling is REST-based (should use WebSocket in production)
- No real-time notifications (would need WebSocket/SSE)

### Potential Enhancements
- Implement real Monnify API integration
- Add WebSocket for real-time call signaling
- Implement push notifications for incoming calls
- Add call recording functionality
- Implement group calling
- Add transaction rollback mechanisms
- Implement idempotency keys for payments
- Add rate limiting per user
- Implement payment refunds
- Add call quality metrics

## 📝 Notes

- **Time Spent:** ~3 hours
- **Focus Areas:** Architecture, API design, security, payment flow, call management
- **Mocked Services:** Monnify API integration is fully mocked but follows actual API patterns
- **WebRTC:** Signaling is REST-based for simplicity; production should use WebSocket

## 📞 Support

For questions or issues, please refer to the Swagger documentation at `/api/docs` when the server is running.

---

**Built with ❤️ using NestJS**
# AIleana
