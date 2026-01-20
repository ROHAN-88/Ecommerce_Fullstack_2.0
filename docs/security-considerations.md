# Security Considerations

Security is paramount for an ecommerce platform. This document outlines the security measures implemented across the stack to protect user data and ensure platform integrity.

## Authentication & Authorization

### JWT (JSON Web Tokens)
- **Mechanism**: Stateless authentication using short-lived Access Tokens (15m) and long-lived Refresh Tokens (7d).
- **Storage**:
    - **Access Token**: Stored in memory (variable) or short-lived HttpOnly cookie.
    - **Refresh Token**: Stored strictly in an **HttpOnly, Secure, SameSite=Strict** cookie to prevent XSS.
- **Strategy**: 
    - Verify token signature on every protected request.
    - Check token expiration.

### RBAC (Role-Based Access Control)
- Middleware checks user `role` against required permissions for an endpoint.
- *Example*: Only `role: 'seller'` can POST to `/api/products`.
- *Example*: Only `role: 'admin'` can access `/api/admin/*` routes.

### Password Security
- **Hashing**: Use `bcrypt` (or `Argon2`) with a sufficient work factor (salt rounds >= 10).
- **Policy**: Enforce strong passwords (min 8 chars, mixed case, numbers).

## Data Protection

### Input Validation & Sanitization
- **Risk**: SQL Injection, NoSQL Injection, Command Injection.
- **Mitigation**:
    - Validate ALL incoming data using a schema validator (Zod/Joi).
    - Use parameterized queries (Prepared Statements) for all database interactions. *Never* concatenate strings into SQL queries.
    - Sanitize HTML inputs to prevent stored XSS (though avoiding innerHTML in React is the primary defense).

### CSRF (Cross-Site Request Forgery)
- Since we use modern frameworks, Next.js / React automatically handles many CSRF concerns.
- If using Cookies for auth, ensure `SameSite` attribute is set to `Strict` or `Lax`.

### XSS (Cross-Site Scripting)
- **React**: Automatically escapes content by default.
- **Content Security Policy (CSP)**: Implement CSP headers to restrict sources of scripts, styles, and images.

## Infrastructure Security

### Rate Limiting
- Implement rate limiting (e.g., `express-rate-limit`) on sensitive endpoints like Login, Registration, and unexpected high-volume API calls to prevent brute-force attacks and DDoS.

### CORS (Cross-Origin Resource Sharing)
- Restrict `Access-Control-Allow-Origin` to known domains (e.g., the frontend domain).
- Do not use `*` in production.

### HTTPS
- Enforce TLS/SSL for all connections. Production environment must redirect HTTP to HTTPS.

## Auditing & Logging
- **Access Logs**: Log API requests (method, URL, status, IP - anonymized if needed).
- **Audit Trails**: (Phase 3) Record sensitive actions (e.g., Admin banning a user) with a timestamp and actor ID.
