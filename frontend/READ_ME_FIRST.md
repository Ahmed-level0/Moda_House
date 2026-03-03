# Moda House Project - Setup Guide 🚀

This project consists of an **Angular Frontend** and a **Node.js/Express Backend** with **MongoDB**.

## Prerequisites
1.  **Node.js**: Installed on your machine.
2.  **MongoDB**: Installed and running locally (default port 27017).

---

## 1. Backend Setup 🛠️
1.  Open a terminal and go to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Ensure the `.env` file exists with these settings:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/modahouse
    JWT_SECRET=secret
    ```
4.  (Optional) Seed initial data (Admin and Products):
    ```bash
    node seedAdmin.js
    node seedProducts.js
    ```
5.  Start the backend server:
    ```bash
    npm run dev
    ```
    *The server will run on [http://localhost:5000](http://localhost:5000)*

---

## 2. Frontend Setup 🎨
1.  Open a **new** terminal in the root folder of the project.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Angular development server:
    ```bash
    npm start
    ```
    *The app will be available at [http://localhost:4200](http://localhost:4200)*

---

## Admin Credentials 🔐
- **Email**: `admin@modahouse.com`
- **Password**: `admin123`

---

## Troubleshooting
- **Database Error**: Ensure MongoDB is running on your machine.
- **Port Conflict**: If port 4200 or 5000 is occupied, you can change them in `angular.json` or `.env` respectively.
