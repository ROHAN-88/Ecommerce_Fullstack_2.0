# Architecture Overview

This document provides a high-level view of the system architecture, describing how the Frontend, Backend, and Database interact.

## System Diagram

```mermaid
graph TD
    subgraph "Client Layer (Next.js)"
        Browser[User Browser]
        Pages[App Router Pages]
        Comps[React Components]
    end

    subgraph "API Layer (Express.js)"
        Gateway[API Gateway / Entry]
        Auth[Auth Middleware (JWT)]
        Controllers[Modular Controllers]
        Services[Business Logic & Services]
    end

    subgraph "Data Layer"
        DB[(PostgreSQL)]
        Assets[Asset Storage (Local/Cloud)]
    end

    Browser -->|HTTP/HTTPS| Pages
    Pages -->|API Calls (fetch)| Gateway
    Gateway --> Auth
    Auth --> Controllers
    Controllers --> Services
    Services -->|SQL Queries| DB
    Services -->|File I/O| Assets
```

## Component Description

### 1. Frontend (Next.js App Router)
- **Responsibility**: Renders UI, manages client-side state, and handles user interactions.
- **Routing**: File-system based routing via the `app/` directory.
- **Data Fetching**: Uses Server Components for initial data load and Client Components for interactivity.
- **State Management**: React Context or local state for UI interactions; URL search params for filters/pagination.

### 2. Backend (Express.js)
- **Responsibility**: Exposes RESTful API endpoints, handles business logic, and ensures security.
- **Structure**: Modular architecture. Each feature (e.g., `auth`, `products`, `chat`) has its own route, controller, and service files.
- **Authentication**: Stateless JWT authentication. Tokens passed in HTTP Headers (`Authorization: Bearer <token>`).
- **Validation**: Input validation middleware (e.g., Joi or Zod) before processing requests.

### 3. Database (PostgreSQL)
- **Responsibility**: Persists application data.
- **Design**: Relational model ensuring data integrity via Foreign Keys.
- **Optimization**: Indexes on frequently searched columns (e.g., `product_name`, `category_id`).

## Data Flow Patterns

### Product Listing (Public Read)
1. **User** visits Homepage.
2. **Next.js Page** (Server Component) requests `GET /api/products` from Backend.
3. **Backend** queries **PostgreSQL** for active products.
4. **Data** is returned to Next.js and rendered as HTML.

### User Login (Auth)
1. **User** submits credentials on Login form.
2. **Frontend** POSTs to `/api/auth/login`.
3. **Backend** verifies credentials against hashed password in DB.
4. **Backend** issues a signed JWT.
5. **Frontend** stores JWT (HttpOnly Cookie preferably, or LocalStorage) for subsequent requests.

### Chat (Real-time/Near Real-time)
1. **Buyer** clicks "Chat" on product.
2. **Frontend** creates a conversation via `POST /api/chat`.
3. **Backend** stores message in DB.
4. **Other Participant** retrieves messages via periodic polling or WebSocket event (implementation dependent).
