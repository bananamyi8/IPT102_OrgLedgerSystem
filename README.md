# OrgLedger — Organization Dues and Payment Tracker

OrgLedger is a web-based application designed to help school organization treasurers manage member records, organization dues, payments, and financial summaries in one place. It aims to make payment tracking more organized, accurate, and convenient than relying only on handwritten records.

## Features

- **Member Management** — Add, view, update, and manage organization members.
- **Payment Tracking** — Record payments and their corresponding receipt references.
- **Balance Monitoring** — Track member dues, payments made, and outstanding balances.
- **Financial Summary** — View payment totals and collection summaries.
- **REST API** — Connect the frontend to the backend through structured API endpoints.
- **Database Integration** — Store and retrieve application data using MongoDB.
- **Responsive Interface** — Access the system through a web browser.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js and Vite |
| Backend | Node.js and Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| API Style | REST API |
| Version Control | Git and GitHub |
| Project Management | GitHub Issues, Projects, and Pull Requests |

## Project Structure

```text
OrgLedger/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── ...
│   ├── package.json
│   └── ...
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── .gitignore
├── docker-compose.yml
└── README.md
```

*Note: The structure above is the intended layout. Keep the filenames and folders consistent with your actual repository.*

## Prerequisites

Install the following before running the application:

- [Node.js and npm](https://nodejs.org/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) or an accessible MongoDB database
- [MongoDB Compass](https://www.mongodb.com/try/download/compass) (optional, for viewing database records)
- [Git](https://git-scm.com/)

**Docker is not required** to run the application locally.

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd OrgLedger
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Set up the backend

Open a terminal in the project root:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder using `.env.example` as a guide.

Example configuration:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/orgledger
```

Make sure MongoDB is running and that the connection string matches your database configuration.

Start the backend:

```bash
npm run dev
```

If the project does not have a `dev` script, check `server/package.json` and configure the appropriate development command before running it.

The backend should run at:

`http://localhost:5000`

### 3. Set up the frontend

Open a **second terminal** in the project root:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal, usually:

`http://localhost:5173`

Keep both terminal windows running while using the application.

### 4. Verify the application

1. Confirm that the backend starts without errors.
2. Confirm that MongoDB connects successfully.
3. Open the frontend in your browser.
4. Test member registration and member records.
5. Test payment recording and receipt references.
6. Verify that balances and financial summaries reflect the stored data.

The exact available operations depend on the features implemented in the current version.

## API Endpoints

The following is the intended REST API structure. Confirm that each endpoint exists in your backend before relying on it.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/members` | Retrieve member records |
| POST | `/api/members` | Add a member |
| GET | `/api/members/:id` | Retrieve a specific member |
| PUT | `/api/members/:id` | Update a member |
| DELETE | `/api/members/:id` | Delete a member |
| GET | `/api/payments` | Retrieve payment records |
| POST | `/api/payments` | Record a payment |
| GET | `/api/reports/summary` | Retrieve financial summaries |

### Example API request

```http
GET http://localhost:5000/api/members
```

Use Postman, an API client, or the frontend to test the endpoints that are implemented.

## Database

OrgLedger uses MongoDB to store application data.

The database may contain collections for:

- Members
- Payments
- Other records required by the implemented features

The database and collection names depend on the application's actual Mongoose models and configuration.

Do not commit your `.env` file, database credentials, or other private configuration to GitHub.

## Scrum and GitHub Workflow

OrgLedger follows a Scrum-inspired development workflow using GitHub for collaboration and progress tracking.

### Branching strategy

- `main` — Stable and reviewed code.
- `feature/...` — New features and improvements.
- `fix/...` — Bug fixes.

Example:

```bash
git checkout -b feature/member-management
```

### Development workflow

1. Create or select a GitHub Issue describing the task.
2. Move the issue into the appropriate Sprint or project board column.
3. Create a feature branch.
4. Implement and test the changes.
5. Commit using a clear, descriptive message.
6. Push the branch to GitHub.
7. Open a Pull Request linked to the issue.
8. Request a review and address feedback.
9. Merge the approved Pull Request into `main`.
10. Update the project board and close the issue when the task is complete.

### Example commit messages

```text
chore: initialize OrgLedger project structure
feat: add member management endpoints
feat: implement payment recording
feat: display outstanding member balances
feat: add financial summary report
fix: handle invalid payment submissions
docs: add project setup instructions
test: verify member and payment endpoints
```

Commit only the changes relevant to the task.

### GitHub Project Board

Recommended board columns:

- Sprint Backlog
- In Progress
- In Review
- Done

Each task should have a clear description, acceptance criteria, and a link to its related Pull Request where applicable.

Follow your instructor's requirements for issue assignments, reviewed Pull Requests, merged contributions, and Scrum evidence.

## Security and Configuration

- Keep secrets and database credentials in environment variables.
- Use `.env.example` to document required configuration without exposing secrets.
- Keep `node_modules/`, build output, and local environment files out of version control.
- Validate user input on the backend.
- Handle API errors appropriately.
- Protect sensitive routes if authentication and authorization are implemented.

## Troubleshooting

**Backend fails to start**

- Verify that dependencies are installed in `server/`.
- Check the scripts in `server/package.json`.
- Confirm that port `5000` is available.

**MongoDB connection fails**

- Make sure MongoDB is running.
- Check the `MONGO_URI` value in `server/.env`.
- Confirm that the database server is accessible.

**Frontend cannot connect to the backend**

- Make sure both frontend and backend are running.
- Check the API base URL in the frontend service files.
- Verify that the Express server has the appropriate CORS configuration.

**`npm run dev` is not recognized**

- Run `npm install` in the correct project folder.
- Check whether the `dev` script exists in that folder's `package.json`.

## Future Improvements

Potential improvements, depending on project scope, include:

- User authentication and role-based access.
- Search and filtering for members and payments.
- Printable receipts and downloadable reports.
- Exportable financial summaries.
- Payment history and audit logs.
- Improved validation and automated tests.

## Contributors

Add the names and roles of the actual project members here.

- **Project Name:** OrgLedger
- **Project Type:** Full-Stack Web Application
- **Name(s):** Ronelyn Santillan & Jay Rhomer Vidor
- **Purpose:** Organization dues and payment management
- **Development Methodology:** Scrum-inspired iterative development

## License

This project was developed for educational purposes. Add an appropriate license if the project is intended for public reuse.
