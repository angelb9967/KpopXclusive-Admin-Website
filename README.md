# 🎶 Kpop Xclusive Admin: Content Management System

## ✨ Project Overview

**Kpop Xclusive Admin** is an administration panel designed for content management of the Kpop Xclusive Wiki website. 💻🎤 

Developed using the **MERN stack (MongoDB, Express.js, React, Node.js)**, this system provides tools for administrators to manage news articles, quizzes, K-pop idol profiles, group information, and user data. It supports the maintenance and update of the wiki's dynamic content.

## 🌟 Key Features

Key functionalities of Kpop Xclusive Admin include:

*   **📊 Admin Dashboard:** Displays key website metrics such as **visitor statistics**, **number of accounts created**, and **active user count**.
*   **📰 News Management:** Functionality for creating, reading, updating, and deleting K-pop news articles, including content, images, and publication status.
*   **❓ Quiz Administration:** Management of interactive quizzes, including adding questions, editing content, configuring answers, and setting difficulty levels.
*   **👤 Idol Profile Management:** Tools for maintaining K-pop idol profiles, covering personal information, discographies, career highlights, and associated group affiliations.
*   **👥 Group Information Management:** Management of K-pop group data, including member rosters, debut specifics, achievements, and official links.
*   **📝 User Account Management:** Administration of user accounts, including viewing user data, managing access levels, and moderation.

## 🛠️ Technologies Utilized

Kpop Xclusive Admin is constructed using the **MERN stack**:

*   **MongoDB:** NoSQL database for flexible data storage (news, quizzes, idols, groups, users).
*   **Express.js:** Web framework for Node.js, providing the backend API and database interaction.
*   **React:** JavaScript library for building the user interface of the admin panel.
*   **Node.js:** JavaScript runtime environment for the backend Express.js server.

## 🚀 Getting Started

These instructions detail the process of setting up and running the Kpop Xclusive Admin application on a local development environment.

### 📋 Prerequisites

*   **Node.js (v16+ recommended):** Includes npm (Node Package Manager).
*   **MongoDB:** Installed locally and running, or access to a MongoDB Atlas instance.
*   **Git:** For cloning the repository.

### ⬇️ Installation

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/angelb9967/KpopXclusive-Admin-Website.git
    cd KpopXclusive-Admin-Website
    ```
2.  **Install Dependencies:**
    *   Navigate to the project's root directory.
    *   Install both server-side and client-side dependencies:
        ```bash
        npm install
        ```
    *   **Database Configuration:** Ensure your MongoDB connection string is correctly configured within `server.js` or an appropriate configuration file.
    *   **Client API Endpoint:** Ensure the client-side application's API endpoint is correctly configured to point to your backend server (typically `http://localhost:5000`). This is usually set in a React app's `src/index.js` or a dedicated config file.

## ▶️ Usage

Once successfully set up, the Kpop Xclusive Admin application can be operated as follows:

1.  **Start the Backend Server:**
    *   Open a terminal in the project's root directory.
    ```bash
    node server.js
    ```
    *   The backend API will typically run on `http://localhost:5000`.
2.  **Start the Frontend Application:**
    *   Open a **new** terminal in the project's root directory.
    ```bash
    npm start 
    ```
    *   The React application will typically open in your browser at `http://localhost:3000`.
3.  **Access the Admin Panel:**
    *   Log in with pre-registered administrator credentials to access the dashboard and content management features.

## 📧 Contact

For any inquiries or feedback regarding this project, please reach out to the team:

| Name            | Email                                    |
| :-------------- | :--------------------------------------- |
| Angeline Bedis  | [***REMOVED***](mailto:***REMOVED***)  |
| Achilles Baranda| [***REMOVED***](mailto:***REMOVED***) |
| Mark Esteves    | [***REMOVED***](mailto:***REMOVED***) |
| Jersey Usman    | [***REMOVED***](mailto:***REMOVED***) |

Project Repository: [https://github.com/angelb9967/KpopXclusive-Admin-Website.git](https://github.com/angelb9967/KpopXclusive-Admin-Website.git) 
