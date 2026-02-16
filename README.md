# E-Shop Backend

This repository contains the **backend service for the E-Shop application**, built using **Node.js**, **Express**, and **MongoDB**. It is responsible for handling API requests, database connections, middleware configuration, and environment-based configuration.

---

## 🛠 Tech Stack

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MongoDB** – Database
- **Mongoose** – MongoDB ODM
- **Morgan** – HTTP request logger
- **CORS** – Cross-Origin Resource Sharing
- **dotenv** – Environment variable management

---

## 📦 Required Node Packages

Install the following packages in the backend application:

```bash
npm i express
npm i morgan
npm i mongoose
npm i cors
npm i dotenv
```

---

## 📁 Project Structure (Basic)

```
E-Shop-Backend/
│
├── app.js          # Main application entry point
├── .env            # Environment variables (not committed)
├── package.json
├── package-lock.json
└── node_modules/
```

---

## ⚙️ Environment Configuration

The **MongoDB connection string** and other sensitive configurations are stored in the **`.env` file** using **dotenv**.

### Example `.env` file:

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/eshop
```

> ⚠️ Do not commit the `.env` file to version control.

---

## 🔗 Database Connection

- The database connection is handled using **Mongoose**.
- The connection string is read from the `.env` file.
- All **main configurations and connections are managed through `app.js`**.

---

## 🚀 Running the Application

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   node app.js
   ```

   or (if using nodemon)

   ```bash
   nodemon app.js
   ```

3. Server will start on the port defined in `.env` (default: `5000`).

---

## 📌 Notes

- Ensure MongoDB is running before starting the backend server.
- CORS is enabled to allow frontend communication.
- Morgan is used for logging HTTP requests during development.

---

## 📄 License

This project is for educational and development purposes for the **E-Shop application**.
