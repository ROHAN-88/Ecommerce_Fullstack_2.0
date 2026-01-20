# API Design Guidelines

These guidelines ensure consistency, predictability, and ease of use for the platform's RESTful API.

## General Principles
- **RESTful**: Use standard HTTP methods (GET, POST, PUT, DELETE) resources.
- **Stateless**: The server does not store client context between requests.
- **Predictable**: Resource URLs and response structures must be consistent.

## URL Structure
- Base URL: `/api/v1`
- Resources should be plural nouns: `/api/v1/users`, `/api/v1/products`.
- Use kebab-case for URL segments: `/api/v1/product-categories`.

## Request Headers
- **Content-Type**: `application/json` (for all bodies).
- **Authorization**: `Bearer <token>` (for protected endpoints).

## Response Format

### Success Response
Standard JSON envelope for successful operations.
```json
{
  "success": true,
  "data": { ... },    // Object or Array
  "meta": {           // Optional: Pagination, etc.
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

### Error Response
Standard JSON envelope for errors.
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The product with ID 123 does not exist.",
    "details": []     // Optional validation errors
  }
}
```

## HTTP Status Codes

### Success
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `204 No Content`: Action succeeded, no response body (e.g., DELETE).

### Client Errors
- `400 Bad Request`: Validation failure or malformed request.
- `401 Unauthorized`: Missing or invalid authentication token.
- `403 Forbidden`: Authenticated but does not have permission (RBAC).
- `404 Not Found`: Resource does not exist.
- `429 Too Many Requests`: Rate limit exceeded.

### Server Errors
- `500 Internal Server Error`: Unhandled server exception.

## Best Practices
1. **Pagination**: Always paginate listing endpoints. Use `page` and `limit` query parameters.
2. **Filtering/Sorting**: Use query parameters.
   - Example: `GET /api/v1/products?category=electronics&sort=-price`
3. **Validation**: Validate all inputs at the controller level. Return `400` with specific field errors if validation fails.
4. **Dates**: Use ISO 8601 strings (UTC) for all timestamps (e.g., `2023-10-27T10:00:00Z`).
