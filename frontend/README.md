# Green Choices Frontend

## Running a React App with Node.js 22.12.x

Follow these steps to get your React app up and running using Node.js .

## Prerequisites

- Node.js 22.12 (or later) installed on your machine
- npm (Node Package Manager)

## Steps

### 1. Install Node.js

If you don't have Node.js  installed, you can download it from the official Node.js website:

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


### 3.Set up environment variable: Add a new file `.env` and add backend api url variable and update value to the actual api url instead of localhost.
```text
   VITE_APP_API_URL=localhost
```

### 4.Start the Development Server

To start the app in development mode, run:

```bash
npm run dev
```

