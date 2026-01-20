# Project Context

## Overview
This project involves building a two-sided ecommerce marketplace platform. The platform serves as an infrastructure provider, facilitating transactions between Buyers and Sellers without owning inventory or managing pricing.

## Core Pillars
- **Infrastructure Provider**: The platform enables commerce but does not participate in sales.
- **Two-Sided Marketplace**: Distinct experiences and tools for Buyers and Sellers.
- **Real-Time Interaction**: Integrated chat system for direct communication.

## User Roles

### 1. Buyer
The end-consumer looking for products.
- **Capabilities**:
  - Browse and search for products across multiple sellers.
  - Filter listings by category, price, etc.
  - View detailed product pages including seller information.
  - Initiate chat with sellers to ask questions or negotiate.

### 2. Seller
The merchant listing products for sale.
- **Capabilities**:
  - Manage a shop profile (location, contact info).
  - Create, update, and delete product listings.
  - View and respond to buyer inquiries via chat.

### 3. Admin
The platform operator.
- **Capabilities**:
  - User management (view/suspend buyers or sellers).
  - Ad management (host and configure advertisements on the homepage).
  - **Restriction**: Admins do not participate in buying, selling, or chat.

## Core Features

### Buyer Experience
- **Homepage**:
  - Responsive Navbar.
  - Admin-managed Advertisement Section.
  - Top Products Carousel.
  - Paginated Product Grid.
- **Product Discovery**:
  - Advanced search and filtering.
  - Product Detail Page with shop info and "Chat with Seller" CTA.

### Seller Experience
- **Dashboard**:
  - comprehensive view of active listings.
  - Tools for inventory management.
  - Chat interface for customer support.

### Admin Experience
- **Dashboard**:
  - User oversight (Buyers/Sellers).
  - Advertisement configuration and performance monitoring.

## Technology Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Styling**: Vanilla CSS (Globals) / Module CSS
- **Linting**: ESLint, Prettier

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (Modular/ES Module architecture)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt (Password hashing), Role-Based Access Control (RBAC)

### Database
- **System**: PostgreSQL
- **ORM/Query Builder**: (To be defined, raw SQL or Prisma/Sequelize recommended)

