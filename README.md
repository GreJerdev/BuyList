# Buy List Application

A modern, production-ready "Buy List" application where users can create and manage lists of items to buy for any event (weekly groceries, renovation projects, etc.). Lists can be shared with groups of users, and any group member can add items, mark items as bought, and record quantity + unit price with automatic total computation.

## Architecture

This is a monorepo application with the following structure:

```
/
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── api/     # API routers
│   │   ├── core/    # Configuration and security
│   │   ├── db/      # MongoDB client
│   │   ├── models/  # Domain models and Pydantic schemas
│   │   └── services/ # Business logic and model service
│   └── tests/       # Backend tests
├── frontend/        # React + Vite frontend
│   └── src/
│       ├── api/    # API client
│       ├── auth/   # Authentication context
│       ├── components/ # React components
│       └── pages/  # Page components
├── models/          # ML models directory (preserved from original)
└── docker-compose.yml
```

## Features

### Core Functionality
- **Multi-user support**: JWT-based authentication with email/password
- **List management**: Create, read, update, delete lists
- **Item management**: Add, edit, delete items with quantity and pricing
- **Sharing**: Share lists with other users with role-based access (owner, editor, viewer)
- **Concurrency control**: Optimistic locking prevents last-write-wins issues
- **ML integration**: Scaffold for ML model integration (category suggestion)

### Item Features
- Name, notes, category (optional)
- Quantity (float/int) and unit price (float)
- Currency support (USD, EUR, GBP)
- Bought status tracking (who bought, when)
- Automatic total price calculation (quantity × unit_price)
- List-level totals (bought vs remaining)

### Security
- Password hashing with bcrypt
- JWT tokens with expiration
- CORS configuration
- Input validation with Pydantic
- Authorization checks on all endpoints

## Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: MongoDB (Motor async driver)
- **Authentication**: JWT (python-jose)
- **Password Hashing**: bcrypt (passlib)
- **Validation**: Pydantic v2
- **Testing**: pytest, pytest-asyncio, httpx

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: MongoDB 7

## Setup & Installation

### Prerequisites
- Docker and Docker Compose
- (Optional) Python 3.11+ and Node.js 20+ for local development

### Quick Start with Docker

1. **Clone the repository** (if not already done)

2. **Set environment variables** (optional, defaults work for local dev):
   ```bash
   export SECRET_KEY=your-secret-key-here
   ```

3. **Start all services**:
   ```bash
   docker-compose up
   ```

   This will start:
   - MongoDB on port 27017
   - Backend API on http://localhost:8000
   - Frontend on http://localhost:5173

4. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Local Development (without Docker)

#### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables**:
   Create a `.env` file in the `backend/` directory:
   ```env
   MONGODB_URL=mongodb://localhost:27017
   MONGODB_DB_NAME=buylist
   SECRET_KEY=your-secret-key-change-in-production
   DEBUG=true
   ```

5. **Start MongoDB** (if not using Docker):
   ```bash
   # Using Docker for MongoDB only
   docker run -d -p 27017:27017 --name mongodb mongo:7
   ```

6. **Run the backend**:
   ```bash
   uvicorn app.main:app --reload
   ```

#### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set environment variables** (optional):
   Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Run the frontend**:
   ```bash
   npm run dev
   ```

## Environment Variables

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URL` | MongoDB connection string | `mongodb://mongodb:27017` |
| `MONGODB_DB_NAME` | Database name | `buylist` |
| `SECRET_KEY` | JWT secret key | `your-secret-key-change-in-production-use-env-var` |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time | `30` |
| `DEBUG` | Debug mode | `false` |
| `CORS_ORIGINS` | Allowed CORS origins | `["http://localhost:5173","http://localhost:3000"]` |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

## API Documentation

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

#### Get Current User
```http
GET /me
Authorization: Bearer <token>
```

### Lists

#### Create List
```http
POST /lists
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Weekly Groceries",
  "description": "Items for this week"
}
```

#### Get My Lists
```http
GET /lists
Authorization: Bearer <token>
```

#### Get List by ID
```http
GET /lists/{list_id}
Authorization: Bearer <token>
```

#### Update List
```http
PATCH /lists/{list_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}
```

#### Delete List
```http
DELETE /lists/{list_id}
Authorization: Bearer <token>
```

### Sharing

#### Share List
```http
POST /lists/{list_id}/share
Authorization: Bearer <token>
Content-Type: application/json

{
  "user_email": "member@example.com",
  "role": "editor"  // or "viewer"
}
```

#### Get List Members
```http
GET /lists/{list_id}/members
Authorization: Bearer <token>
```

#### Remove Member
```http
DELETE /lists/{list_id}/members/{user_id}
Authorization: Bearer <token>
```

### Items

#### Add Item
```http
POST /lists/{list_id}/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Milk",
  "notes": "2% fat",
  "category": "Dairy",
  "quantity": 2.0,
  "unit_price": 3.50,
  "currency": "USD"
}
```

#### Update Item
```http
PATCH /lists/{list_id}/items/{item_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3.0,
  "unit_price": 4.00,
  "bought": true,
  "version": 1  // Required for optimistic concurrency
}
```

#### Delete Item
```http
DELETE /lists/{list_id}/items/{item_id}
Authorization: Bearer <token>
```

### ML Model Integration

#### Suggest Category
```http
POST /assist/suggest-category
Content-Type: application/json

{
  "item_name": "Organic Milk",
  "notes": "2% fat, 1 gallon"
}

Response:
{
  "category_suggestion": "Dairy"  // or "unknown" if model unavailable
}
```

## Database Schema

### Collections

#### users
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password_hash: String,
  name: String,
  created_at: DateTime
}
```

#### lists
```javascript
{
  _id: ObjectId,
  name: String,
  description: String (optional),
  owner_id: ObjectId (ref: users),
  created_at: DateTime,
  updated_at: DateTime,
  version: Integer,  // For optimistic concurrency
  items: [{
    _id: ObjectId,
    name: String,
    notes: String (optional),
    category: String (optional),
    quantity: Float,
    unit_price: Float,
    currency: String,
    bought: Boolean,
    bought_by: ObjectId (optional, ref: users),
    bought_at: DateTime (optional),
    created_at: DateTime,
    updated_at: DateTime,
    version: Integer
  }]
}
```

#### list_memberships
```javascript
{
  _id: ObjectId,
  list_id: ObjectId (ref: lists),
  user_id: ObjectId (ref: users),
  role: String ("owner" | "editor" | "viewer"),
  added_at: DateTime
}
```

### Design Decisions

**Embedded vs Referenced Items**: Items are embedded in lists for better read performance and atomic updates. This works well for the use case where items are always accessed in the context of a list.

**Optimistic Concurrency**: Both lists and items have a `version` field that is incremented on each update. Clients must include the current version when updating to prevent conflicts.

## ML Model Integration

The application includes a scaffold for ML model integration in `backend/app/services/model_service.py`. The service is designed to:

1. **Lazy load models** from the `/models` directory
2. **Cache loaded models** in memory
3. **Provide fallback behavior** when models are unavailable

### Adding ML Models

To add an ML model:

1. Place model files in the `/models` directory (e.g., `category_model.pkl`, `category_model.h5`, etc.)
2. Update `model_service.py` to implement the actual loading logic for your model format
3. Implement the inference logic in the `suggest_category` method (or add new methods)

Example model formats supported (with implementation):
- Pickle/Joblib: `joblib.load(model_path)`
- TensorFlow/Keras: `keras.models.load_model(model_path)`
- PyTorch: `torch.load(model_path)`

The `/assist/suggest-category` endpoint demonstrates model usage. Currently returns "unknown" as a placeholder, but the integration structure is ready for actual models.

## Testing

### Backend Tests

Run tests from the `backend/` directory:

```bash
cd backend
pytest
```

Tests cover:
- Authentication (register, login, token validation)
- List CRUD operations
- Item CRUD operations
- Sharing functionality
- Optimistic concurrency control

### Test Database

Tests use a separate test database (`buylist_test`) that is automatically cleaned up after each test run.

## Development

### Code Structure

- **API Layer** (`backend/app/api/`): FastAPI routers, handle HTTP requests/responses
- **Services** (`backend/app/services/`): Business logic, database operations
- **Models** (`backend/app/models/`): Domain models and Pydantic schemas
- **Core** (`backend/app/core/`): Configuration, security, database client

### Adding New Features

1. **New Endpoint**: Add router in `backend/app/api/`
2. **Business Logic**: Add service method in `backend/app/services/`
3. **Database Changes**: Update domain models in `backend/app/models/domain.py`
4. **API Schema**: Update Pydantic schemas in `backend/app/models/schemas.py`

## Production Deployment

### Security Checklist

- [ ] Change `SECRET_KEY` to a strong random value
- [ ] Set `DEBUG=false`
- [ ] Configure proper CORS origins
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS
- [ ] Set up MongoDB authentication
- [ ] Configure proper firewall rules
- [ ] Set up monitoring and logging

### Recommended Setup

1. Use a reverse proxy (nginx) in front of the backend
2. Use a process manager (systemd, supervisor) or container orchestration (Kubernetes)
3. Set up MongoDB replica set for production
4. Configure backups
5. Set up CI/CD pipeline

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running: `docker ps` or check MongoDB service
- Check connection string in environment variables
- Verify network connectivity between services

### CORS Errors

- Check `CORS_ORIGINS` environment variable
- Ensure frontend URL is in the allowed origins list

### Authentication Issues

- Verify JWT token is being sent in Authorization header
- Check token expiration time
- Ensure `SECRET_KEY` matches between restarts

## License

ISC

## Contributing

This is a refactored application. The original codebase structure has been preserved in the `/models` directory for reference, but the application has been completely rewritten with modern best practices.
