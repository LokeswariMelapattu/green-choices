# Green Choices Backend

## Running a Express Backend with Node.js 22.12.x

Follow these steps to get your Express backend running using Node.js .

## Prerequisites

- Node.js 22.12 (or later) installed on your machine
- npm (Node Package Manager)
- PostgreSQL 16 or later version

## Steps

### 1. Install Node.js

If you don't have Node.js installed, you can download it from the official Node.js website:

- [Download Node.js](https://nodejs.org)

Alternatively, if you're using **nvm** (Node Version Manager), you can install Node.js 22.12 by running:

```bash
nvm install 22.12
nvm use 22.12
```

### 2.Run the following command to install all the necessary dependencies for your React app:

```bash
npm install
```

### 3.Install PostgreSQL

## Installation

- **Windows**: [Download Installer](https://www.postgresql.org/download/windows/)
- **Mac**: Install via Homebrew
  ```sh
  brew install postgresql
  ```
- **Linux**:

```sh
   sudo apt update
   sudo apt install postgresql postgresql-contrib
```

## Start postgresql service

- **Windows**: Start pgAdmin or run PostgreSQL service from Services.
- **Mac**:

```sh
brew services start postgresql
```
- **Linux**:
```sh
 sudo systemctl start postgresql
```

### 4.Set up environment variable: Add a new file `.env` with follwing format in the root folder of backend project.
```text
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=greenchoices
DB_PORT=5432
PORT=3000
````

### 5.Initialize the database run the below command in the root folder of backend project.

```
  npm run init-db
```

### 6.Start the Development Server

To start the app in development mode, run:

```bash
npm run dev
```

## Steps to Run Test for backend

To test the backend service, run:

```bash
npm run test
```

**Soon Report Generation will be Implemented**
