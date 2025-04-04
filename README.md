# Green Choices for Logistics

## Overview

**Green Choices for Logistics** is a web store designed to promote environmentally conscious consumer logistics by offering greener delivery options as the default choice. This project aims to provide an easy-to-use platform that encourages consumers to choose more sustainable delivery methods (such as road, marine, and flight), while also visualizing the carbon savings and other environmental benefits.

## Purpose & Scope

The purpose of this project is to create a user-friendly interface and backend system for an online store that encourages sustainability in logistics. The scope of this project includes the development of core features to:

- Offer greener delivery options as the default for consumers.
- Visualize carbon savings and other delivery details.
- Provide a seamless web experience for customers to explore and select logistics options.

## Project Structure

This project is organized into two main folders:

- **`/backend`**: Contains the Express server for handling API requests, including the processing of logistics and environmental data.
- **`/frontend`**: Contains the React.js application that provides the user interface and allows consumers to interact with the platform.

## Technologies Used

- **Frontend**: React.js for building the user interface.
- **Backend**: Node.js with Express for handling API requests and serving data.

## Features

- **Green Delivery Options**: Greener logistics methods are prioritized by default, offering road, marine, and flight options.
- **Carbon Savings Visualization**: Customers can see the environmental impact of their chosen delivery option in terms of carbon savings.
- **User-Friendly Interface**: An intuitive frontend built with React.js for easy navigation and interaction.

## Installation and Setup

### Prerequisites

Make sure you have the following tools installed:

- [Node.js](https://nodejs.org/) (version 22 or later)
- [npm](https://www.npmjs.com/)  (Node Package Manager)

### Backend Setup

1. Navigate to the `backend` folder:

   ```bash
   cd backend
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Set up environment variable in a `/backend` folder in `.env` file with follwing format.
   ```text
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=yourpassword
   DB_NAME=greenchoices
   DB_PORT=5432
   PORT=3000
   ```

4. Start the Express server:

   ```bash
   npm run dev
   ```

   The backend server will now be running, typically on `http://localhost:5000`.

### Frontend Setup

1. Navigate to the `frontend` folder:

   ```bash
   cd frontend
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```
3. Set up environment variable in a `/frontend` folder in `.env` file with follwing format.
   ```text
   VITE_APP_API_URL=http://localhost:3000/
   ```
4. Start the React development server:

   ```bash
   npm run dev
   ```

   The frontend application will now be running, typically on `http://localhost:5173`.
