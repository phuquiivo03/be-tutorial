# Wallet & Transaction System

A full-stack digital wallet project built to explore backend architecture, transaction processing, asynchronous messaging, and real-time communication.

The system supports user authentication, wallet accounts, money transfers, asynchronous transaction processing through RabbitMQ, and real-time notifications through WebSocket.

## Features

- User registration and authentication
- JWT-based authentication
- Password hashing with bcrypt
- Wallet account management
- Account balance tracking
- Money transfer between accounts
- Transaction history
- Double-entry transaction records
- Asynchronous transaction processing with RabbitMQ
- Message retry and Dead Letter Queue (DLQ) handling
- Real-time transaction notifications through WebSocket
- Request validation with Zod
- PostgreSQL database with Prisma ORM
- Redis integration for application-level data management

## Architecture

The application separates synchronous API requests from asynchronous transaction processing.

```text
                    ┌───────────────┐
                    │   Frontend    │
                    │    React      │
                    └───────┬───────┘
                            │
                       HTTP / REST
                            │
                            ▼
                    ┌───────────────┐
                    │   Express.js  │
                    │   REST API    │
                    └───────┬───────┘
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
        PostgreSQL        Redis        RabbitMQ
          Prisma                         │
                                        │
                            ┌───────────┴───────────┐
                            │                       │
                            ▼                       ▼
                     Transaction Queue         Retry / DLQ
                            │
                            ▼
                    Transaction Worker
                            │
                            ▼
                       PostgreSQL
                            │
                            ▼
                       WebSocket
                            │
                            ▼
                       Frontend
```

## Transaction Model

The wallet uses a transaction and entry-based model to keep track of account movements.

A transaction represents a transfer operation, while each entry represents the effect of that transaction on an account.

```text
Transaction
     │
     ├── Entry → Sender Account  (- amount)
     │
     └── Entry → Receiver Account (+ amount)
```

This approach makes it possible to keep a clear record of how each transaction affects the involved accounts.

## Asynchronous Processing

RabbitMQ is used to process transaction-related jobs asynchronously.

The messaging layer includes:

- Durable exchanges and queues
- Routing keys
- Transaction queues
- Retry queues
- Dead Letter Exchange
- Dead Letter Queue
- Message TTL for retry processing

When a message cannot be processed successfully, it can be routed through the retry flow instead of being immediately lost.

```text
                    ┌──────────────────┐
                    │ Transaction API  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ RabbitMQ Exchange │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Transaction Queue │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    Consumer      │
                    └───────┬──────────┘
                            │
                   ┌────────┴────────┐
                   │                 │
                Success            Failure
                   │                 │
                   ▼                 ▼
              PostgreSQL        Retry Queue
                                     │
                                  TTL
                                     │
                                     ▼
                              Transaction Queue
                                     │
                                  Failure
                                     │
                                     ▼
                                   DLQ
```

## Real-time Notifications

The project uses WebSocket to provide real-time communication between the backend and frontend.

After a transaction is processed, the backend can notify connected clients without requiring the frontend to continuously poll the API.

```text
Transaction
     │
     ▼
RabbitMQ
     │
     ▼
Transaction Processing
     │
     ▼
WebSocket Event
     │
     ▼
Frontend
```

## Tech Stack

### Frontend

- React.js
- Shadcn UI

### Backend

- TypeScript
- Node.js
- Express.js
- Prisma ORM

### Database & Storage

- PostgreSQL
- Redis

### Messaging & Real-time

- RabbitMQ
- WebSocket

### Authentication & Validation

- JWT
- bcrypt
- Zod

## Project Structure

```text
.
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── config/
│   ├── infrastructure/
│   │   ├── prisma/
│   │   └── rabbitmq/
│   │
│   ├── ...
│   ├── app.ts
│   ├── server.ts
│   └── socket.ts
│
├── package.json
├── prisma.config.ts
└── Readme.md
```

## Database Model

The core database entities are:

```text
User
 │
 └── Account
       │
       └── Entry ────── Transaction
```

### User

Stores authentication and user information.

### Account

Represents a user's wallet account.

### Transaction

Represents a transfer operation and its processing status.

### Entry

Represents an individual account movement associated with a transaction.

### Job

Stores asynchronous jobs that require background processing.

## Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js
- PostgreSQL
- Redis
- RabbitMQ

### Installation

Clone the repository:

```bash
git clone https://github.com/phuquiivo03/be-tutorial.git
cd be-tutorial
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/wallet"

JWT_SECRET="your-secret"

REDIS_URL="redis://localhost:6379"

RABBITMQ_URL="amqp://localhost"
```

Do not commit your actual `.env` file to the repository.

### Database Setup

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

### Run the API

```bash
npm run dev
```

### Run the WebSocket Server

```bash
npm run dev:socket
```

The WebSocket server runs on:

```text
ws://localhost:3000/ws
```

## API Overview

The backend exposes APIs for core wallet operations, including:

```text
Authentication
├── Register
└── Login

Account
├── Get account
└── Get balance

Transaction
├── Transfer
└── Transaction history
```

The exact endpoints and request/response formats may change as the project evolves.

## Project Goals

This project was built primarily to practice and understand backend system design concepts beyond basic CRUD applications.

The main areas explored include:

- Designing RESTful APIs
- Relational data modeling
- Financial transaction modeling
- Asynchronous processing
- Message queues
- Retry and failure handling
- Dead Letter Queues
- Real-time communication
- Authentication
- Database consistency
- Separating infrastructure concerns from application logic

## Future Improvements

Potential improvements include:

- Add comprehensive automated tests
- Improve transaction idempotency
- Add stronger concurrency control for balance updates
- Add distributed locking where appropriate
- Improve observability and structured logging
- Containerize the complete development environment
- Add CI/CD pipeline
- Add API documentation with OpenAPI/Swagger

## Status

**Completed — core wallet, transaction processing, RabbitMQ flow, and WebSocket notification flow have been implemented and integrated with the frontend demo.**

## Author

**Phu Qui Vo**

GitHub: https://github.com/phuquiivo03
