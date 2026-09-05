# Turso Database Setup Guide

This Express app is now configured to connect to Turso (SQLite over HTTP).

## 1. Create a Turso Database

If you haven't already:

```bash
# Install Turso CLI
curl https://get.tur.so | bash

# Login to Turso
turso auth login

# Create a new database
turso db create my-database

# Get your connection credentials
turso db show my-database --detailed
```

## 2. Set Environment Variables

Create a `.env.local` or `.env.development.local` file in the root of your project:

```
TURSO_DATABASE_URL=libsql://your-db-name-xxxx.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZDI1NTE5In0.your_token_here
```

Or set them in your deployment platform (Vercel, etc.).

## 3. Create Your Database Schema

Connect to your Turso database and create tables:

```bash
turso db shell my-database
```

Then run SQL commands:

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Schemes Catalog

Create and seed the schemes table from the project root:

```bash
turso db shell my-database < sql/schemes.sql
```

The schemes endpoint reads from this table:

```text
GET /api/schemes
Header: session_id: <session-id>
```

## 4. Using the Database in Your Code

### Import the database client:

```typescript
import db from "./lib/db.js";
```

### Execute queries:

```typescript
// Simple query
const result = await db.execute("SELECT * FROM users");

// Query with parameters (safe from SQL injection)
const result = await db.execute({
  sql: "INSERT INTO users (name, email) VALUES (?, ?)",
  args: ["John", "john@example.com"],
});
```

## 5. Example API Routes

This project includes example routes in `/src/routes/db-example.ts`:

- `GET /api/users` - Fetch users from database
- `POST /api/users` - Create a new user

You can modify these or create your own routes following the same pattern.

## 6. API Response Format

The client returns results in this format:

```typescript
{
  rows: [
    { id: 1, name: "John", email: "john@example.com", ... },
    { id: 2, name: "Jane", email: "jane@example.com", ... }
  ],
  columns: ["id", "name", "email", ...],
  rowsAffected: 2,
  lastInsertRowid: 123
}
```

## Useful Resources

- [Turso Documentation](https://docs.turso.tech/)
- [LibSQL Client Documentation](https://github.com/libsql/js-sdk)
- [Turso CLI Reference](https://docs.turso.tech/reference/turso-cli)
