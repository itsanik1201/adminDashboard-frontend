# Admin Dashboard Project

This is a full-stack admin dashboard application for managing placements, users, and related activities. The project consists of a frontend built with Angular and a backend built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Login and authentication system with JWT tokens.
- **Dashboard**: Overview with KPI cards, placement charts, and recruiters panel.
- **Admin Panel**:
  - User Management: Manage users and their roles.
  - Manage Candidates: Handle candidate information for placements.
  - Reports: Generate and view placement reports.
- **Placement Management**: CRUD operations for placements via REST API.
- **Responsive UI**: Built with Angular for a modern, responsive interface.
- **Real-time Data**: Integration with MongoDB for data persistence.

## Tech Stack

### Frontend
- **Angular**: Version 21.1.0
- **TypeScript**: Version 5.9.2
- **Chart.js**: For data visualization
- **GSAP**: For animations
- **Vitest**: For unit testing

### Backend
- **Node.js**: With Express.js
- **MongoDB**: For database
- **Mongoose**: ODM for MongoDB
- **JWT**: For authentication
- **bcryptjs**: For password hashing
- **CORS**: For cross-origin requests

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **npm**: Version 11.6.2 or higher
- **MongoDB**: Local or cloud instance (e.g., MongoDB Atlas)
- **Angular CLI**: Version 21.1.2 (for frontend development)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd admin-dashboard
   ```

2. **Backend Setup**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the backend directory with the following variables:
     ```
     MONGODB_URI=mongodb://localhost:27017/admin-dashboard
     JWT_SECRET=your-secret-key
     PORT=5000
     ```

3. **Frontend Setup**:
   - Navigate to the frontend directory:
     ```bash
     cd ../frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```

## Running the Application

1. **Start the Backend**:
   - From the backend directory:
     ```bash
     npm run dev
     ```
   - The backend server will run on `http://localhost:5000`.

2. **Start the Frontend**:
   - From the frontend directory:
     ```bash
     ng serve
     ```
   - Open your browser and navigate to `http://localhost:4200`.

## API Endpoints

### Authentication
- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration (if applicable)

### Placements
- `GET /api/placements`: Get all placements
- `POST /api/placements`: Create a new placement
- `PUT /api/placements/:id`: Update a placement
- `DELETE /api/placements/:id`: Delete a placement

## Building for Production

### Frontend
```bash
ng build --configuration production
```

### Backend
```bash
npm start
```

## Running Tests

### Frontend
- Unit tests:
  ```bash
  ng test
  ```

### Backend
- Add test scripts in `backend/package.json` if needed.

## Project Structure

```
admin-dashboard/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   ├── package.json
│   └── package-lock.json
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── admin/
    │   │   ├── auth/
    │   │   ├── dashboard/
    │   │   ├── layout/
    │   │   ├── login/
    │   │   └── shared/
    │   ├── environments/
    │   └── main.ts
    ├── public/
    ├── angular.json
    ├── package.json
    └── README.md (this file)
```

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -am 'Add new feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

## License

This project is licensed under the ISC License.
