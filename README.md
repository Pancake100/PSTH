# DigitalAcademy Web Application

This project is a web-based school portal created with the MERN stack (MongoDB, Express, React, Node.js). It provides separate interfaces for students and teachers to manage assignments, view library resources, and access their profiles.

## Features

- **User Authentication:** Separate login flows for students and teachers.
- **Dashboard:** A central hub for users to access different parts of the application.
- **Assignments Page:**
  - **Teachers:** Can create and delete assignments for various subjects.
  - **Students:** Can view assignments categorized by subject.
- **Library Page:** A browsable library of books categorized by subject.
- **Profile Page:** A placeholder page for user profile management.

## Tech Stack

- **Front-End:** React, React Router
- **Back-End:** Node.js, Express
- **Database:** Local `db.json` file managed by the Express server.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    ```

2.  **Install Server Dependencies:**
    Navigate to the `server` directory and install the required packages.
    ```sh
    cd server
    npm install
    ```

3.  **Install Client Dependencies:**
    Navigate to the `client` directory and install the required packages.
    ```sh
    cd ../client
    npm install
    ```

### Running the Application

You will need two separate terminals to run both the back-end server and the front-end client simultaneously.

1.  **Start the Server:**
    In one terminal, navigate to the `server` directory and run:
    ```sh
    node server.js
    ```
    The server should start running on `http://localhost:5001`.

2.  **Start the Client:**
    In a second terminal, navigate to the `client` directory and run:
    ```sh
    npm start
    ```
    The React application will open in your browser at `http://localhost:3000`.
