<<<<<<< HEAD
\# OrgLedger — Organization Dues Tracker



\## Student Information



\- \*\*Members:\*\* Ronelyn Santillan \& Jay Rhomer Vidor

\- \*\*Student ID:\*\* 24-285 \&

\- \*\*Project Name:\*\* OrgLedger

\- \*\*Project Type:\*\* Full-Stack Web Application



\## Project Description



OrgLedger is a web-based Organization Dues Tracker designed to help student organizations manage member information, record dues payments, monitor outstanding balances, and organize collection records. It aims to make tracking organization finances easier, more accurate, and more organized.



\## Technologies Used



\- \*\*Frontend:\*\* React.js and Vite

\- \*\*Backend:\*\* Node.js and Express.js

\- \*\*Database:\*\* MongoDB

\- \*\*API:\*\* REST API

\- \*\*Version Control:\*\* Git and GitHub



\## Features



\- Member registration and management

\- Organization dues tracking

\- Recording and monitoring payments

\- Viewing outstanding balances

\- Organizing member and payment records

\- Frontend-to-backend API communication



\*Note: Update this list to reflect the features actually implemented in your application.\*



\## Project Structure



```text

OrgLedger/

├── client/                 # React + Vite frontend

│   ├── src/

│   ├── public/

│   └── package.json

├── server/                 # Express backend

│   ├── routes/

│   ├── models/

│   ├── server.js

│   └── package.json

├── screenshots/            # Application screenshots

├── .gitignore

└── README.md

```



\## Prerequisites



Before running the application, install the following:



\- \[Node.js](https://nodejs.org/)

\- \[MongoDB Community Server](https://www.mongodb.com/try/download/community)

\- \[Git](https://git-scm.com/)



\## Installation and Setup



\### 1. Clone the Repository



```bash

git clone YOUR\_GITHUB\_REPOSITORY\_URL

cd OrgLedger

```



Replace `YOUR\_GITHUB\_REPOSITORY\_URL` with your actual GitHub repository URL.



\### 2. Configure the Backend



Open a terminal and run:



```bash

cd server

npm install

```



Create a `.env` file inside the `server/` directory:



```env

PORT=5000

MONGO\_URI=mongodb://127.0.0.1:27017/orgledger

```



Make sure MongoDB is running before starting the backend.



Start the backend:



```bash

npm run dev

```



If your `server/package.json` does not have a `dev` script, use `npm start` if the `start` script is configured.



\### 3. Configure the Frontend



Open a second terminal in the project root and run:



```bash

cd client

npm install

npm run dev

```



\### 4. Open the Application



Open the local frontend address displayed by Vite, normally:



\- \*\*Frontend:\*\* http://localhost:5173

\- \*\*Backend:\*\* http://localhost:5000



The backend address is not necessarily a webpage. Use the actual API endpoint configured in your project to test the API.



\## Environment Variables



The backend uses environment variables to configure the server and database connection.



| Variable | Description | Example |

|---|---|---|

| `PORT` | Backend server port | `5000` |

| `MONGO\_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/orgledger` |



Do not commit your `.env` file or any credentials to GitHub.



\## Screenshots



The `screenshots/` folder contains evidence of the application running locally.



Suggested screenshots:



1\. Frontend application running in the browser.

2\. Backend server running successfully in the terminal.

3\. Main dashboard or dues management page.

4\. Member registration or payment recording feature.



\## GitHub Repository



The source code is maintained using Git and GitHub for version control and project submission.



\## Future Improvements



\- User authentication and role-based access

\- Search and filtering for members and payments

\- Payment history and downloadable reports

\- Improved dashboard and collection summaries

\- Data validation and error handling



\## License



This project was developed for educational purposes.



=======
# IPT102_OrgLedger
>>>>>>> b6ad19bc4f26489a9b41cd7130e993fe201f0534
